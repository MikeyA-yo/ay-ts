#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { Parser } from "./parser/parser";
import compileAST from "./parser/astcompiler";

const fileName = process.argv[2];
const VERSION = "1.0.0";
const AY_FancyName = `
   █████╗ ██╗   ██╗
  ██╔══██╗╚██╗ ██╔╝
  ███████║ ╚████╔╝ 
  ██╔══██║  ╚██╔╝  
  ██║  ██║   ██║   
  ╚═╝  ╚═╝   ╚═╝   
`
const welcome = `${AY_FancyName}
AY Programming Language Compiler v${VERSION}

A modern, expressive programming language that compiles to JavaScript.
Features: Variables (l), Functions (f), Comments, Control Flow, Async Operations, and more!

Usage: ayc <filename>
Example: ayc myprogram.ay

Visit: https://github.com/MikeyA-yo/ay-ts
`;
if (!fileName) {
  console.error(welcome);
  console.error("⚠️  No filename provided");
  process.exit(1);
}

const fileText = readFileSync(fileName, "utf-8");
const fileNameParts = fileName.split(".");
if (fileNameParts[fileNameParts.length - 1] !== "ay") {
  console.error(welcome);
  console.error("⚠️  Invalid file extension. Please use .ay files only.");
  process.exit(1);
}
const arrF = readFileSync("./functions/arr.js", "utf-8");
const mathF = readFileSync("./functions/mth.js", "utf-8");
const stringF = readFileSync("./functions/string.js", "utf-8");
const printF = readFileSync("./functions/print.js", "utf-8");
const fsF = readFileSync("./functions/fs.js", "utf-8");
const dateF = readFileSync("./functions/date.js", "utf-8");
const timeF = readFileSync("./functions/timer.js", "utf-8");
const httpF = readFileSync("./functions/http.js", "utf-8");
// const mathFancy = `
//   ██╗   ██╗███████╗██████╗ ██╗   ██╗███████╗██████╗
//   ╚██╗ ██╔╝██╔════╝██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
//    ╚████╔╝ █████╗  ██████╔╝ ╚████╔╝ █████╗  ██████╔╝
//     ╚██╔╝  ██╔══╝  ██╔══██╗  ╚██╔╝  ██╔══╝  ██╔══██╗
//      ██║   ███████╗██║  ██║   ██║   ███████╗██║  ██║
//      ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
// `
const parser = new Parser(fileText);
parser.start();
if (parser.errors.length > 0) {

  console.error(`${AY_FancyName} Error encountered\nError compiling ${fileName}\n`);
  console.error("Errors:");
  parser.errors.forEach((error) => {
    console.error(error);
  });
  process.exit(1);
}

const ast = parser.nodes;
const compiled = compileAST(ast);
const output = `
${arrF}
${mathF}
${stringF}
${printF}
${fsF}
${dateF}
${timeF}
${compiled}
${httpF}
`;
const outputFileName = fileNameParts[0] + ".js";
console.log(`✅ Compiled ${fileName} to ${outputFileName}`);
console.log(`🚀 Run with: node ${outputFileName}`);
writeFileSync(outputFileName, output);
// console.log(`Running ${outputFileName}...`);
// eval(output);