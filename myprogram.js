
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
    return arr.splice(start, deleteCount,...items);
}

function push(arr,...items) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    return arr.push(...items);
}

function pop(arr) {
    if (!Array.isArray(arr)) {
        console.error('Input must be an array but got,', typeof arr, 'instead for this function');
        process.exit(1)     
    }
    return arr.pop();
}
function rand(min = 0, max = 0) {
  return Math.random() * (max - min + 1) + min
}

function randInt(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function round(num, precision = 0) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}
// String utility functions for AY language
function Split(str, delimiter) {
  return str.split(delimiter);
}

function Reverse(str) {
  return str.split("").reverse().join("");
}

function stylishJoin(arr, delimiter) {
  return arr.join(delimiter);
}

function shoutyCaps(str) {
  return str.toUpperCase();
}

function whisperyCaps(str) {
  return str.toLowerCase();
}
// Print utility functions for AY language
function coolPrint(msg) {
  console.log("[COOL PRINT]", msg);
}

function fancyLog(msg) {
  console.log("✨ FANCY LOG:", msg);
}

function stylishWarn(msg) {
  console.warn("⚠️ STYLISH WARNING:", msg);
}

function errorPop(msg) {
  console.error("❌ ERROR POP:", msg);
}

function print(...msg) {
  console.log(...msg);
}

function errorlog(...msg) {
  console.error(...msg);
}
const { readFileSync, writeFileSync } = require("node:fs");

function read(path, options = "utf-8"){
    return readFileSync(path, options)
}

function write(file, data){
    return writeFileSync(file, data);
}
// Basic date utility functions
const dateToISO = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString();
};

const dateToLocal = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString();
};

const dateToShort = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const dateToLong = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const dateDiffInDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const dateDiffInHours = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

const dateDiffInMinutes = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60));
};

const dateDiffInSeconds = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / 1000);
};

// Advanced date manipulation
const dateAdd = (date, value, unit) => {
  const d = new Date(date);
  switch(unit.toLowerCase()) {
    case 'years': d.setFullYear(d.getFullYear() + value); break;
    case 'months': d.setMonth(d.getMonth() + value); break;
    case 'days': d.setDate(d.getDate() + value); break;
    case 'hours': d.setHours(d.getHours() + value); break;
    case 'minutes': d.setMinutes(d.getMinutes() + value); break;
    case 'seconds': d.setSeconds(d.getSeconds() + value); break;
  }
  return d;
};

const dateSubtract = (date, value, unit) => {
  return dateAdd(date, -value, unit);
};

const dateStartOf = (date, unit) => {
  const d = new Date(date);
  switch(unit.toLowerCase()) {
    case 'year': d.setMonth(0, 1); d.setHours(0, 0, 0, 0); break;
    case 'month': d.setDate(1); d.setHours(0, 0, 0, 0); break;
    case 'day': d.setHours(0, 0, 0, 0); break;
    case 'hour': d.setMinutes(0, 0, 0); break;
  }
  return d;
};

const dateEndOf = (date, unit) => {
  const d = new Date(date);
  switch(unit.toLowerCase()) {
    case 'year': d.setMonth(11, 31); d.setHours(23, 59, 59, 999); break;
    case 'month': d.setMonth(d.getMonth() + 1, 0); d.setHours(23, 59, 59, 999); break;
    case 'day': d.setHours(23, 59, 59, 999); break;
    case 'hour': d.setMinutes(59, 59, 999); break;
  }
  return d;
};

// Helper function to check if date is valid
const isValidDateFormat = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Timer utility functions for AY language
function Timeout(fn, delay) {
  return setTimeout(fn, delay);
}

function Interval(fn, interval) {
  return setInterval(fn, interval);
}

function stopTimeout(timeoutId) {
  clearTimeout(timeoutId);
}

function stopInterval(intervalId) {
  clearInterval(intervalId);
}
let a = "my program variables are nicely scoped";
let b = "hello world";
let c = 3 + 3;
let d = round(rand() * 12);
let arr = [1, 3, 5, 7];
function add(a, b) {
let c = a + b;
return c;
}
function foo(a) {
if ((a > 0)) {
let result = add(a, a);
return result;
}
}
let i = 0;
while (i < 5) {
print(i)
i++;
}
for (let i = 0; (i < 8); i++) {
print(i)
}
foo(20)
