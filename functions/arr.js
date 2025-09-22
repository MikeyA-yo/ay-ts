function sort(arr, compareFn) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    if (!compareFn) {
        return arr.sort();
    } else {
        return arr.sort(compareFn);
    }
}

function reverse(arr) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    return arr.reverse();
}

function filter(arr, callback) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    return arr.filter(callback);
}

function map(arr, callback) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    return arr.map(callback);
}

function slice(arr, start, end) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    return arr.slice(start, end);
}

function splice(arr, start, deleteCount, ...items) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    arr.splice(start, deleteCount,...items);
    return arr;
}

function push(arr,...items) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    arr.push(...items);
    return arr;
}

function pop(arr) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array but got,', typeof arr, 'instead for this function');
        process.exit(1)     
    }
    arr.pop();
    return arr;
}

function len(arr) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array but got,', typeof arr, 'instead for this function');
        process.exit(1)     
    }
    return arr.length;  
}