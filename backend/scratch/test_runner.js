import { runAgainstTestCases } from '../utils/codeRunner.js';

const code = `
function greet(name) {
    return "hello " + name;
}
`;

runAgainstTestCases(code, 'javascript', [{input: 'world', output: 'hello world'}], 'greet')
    .then(console.log)
    .catch(console.error);
