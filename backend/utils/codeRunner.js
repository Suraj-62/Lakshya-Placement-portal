import axios from 'axios';
import { 
    generateCppDriver, 
    generateJavaDriver, 
    generateJavascriptDriver, 
    generatePythonDriver 
} from './dynamicDrivers.js';

// Language IDs for Judge0 CE
const LANGUAGE_IDS = {
    'javascript': 93, // Node.js 18.15.0 (Fallback to 63 if needed)
    'python': 71,     // Python 3.11.2
    'cpp': 54,        // GCC 9.2.0
    'java': 62        // OpenJDK 13.0.1
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

const executeOnJudge0 = async (sourceCode, languageId, stdin) => {
    const apiUrl = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
    const apiKey = process.env.JUDGE0_API_KEY;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (apiKey) {
        if (apiUrl.includes('rapidapi')) {
            headers['X-RapidAPI-Key'] = apiKey;
            headers['X-RapidAPI-Host'] = new URL(apiUrl).hostname;
        } else {
            headers['X-Auth-Token'] = apiKey; 
        }
    }

    try {
        const response = await axios.post(`${apiUrl}/submissions?base64_encoded=true&wait=true`, {
            source_code: Buffer.from(sourceCode).toString('base64'),
            language_id: languageId,
            stdin: stdin ? Buffer.from(String(stdin)).toString('base64') : null
        }, { headers });

        const data = response.data;
        if (data.stdout) data.stdout = Buffer.from(data.stdout, 'base64').toString('utf8');
        if (data.stderr) data.stderr = Buffer.from(data.stderr, 'base64').toString('utf8');
        if (data.compile_output) data.compile_output = Buffer.from(data.compile_output, 'base64').toString('utf8');

        return data;
    } catch (error) {
        console.error("Judge0 API Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Judge0 execution failed.");
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

    let languageId = LANGUAGE_IDS[language];
    if (!languageId) {
        return testCases.map(tc => ({
            input: tc.input,
            passed: false,
            error: `Language ${language} not supported on Judge0 yet.`,
            status: 'error'
        }));
    }

    // Execute test cases sequentially to avoid rate-limiting on public Judge0 API
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
            const judge0Result = await executeOnJudge0(wrappedCode, languageId, tc.input);
            
            // Handle fallback if Node.js 18 (93) is missing, Judge0 might return "Language not found"
            if (judge0Result.error && judge0Result.error.includes("Language") && language === 'javascript' && languageId === 93) {
                languageId = 63; // Fallback to 63
                const retryResults = await runAgainstTestCases(code, language, [tc], functionName, drivers);
                finalResults.push(retryResults[0]);
                continue;
            }
            
            let actualOutput = "";
            let errorMsg = null;

            if (judge0Result.status.id === 3) {
                // Success
                actualOutput = judge0Result.stdout || "";
            } else if (judge0Result.status.id === 6) {
                // Compile Error
                errorMsg = judge0Result.compile_output || "Compile Error";
            } else {
                // Runtime / Time Limit / etc.
                errorMsg = (judge0Result.stderr || judge0Result.compile_output || judge0Result.status.description || "Execution Error").trim();
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
                stdout: judge0Result.stdout,
                stderr: judge0Result.stderr,
                status: errorMsg ? 'error' : 'success',
                signal: judge0Result.status.description
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
