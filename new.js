#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("node:fs");
var out = __dirname + '/out.js';
var programName = process.argv[2];
var program = fs.readFileSync(programName, 'utf-8');
// this function breaks the whole program into lines
function parse(codes) {
    return codes.split('\n');
}
// thus function breaks a line into words by white space
function tokenize(code) {
    return code.split(/\s+/);
}
function imp(values, val) {
    // to do fix this
    var impStatementLength = values.length;
    var importForV = values[1];
    var importLocation = values[impStatementLength - 3];
    var impLength = importLocation.length;
    importLocation = importLocation.slice(1, (impLength - 1));
    var ayImport = fs.readFileSync(importLocation, 'utf-8');
    for (var i = 0; i < impStatementLength; i++) {
        values[i] = '';
    }
    var jsTransformed = generateCode(ayImport);
    val = jsTransformed;
    return val;
}
//this function is peak
function parser(inputString) {
    // Separate the input string into segments
    var segments = inputString.match(/(["'`].*?["'`])|\S+/g);
    if (!segments)
        return [];
    var result = [];
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
        var segment = segments_1[_i];
        if (segment.startsWith('"') || segment.startsWith("'") || segment.startsWith("`")) {
            // Quoted strings
            result.push(segment);
        }
        else {
            // Split by parentheses, square brackets, braces, and operators
            var tokens = segment.split(/([()\[\]{}])/).filter(function (token) { return token.trim() !== ''; });
            // Combine adjacent parentheses, square brackets, or braces
            var combinedToken = '';
            for (var _a = 0, tokens_1 = tokens; _a < tokens_1.length; _a++) {
                var token = tokens_1[_a];
                if (token === '(' || token === '[' || token === '{' || token === ')' || token === ']' || token === '}') {
                    if (combinedToken !== '') {
                        result.push(combinedToken);
                        combinedToken = '';
                    }
                    result.push(token);
                }
                else {
                    combinedToken += token;
                }
            }
            // Push any remaining combined token
            if (combinedToken !== '') {
                result.push(combinedToken);
            }
        }
    }
    return result;
}
function parseStr(inputString) {
    var regex = /(["'`])(.*?)\1|\S+/g;
    var matches = inputString.match(regex);
    if (matches) {
        return matches;
    }
    else {
        return [];
    }
}
// this function breaks a quote statement apart
function parseStatement(statement) {
    var regex = /"([^"]+)"|(\w+)|([=\[\]\(\){}÷*+\-])/g; // Matches either a quoted string or a word /("[^"]+"|\w+)/g
    var matches = statement.match(regex);
    return matches;
}
var exporters = [];
function generateCode(program) {
    var code = "";
    var lines = parse(program);
    var newLines = lines.filter(function (line) {
        return line !== '\r';
    });
    if (newLines[0].includes('#')) {
        newLines[0] = '';
    }
    newLines.forEach(function (el) {
        el.includes('{') ? el += '' : el.includes(';') ? el += '' : el.includes('}') ? el += '' : el.includes(',') ? el += '' : el += ' ;';
        var values = parseStr(el);
        if (el.includes('for (') || el.includes('for(') || el.includes('if(') || el.includes('if (') || el.includes('exp@ f')) {
            values = parser(el);
        }
        values[values.length] = '\n';
        var container = [];
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
            if (values[i] == 'exp@') {
                exporters.push(values[i + 2]); // exported variable name to list of exported in a file
                values[i] = '';
            }
            if (values[i] == 'imp@') {
                // let impe = imp(values, values[i]);
                // values[i] = impe
                var impStatementLength = values.length;
                // import for variable
                var importForV = values[i + 1].slice(1, -1);
                var endMark = impStatementLength - 3;
                // import location
                var importLocation = values[endMark];
                var impLength = importLocation.length;
                importLocation = importLocation.slice(1, (impLength - 1));
                var ayImport = fs.readFileSync(process.cwd() + importLocation, 'utf-8');
                var dFr = values[2];
                //  console.log(importForV,importLocation,values)
                values[i] = '';
                values[i + 1] = '';
                values[2] = '';
                values[endMark] = '';
                if (importForV == importLocation) {
                    code += generateCode(ayImport);
                }
                else {
                    //to do actually make sure the file isn't loaded and executed
                    var tempCode = generateCode(ayImport);
                    tempCode += "module.exports = {".concat(exporters, "}\n");
                    if (exporters.includes(importForV)) {
                        var math_1 = "const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')\n";
                        var utils_1 = "const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')\n";
                        var AY_1 = "const {AY} = require(__dirname +'/objects/AY');\n";
                        var exec_1 = " ".concat(math_1, " ").concat(utils_1, " ").concat(AY_1, "  try {\n").concat(tempCode, "}catch(e){\n console.error(e.message);\n}");
                        var out2 = __dirname + '/out2.js';
                        fs.writeFileSync(out2, exec_1);
                        code += "const {".concat(importForV, "} = require(\"./out2\")");
                    }
                    if (!exporters.includes(importForV)) {
                        console.log('exports: ', exporters);
                        console.log('No exports found ', importForV);
                        process.exit(1);
                    }
                }
            }
        }
        code += values.join(" ");
        // switch case will only be used for error handling
        // switch(values[0]){
        //     case 'l':
        //         values[0] = 'let';
        //         break;
        //     case 'print':
        //         values[0] = `console.log(${values[1]});`;
        //         values[1] = ' '
        //         break; 
        //     case 'f':
        //         values[0] = `function`;
        //         break;    
        //     default:
        //         values[0] = values[0];    
        // }
        // code += values.join(" ");
    });
    return code;
}
var math = "const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')\n";
var utils = "const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')\n";
var AY = "const {AY} = require(__dirname +'/objects/AY');\n";
var exec = " ".concat(math, " ").concat(utils, " ").concat(AY, "  try {\n").concat(generateCode(program), "}catch(e){\n console.error(e.message);\n}");
module.exports = { program: program };
fs.writeFileSync(out, exec);
require(out);
