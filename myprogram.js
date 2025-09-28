
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
    if (!Array.isArray(arr) && typeof arr !== "string") {
        console.error('Input must be an array or string but got,', typeof arr, 'instead for this function');
        process.exit(1)     
    }
    return arr.length;  
}

function newArr(arr, size, fillValue = null){
    if (!Array.isArray(arr)) {
        console.error('Input must be an array');
        process.exit(1)
    }
    return Array.from({ length: size }, (_, i) => arr[i] || fillValue);
}
function includes(arr, value) {
    if (!Array.isArray(arr) && typeof arr !== "string") {
        console.error('Input must be an array or string but got,', typeof arr, 'instead for this function');
        process.exit(1)
    }
    return arr.includes(value);
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

// Basic trigonometric functions
function sin(x) {
  return Math.sin(x);
}

function cos(x) {
  return Math.cos(x);
}

function tan(x) {
  return Math.tan(x);
}

// Inverse trigonometric functions
function asin(x) {
  return Math.asin(x);
}

function acos(x) {
  return Math.acos(x);
}

function atan(x) {
  return Math.atan(x);
}

function atan2(y, x) {
  return Math.atan2(y, x);
}

// Hyperbolic functions
function sinh(x) {
  return Math.sinh(x);
}

function cosh(x) {
  return Math.cosh(x);
}

function tanh(x) {
  return Math.tanh(x);
}

// Inverse hyperbolic functions
function asinh(x) {
  return Math.asinh(x);
}

function acosh(x) {
  return Math.acosh(x);
}

function atanh(x) {
  return Math.atanh(x);
}

// Trigonometric identities and utility functions
function sec(x) {
  return 1 / Math.cos(x);
}

function csc(x) {
  return 1 / Math.sin(x);
}

function cot(x) {
  return 1 / Math.tan(x);
}

// Convert between degrees and radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Degree-based trigonometric functions
function sind(degrees) {
  return Math.sin(toRadians(degrees));
}

function cosd(degrees) {
  return Math.cos(toRadians(degrees));
}

function tand(degrees) {
  return Math.tan(toRadians(degrees));
}

// Additional math constants and functions
function pi() {
  return Math.PI;
}

function e() {
  return Math.E;
}

function abs(x) {
  return Math.abs(x);
}

function sqrt(x) {
  return Math.sqrt(x);
}

function pow(base, exponent) {
  return Math.pow(base, exponent);
}

function exp(x) {
  return Math.exp(x);
}

function log(x) {
  return Math.log(x);
}

function log10(x) {
  return Math.log10(x);
}

function log2(x) {
  return Math.log2(x);
}

function floor(x) {
  return Math.floor(x);
}

function ceil(x) {
  return Math.ceil(x);
}

function max(...numbers) {
  return Math.max(...numbers);
}

function min(...numbers) {
  return Math.min(...numbers);
}

// String utility functions for AY language
function split(str, delimiter) {
  return str.split(delimiter);
}

function reverse(str) {
  return str.split("").reverse().join("");
}

function join(arr, delimiter) {
  return arr.join(delimiter);
}

function upper(str) {
  return str.toUpperCase();
}

function lower(str) {
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


// Synchronous input function using process.stdin (blocks execution)
const fs = require("fs");

function input(prompt = "") {
  if (prompt) process.stdout.write(prompt);

  // Read from stdin until newline
  const buffer = Buffer.alloc(1024);
  const bytesRead = fs.readSync(process.stdin.fd, buffer, 0, buffer.length, null);

  return buffer.toString("utf8", 0, bytesRead).trim();
}

function writestdout(...args){
  process.stdout.write(args.join(' '));
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

function now(){
  return new Date();
}
function timestamp(){
  return Date.now();
}
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
let c = 6 + 3;
let d = round(rand() * 12);
let trueVar = true;
let falseVar = false;
let arr = [1, 3, 5, 7];
function add(a, b) {
let c = a + b;
return c;
}
function greet(name) {
let greeting = "Hello, " + name + "!";
return greeting;
}
let userName = "Alice";
let welcomeMessage = greet(userName);
print(welcomeMessage)
function factorial(n) {
if ((n <= 1)) {
return 1;
}
return n * factorial(n - 1);
}
function fibonacci(n) {
if ((n <= 1)) {
return n;
}
return fibonacci(n - 1) + fibonacci(n - 2);
}
let factResult = factorial(5);
let fibResult = fibonacci(8);
print(factResult)
print(fibResult)
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
let doubleResult = foo(20);
print(doubleResult)
function randPrint() {
if ((d > 6)) {
let comparison = 0.5 < d;
print(comparison)
print(d)
} else {
print(d)
}
}
randPrint()
let testingVar;




let aliasedVariable = "This was declared using var alias!";
print(aliasedVariable)
function aliasedFunction(x, y) {
let sum = x + y;
return sum;
}
let aliasResult = aliasedFunction(10, 15);
print(aliasResult)
let counter = 0;
while (counter < 10) {
print(counter)
counter++;
if ((counter == 3)) {
break;
}
}
let numbers = [1, 2, 3, 4, 5];
print(numbers, len(numbers))
let complexCalc = factorial(4) + fibonacci(6);
print(complexCalc)
let mathResult = add(factorial(3), fibonacci(5));
print(mathResult)
let asks = input("WHat you gonna type ei? ");
print(asks, len(asks))
let numberP = numbers[randInt(0, 4)];
print(numberP)
while (true) {
writestdout(0)
break;
}
writestdout("\n")
writestdout("Hey ")
writestdout("World\n")
let addComp = 8 + 9 - (7 / 6 * 8);
// Functional HTTP utilities for AY language
// All functions are pure and functional - no side effects, immutable data

// Simple GET Request
function httpGet(url, parseType = "json") {
  return fetch(url)
    .then((response) => {
      if (parseType === "json") {
        return response.json();
      } else if (parseType === "text") {
        return response.text();
      } else if (parseType === "blob") {
        return response.blob();
      } else if (parseType === "arrayBuffer") {
        return response.arrayBuffer();
      } else if (parseType === "formData") {
        return response.formData();
      } else {
        // Default to json if unknown type
        return response.json();
      }
    })
    .catch((error) => ({ error: error.message, success: false }));
}

// Simple POST Request
function httpPost(url, data) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => ({ error: error.message, success: false }));
}

// Simple PUT Request
function httpPut(url, data) {
  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => ({ error: error.message, success: false }));
}

// Simple DELETE Request
function httpDelete(url) {
  return fetch(url, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .catch((error) => ({ error: error.message, success: false }));
}

// Create HTTP Server
function createHttpServer(port) {
  const http = require("http");
  const url = require("url");

  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const response = {
        message: "Hello from AY HTTP Server!",
        method: method,
        path: path,
        query: parsedUrl.query,
        timestamp: new Date().toISOString(),
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    });
  });

  server.listen(port, () => {
    console.log(`AY HTTP Server running on port ${port}`);
  });

  return server;
}

// Start Server
function startHttpServer(port) {
  return createHttpServer(port);
}

// Stop Server
function stopHttpServer(server) {
  if (server && server.close) {
    server.close();
    return true;
  }
  return false;
}

// JSON Response Helper
function createJsonResponse(data, status) {
  return {
    status: status || 200,
    data: data,
    timestamp: new Date().toISOString(),
  };
}

// Error Response Helper
function createErrorResponse(message, status) {
  return {
    status: status || 500,
    error: message,
    timestamp: new Date().toISOString(),
  };
}

// Success Response Helper
function createSuccessResponse(data, message) {
  return {
    status: 200,
    success: true,
    message: message || "Success",
    data: data,
    timestamp: new Date().toISOString(),
  };
}

// URL Builder
function buildHttpUrl(base, path) {
  return base + path;
}

// Query String Builder
function buildQueryString(params) {
  const query = new URLSearchParams();
  for (const key in params) {
    query.append(key, params[key]);
  }
  return query.toString();
}

// Parse JSON
function parseJson(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return { error: "Invalid JSON", success: false };
  }
}

// Stringify JSON
function stringifyJson(obj) {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return "{}";
  }
}

// HTTP Status Helper
function getHttpStatusMessage(status) {
  const statusMessages = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };
  return statusMessages[status] || "Unknown Status";
}



// HTTP Logger
function logHttpRequest(method, url, data) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  if (data) {
    console.log("Data:", JSON.stringify(data, null, 2));
  }
}

// HTTP Logger for Response
function logHttpResponse(response) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Response:`, JSON.stringify(response, null, 2));
}

// Promise Resolution Utilities - Functional approach

// Simple promise resolver - waits for promise and returns result
function awaitPromise(promise, onSuccess, onError) {
  return promise.then(onSuccess).catch(onError);
}

// Promise resolver with timeout
function awaitPromiseWithTimeout(promise, onSuccess, onError, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Promise timeout")), timeout || 5000)
    ),
  ])
    .then(onSuccess)
    .catch(onError);
}



// Promise chain helper - run multiple promises
function awaitAll(promises, onSuccess, onError) {
  return Promise.all(promises).then(onSuccess).catch(onError);
}




// Simple promise logger
function logPromise(promise, label, varName) {
  console.log(`Starting promise: ${label || "Unnamed"}`);
  return promise
    .then((result) => {
      console.log(`Promise resolved: ${label || "Unnamed"}`, result);
      varName = result;
      return result;
    })
    .catch((error) => {
      console.error(`Promise rejected: ${label || "Unnamed"}`, error.message);
      return { error: error.message, success: false };
    });
}
