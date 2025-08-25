function deepCopyWithCircular(obj, visited = new WeakMap()) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (visited.has(obj)) {
        return visited.get(obj);
    }
    
    const copy = Array.isArray(obj) ? [] : {};
    visited.set(obj, copy);
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopyWithCircular(obj[key], visited);
        }
    }
    
    return copy;
}