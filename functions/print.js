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