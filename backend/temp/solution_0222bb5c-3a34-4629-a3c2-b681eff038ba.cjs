var twoSum = (nums, target) => { fo}j = i + 1; j < num(nums[i] + nums[j] === target) return [i, j]; } } };


const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
try {
    const args = input.map(line => {
        try { return JSON.parse(line.trim()); }
        catch (e) { return line.trim(); }
    });
    
    let result;
    if (typeof twoSum === 'function') {
        result = twoSum(...args);
    } else if (typeof Solution !== 'undefined' && typeof Solution.prototype.twoSum === 'function') {
        const sol = new Solution();
        result = sol.twoSum(...args);
    } else {
        throw new Error("Function twoSum not found");
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
