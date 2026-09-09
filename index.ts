#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import { Parser } from "./parser/parser";
import compileAST from "./parser/astcompiler";

declare const __dirname: string;
declare const require: { main: unknown };

const VERSION = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf-8")
).version as string;
const AY_FancyName = `
   █████╗ ██╗   ██╗
  ██╔══██╗╚██╗ ██╔╝
  ███████║ ╚████╔╝ 
  ██╔══██║  ╚██╔╝  
  ██║  ██║   ██║   
  ╚═╝  ╚═╝   ╚═╝   
`;

const usage = `${AY_FancyName}
AY Programming Language Compiler v${VERSION}

A modern, expressive programming language that compiles to JavaScript.

Usage:
  ayc <file.ay>                 Compile to JavaScript
  ayc build <file.ay>           Same as compile
  ayc run <file.ay> [args...]   Compile and run
  ay  <file.ay> [args...]       Compile and run (same as ayc run)

  ayc -h, --help                Show this help
  ayc -v, --version             Show version

Examples:
  ayc myprogram.ay
  ayc run myprogram.ay
  ayc run myprogram.ay Alice 42
  ay myprogram.ay

Visit: https://github.com/MikeyA-yo/ay-ts
`;

type Command = "build" | "run";

function isHelp(arg: string) {
  return arg === "-h" || arg === "--help" || arg === "help";
}

function isVersion(arg: string) {
  return arg === "-v" || arg === "--version" || arg === "version";
}

function printVersion() {
  console.log(`ayc v${VERSION}`);
}

function die(message: string, showUsage = false): never {
  if (showUsage) {
    console.error(usage);
  } else {
    console.error(`${AY_FancyName} Error encountered`);
  }
  console.error(message);
  process.exit(1);
}

function loadStdlib() {
  const dir = join(__dirname, "..", "functions");
  return [
    readFileSync(join(dir, "error.js"), "utf-8"),
    readFileSync(join(dir, "arr.js"), "utf-8"),
    readFileSync(join(dir, "mth.js"), "utf-8"),
    readFileSync(join(dir, "string.js"), "utf-8"),
    readFileSync(join(dir, "print.js"), "utf-8"),
    readFileSync(join(dir, "fs.js"), "utf-8"),
    readFileSync(join(dir, "date.js"), "utf-8"),
    readFileSync(join(dir, "timer.js"), "utf-8"),
    readFileSync(join(dir, "obj.js"), "utf-8"),
    readFileSync(join(dir, "http.js"), "utf-8"),
  ].join("\n");
}

function compileFile(fileName: string) {
  const fileNameParts = fileName.split(".");
  if (fileNameParts[fileNameParts.length - 1] !== "ay") {
    die("Invalid file extension. Please use .ay files only.", true);
  }

  const filePath = join(process.cwd(), fileName);
  let fileText: string;
  try {
    fileText = readFileSync(filePath, "utf-8");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    die(`Could not read file '${fileName}'\n${message}`, true);
  }

  const parser = new Parser(fileText, fileName);
  parser.start();
  if (parser.errors.length > 0) {
    const n = parser.errors.length;
    console.error(`ayc: ${fileName}: ${n} error${n === 1 ? "" : "s"}\n`);
    parser.errors.forEach((error) => {
      console.error(error);
      console.error("");
    });
    process.exit(1);
  }

  const compiled = compileAST(parser.nodes);
  const output = `${loadStdlib()}\n${compiled}\n`;
  const baseName = fileNameParts.slice(0, -1).join(".");
  const outputFileName = baseName.replace(/^.*[\\/]/, "") + ".js";
  writeFileSync(outputFileName, output);
  return outputFileName;
}

function runCompiled(outputFileName: string, programArgs: string[]) {
  const scriptPath = join(process.cwd(), outputFileName);
  const result = spawnSync(process.execPath, [scriptPath, ...programArgs], {
    stdio: "inherit",
  });
  if (result.error) {
    die(`Failed to run ${outputFileName}: ${result.error.message}`);
  }
  process.exit(result.status ?? 1);
}

export function runCli(defaultCommand: Command = "build") {
  const raw = process.argv.slice(2);

  if (raw.length === 0) {
    die("No filename provided", true);
  }

  if (isHelp(raw[0])) {
    console.log(usage);
    process.exit(0);
  }
  if (isVersion(raw[0])) {
    printVersion();
    process.exit(0);
  }

  let command: Command = defaultCommand;
  let rest = raw;

  if (raw[0] === "run" || raw[0] === "--run") {
    command = "run";
    rest = raw.slice(1);
  } else if (raw[0] === "build" || raw[0] === "compile") {
    command = "build";
    rest = raw.slice(1);
  }

  if (rest.length === 0) {
    die(`No filename provided for '${command}'`, true);
  }
  if (isHelp(rest[0])) {
    console.log(usage);
    process.exit(0);
  }
  if (isVersion(rest[0])) {
    printVersion();
    process.exit(0);
  }

  const fileName = rest[0];
  let programArgs = rest.slice(1);
  if (programArgs[0] === "--") {
    programArgs = programArgs.slice(1);
  }

  const outputFileName = compileFile(fileName);
  console.log(`Compiled ${fileName} to ${outputFileName}`);

  if (command === "run") {
    runCompiled(outputFileName, programArgs);
    return;
  }

  console.log(`Run with: ayc run ${fileName}`);
}

const invoked = basename(process.argv[1] || "").replace(/\.js$/i, "");
const defaultCommand: Command = invoked === "ay" ? "run" : "build";

if (typeof require !== "undefined" && require.main === module) {
  runCli(defaultCommand);
}
