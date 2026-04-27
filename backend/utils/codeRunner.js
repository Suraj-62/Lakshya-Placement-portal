import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
    generateCppDriver, 
    generateJavaDriver, 
    generateJavascriptDriver, 
    generatePythonDriver 
} from './dynamicDrivers.js';

const TEMP_DIR = path.join(process.cwd(), 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

const getDriver = (language, functionName) => {
    switch (language) {
        case 'javascript':
            return `
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\\n');
try {
    const args = input.map(line => {
        try { return JSON.parse(line.trim()); }
        catch (e) { return line.trim(); }
    });
    
    let result;
    if (typeof ${functionName} === 'function') {
        result = ${functionName}(...args);
    } else if (typeof Solution !== 'undefined' && typeof Solution.prototype.${functionName} === 'function') {
        const sol = new Solution();
        result = sol.${functionName}(...args);
    } else {
        throw new Error("Function ${functionName} not found");
    }
    
    // For void functions that modify in-place (like reverseString)
    if (result === undefined && args.length > 0) {
        process.stdout.write(JSON.stringify(args[0]));
    } else {
        process.stdout.write(JSON.stringify(result));
    }
} catch (e) {
    process.stderr.write(e.message);
    process.exit(1);
}
`;
        case 'python':
            return `
import sys, json
input_data = sys.stdin.read().strip().split('\\n')
try:
    args = []
    for line in input_data:
        try: args.append(json.loads(line.strip()))
        except: args.append(line.strip())
    
    # Check if Solution class exists
    if 'Solution' in globals():
        sol = Solution()
        func = getattr(sol, '${functionName}', None)
        if func:
            result = func(*args)
        else:
            raise Exception("Function ${functionName} not found in Solution class")
    elif '${functionName}' in globals():
        result = globals()['${functionName}'](*args)
    else:
        raise Exception("Function ${functionName} not found")
        
    # For in-place modifications (void functions)
    if result is None and len(args) > 0:
        sys.stdout.write(json.dumps(args[0]))
    else:
        sys.stdout.write(json.dumps(result))
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;
        case 'cpp':
        case 'java':
            return '';
        default:
            return '';
    }
};

const executeCommand = (command, args, input, timeout = 3000) => {
    return new Promise((resolve) => {
        const child = spawn(command, args);
        let stdout = '';
        let stderr = '';
        let killed = false;

        const timer = setTimeout(() => {
            child.kill();
            killed = true;
            resolve({ code: null, stdout, stderr: stderr + '\nExecution Timed Out', signal: 'SIGTERM' });
        }, timeout);

        if (input !== undefined && input !== null) {
            child.stdin.write(String(input));
        }
        child.stdin.end();

        child.stdout.on('data', (data) => { stdout += data.toString(); });
        child.stderr.on('data', (data) => { stderr += data.toString(); });

        child.on('close', (code, signal) => {
            if (killed) return;
            clearTimeout(timer);
            resolve({ code, stdout, stderr, signal });
        });

        child.on('error', (err) => {
            if (killed) return;
            clearTimeout(timer);
            resolve({ code: null, stdout, stderr: stderr + '\n' + err.message, signal: 'ERROR' });
        });
    });
};

export const runAgainstTestCases = async (code, language, testCases, functionName, drivers = {}) => {
    const results = [];
    
    // Choose the driver: Question-specific driver first, then generic fallback
    let driverTemplate = drivers?.[language];
    let isGenericDriver = !driverTemplate;
    if (!driverTemplate) {
        driverTemplate = getDriver(language, functionName);
    }
    
    let baseWrappedCode;
    if (driverTemplate) {
        if (driverTemplate.includes('{{user_code}}')) {
            baseWrappedCode = driverTemplate.replace('{{user_code}}', code);
        } else {
            baseWrappedCode = `${code}\n\n${driverTemplate}`;
        }
    } else {
        baseWrappedCode = code;
    }
    
    const runId = crypto.randomUUID();

    // Normalization helper
    const normalize = (str) => {
        let trimmed = str.trim();
        try {
            let parsed = JSON.parse(trimmed);
            if (typeof parsed === 'string') return parsed;
            return JSON.stringify(parsed);
        } catch (e) {
            return trimmed.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        }
    };

    for (const tc of testCases) {
        let runResult;
        let wrappedCode = baseWrappedCode;
        if (isGenericDriver) {
            if (language === 'cpp') {
                wrappedCode = generateCppDriver(code, functionName, tc);
            } else if (language === 'java') {
                wrappedCode = generateJavaDriver(code, functionName, tc);
            } else if (language === 'javascript') {
                wrappedCode = generateJavascriptDriver(code, functionName, tc);
            } else if (language === 'python') {
                wrappedCode = generatePythonDriver(code, functionName, tc);
            }
        }
        
        const filePath = path.join(TEMP_DIR, `solution_${runId}_${crypto.randomUUID()}`);

        try {
            if (language === 'javascript') {
                const jsFile = `${filePath}.cjs`;
                fs.writeFileSync(jsFile, wrappedCode);
                runResult = await executeCommand('node', [jsFile], tc.input);
                if (fs.existsSync(jsFile)) fs.unlinkSync(jsFile);
            } 
            else if (language === 'python') {
                const pyFile = `${filePath}.py`;
                fs.writeFileSync(pyFile, wrappedCode);
                runResult = await executeCommand('python', [pyFile], tc.input);
                if (fs.existsSync(pyFile)) fs.unlinkSync(pyFile);
            }
            else if (language === 'cpp') {
                const cppFile = `${filePath}.cpp`;
                const exeFile = `${filePath}.exe`;
                fs.writeFileSync(cppFile, wrappedCode);
                
                // Compile
                const compileResult = await executeCommand('g++', [cppFile, '-o', exeFile], null, 10000);
                if (compileResult.code !== 0) {
                    runResult = { ...compileResult, status: 'error', errorType: 'Compile Error' };
                } else {
                    // Run
                    runResult = await executeCommand(exeFile, [], tc.input);
                }
                
                // Cleanup
                if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
                if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
            }
            else if (language === 'java') {
                // Java needs the class name to match the file name. 
                // We'll wrap the user code if needed or assume they provide a class 'Solution'
                // For simplicity, we'll name the file Solution.java in a unique subfolder
                const javaTaskDir = path.join(TEMP_DIR, `${runId}_${crypto.randomUUID()}`);
                if (!fs.existsSync(javaTaskDir)) fs.mkdirSync(javaTaskDir);
                
                const javaFile = path.join(javaTaskDir, 'Solution.java');
                fs.writeFileSync(javaFile, wrappedCode);
                
                // Compile
                const compileResult = await executeCommand('javac', [javaFile], null, 10000);
                if (compileResult.code !== 0) {
                    runResult = { ...compileResult, status: 'error', errorType: 'Compile Error' };
                } else {
                    // Run (must run from the directory containing the classes)
                    runResult = await executeCommand('java', ['-cp', javaTaskDir, 'SolutionRunner'], null);
                }
                
                // Cleanup
                if (fs.existsSync(javaTaskDir)) fs.rmSync(javaTaskDir, { recursive: true, force: true });
            }
            else {
                results.push({
                    input: tc.input,
                    passed: false,
                    error: `Language ${language} not supported for local execution yet.`,
                    status: 'error'
                });
                continue;
            }

            const actualOutput = runResult.stdout.trim();
            const expectedOutput = tc.output.trim();
            const passed = runResult.code === 0 && !runResult.signal && normalize(actualOutput) === normalize(expectedOutput);

            results.push({
                input: tc.input,
                expectedOutput: tc.output,
                actualOutput: actualOutput || (runResult.stderr ? `Error: ${runResult.stderr}` : "No output"),
                passed,
                stdout: runResult.stdout,
                stderr: runResult.stderr,
                status: runResult.signal ? 'signal' : (runResult.code === 0 ? 'success' : 'failure'),
                signal: runResult.signal
            });

        } catch (error) {
            results.push({
                input: tc.input,
                passed: false,
                error: error.message,
                status: 'error'
            });
        }
    }

    return results;
};
