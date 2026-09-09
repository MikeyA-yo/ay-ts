function sort(arr, compareFn) {
    expectArray("sort", arr);
    if (!compareFn) {
        return arr.sort();
    }
    return arr.sort(compareFn);
}

function reverse(arr) {
    expectArray("reverse", arr);
    return arr.reverse();
}

function filter(arr, callback) {
    expectArray("filter", arr);
    return arr.filter(callback);
}

function map(arr, callback) {
    expectArray("map", arr);
    return arr.map(callback);
}

function slice(arr, start, end) {
    expectArray("slice", arr);
    return arr.slice(start, end);
}

function splice(arr, start, deleteCount, ...items) {
    expectArray("splice", arr);
    arr.splice(start, deleteCount, ...items);
    return arr;
}

function push(arr, ...items) {
    expectArray("push", arr);
    arr.push(...items);
    return arr;
}

function pop(arr) {
    expectArray("pop", arr);
    arr.pop();
    return arr;
}

function len(arr) {
    expectArrayOrString("len", arr);
    return arr.length;
}

function newArr(arr, size, fillValue = null) {
    expectArray("newArr", arr);
    return Array.from({ length: size }, (_, i) => arr[i] || fillValue);
}

function includes(arr, value) {
    expectArrayOrString("includes", arr);
    return arr.includes(value);
}
