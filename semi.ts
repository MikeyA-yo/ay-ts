#!/usr/bin/env node
import * as fs from 'node:fs';
const out = __dirname+'/out.js';
const programName = process.argv[2];
const program = fs.readFileSync(programName, 'utf-8');


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
  let exporters:string[] = [];  
function generateCode(program:any){
     let code = "";
     let lines = parse(program)
     let newLines =lines.filter(line => {
       return line !== '\r'
     })
     if(newLines[0].includes('#')){
        newLines[0] = ''
     }
    newLines.forEach(el => {
        el.includes('{') ? el += '' : el.includes(';') ? el += '': el.includes('}') ? el += '' : el.includes(',') ? el += '' : el += ' ;' ;
        let values: RegExpMatchArray  | string[] = parseStr(el);
        if(el.includes('for (') || el.includes('for(') || el.includes('if(') ||el.includes('if (')|| el.includes('exp@ f')){
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
            if (values[i] == 'exp@'){
                exporters.push(values[i + 2]) // exported variable name to list of exported in a file
                values[i] = ''
            }
            
            if (values[i] == 'imp@') {
                // let impe = imp(values, values[i]);
                // values[i] = impe
                let impStatementLength = values.length;
                // import for variable
                let importForV = values[i + 1].slice(1,-1);
                let endMark = impStatementLength - 3
                // import location
                let importLocation = values[endMark]
                let impLength = importLocation.length;
                importLocation = importLocation.slice(1,(impLength - 1))
                let ayImport = fs.readFileSync(process.cwd()+importLocation, 'utf-8');
                let dFr = values[2]
              //  console.log(importForV,importLocation,values)
                values[i] = '';
                values[i + 1] = ''
                values[2] = ''
                values[endMark] = '';
               if( importForV == importLocation){
                   code += generateCode(ayImport);
               }else {
                  //to do actually make sure the file isn't loaded and executed
                let tempCode = generateCode(ayImport);
                tempCode += `module.exports = {${exporters}}\n`
                const math = `const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')\n`;
                const utils = `const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')\n`
                const AY = `const {AY} = require(__dirname +'/objects/AY');\n`;
                const exec= ` ${math} ${utils} ${AY}  try {\n${tempCode}}catch(e){\n console.error(e.message);\n}`
                const out2 = __dirname + '/out2.js'
                fs.writeFileSync(out2, exec)
                code += `const {${importForV}} = require("./out2")`
                if(!exporters.includes(importForV)){
                    console.log(exporters)
                    console.log('No exports found')
                   }
               }
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