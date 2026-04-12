import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import { runAgainstTestCases } from './utils/codeRunner.js';

dotenv.config();

const solutions = {
    javascript: `
var twoSum = function(nums, target) {
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
        let complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement), i];
        map.set(nums[i], i);
    }
};`,
    python: `
class Solution:
    def twoSum(self, nums, target):
        prevMap = {}
        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
        return`,
    cpp: `
#include <vector>
using namespace std;
vector<int> twoSum(vector<int>& nums, int target) {
    for(int i=0; i<nums.size(); ++i) {
        for(int j=i+1; j<nums.size(); ++j) {
            if(nums[i] + nums[j] == target) return {i, j};
        }
    }
    return {};
}`,
    java: `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`
};

const testExecution = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const question = await Question.findOne({ functionName: 'twoSum' });
        
        for (const [lang, code] of Object.entries(solutions)) {
            console.log("Testing " + lang.toUpperCase() + "...");
            const results = await runAgainstTestCases(code, lang, question.testCases.filter(tc => !tc.isHidden), question.functionName, question.drivers);
            const passed = results.every(r => r.passed);
            console.log(lang.toUpperCase() + " Result: " + (passed ? 'PASSED' : 'FAILED'));
            if (!passed) {
                console.log('Details:', JSON.stringify(results, null, 2));
            }
        }
        
        process.exit();
    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    }
};

testExecution();
