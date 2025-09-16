import { readFileSync, writeFileSync } from "node:fs";
import { Parser } from "./parser/parser";
import compileAST from "./parser/astcompiler";

const fileName = process.argv[2];
const AY_FancyName = `
   █████╗ ██╗   ██╗
  ██╔══██╗╚██╗ ██╔╝
  ███████║ ╚████╔╝ 
  ██╔══██║  ╚██╔╝  
  ██║  ██║   ██║   
  ╚═╝  ╚═╝   ╚═╝   
`
const welcome = `Welcome to ${AY_FancyName} language compiler!\n\nUsage: ayc <filename>\n\nExample: ayc test.ay\n\n`;
if (!fileName) {
  console.error(welcome);
  console.error("No filename provided");
  process.exit(1);
}

const fileText = readFileSync(fileName, "utf-8");
const fileNameParts = fileName.split(".");
if (fileNameParts[fileNameParts.length - 1] !== "ay") {
  console.error(welcome);
  console.error("Invalid file extension");
  process.exit(1);
}
const arrF = readFileSync("./functions/arr.js", "utf-8");
const mathF = readFileSync("./functions/mth.js", "utf-8");
const stringF = readFileSync("./functions/string.js", "utf-8");
const printF = readFileSync("./functions/print.js", "utf-8");
const fsF = readFileSync("./functions/fs.js", "utf-8");
const dateF = readFileSync("./functions/date.js", "utf-8");
const timeF = readFileSync("./functions/timer.js", "utf-8");
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
`;
const outputFileName = fileNameParts[0] + ".js";
console.log(`Compiled ${fileName} to ${outputFileName}`);
writeFileSync(outputFileName, output);
// console.log(`Running ${outputFileName}...`);
// eval(output);