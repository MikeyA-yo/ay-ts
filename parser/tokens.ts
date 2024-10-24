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
  mul: "*",
  rem: "%",
  shL: "<<",
  shR: ">>",
  grT: ">",
  lsT: "<",
  l: "l",
  or: "|",
  oror: "||",
  andand: "&&",
  not: "!",
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
function tokenize(line: string) {
  const tokens: Token[] = [];
  let currentToken = "";
  let currentType: TokenType = TokenType.Identifier;
  let qChar = "";
  let sOpen = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"' || line[i] === "'") {
      qChar = line[i];
      if (sOpen) {
        currentToken += qChar;
        tokens.push({type: currentType, value: currentToken});
        //cleanup
        currentToken = ""
        sOpen = false
      } else {
        currentType = TokenType.StringLiteral;
        sOpen = true
        // currentToken = qChar
      }
    }
    if (sOpen) {
      currentToken += line[i];
    } else if (/[a-zA-Z_@]/.test(line[i]) && !sOpen) {
      if (currentType == TokenType.Identifier) {
        currentToken += line[i];
      } else {
        currentType = TokenType.Identifier;
        currentToken = line[i];
      }
      if (line.length - 1 >= i + 1) {
        if (!/[a-zA-Z_@]/.test(line[i + 1])) {
          if (isKeyword(currentToken)) {
            tokens.push({ type: TokenType.Keyword, value: currentToken });
            currentToken = ""
          } else {
            tokens.push({ type: currentType, value: currentToken });
            currentToken = ""
          }
        }
      }
    } else if (/\s/.test(line[i]) && !sOpen) {
      currentType = TokenType.Whitespace;
      if (currentToken.length > 0 && /\s/.test(currentToken)) {
        currentToken += line[i];
      } else {
        currentToken = line[i];
      }
      if (line.length - 1 >= i + 1) {
        if (!/\s/.test(line[i + 1])) {
          tokens.push({ type: currentType, value: currentToken });
          currentToken = ""
        }
      }
    } else if (/[+*/%=<>&|!?-]/.test(line[i]) && !sOpen) {
      currentType = TokenType.Operator;
      if (currentToken.length > 0 && /[+*/%=<>&|!?-]/.test(currentToken)) {
        switch (currentToken.length) {
          case 1:
            if (currentToken !== "/") {
              currentToken += line[i];
            }
            break;
          case 2:
            if (
              (currentToken === ">>" || currentToken === "<<") &&
              (line[i] === ">" || line[i] === "<")
            ) {
              currentToken += line[i];
            }
            break;
          default:
            currentType = TokenType.Unknown;
            currentToken += line[i];
        }
      } else {
        currentToken = line[i];
      }
      if (line.length - 1 >= i + 1) {
        if (!/[+*/%=<>&|!?-]/.test(line[i + 1])) {
          tokens.push({ type: currentType, value: currentToken });
          currentToken = ""
        }
      }
      // hmm: /^-?\d+(_?\d+)*(?:\.\d+)?$/
    } else if (/\d/.test(line[i]) && !sOpen) {
      currentType = TokenType.Literal;
      if (
        currentToken.length > 0 &&
        (/\d/.test(currentToken) || currentToken.endsWith("."))
      ) {
        if (/\d/.test(currentToken) || currentToken.endsWith(".")) {
          currentToken += line[i];
        }
      } else {
        currentToken = line[i];
      }
      if (line.length - 1 >= i + 1) {
        if (!/\d/.test(line[i + 1]) && line[i + 1] !== ".") {
          tokens.push({ type: currentType, value: currentToken });
          currentToken = ""
        }
      }
    } else if (/[(){}[\]:;,.]/.test(line[i]) && !sOpen) {
      if (
        currentType === TokenType.Literal &&
        line[i] === "." &&
        !currentToken.includes(".") &&
        currentToken.length > 0
      ) {
        currentToken += line[i];
      } else {
        currentType = TokenType.Punctuation;
        currentToken = line[i];
        tokens.push({ type: currentType, value: currentToken });
        currentToken = ""
      }
    }
  }
  if(currentToken !== ""){
    tokens.push({ type: currentType, value: currentToken });
  }
  return tokens;
}

console.log(
  tokenize("exp@ l bn = bn >= 6.9 ?? -8.99 this.val 'mbbs is cool' + 'yh'")
);

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

    if (char === "/" && line[i + 1] === "/") {
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
    // figuring out the right array indexing
    if (this.currentTokenNo < currentLineToken.length - 1) {
      this.currentTokenNo++;
    } else {
      if (this.currentLine < this.lines.length - 1) {
        this.currentTokenNo = 0;
        this.currentLine++;
      }
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
  peek(steps?: number): Token {
    let token;
    if (steps) {
      for (let i = 0; i < steps; i++) {
        this.next();
      }
      token = this.getCurrentToken();
      for (let i = 0; i < steps; i++) {
        this.back();
      }
      return token;
    } else {
      this.next();
      token = this.getCurrentToken();
      this.back();
      return token;
    }
  }
  skip(steps?: number) {
    let token;
    if (steps) {
      for (let i = 0; i < steps; i++) {
        this.next();
      }
      token = this.getCurrentToken();
      return token;
    } else {
      this.next();
      token = this.getCurrentToken();
      return token;
    }
  }
  getCurrentToken() {
    if (
      this.currentLine > this.lines.length ||
      this.currentLine < 0 ||
      this.lines[this.currentLine] === void 0
    ) {
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
    if (this.lines[this.currentLine]) {
      return this.tokenizeLine(this.lines[this.currentLine]).slice(
        this.currentTokenNo + 1
      );
    }
  }
  getFullLineToken() {
    return this.tokenizeLine(this.lines[this.currentLine]);
  }
}
