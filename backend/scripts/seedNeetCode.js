import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../config/db.js';
import Question from '../models/Question.js';
import Category from '../models/Category.js';

// The 18 NeetCode Topics mapped with sample premium questions
const neetcodeQuestions = [
    // 1. Arrays & Hashing
    {
        topic: "Arrays & Hashing",
        difficulty: "easy",
        questionText: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        functionName: "twoSum",
        constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
        testCases: [
            { input: "[2,7,11,15]\n9", output: "[0,1]", isHidden: false },
            { input: "[3,2,4]\n6", output: "[1,2]", isHidden: false },
            { input: "[3,3]\n6", output: "[0,1]", isHidden: true }
        ]
    },
    {
        topic: "Arrays & Hashing",
        difficulty: "easy",
        questionText: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        functionName: "containsDuplicate",
        constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
        testCases: [
            { input: "[1,2,3,1]", output: "true", isHidden: false },
            { input: "[1,2,3,4]", output: "false", isHidden: false }
        ]
    },
    // 2. Two Pointers
    {
        topic: "Two Pointers",
        difficulty: "easy",
        questionText: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
        functionName: "isPalindrome",
        constraints: "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
        testCases: [
            { input: '"A man, a plan, a canal: Panama"', output: "true", isHidden: false },
            { input: '"race a car"', output: "false", isHidden: false }
        ]
    },
    {
        topic: "Two Pointers",
        difficulty: "medium",
        questionText: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
        functionName: "threeSum",
        constraints: "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
        testCases: [
            { input: "[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", isHidden: false },
            { input: "[0,1,1]", output: "[]", isHidden: false }
        ]
    },
    // 3. Sliding Window
    {
        topic: "Sliding Window",
        difficulty: "easy",
        questionText: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
        functionName: "maxProfit",
        constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
        testCases: [
            { input: "[7,1,5,3,6,4]", output: "5", isHidden: false },
            { input: "[7,6,4,3,1]", output: "0", isHidden: false }
        ]
    },
    {
        topic: "Sliding Window",
        difficulty: "medium",
        questionText: "Given a string s, find the length of the longest substring without repeating characters.",
        functionName: "lengthOfLongestSubstring",
        constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
        testCases: [
            { input: '"abcabcbb"', output: "3", isHidden: false },
            { input: '"bbbbb"', output: "1", isHidden: false }
        ]
    },
    // 4. Stack
    {
        topic: "Stack",
        difficulty: "easy",
        questionText: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        functionName: "isValid",
        constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
        testCases: [
            { input: '"()"', output: "true", isHidden: false },
            { input: '"()[]{}"', output: "true", isHidden: false },
            { input: '"(]"', output: "false", isHidden: false }
        ]
    },
    // 5. Binary Search
    {
        topic: "Binary Search",
        difficulty: "easy",
        questionText: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
        functionName: "search",
        constraints: "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.",
        testCases: [
            { input: "[-1,0,3,5,9,12]\n9", output: "4", isHidden: false },
            { input: "[-1,0,3,5,9,12]\n2", output: "-1", isHidden: false }
        ]
    },
    // 6. Linked List
    {
        topic: "Linked List",
        difficulty: "easy",
        questionText: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        functionName: "reverseList",
        constraints: "The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000",
        testCases: [
            { input: "[1,2,3,4,5]", output: "[5,4,3,2,1]", isHidden: false }
        ]
    },
    // 7. Trees
    {
        topic: "Trees",
        difficulty: "easy",
        questionText: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        functionName: "maxDepth",
        constraints: "The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100",
        testCases: [
            { input: "[3,9,20,null,null,15,7]", output: "3", isHidden: false }
        ]
    },
    // 8. Tries
    {
        topic: "Tries",
        difficulty: "medium",
        questionText: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class.",
        functionName: "Trie",
        constraints: "1 <= word.length, prefix.length <= 2000",
        testCases: [
            { input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]', output: "[null, null, true, false, true, null, true]", isHidden: false }
        ]
    },
    // 9. Heap / Priority Queue
    {
        topic: "Heap / Priority Queue",
        difficulty: "easy",
        questionText: "Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
        functionName: "KthLargest",
        constraints: "1 <= k <= 10^4\n0 <= nums.length <= 10^4\n-10^4 <= nums[i] <= 10^4",
        testCases: [
            { input: '["KthLargest", "add", "add", "add", "add", "add"]\n[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]', output: "[null, 4, 5, 5, 8, 8]", isHidden: false }
        ]
    },
    // 10. Backtracking
    {
        topic: "Backtracking",
        difficulty: "medium",
        questionText: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
        functionName: "permute",
        constraints: "1 <= nums.length <= 6\n-10 <= nums[i] <= 10\nAll the integers of nums are unique.",
        testCases: [
            { input: "[1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", isHidden: false }
        ]
    },
    // 11. Graphs
    {
        topic: "Graphs",
        difficulty: "medium",
        questionText: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        functionName: "numIslands",
        constraints: "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is '0' or '1'.",
        testCases: [
            { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", isHidden: false }
        ]
    },
    // 12. Advanced Graphs
    {
        topic: "Advanced Graphs",
        difficulty: "hard",
        questionText: "You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target. We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal.",
        functionName: "networkDelayTime",
        constraints: "1 <= k <= n <= 100",
        testCases: [
            { input: "[[2,1,1],[2,3,1],[3,4,1]]\n4\n2", output: "2", isHidden: false }
        ]
    },
    // 13. 1-D Dynamic Programming
    {
        topic: "1-D Dynamic Programming",
        difficulty: "easy",
        questionText: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        functionName: "climbStairs",
        constraints: "1 <= n <= 45",
        testCases: [
            { input: "2", output: "2", isHidden: false },
            { input: "3", output: "3", isHidden: false }
        ]
    },
    // 14. 2-D Dynamic Programming
    {
        topic: "2-D Dynamic Programming",
        difficulty: "medium",
        questionText: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
        functionName: "longestCommonSubsequence",
        constraints: "1 <= text1.length, text2.length <= 1000",
        testCases: [
            { input: '"abcde"\n"ace"', output: "3", isHidden: false }
        ]
    },
    // 15. Greedy
    {
        topic: "Greedy",
        difficulty: "medium",
        questionText: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
        functionName: "canJump",
        constraints: "1 <= nums.length <= 10^4\n0 <= nums[i] <= 10^5",
        testCases: [
            { input: "[2,3,1,1,4]", output: "true", isHidden: false },
            { input: "[3,2,1,0,4]", output: "false", isHidden: false }
        ]
    },
    // 16. Intervals
    {
        topic: "Intervals",
        difficulty: "medium",
        questionText: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        functionName: "merge",
        constraints: "1 <= intervals.length <= 10^4",
        testCases: [
            { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", isHidden: false }
        ]
    },
    // 17. Math & Geometry
    {
        topic: "Math & Geometry",
        difficulty: "medium",
        questionText: "Given an integer matrix, return a matrix of the same dimensions such that each element is rotated by 90 degrees clockwise. You must rotate the image in-place.",
        functionName: "rotate",
        constraints: "n == matrix.length == matrix[i].length",
        testCases: [
            { input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", isHidden: false }
        ]
    },
    // 18. Bit Manipulation
    {
        topic: "Bit Manipulation",
        difficulty: "easy",
        questionText: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
        functionName: "singleNumber",
        constraints: "1 <= nums.length <= 3 * 10^4",
        testCases: [
            { input: "[2,2,1]", output: "1", isHidden: false },
            { input: "[4,1,2,1,2]", output: "4", isHidden: false }
        ]
    }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to Database...");

        // 1. Delete all existing code questions to clean the slate
        console.log("Wiping existing coding questions...");
        const deleteResult = await Question.deleteMany({ type: 'code' });
        console.log(`Deleted ${deleteResult.deletedCount} old coding questions.`);

        // 2. Find or create a 'Coding' category
        let category = await Category.findOne({ name: 'DSA Practice' });
        if (!category) {
            category = await Category.findOne({ name: 'Coding' });
        }
        if (!category) {
            console.log("Creating new 'DSA Practice' category...");
            category = await Category.create({
                name: 'DSA Practice',
                description: 'Data Structures and Algorithms Industrial Practice',
                icon: 'Code'
            });
        }

        // 3. Map and Insert new NeetCode questions
        console.log("Seeding NeetCode Roadmap questions...");
        
        const questionsToInsert = neetcodeQuestions.map(q => {
            // Generate title from functionName (e.g. twoSum -> Two Sum)
            const generatedTitle = q.functionName 
                ? q.functionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) 
                : 'Coding Question';

            return {
                ...q,
                title: generatedTitle,
                type: 'code',
            category: category._id,
            starterCode: {
                cpp: `class Solution {\npublic:\n    // Add your code here\n};`,
                java: `class Solution {\n    // Add your code here\n}`,
                python: `class Solution:\n    def ${q.functionName}(self, args):\n        # Add your code here\n        pass`,
                javascript: `/**\n * @return {any}\n */\nvar ${q.functionName} = function(args) {\n    // Add your code here\n};`
            },
            drivers: {
                cpp: `// Hidden Driver Code`,
                java: `// Hidden Driver Code`,
                python: `# Hidden Driver Code`,
                javascript: `// Hidden Driver Code`
            }
        };
        });

        await Question.insertMany(questionsToInsert);
        
        console.log(`Successfully seeded ${questionsToInsert.length} NeetCode questions!`);
        console.log("Database Seed Complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();
