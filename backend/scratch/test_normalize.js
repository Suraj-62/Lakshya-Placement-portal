const normalize = (str) => {
    let trimmed = str.trim();
    try {
        let parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') return parsed;
        return JSON.stringify(parsed);
    } catch (e) {
        return trimmed.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    }
};

const tests = [
    { actual: '"hello"', expected: 'hello' },
    { actual: '3', expected: '3' },
    { actual: '[1, 2]', expected: '[1,2]' },
    { actual: '{"a": 1}', expected: '{"a":1}' },
    { actual: 'true', expected: 'true' },
    { actual: '["h", "e"]', expected: '["h","e"]' }
];

tests.forEach(t => {
    const act = normalize(t.actual);
    const exp = normalize(t.expected);
    console.log(`ACT: ${act} | EXP: ${exp} | MATCH: ${act === exp}`);
});
