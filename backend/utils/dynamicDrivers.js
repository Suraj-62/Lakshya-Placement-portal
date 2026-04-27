export const parseInputLine = (line) => {
    let cleanedLine = line.trim();
    const eqIndex = cleanedLine.indexOf('=');
    if (eqIndex !== -1) {
        const potentialJson = cleanedLine.substring(eqIndex + 1).trim();
        try { return JSON.parse(potentialJson); } catch(e) {}
    }
    try { return JSON.parse(cleanedLine); } catch (e) { return cleanedLine; }
};

export const inferTypeAndGenerateCppLiteral = (val) => {
    if (typeof val === 'number') {
        return { type: val % 1 === 0 ? 'int' : 'double', literal: val.toString() };
    }
    if (typeof val === 'boolean') {
        return { type: 'bool', literal: val ? 'true' : 'false' };
    }
    if (typeof val === 'string') {
        return { type: 'string', literal: `"${val}"` };
    }
    if (Array.isArray(val)) {
        if (val.length === 0) {
            return { type: 'vector<int>', literal: '{}' }; // Fallback
        }
        const inner = inferTypeAndGenerateCppLiteral(val[0]);
        const literals = val.map(v => inferTypeAndGenerateCppLiteral(v).literal);
        return { type: `vector<${inner.type}>`, literal: `{${literals.join(', ')}}` };
    }
    return { type: 'string', literal: '""' };
};

export const inferTypeAndGenerateJavaLiteral = (val) => {
    if (typeof val === 'number') {
        return { type: val % 1 === 0 ? 'int' : 'double', literal: val.toString() };
    }
    if (typeof val === 'boolean') {
        return { type: 'boolean', literal: val ? 'true' : 'false' };
    }
    if (typeof val === 'string') {
        return { type: 'String', literal: `"${val}"` };
    }
    if (Array.isArray(val)) {
        if (val.length === 0) return { type: 'int[]', literal: 'new int[]{}' }; // Fallback
        const inner = inferTypeAndGenerateJavaLiteral(val[0]);
        const getValuesOnly = (v) => {
             if (Array.isArray(v)) return `{${v.map(getValuesOnly).join(', ')}}`;
             if (typeof v === 'string') return `"${v}"`;
             return v.toString();
        };
        const literals = getValuesOnly(val);
        const arrayDepth = (inner.type.match(/\\[\\]/g) || []).length + 1;
        const baseType = inner.type.replace(/\\[\\]/g, '');
        const brackets = "[]".repeat(arrayDepth);
        return { type: `${baseType}${brackets}`, literal: `new ${baseType}${brackets}${literals}` };
    }
    return { type: 'String', literal: '""' };
};

export const generateCppDriver = (code, functionName, testCase) => {
    const inputLines = testCase.input.trim().split('\\n');
    const parsedArgs = inputLines.map(parseInputLine);

    const argLiterals = parsedArgs.map((val, i) => {
        const { type, literal } = inferTypeAndGenerateCppLiteral(val);
        return { type, literal, name: `arg${i}` };
    });

    const sigRegex = new RegExp(`([\\w\\<\\>:]+)\\s+${functionName}\\s*\\(`);
    const match = code.match(sigRegex);
    const returnType = match ? match[1] : 'void';

    let argDeclarations = argLiterals.map(a => `${a.type} ${a.name} = ${a.literal};`).join('\\n    ');
    let callArgs = argLiterals.map(a => a.name).join(', ');

    let printLogic;
    if (returnType === 'void' && argLiterals.length > 0) {
        printLogic = `printJson(${argLiterals[0].name});`;
    } else {
        printLogic = `printJson(result);`;
    }

    const driverIncludes = `
#include <iostream>
#include <vector>
#include <string>
using namespace std;
`;

    const driverMain = `
void printJson(int val) { cout << val; }
void printJson(double val) { cout << val; }
void printJson(bool val) { cout << (val ? "true" : "false"); }
void printJson(const string& val) { cout << "\\"" << val << "\\""; }

template<typename T>
void printJson(const vector<T>& vec) {
    cout << "[";
    for(size_t i=0; i<vec.size(); ++i) {
        printJson(vec[i]);
        if (i < vec.size() - 1) cout << ",";
    }
    cout << "]";
}

int main() {
    ${argDeclarations}
    Solution sol;
    ${returnType === 'void' ? `sol.${functionName}(${callArgs});` : `auto result = sol.${functionName}(${callArgs});`}
    ${printLogic}
    return 0;
}
`;
    return `${driverIncludes}\n${code}\n${driverMain}`;
};

export const generateJavaDriver = (code, functionName, testCase) => {
    const inputLines = testCase.input.trim().split('\\n');
    const parsedArgs = inputLines.map(parseInputLine);

    const argLiterals = parsedArgs.map((val, i) => {
        const { type, literal } = inferTypeAndGenerateJavaLiteral(val);
        return { type, literal, name: `arg${i}` };
    });

    const sigRegex = new RegExp(`(public\\s+|private\\s+|protected\\s+|static\\s+)*([\\w\\[\\]<>]+)\\s+${functionName}\\s*\\(`);
    const match = code.match(sigRegex);
    const returnType = match ? match[2] : 'void';

    let argDeclarations = argLiterals.map(a => `${a.type} ${a.name} = ${a.literal};`).join('\\n        ');
    let callArgs = argLiterals.map(a => a.name).join(', ');

    let printLogic;
    if (returnType === 'void' && argLiterals.length > 0) {
        printLogic = `printJson(${argLiterals[0].name});`;
    } else {
        printLogic = `printJson(result);`;
    }

    const driverIncludes = `
import java.util.*;
import java.io.*;
`;

    const driverMain = `
class SolutionRunner {
    public static void printJson(int val) { System.out.print(val); }
    public static void printJson(double val) { System.out.print(val); }
    public static void printJson(boolean val) { System.out.print(val ? "true" : "false"); }
    public static void printJson(String val) { System.out.print("\\"" + val + "\\""); }
    
    public static void printJson(int[] arr) {
        System.out.print("[");
        for(int i=0; i<arr.length; i++) { printJson(arr[i]); if(i < arr.length-1) System.out.print(","); }
        System.out.print("]");
    }
    public static void printJson(double[] arr) {
        System.out.print("[");
        for(int i=0; i<arr.length; i++) { printJson(arr[i]); if(i < arr.length-1) System.out.print(","); }
        System.out.print("]");
    }
    public static void printJson(boolean[] arr) {
        System.out.print("[");
        for(int i=0; i<arr.length; i++) { printJson(arr[i]); if(i < arr.length-1) System.out.print(","); }
        System.out.print("]");
    }
    public static void printJson(String[] arr) {
        System.out.print("[");
        for(int i=0; i<arr.length; i++) { printJson(arr[i]); if(i < arr.length-1) System.out.print(","); }
        System.out.print("]");
    }
    public static void printJson(int[][] arr) {
        System.out.print("[");
        for(int i=0; i<arr.length; i++) { printJson(arr[i]); if(i < arr.length-1) System.out.print(","); }
        System.out.print("]");
    }

    public static void main(String[] args) {
        ${argDeclarations}
        Solution sol = new Solution();
        ${returnType === 'void' ? `sol.${functionName}(${callArgs});` : `${returnType} result = sol.${functionName}(${callArgs});`}
        ${printLogic}
    }
}
`;
    return `${driverIncludes}\n${code}\n${driverMain}`;
};

export const generateJavascriptDriver = (code, functionName, testCase) => {
    const inputLines = testCase.input.trim().split('\n');
    const parsedArgs = inputLines.map(parseInputLine);

    const argDeclarations = parsedArgs.map((arg, i) => `const arg${i} = ${JSON.stringify(arg)};`).join('\n');
    const callArgs = parsedArgs.map((_, i) => `arg${i}`).join(', ');

    // If functionName is not provided, try to extract it from the code
    let targetFunc = functionName;
    if (!targetFunc) {
        const match = code.match(/var\s+([a-zA-Z0-9_]+)\s*=\s*function/);
        if (match) targetFunc = match[1];
        else {
            const match2 = code.match(/function\s+([a-zA-Z0-9_]+)/);
            if (match2) targetFunc = match2[1];
        }
    }

    const driverMain = `
// --- Driver ---
${argDeclarations}
let result;
try {
    result = ${targetFunc}(${callArgs});
    if (result === undefined && typeof arg0 !== 'undefined') {
        console.log(JSON.stringify(arg0));
    } else {
        console.log(JSON.stringify(result));
    }
} catch(err) {
    console.error(err);
}
`;
    return `${code}\n${driverMain}`;
};

export const generatePythonDriver = (code, functionName, testCase) => {
    const inputLines = testCase.input.trim().split('\n');
    const parsedArgs = inputLines.map(parseInputLine);

    const argDeclarations = parsedArgs.map((arg, i) => `arg${i} = json.loads('${JSON.stringify(arg)}')`).join('\n');
    const callArgs = parsedArgs.map((_, i) => `arg${i}`).join(', ');

    let targetFunc = functionName;
    if (!targetFunc) {
        const match = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
        if (match) targetFunc = match[1];
    }

    let initAndCall = '';
    if (code.includes('class Solution')) {
        initAndCall = `sol = Solution()\nresult = sol.${targetFunc}(${callArgs})`;
    } else {
        initAndCall = `result = ${targetFunc}(${callArgs})`;
    }

    const driverMain = `
# --- Driver ---
import json

${argDeclarations}
try:
    ${initAndCall}
    if result is None:
        print(json.dumps(arg0, separators=(',', ':')))
    else:
        print(json.dumps(result, separators=(',', ':')))
except Exception as e:
    print(str(e))
`;
    return `${code}\n${driverMain}`;
};
