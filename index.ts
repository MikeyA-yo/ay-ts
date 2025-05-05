import { readFileSync } from "node:fs";
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
