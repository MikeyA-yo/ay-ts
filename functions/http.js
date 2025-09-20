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

// Request Timeout Helper
function withHttpTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout || 5000)
    ),
  ]);
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

// Safe promise execution with default value
function safeAwait(promise, onSuccess, onError, defaultValue) {
  return promise.then(onSuccess).catch(onError);
}

// Promise chain helper - run multiple promises
function awaitAll(promises, onSuccess, onError) {
  return Promise.all(promises).then(onSuccess).catch(onError);
}

// Retry promise with simple retry logic
function retryAwait(promiseFn, onSuccess, onError, maxRetries) {
  let attempts = 0;

  function attempt() {
    return promiseFn().then(onSuccess).catch(onError);
  }

  return attempt();
}

// Promise result processor - simple transformation
function processPromiseResult(promise, varName, processor) {
  return promise
    .then((result) => {
      if (processor && typeof processor === "function") {
        varName = processor(result);
        return varName;
      }
      return result;
    })
    .catch((error) => ({ error: error.message, success: false }));
}

// Conditional promise execution
function conditionalAwait(condition, promiseFn, varName, fallbackValue) {
  if (condition) {
    return promiseFn().then((result) => {
      varName = result;
      return result;
    });
  }
  return Promise.resolve(fallbackValue || "Condition not met");
}

// Promise status checker
function checkPromiseStatus(promise, varName) {
  return promise
    .then((result) => {
      varName = result;
      return { status: "resolved", result: result };
    })
    .catch((error) => ({ status: "rejected", error: error.message }));
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

// Simple Promise Assignment Utilities - The core functionality you wanted

// Assign promise result to a variable (functional approach)
function assignPromise(promise, assignFn, varName) {
  return promise
    .then((result) => {
      assignFn(result);
      varName = result;
      return result;
    })
    .catch((error) => {
      const errorResult = { error: error.message, success: false };
      assignFn(errorResult);
      return errorResult;
    });
}

// Simple promise assignment with error handling
function assignPromiseSafe(promise, assignFn, varName, defaultValue) {
  return promise
    .then((result) => {
      assignFn(result);
      return result;
    })
    .catch((error) => {
      const fallback = defaultValue || { error: error.message, success: false };
      assignFn(fallback);
      return fallback;
    });
}

// Promise assignment with timeout
function assignPromiseTimeout(promise, assignFn, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Promise timeout")), timeout || 5000)
    ),
  ])
    .then((result) => {
      assignFn(result);
      return result;
    })
    .catch((error) => {
      const errorResult = { error: error.message, success: false };
      assignFn(errorResult);
      return errorResult;
    });
}

// Multiple promise assignment
function assignAllPromises(promises, assignFn) {
  return Promise.all(promises)
    .then((results) => {
      assignFn(results);
      return results;
    })
    .catch((error) => {
      const errorResult = { error: error.message, success: false };
      assignFn(errorResult);
      return errorResult;
    });
}
