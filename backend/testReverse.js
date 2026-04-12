import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import { runAgainstTestCases } from './utils/codeRunner.js';

dotenv.config();

const solutions = {
    javascript: "var reverseString = function(s) { s.reverse(); };",
    python: "class Solution:\n    def reverseString(self, s):\n        s.reverse()",
    cpp: "#include <vector>\n#include <algorithm>\nusing namespace std;\nvoid reverseString(vector<char>& s) { reverse(s.begin(), s.end()); }",
    java: "class Solution {\n    public void reverseString(char[] s) {\n        for(int i=0; i<s.length/2; i++) {\n            char temp = s[i];\n            s[i] = s[s.length-1-i];\n            s[s.length-1-i] = temp;\n        }\n    }\n}"
};

const testReverse = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const question = await Question.findOne({ functionName: 'reverseString' });
        
        for (const [lang, code] of Object.entries(solutions)) {
            console.log("Testing Reverse " + lang.toUpperCase() + "...");
            const results = await runAgainstTestCases(code, lang, question.testCases.filter(tc => !tc.isHidden), question.functionName, question.drivers);
            const passed = results.every(r => r.passed);
            console.log(lang.toUpperCase() + " Result: " + (passed ? 'PASSED' : 'FAILED'));
            if (!passed) {
                console.log('Details:', JSON.stringify(results, null, 2));
            }
        }
        
        process.exit();
    } catch (error) {
        process.exit(1);
    }
};

testReverse();
