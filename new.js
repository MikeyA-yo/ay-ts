#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("node:fs");
var out = __dirname + '/out.js';
var programName = process.argv[2];
var program = fs.readFileSync(programName, 'utf-8');
var code;
// this function breaks the whole program into lines
function parse(codes) {
    return codes.split('\n');
}
// thus function breaks a line into words by white space
function tokenize(code) {
    return code.split(/\s+/);
}
// this function breaks a quote statement apart
function parseStatement(statement) {
    var regex = /"([^"]+)"|(\w+)|([=\[\]\(\){}÷*+\-])/g; // Matches either a quoted string or a word /("[^"]+"|\w+)/g
    var matches = statement.match(regex);
    return matches;
}
function generateCode(program) {
    code = "";
    var lines = parse(program);
    var newLines = lines.filter(function (line) {
        return line !== '\r';
    });
    if (newLines[0].includes('#')) {
        newLines[0] = '';
    }
    newLines.forEach(function (el) {
        el.includes('}') ? el += '' : el.includes(';') ? el += '' : el.includes('}') ? el += '' : el += ';';
        var values = tokenize(el);
        values[values.length] = '\n';
        for (var i = 0; i < values.length; i++) {
            if (values[i] == 'l') {
                values[i] = 'let';
            }
            if (values[i] == 'print') {
                values[i] = "console.log(".concat(values[i + 1], ")");
                values[i + 1] = ' ';
            }
            if (values[i] == 'f') {
                values[i] = 'function';
            }
        }
        // switch case will only be used for error handling
        switch (values[0]) {
            case 'l':
                values[0] = 'let';
                break;
            case 'print':
                values[0] = "console.log(".concat(values[1], ");");
                values[1] = ' ';
                break;
            case 'f':
                values[0] = "function";
                break;
            default:
                values[0] = values[0];
        }
        code += values.join(" ");
    });
    return code;
}
var math = "const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')\n";
var utils = "const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')\n";
var exec = " ".concat(math, " ").concat(utils, "  try {\n").concat(generateCode(program), "}catch(e){\n console.error(e.message);\n}");
fs.writeFileSync(out, exec);
require(out);
// if(!values[0].includes('(')){
//     values[0] = `console.log(${values[1]});`;
//     values[1] = ''
//    }else{
//     values[0]=values[0]
//    }
// function parseExpression(tokens: string[]): ExpressionNode[] {
//     if (tokens[0] === '"' && tokens[tokens.length - 1] === '"') {
//       return [{ kind: "StringLiteral", value: tokens.slice(1, -1).join("") }];
//     }
//     throw new Error("Unsupported expression");
//   }
//  if (values[0] == 'assign'){
//   values[0] = 'let';
//}
// function parse(tokens: string[]): ASTNode[] {
//     const ast: ASTNode[] = [];
//     for (let i = 0; i < tokens.length; i++) {
//       const token = tokens[i];
//       if (token === "let") {
//         const identifier = tokens[++i];
//         const expression = parseExpression(tokens.slice(i + 1));
//         ast.push({ kind: "VariableDeclaration", identifier, expression });
//         i += expression.length; // Skip parsed expression tokens
//       } else if (token === "print") {
//         const expression = parseExpression(tokens.slice(i + 1));
//         ast.push({ kind: "PrintStatement", expression });
//         i += expression.length; // Skip parsed expression tokens
//       }
//     }
//     return ast;
//   }
