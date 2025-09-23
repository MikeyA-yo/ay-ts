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
function input(prompt = "") {
  const fs = require('fs');
  
  // Display the prompt
  if (prompt) {
    process.stdout.write(prompt);
  }
  
  // Read from stdin synchronously
  let input = '';
  const fd = process.stdin.fd;
  const buffer = Buffer.alloc(1);
  
  while (true) {
    const bytesRead = fs.readSync(fd, buffer, 0, 1, null);
    if (bytesRead === 0) break;
    
    const char = buffer.toString();
    
    // Check for Enter key (newline)
    if (char === '\n' || char === '\r') {
      break;
    }
    
    // Add character to input
    input += char;
  }
  return input.trim();
}

