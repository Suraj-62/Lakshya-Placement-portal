import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Category from './models/Category.js';

dotenv.config();

const seedCodingQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find or create a 'DSA' category
    let dsaCategory = await Category.findOne({ name: 'DSA' });
    if (!dsaCategory) {
      dsaCategory = await Category.create({ name: 'DSA', description: 'Data Structures and Algorithms' });
    }

    const questions = [
      {
        category: dsaCategory._id,
        topic: 'Arrays',
        difficulty: 'easy',
        questionText: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
        type: 'code',
        functionName: 'twoSum',
        drivers: {
          cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\n\nusing namespace std;\n\n{{user_code}}\n\nvector<int> parseVector(string s) {\n    vector<int> res;\n    s.erase(remove(s.begin(), s.end(), '['), s.end());\n    s.erase(remove(s.begin(), s.end(), ']'), s.end());\n    if(s.empty()) return res;\n    stringstream ss(s);\n    string item;\n    while (getline(ss, item, ',')) res.push_back(stoi(item));\n    return res;\n}\n\nint main() {\n    string line1, line2;\n    if (getline(cin, line1) && getline(cin, line2)) {\n        vector<int> nums = parseVector(line1);\n        int target = stoi(line2);\n        vector<int> res = twoSum(nums, target);\n        cout << "[";\n        for(int i=0; i<res.size(); ++i) cout << res[i] << (i==res.size()-1 ? "" : ",");\n        cout << "]";\n    }\n    return 0;\n}`,
          java: `import java.util.*;\n\n{{user_code}}\n\nclass SolutionRunner {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String line1 = sc.nextLine();\n        if (!sc.hasNextLine()) return;\n        String line2 = sc.nextLine();\n        \n        Solution sol = new Solution();\n        int[] nums = parseArray(line1);\n        int target = Integer.parseInt(line2.trim());\n        int[] res = sol.twoSum(nums, target);\n        System.out.println(Arrays.toString(res).replace(" ", ""));\n    }\n    \n    private static int[] parseArray(String s) {\n        s = s.replace("[", "").replace("]", "").replace(" ", "");\n        if (s.isEmpty()) return new int[0];\n        String[] parts = s.split(",");\n        int[] res = new int[parts.length];\n        for(int i=0; i<parts.length; i++) res[i] = Integer.parseInt(parts[i]);\n        return res;\n    }\n}`
        },
        testCases: [
          { input: '[2,7,11,15]\n9', output: '[0,1]', isHidden: false },
          { input: '[3,2,4]\n6', output: '[1,2]', isHidden: false },
          { input: '[3,3]\n6', output: '[0,1]', isHidden: true }
        ],
        starterCode: {
          cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    \n}',
          java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}',
          python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ',
          javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};'
        }
      },
      {
        category: dsaCategory._id,
        topic: 'Strings',
        difficulty: 'easy',
        questionText: 'Write a function that reverses a string. The input string is given as an array of characters `s`.',
        type: 'code',
        functionName: 'reverseString',
        drivers: {
          cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\n\nusing namespace std;\n\n{{user_code}}\n\nvector<char> parseCharVector(string s) {\n    vector<char> res;\n    for(int i=0; i<s.length(); ++i) {\n        if(s[i] != '[' && s[i] != ']' && s[i] != ',' && s[i] != '\"' && !isspace(s[i])) res.push_back(s[i]);\n    }\n    return res;\n}\n\nint main() {\n    string line1;\n    if (getline(cin, line1)) {\n        vector<char> s = parseCharVector(line1);\n        reverseString(s);\n        cout << "[";\n        for(int i=0; i<s.size(); ++i) cout << "\\\"" << s[i] << "\\\"" << (i==s.size()-1 ? "" : ",");\n        cout << "]";\n    }\n    return 0;\n}`,
          java: `import java.util.*;\n\n{{user_code}}\n\nclass SolutionRunner {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String line1 = sc.nextLine();\n        Solution sol = new Solution();\n        char[] s = parseCharArray(line1);\n        sol.reverseString(s);\n        System.out.print("[");\n        for(int i=0; i<s.length; i++) {\n            System.out.print("\\\"" + s[i] + "\\\"" + (i == s.length - 1 ? "" : ","));\n        }\n        System.out.println("]");\n    }\n    \n    private static char[] parseCharArray(String s) {\n        s = s.replace("[", "").replace("]", "").replace("\\\"", "").replace(" ", "").replace(",", "");\n        return s.toCharArray();\n    }\n}`
        },
        testCases: [
          { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]', isHidden: false },
          { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', isHidden: true }
        ],
        starterCode: {
          cpp: 'void reverseString(vector<char>& s) {\n    \n}',
          java: 'class Solution {\n    public void reverseString(char[] s) {\n        \n    }\n}',
          python: 'class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        ',
          javascript: '/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n    \n};'
        }
      }
    ];

    for (const q of questions) {
      await Question.findOneAndUpdate(
        { questionText: q.questionText, type: 'code' },
        q,
        { upsert: true, new: true }
      );
    }
    console.log('Successfully seeded/updated coding questions!');
    process.exit();
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedCodingQuestions();
