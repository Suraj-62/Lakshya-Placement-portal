var twoSum = function(nums, target) {
      const m = new Map();
        for (let i = 0; i < nums.length; i++) {
                const v = nums[i];
                    const c = target - v;
                        if (m.has(c)) return [m.get(c), i];
                            m.set(v, i);
        }
        };
        


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
