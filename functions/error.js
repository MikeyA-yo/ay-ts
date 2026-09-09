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
