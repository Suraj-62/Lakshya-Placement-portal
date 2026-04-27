const inferTypeAndGenerateCppLiteral = (val) => {
    if (typeof val === 'number') {
        return { type: val % 1 === 0 ? 'int' : 'double', literal: val.toString() };
    }
    if (typeof val === 'boolean') {
        return { type: 'bool', literal: val ? 'true' : 'false' };
    }
    if (typeof val === 'string') {
        // Simple heuristic for char vs string if needed, but string is standard
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

const inferTypeAndGenerateJavaLiteral = (val) => {
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
        if (val.length === 0) {
            return { type: 'int[]', literal: 'new int[]{}' }; // Fallback
        }
        const inner = inferTypeAndGenerateJavaLiteral(val[0]);
        const literals = val.map(v => inferTypeAndGenerateJavaLiteral(v).literal);
        return { type: `${inner.type}[]`, literal: `new ${inner.type.replace(/\[\]/g, '')}[]{${literals.join(', ')}}` };
    }
    return { type: 'String', literal: '""' };
};

console.log(inferTypeAndGenerateCppLiteral([[1,2],[3,4]]));
console.log(inferTypeAndGenerateJavaLiteral([[1,2],[3,4]]));
console.log(inferTypeAndGenerateCppLiteral(["hello", "world"]));
