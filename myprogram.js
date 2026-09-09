function ayTypeName(value) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function fail(fn, message) {
  throw new TypeError(fn + "(): " + message);
}

function expectArray(fn, value) {
  if (!Array.isArray(value)) {
    fail(fn, "expected an array, got " + ayTypeName(value));
  }
}

function expectArrayOrString(fn, value) {
  if (!Array.isArray(value) && typeof value !== "string") {
    fail(fn, "expected an array or string, got " + ayTypeName(value));
  }
}

function error(message, extra) {
  const err = new Error(message == null ? "" : String(message));
  if (extra && typeof extra === "object") {
    const keys = Object.keys(extra);
    for (let i = 0; i < keys.length; i++) {
      err[keys[i]] = extra[keys[i]];
    }
  }
  return err;
}

function ayPrintError(err, kind) {
  const name = err && err.name ? err.name : "Error";
  const msg = err && err.message != null ? err.message : String(err);
  console.error("AY " + (kind || "runtime") + " error: " + name + ": " + msg);
}

if (typeof process !== "undefined" && process.on && !global.__ayErrorHooks) {
  global.__ayErrorHooks = true;
  process.on("uncaughtException", (err) => {
    ayPrintError(err);
    process.exit(1);
  });
  process.on("unhandledRejection", (reason) => {
    ayPrintError(reason instanceof Error ? reason : new Error(String(reason)), "unhandled");
    process.exit(1);
  });
}

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

function rand(min, max) {
  if (min === undefined && max === undefined) {
    return Math.random();
  }
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
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

function reverse(val) {
  if (Array.isArray(val)) {
    return val.reverse();
  }
  if (typeof val !== "string") {
    fail("reverse", "expected an array or string, got " + ayTypeName(val));
  }
  return String(val).split("").reverse().join("");
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
  console.log("FANCY LOG:", msg);
}

function stylishWarn(msg) {
  console.warn("STYLISH WARNING:", msg);
}

function errorPop(msg) {
  console.error("ERROR POP:", msg);
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
// Named object blueprints. A stepping stone toward class syntax:
//   l Cat = type({
//       init(name) { this.name = name },
//       speak() { return this.name + " meows" }
//   })
//   l c = new Cat("Mochi")
function type(blueprint) {
  if (!blueprint || typeof blueprint !== "object" || Array.isArray(blueprint)) {
    fail("type", "expected an object of fields and methods, got " + ayTypeName(blueprint));
  }

  function Type() {
    const keys = Object.keys(blueprint);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof blueprint[key] !== "function") {
        this[key] = blueprint[key];
      }
    }
    const init = blueprint.init || blueprint.new;
    if (typeof init === "function") {
      init.apply(this, arguments);
    }
  }

  const keys = Object.keys(blueprint);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof blueprint[key] === "function" && key !== "init" && key !== "new") {
      Type.prototype[key] = blueprint[key];
    }
  }

  return Type;
}

const nodeHttp = (() => {
  try {
    return require("http");
  } catch (err) {
    return null;
  }
})();
const nodeFs = (() => {
  try {
    return require("fs");
  } catch (err) {
    return null;
  }
})();
const nodePath = (() => {
  try {
    return require("path");
  } catch (err) {
    return null;
  }
})();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

function parseFetchBody(response, parseType) {
  if (parseType === "text") return response.text();
  if (parseType === "blob") return response.blob();
  if (parseType === "arrayBuffer") return response.arrayBuffer();
  if (parseType === "formData") return response.formData();
  if (parseType === "raw") return Promise.resolve(response);
  return response.text().then((text) => {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (err) {
      const parseErr = new Error("Failed to parse JSON response from " + response.url);
      parseErr.body = text;
      parseErr.status = response.status;
      throw parseErr;
    }
  });
}

function ayFetch(options) {
  if (typeof options === "string") {
    options = { url: options };
  }
  options = options || {};
  const url = options.url;
  if (!url || typeof url !== "string") {
    return Promise.reject(new TypeError("http request: missing url"));
  }
  const method = (options.method || "GET").toUpperCase();
  const headers = Object.assign({}, options.headers || {});
  let body = options.body;
  const parseType = options.parse || options.parseType || "json";

  if (body !== undefined && body !== null && typeof body !== "string" && !Buffer.isBuffer(body)) {
    if (!headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
    try {
      body = JSON.stringify(body);
    } catch (err) {
      return Promise.reject(new TypeError("http request: body cannot be converted to JSON"));
    }
  }

  const init = { method, headers };
  if (body !== undefined && method !== "GET" && method !== "HEAD") {
    init.body = body;
  }

  return fetch(url, init).then((response) => parseFetchBody(response, parseType));
}

function httpGet(url, options) {
  if (typeof options === "string") {
    options = { parse: options };
  }
  return ayFetch(Object.assign({ method: "GET", url }, options || {}));
}

function httpPost(url, data, options) {
  return ayFetch(Object.assign({ method: "POST", url, body: data }, options || {}));
}

function httpPut(url, data, options) {
  return ayFetch(Object.assign({ method: "PUT", url, body: data }, options || {}));
}

function httpPatch(url, data, options) {
  return ayFetch(Object.assign({ method: "PATCH", url, body: data }, options || {}));
}

function httpDelete(url, options) {
  return ayFetch(Object.assign({ method: "DELETE", url }, options || {}));
}

function httpRequest(options) {
  return ayFetch(options || {});
}

function matchRoute(pattern, path) {
  if (pattern === "*" || pattern === "/*") {
    return { ok: true, params: { wildcard: path.replace(/^\//, "") } };
  }
  const pat = String(pattern).split("/").filter(Boolean);
  const parts = String(path).split("/").filter(Boolean);
  const params = {};
  for (let i = 0; i < pat.length; i++) {
    if (pat[i] === "*") {
      params.wildcard = parts.slice(i).join("/");
      return { ok: true, params };
    }
    if (i >= parts.length) return { ok: false, params };
    if (pat[i][0] === ":") {
      params[pat[i].slice(1)] = decodeURIComponent(parts[i]);
    } else if (pat[i] !== parts[i]) {
      return { ok: false, params };
    }
  }
  if (pat.length !== parts.length) return { ok: false, params };
  return { ok: true, params };
}

function pathStartsWith(path, prefix) {
  if (!prefix || prefix === "/" || prefix === "*") return true;
  if (path === prefix) return true;
  const base = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  return path.startsWith(base + "/") || path === base;
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        req.destroy();
        reject(new Error("Request body too large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseBody(raw, contentType) {
  if (!raw) return null;
  const type = (contentType || "").toLowerCase();
  if (type.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      const parseErr = new Error("Invalid JSON body");
      parseErr.status = 400;
      throw parseErr;
    }
  }
  if (type.includes("application/x-www-form-urlencoded")) {
    const out = {};
    new URLSearchParams(raw).forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }
  return raw;
}

function sendValue(res, value) {
  if (res.sent) return;
  if (value === null || value === undefined) {
    res.status(204).end();
    return;
  }
  if (Buffer.isBuffer(value)) {
    res.send(value);
    return;
  }
  if (typeof value === "string") {
    if (value.trim().startsWith("<")) res.html(value);
    else res.send(value);
    return;
  }
  res.json(value);
}

function makeResponse(nodeRes, settings) {
  let statusCode = 200;
  const headers = {};
  let sent = false;

  if (settings.cors) {
    const cors = settings.cors === true ? {} : settings.cors;
    headers["Access-Control-Allow-Origin"] = cors.origin || "*";
    headers["Access-Control-Allow-Methods"] =
      cors.methods || "GET, POST, PUT, PATCH, DELETE, OPTIONS";
    headers["Access-Control-Allow-Headers"] =
      cors.headers || "Content-Type, Authorization";
  }

  function writeOut(body) {
    if (sent) return api;
    sent = true;
    api.sent = true;
    let payload = body;
    if (payload == null) payload = "";
    if (!Buffer.isBuffer(payload)) payload = Buffer.from(String(payload));
    if (headers["Content-Length"] == null) {
      headers["Content-Length"] = payload.length;
    }
    nodeRes.writeHead(statusCode, headers);
    nodeRes.end(payload);
    return api;
  }

  const api = {
    sent: false,
    status(code) {
      statusCode = code;
      return api;
    },
    header(name, value) {
      headers[name] = value;
      return api;
    },
    type(mime) {
      headers["Content-Type"] = mime;
      return api;
    },
    json(data) {
      headers["Content-Type"] = "application/json; charset=utf-8";
      let text;
      try {
        text = JSON.stringify(data);
      } catch (err) {
        fail("res.json", "value cannot be converted to JSON");
      }
      return writeOut(text);
    },
    send(data) {
      if (Buffer.isBuffer(data)) {
        if (!headers["Content-Type"]) headers["Content-Type"] = "application/octet-stream";
        return writeOut(data);
      }
      if (data !== null && typeof data === "object") return api.json(data);
      if (!headers["Content-Type"]) headers["Content-Type"] = "text/plain; charset=utf-8";
      return writeOut(data);
    },
    html(data) {
      headers["Content-Type"] = "text/html; charset=utf-8";
      return writeOut(data);
    },
    text(data) {
      headers["Content-Type"] = "text/plain; charset=utf-8";
      return writeOut(data);
    },
    redirect(url, code) {
      statusCode = code || 302;
      headers["Location"] = url;
      return writeOut("");
    },
    end(data) {
      return writeOut(data == null ? "" : data);
    },
  };
  return api;
}

function serveStaticFile(root, urlPath, res) {
  if (!nodeFs || !nodePath) return false;
  const relative = decodeURIComponent(urlPath).replace(/^\/+/, "");
  const resolvedRoot = nodePath.resolve(root);
  let file = nodePath.resolve(resolvedRoot, relative);
  if (file !== resolvedRoot && !file.startsWith(resolvedRoot + nodePath.sep)) {
    return false;
  }
  if (nodeFs.existsSync(file) && nodeFs.statSync(file).isDirectory()) {
    file = nodePath.join(file, "index.html");
  }
  if (!nodeFs.existsSync(file) || !nodeFs.statSync(file).isFile()) {
    return false;
  }
  const ext = nodePath.extname(file).toLowerCase();
  res.header("Content-Type", MIME[ext] || "application/octet-stream");
  res.send(nodeFs.readFileSync(file));
  return true;
}

function registerBag(app, method, bag) {
  if (!bag || typeof bag !== "object") return;
  const paths = Object.keys(bag);
  for (let i = 0; i < paths.length; i++) {
    app[method](paths[i], bag[paths[i]]);
  }
}

function createServer(options) {
  if (typeof options === "number") {
    options = { port: options };
  }
  options = options || {};

  const settings = {
    port: options.port,
    host: options.host,
    cors: options.cors !== undefined ? options.cors : true,
    limit: options.limit || 1024 * 1024,
    static: options.static || null,
    debug: !!options.debug,
  };

  const routes = [];
  const middlewares = [];
  const staticDirs = [];

  if (typeof settings.static === "string") {
    staticDirs.push({ prefix: "/", dir: settings.static });
  } else if (settings.static && typeof settings.static === "object") {
    staticDirs.push({
      prefix: settings.static.path || "/",
      dir: settings.static.dir || settings.static.root,
    });
  }

  const errorHandlers = [];

  function addRoute(method, path, handler) {
    if (typeof handler !== "function") {
      fail("app." + method.toLowerCase(), "handler for " + path + " must be a function");
    }
    routes.push({ method: method.toUpperCase(), path, handler });
    return app;
  }

  const app = {
    settings,
    get(path, handler) {
      return addRoute("GET", path, handler);
    },
    post(path, handler) {
      return addRoute("POST", path, handler);
    },
    put(path, handler) {
      return addRoute("PUT", path, handler);
    },
    patch(path, handler) {
      return addRoute("PATCH", path, handler);
    },
    del(path, handler) {
      return addRoute("DELETE", path, handler);
    },
    all(path, handler) {
      return addRoute("*", path, handler);
    },
    use(path, handler) {
      if (typeof path === "function") {
        handler = path;
        path = "/";
      }
      if (typeof handler !== "function") {
        fail("app.use", "middleware must be a function");
      }
      middlewares.push({ path: path || "/", handler });
      return app;
    },
    error(handler) {
      if (typeof handler !== "function") {
        fail("app.error", "expected a function (err, req, res)");
      }
      errorHandlers.push(handler);
      return app;
    },
    static(prefix, dir) {
      if (dir === undefined) {
        dir = prefix;
        prefix = "/";
      }
      staticDirs.push({ prefix, dir });
      return app;
    },
    listen(port, host, callback) {
      if (!nodeHttp) {
        throw new Error("createServer() requires Node.js http");
      }
      if (typeof port === "function") {
        callback = port;
        port = settings.port;
        host = settings.host;
      } else if (typeof host === "function") {
        callback = host;
        host = settings.host;
      }
      if (port == null) port = settings.port || 3000;
      if (host == null) host = settings.host;

      app._server = nodeHttp.createServer((req, nodeRes) => {
        readBody(req, settings.limit)
          .then((raw) => {
            const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
            const path = decodeURIComponent(url.pathname);
            const query = {};
            url.searchParams.forEach((value, key) => {
              query[key] = value;
            });
            const res = makeResponse(nodeRes, settings);

            if (req.method === "OPTIONS" && settings.cors) {
              res.status(204).end();
              return;
            }

            let matched = null;
            for (let i = 0; i < routes.length; i++) {
              const route = routes[i];
              if (route.method !== "*" && route.method !== req.method) continue;
              const hit = matchRoute(route.path, path);
              if (hit.ok) {
                matched = { route, params: hit.params };
                break;
              }
            }

            const reqObj = {
              method: req.method,
              url: req.url,
              path,
              query,
              params: matched ? matched.params : {},
              headers: req.headers,
              body: parseBody(raw, req.headers["content-type"]),
              raw,
            };

            const stack = [];
            for (let i = 0; i < middlewares.length; i++) {
              if (pathStartsWith(path, middlewares[i].path)) {
                stack.push(middlewares[i].handler);
              }
            }
            if (matched) stack.push(matched.route.handler);

            let index = 0;
            function sendError(err) {
              ayPrintError(err, "server");
              let errIndex = 0;
              function nextError(current) {
                const fn = errorHandlers[errIndex++];
                if (!fn) {
                  if (!res.sent) {
                    const status = (current && (current.status || current.statusCode)) || 500;
                    const body = {
                      error: String((current && current.message) || current || "Internal Server Error"),
                    };
                    if (settings.debug && current && current.stack) {
                      body.stack = current.stack;
                    }
                    res.status(status).json(body);
                  }
                  return;
                }
                try {
                  const result = fn(current, reqObj, res);
                  Promise.resolve(result)
                    .then((value) => {
                      if (res.sent) return;
                      if (value !== undefined) sendValue(res, value);
                      else nextError(current);
                    })
                    .catch(nextError);
                } catch (caught) {
                  nextError(caught);
                }
              }
              nextError(err);
            }
            function next(err) {
              if (err) {
                sendError(err);
                return;
              }
              const fn = stack[index++];
              if (!fn) {
                if (res.sent) return;
                for (let i = 0; i < staticDirs.length; i++) {
                  const mount = staticDirs[i];
                  if (!pathStartsWith(path, mount.prefix)) continue;
                  let rest = path;
                  if (mount.prefix !== "/") {
                    rest = path.slice(mount.prefix.length) || "/";
                  }
                  if (serveStaticFile(mount.dir, rest, res)) return;
                }
                res.status(404).json({ error: "Not Found", path });
                return;
              }
              try {
                const result =
                  fn.length >= 3 ? fn(reqObj, res, next) : fn(reqObj, res);
                Promise.resolve(result)
                  .then((value) => {
                    if (res.sent) return;
                    if (value !== undefined) {
                      sendValue(res, value);
                      return;
                    }
                    if (fn.length >= 3) return;
                    if (index >= stack.length && matched) {
                      res.status(204).end();
                      return;
                    }
                    next();
                  })
                  .catch(next);
              } catch (caught) {
                next(caught);
              }
            }
            next();
          })
          .catch((err) => {
            const res = makeResponse(nodeRes, settings);
            const status =
              err && err.status
                ? err.status
                : String(err.message || "").includes("too large")
                ? 413
                : 400;
            ayPrintError(err, "server");
            res.status(status).json({ error: String(err.message || err) });
          });
      });

      app._server.on("error", (err) => {
        if (err && err.code === "EADDRINUSE") {
          console.error("AY server error: port " + port + " is already in use");
        } else {
          ayPrintError(err, "server");
        }
        process.exit(1);
      });

      const onListen = () => {
        const addr = app._server.address();
        app.port = addr && addr.port;
        const where = typeof addr === "string" ? addr : "http://localhost:" + app.port;
        console.log("AY server listening on " + where);
        if (typeof callback === "function") callback();
      };

      if (host) app._server.listen(port, host, onListen);
      else app._server.listen(port, onListen);
      return app;
    },
    close(callback) {
      if (app._server && app._server.close) {
        app._server.close(callback);
        return true;
      }
      return false;
    },
    address() {
      return app._server && app._server.address ? app._server.address() : null;
    },
  };

  app.delete = app.del;

  registerBag(app, "get", options.get);
  registerBag(app, "post", options.post);
  registerBag(app, "put", options.put);
  registerBag(app, "patch", options.patch);
  registerBag(app, "del", options.del || options.delete);
  registerBag(app, "all", options.all);

  if (Array.isArray(options.use)) {
    for (let i = 0; i < options.use.length; i++) app.use(options.use[i]);
  } else if (typeof options.use === "function") {
    app.use(options.use);
  }

  if (typeof options.error === "function") {
    app.error(options.error);
  }

  return app;
}

function createHttpServer(port, handler) {
  const app = createServer(typeof port === "object" && port ? port : {});
  if (typeof handler === "function") {
    app.all("*", handler);
  }
  if (typeof port === "number") return app.listen(port);
  if (port && typeof port === "object" && port.port != null) return app.listen(port.port, port.host);
  return app;
}

function startHttpServer(port) {
  return createHttpServer(port);
}

function stopHttpServer(server) {
  if (server && typeof server.close === "function") {
    server.close();
    return true;
  }
  return false;
}

const http = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  del: httpDelete,
  delete: httpDelete,
  request: httpRequest,
  server: createServer,
};

function createJsonResponse(data, status) {
  return {
    status: status || 200,
    data: data,
    timestamp: new Date().toISOString(),
  };
}

function createErrorResponse(message, status) {
  return {
    status: status || 500,
    error: message,
    timestamp: new Date().toISOString(),
  };
}

function createSuccessResponse(data, message) {
  return {
    status: 200,
    success: true,
    message: message || "Success",
    data: data,
    timestamp: new Date().toISOString(),
  };
}

function buildHttpUrl(base, path) {
  return base + path;
}

function buildQueryString(params) {
  const query = new URLSearchParams();
  for (const key in params) {
    query.append(key, params[key]);
  }
  return query.toString();
}

function parseJson(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return { error: "Invalid JSON", success: false };
  }
}

function stringifyJson(obj) {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return "{}";
  }
}

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

function logHttpRequest(method, url, data) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  if (data) {
    console.log("Data:", JSON.stringify(data, null, 2));
  }
}

function logHttpResponse(response) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Response:`, JSON.stringify(response, null, 2));
}

function awaitPromise(promise, onSuccess, onError) {
  return promise.then(onSuccess).catch(onError);
}

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

function awaitAll(promises, onSuccess, onError) {
  return Promise.all(promises).then(onSuccess).catch(onError);
}

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
i++
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
counter++
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
let asks = input("What you gonna type ei? ");
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
let obj = { name: "Alice", age: 30, isStudent: false, greet: function () {
return "Hello, " + this.name + "!";
} };
print(obj.greet())
print(obj.name, obj.age, obj.isStudent)
