export const tokens = {
  lParen: "(",
  rParen: ")",
  dot: ".",
  comma: ",",
  dot3: "...",
  colon: ":",
  semi: ";",
  lBrace: "{",
  rBrace: "}",
  lBrack: "[",
  rBrack: "]",
  assign: "=",
  add: "+",
  sub: "-",
  div: "/",
  mul:"*",
  rem: "%",
  shL: "<<",
  shR: ">>",
  grT: ">",
  lsT: "<",
  l: "l",
  or: "|",
  oror: "||",
  andand: "&&",
  not:"!"
};
const keywords = [
  "l", // custom: like 'let'
  "define", // custom
  "f", // custom: like 'function'
  "for", // custom & JavaScript
  "if", // custom & JavaScript
  "else", // custom & JavaScript
  "while", // custom & JavaScript
  "continue", // custom & JavaScript
  "return", // custom & JavaScript
  "break", // custom & JavaScript
  "do", // custom & JavaScript
  "imp@",
  "exp@",
  "print",
  "from",
  "false",
  "true",
  // JavaScript keywords (non-function/variable declaration)
  "class",
  "const",
  "debugger",
  "delete",
  "extends",
  "finally",
  "in",
  "instanceof",
  "new",
  "null",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "void",
  "with",
  "yield",
];

export enum TokenType {
  Identifier,
  Operator,
  Keyword,
  Literal,
  StringLiteral,
  Whitespace,
  Punctuation,
  SingleLineComment,
  Unknown,
}

export interface Token {
  type: TokenType;
  value: string;
}

function isKeyword(value: string) {
  return keywords.includes(value);
}
export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let currentToken = "";
  let currentState = TokenType.Identifier;
  let isStringLiteral = false;
  let quoteChar: string | null = null;

  const pushToken = (type: TokenType) => {
    if (currentToken) {
      if (type === TokenType.Identifier && isKeyword(currentToken)) {
        tokens.push({ type: TokenType.Keyword, value: currentToken });
      } else {
        tokens.push({ type, value: currentToken });
      }
      currentToken = "";
    }
  };

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '/' && line[i + 1] === '/') {
        // Push any token before the comment
        pushToken(currentState);
        // Capture the rest of the line as a single comment token
        tokens.push({ type: TokenType.SingleLineComment, value: line.slice(i) });
        break; // Stop processing the rest of the line
      }
    switch (currentState) {
      case TokenType.Identifier:
        if (/[a-zA-Z_@]/.test(char)) {
          currentToken += char;
        } else {
          pushToken(TokenType.Identifier);
          if (/\d/.test(char)) {
            currentState = TokenType.Literal;
            currentToken += char;
          } else if (/[+*/%=<>&|!?-]/.test(char)) {
            currentState = TokenType.Operator;
            currentToken += char;
          } else if (char === '"' || char === "'") {
            currentState = TokenType.StringLiteral;
            isStringLiteral = true;
            quoteChar = char;
            currentToken += char;
          } else if (/\s/.test(char)) {
            currentState = TokenType.Whitespace;
            currentToken += char;
          } else if (/[(){}[\]:;,.]/.test(char)) {
            currentToken += char;
            pushToken(TokenType.Punctuation);
            currentState = TokenType.Identifier;
          } else {
            currentState = TokenType.Unknown;
            currentToken += char;
          }
        }
        break;

      case TokenType.Operator:
        if (/[+*/%=<>&|!?-]/.test(char)) {
          currentToken += char; // Handle multi-character operators
        } else {
          pushToken(TokenType.Operator);
          currentState = TokenType.Identifier;
          i--; // Reprocess this character
        }
        break;

      case TokenType.Literal:
        if (/\d/.test(char) || char === ".") {
          currentToken += char; // Handle numbers and decimal points
        } else {
          pushToken(TokenType.Literal);
          if (/[+*/%=<>&|!?-]/.test(char)) {
            currentState = TokenType.Operator;
            currentToken += char; // Start a new operator
          } else if (/[(){}[\]:;,.]/.test(char)) {
            currentState = TokenType.Punctuation;
            currentToken += char;
          } else {
            currentState = TokenType.Identifier;
            i--; // Reprocess non-literal character
          }
        }
        break;
    
      case TokenType.StringLiteral:
        currentToken += char;
        if (char === quoteChar && !isEscaped(line, i)) {
          pushToken(TokenType.StringLiteral);
          currentState = TokenType.Identifier;
          isStringLiteral = false;
        }
        break;

      case TokenType.Whitespace:
        if (/\s/.test(char)) {
          currentToken += char;
        } else {
          pushToken(TokenType.Whitespace);
          currentState = TokenType.Identifier;
          i--; // Reprocess non-whitespace character
        }
        break;

      case TokenType.Unknown:
        currentToken += char;
        break;
    }
  }

  // Handle last token
  if (isStringLiteral) {
    pushToken(TokenType.StringLiteral);
  } else {
    pushToken(currentState);
  }

  return tokens.filter((t) => t.type !== TokenType.Whitespace);
}
function isEscaped(line: string, index: number): boolean {
  if (index === 0) return false;
  return line[index - 1] === "\\";
}
export class TokenGen {
  tokenizeLine: (line: string) => Token[];
  lines: string[];
  currentLine: number;
  currentTokenNo: number;
  constructor(file: string) {
    this.tokenizeLine = tokenizeLine;
    this.lines = file.includes("\r\n") ? file.split("\r\n") : file.split("\n");
    this.currentLine = 0;
    this.currentTokenNo = 0;
  }
  next(): void {
    let currentLineToken = this.tokenizeLine(this.lines[this.currentLine]);
    if (this.currentTokenNo < currentLineToken.length - 1) {
      this.currentTokenNo++;
    } else {
      this.currentTokenNo = 0;
      this.currentLine++;
    }
  }
  back() {
    if (this.currentTokenNo !== 0) {
      this.currentTokenNo--;
    } else {
      if (this.currentLine !== 0) {
        this.currentLine--;
        let currentLineToken = this.tokenizeLine(this.lines[this.currentLine]);
        this.currentTokenNo = currentLineToken.length - 1;
      }
    }
  }
  peek(steps?:number):Token{
    let token;
    if(steps){
      for (let i = 0; i < steps; i++){
        this.next()
      }
      token = this.getCurrentToken()
      for (let i = 0; i < steps; i++){
        this.back()
      }
      return token
    }else{
      this.next()
      token = this.getCurrentToken()
      this.back()
      return token
    }
  }
  getCurrentToken() {
    if (this.currentLine > this.lines.length || this.currentLine < 0 || this.lines[this.currentLine] === void 0) {
      return void 0;
    }
    return this.tokenizeLine(this.lines[this.currentLine])[this.currentTokenNo];
  }
  getRemainingToken() {
    let tokensLeft: Token[] = this.tokenizeLine(
      this.lines[this.currentLine]
    ).slice(this.currentTokenNo + 1);
    let linesLeft = this.lines.slice(this.currentLine + 1);
    for (let i = 0; i < linesLeft.length; i++) {
      let lineTokens = this.tokenizeLine(linesLeft[i]);
      tokensLeft.push(...lineTokens);
    }
    return tokensLeft;
  }
  getTokenLeftLine() {
    if(this.lines[this.currentLine]){
      return this.tokenizeLine(this.lines[this.currentLine]).slice(
        this.currentTokenNo + 1
      );
    }
  }
  getFullLineToken(){
    return this.tokenizeLine(this.lines[this.currentLine])
  }
}
//  const tn = new TokenGen("l b = 44\nl c += 45 ?? -4 \nl d = b + c\nl c = 45\nl c = 45\nl c = 45\nl c = 45 //y");
// console.log(tn.getRemainingToken())
// console.log(tn.peek(100))