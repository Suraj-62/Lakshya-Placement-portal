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
    const parsedArgs = inputLines.map(line => {
        try { return JSON.parse(line.trim()); } catch (e) { return line.trim(); }
    });

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
    const parsedArgs = inputLines.map(line => {
        try { return JSON.parse(line.trim()); } catch (e) { return line.trim(); }
    });

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
