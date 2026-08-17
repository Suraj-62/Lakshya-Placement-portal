import axios from 'axios';
import { 
    generateCppDriver, 
    generateJavaDriver, 
    generateJavascriptDriver, 
    generatePythonDriver 
} from './dynamicDrivers.js';

// Piston API uses specific language versions
const PISTON_LANGUAGES = {
    'javascript': { language: 'javascript', version: '18.15.0' },
    'python': { language: 'python', version: '3.10.0' },
    'cpp': { language: 'c++', version: '10.2.0' },
    'java': { language: 'java', version: '15.0.2' }
};

// Use the old getDriver implementation since it's working for wrapping user code
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

const executeOnPiston = async (sourceCode, language, stdin) => {
    const PISTON_API = 'https://emkc.org/api/v2/piston/execute';
    
    const targetLang = PISTON_LANGUAGES[language];
    if (!targetLang) throw new Error("Unsupported language for Piston API");

    const payload = {
        language: targetLang.language,
        version: targetLang.version,
        files: [{ content: sourceCode }],
        stdin: stdin ? String(stdin) : "",
    };

    try {
        const response = await axios.post(PISTON_API, payload);
        const data = response.data;
        
        const compileCode = data.compile ? data.compile.code : 0;
        const runCode = data.run ? data.run.code : 0;
        
        let statusId = 3; // Success
        if (compileCode !== 0) {
            statusId = 6; // Compile Error
        } else if (runCode !== 0) {
            statusId = 4; // Runtime Error
        }

        return {
            stdout: data.run?.stdout || "",
            stderr: data.run?.stderr || "",
            compile_output: data.compile?.output || "",
            status: { id: statusId, description: data.run?.signal || (statusId === 3 ? "Accepted" : "Error") }
        };
    } catch (error) {
        console.error("Piston API Error:", error.response?.data || error.message);
        throw new Error("Piston execution failed.");
    }
};

export const runAgainstTestCases = async (code, language, testCases, functionName, drivers = {}) => {
    
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
    
    const normalize = (str) => {
        if (!str) return "";
        let trimmed = str.trim();
        try {
            let parsed = JSON.parse(trimmed);
            if (typeof parsed === 'string') return parsed;
            return JSON.stringify(parsed);
        } catch (e) {
            return trimmed.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        }
    };

    if (!PISTON_LANGUAGES[language]) {
        return testCases.map(tc => ({
            input: tc.input,
            passed: false,
            error: `Language ${language} not supported yet.`,
            status: 'error'
        }));
    }

    // Execute test cases sequentially
    const finalResults = [];
    for (const tc of testCases) {
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

        try {
            const executionResult = await executeOnPiston(wrappedCode, language, tc.input);
            
            let actualOutput = "";
            let errorMsg = null;

            if (executionResult.status.id === 3) {
                // Success
                actualOutput = executionResult.stdout || "";
            } else if (executionResult.status.id === 6) {
                // Compile Error
                errorMsg = executionResult.compile_output || "Compile Error";
            } else {
                // Runtime / Time Limit / etc.
                errorMsg = (executionResult.stderr || executionResult.compile_output || executionResult.status.description || "Execution Error").trim();
            }

            const expectedOutput = tc.output.trim();
            let passed = false;

            if (!errorMsg) {
                passed = normalize(actualOutput) === normalize(expectedOutput);
            }

            finalResults.push({
                input: tc.input,
                expectedOutput: tc.output,
                actualOutput: errorMsg ? `Error: ${errorMsg}` : (actualOutput.trim() || "No output"),
                passed,
                stdout: executionResult.stdout,
                stderr: executionResult.stderr,
                status: errorMsg ? 'error' : 'success',
                signal: executionResult.status.description
            });

        } catch (error) {
            finalResults.push({
                input: tc.input,
                expectedOutput: tc.output,
                actualOutput: `Error: ${error.message}`,
                passed: false,
                status: 'error'
            });
        }
    }

    return finalResults;
};
