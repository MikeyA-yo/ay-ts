#!/usr/bin/env node
import * as fs from 'node:fs';
const out = __dirname+'/out.js';
const programName = process.argv[2];
const program = fs.readFileSync(programName, 'utf-8');
let code;

// this function breaks the whole program into lines
function parse(codes:any): string[]{
    return codes.split('\n');
}  
// thus function breaks a line into words by white space
function tokenize(code:string): string[]{
   return code.split(/\s+/);
}
function imp(values, val){
    // to do fix this
    let impStatementLength = values.length;
    let importForV = values[1];
    let importLocation = values[impStatementLength - 3]
    let impLength = importLocation.length;
    importLocation = importLocation.slice(1,(impLength - 1))
    let ayImport = fs.readFileSync(importLocation, 'utf-8');
    for(let i = 0; i < impStatementLength; i++){
        values[i] = '';
    }
    let jsTransformed = generateCode(ayImport);
    val = jsTransformed;
    return val
}
//this function is peak
function parser(inputString:string): string[] | any {
    // Separate the input string into segments
    const segments = inputString.match(/(["'`].*?["'`])|\S+/g);

    if (!segments) return [];

    const result:any = [];

    for (const segment of segments) {
        if (segment.startsWith('"') || segment.startsWith("'") || segment.startsWith("`")) {
            // Quoted strings
            result.push(segment);
        } else {
            // Split by parentheses, square brackets, braces, and operators
            const tokens = segment.split(/([()\[\]{}])/).filter(token => token.trim() !== '');

            // Combine adjacent parentheses, square brackets, or braces
            let combinedToken = '';
            for (const token of tokens) {
                if (token === '(' || token === '[' || token === '{' || token === ')' || token === ']' || token === '}') {
                    if (combinedToken !== '') {
                        result.push(combinedToken);
                        combinedToken = '';
                    }
                    result.push(token);
                } else {
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
function parseStr(inputString:string): string[] | any {
    const regex = /(["'`])(.*?)\1|\S+/g;
    const matches = inputString.match(regex);

    if (matches) {
        return matches;
    } else {
        return [];
    }
}
// this function breaks a quote statement apart
function parseStatement(statement): string[] {
    const regex =/"([^"]+)"|(\w+)|([=\[\]\(\){}÷*+\-])/g ; // Matches either a quoted string or a word /("[^"]+"|\w+)/g
    const matches = statement.match(regex);
    return matches;
  }
function generateCode(program:any){
     code = "";
     let lines = parse(program)
     let newLines =lines.filter(line => {
       return line !== '\r'
     })
     if(newLines[0].includes('#')){
        newLines[0] = ''
     }
    
    newLines.forEach(el => {
        el.includes('{') ? el += '' : el.includes(';') ? el += '': el.includes('}') ? el += '' : el.includes(',') ? el += '' : el += ';' ;
        let values: RegExpMatchArray  | string[] = parseStr(el);
        if(el.includes('for (') || el.includes('for(') || el.includes('if(') ||el.includes('if (')){
            values = parser(el)
        }
        values[values.length] = '\n';
        let container:any = []
        for(let i = 0; i < values.length; i++){
            if(values[i] == 'l'){
                values[i] = 'let';
            }
            if(values[i] == 'print'){
                values[i] = `console.log(${values[i + 1]})`
                values[i + 1] = ' '
            }
            if ( values[i] == 'f'){
                values[i] = 'function'
            }
            
            if (values[i] == 'imp@') {
                // let impe = imp(values, values[i]);
                // values[i] = impe
                let impStatementLength = values.length;
                let importForV = values[i + 1];
                let importLocation = values[impStatementLength - 3]
                let impLength = importLocation.length;
                importLocation = importLocation.slice(1,(impLength - 1))
                let ayImport = fs.readFileSync(importLocation, 'utf-8');
              //  console.log(values[i],values[impStatementLength - 3])
                values[i] = '';
                values[impStatementLength - 3] = '';
         
              code += generateCode(ayImport);
            }
        } 
        code += values.join(" ")
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
    })
    return code;
}
const math = `const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')\n`;
const utils = `const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')\n`
const AY = `const {AY} = require(__dirname +'/objects/AY');\n`;
const exec= ` ${math} ${utils} ${AY}  try {\n${generateCode(program)}}catch(e){\n console.error(e.message);\n}`
module.exports = {program}
fs.writeFileSync(out, exec );
require(out);

interface ASTNode{
    kind:string;
}
interface VariableDeclarationNode extends ASTNode {
    kind: "VariableDeclaration";
    identifier: string;
    expression: ExpressionNode;
  }
  
  // Represents an expression (currently just a string literal)
  interface ExpressionNode extends ASTNode {
    kind: "StringLiteral";
    value: string;
  }
  
  // Represents a print statement (print + expression)
  interface PrintStatementNode extends ASTNode {
    kind: "PrintStatement";
    expression: ExpressionNode;
  }
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
