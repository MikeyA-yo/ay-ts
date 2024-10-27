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
  nullC:"??",
  equality:"==",
  inEqualty:"!=",
  subEql:"-=",
  addEql:"+=",
  mulEql:"*=",
  divEql:"/=",
  inc:"++",
  dec:"--",
  exp:"**",
  ororEql: "||=",
  andandEql:"&&="
};
const keywords = [
  "l", // custom: like 'let'
  "define", // custom
  "defer",
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
  // keep track of each token in an array
  const tokens: Token[] = [];
  // holds current token and current token type values
  let currentToken = "";
  let currentType: TokenType = TokenType.Identifier;
  // keeps track of string quotes and whether we are in a string or not(sOpen)
  let qChar = "";
  let sOpen = false;
  //loop through each and every character to scan them depending on how they are
  for (let i = 0; i < line.length; i++) {
    // this checks if it's a string quote character, controls the value of sOpen
    // notice how we also make sure we are not in a comment by checking the type
    if (
      (line[i] === '"' || line[i] === "'") &&
      currentType !== TokenType.SingleLineComment
    ) {
      qChar = line[i];
      // checks if the string was already open so we know that's a closing quote so
      // we can make sOpen false and clear currentToken, and push the entire string into the tokens array
      if (sOpen) {
        // extra validation to make sure it's the proper end to the star
        if (currentToken[0] === qChar) {
          currentToken += qChar;
          tokens.push({ type: currentType, value: currentToken });
          //cleanup
          currentToken = "";
          sOpen = false;
        }
        // else we know that this is just the opening of a string, so we set the currentType
        // and we make sOpen true
      } else {
        currentType = TokenType.StringLiteral;
        sOpen = true;
      }
    }
    // keep adding every character as a comment, but since we only expect a line this is fine as it continues to the end of the line
    //keep adding string characters until sOpen is false, i.e it's closed with the ending quotechar
    if (sOpen || (currentType === TokenType.SingleLineComment)) {
      currentToken += line[i];
      //start other tests, first for identifiers and keywords, notice you'd always see...
      // !sOpen && currentType !== TokenType.SingleLineComment, to make sure the code in the
      // block doesn't run when a string is open or when a comment is on
    } 
     if (
      /[a-zA-Z_@]/.test(line[i]) &&
      !sOpen &&
      currentType !== TokenType.SingleLineComment
    ) {
      //previous token is an identifier, just add up the character to it
      if (currentType == TokenType.Identifier) {
        currentToken += line[i];
        // it was another token type, now an identifier so we initialise the type and value fresh
      } else {
        currentType = TokenType.Identifier;
        currentToken = line[i];
      } //checks if it's the last character or not
      if (line.length - 1 >= i + 1) {
        if (!/[a-zA-Z_@]/.test(line[i + 1])) {
          //if it's not the last character and the next character fails the test then we can push it
          if (isKeyword(currentToken)) {
            // checks keyword or identifier
            tokens.push({ type: TokenType.Keyword, value: currentToken });
            currentToken = "";
          } else {
            tokens.push({ type: currentType, value: currentToken });
            currentToken = "";
          }
        }
      }
    } else if (
      /\s/.test(line[i]) &&
      !sOpen &&
      currentType !== TokenType.SingleLineComment
    ) {
      currentType = TokenType.Whitespace;
      if (currentToken.length > 0 && /\s/.test(currentToken)) {
        currentToken += line[i];
      } else {
        currentToken = line[i];
      }
      if (line.length - 1 >= i + 1) {
        if (!/\s/.test(line[i + 1])) {
          tokens.push({ type: currentType, value: currentToken });
          currentToken = "";
        }
      }
    } else if (
      /[+*/%=<>&|!?^-]/.test(line[i]) &&
      !sOpen &&
      currentType !== TokenType.SingleLineComment
    ) {
      currentType = TokenType.Operator;
      if (currentToken.length > 0 && /[+*/%=<>&|!?-]/.test(currentToken)) {
        switch (currentToken.length) {
          case 1:
            if (currentToken !== "/" && currentToken !== "^") {
              if (currentToken === line[i]) {
                currentToken += line[i];
              } else if (line[i] === "=") {
                currentToken += line[i];
              } else {
                tokens.push({ type: currentType, value: currentToken });
                currentToken = line[i];
              }
            } else {
              currentType = TokenType.SingleLineComment;
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
        if (
          !/[+*/%=<>&|!?-]/.test(line[i + 1]) &&
          currentType !== TokenType.SingleLineComment
        ) {
          tokens.push({ type: currentType, value: currentToken });
          currentToken = "";
        }
      }
      // hmm: /^-?\d+(_?\d+)*(?:\.\d+)?$/
    } else if (
      /\d/.test(line[i]) &&
      !sOpen &&
      currentType !== TokenType.SingleLineComment
    ) {
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
          currentToken = "";
        }
      }
    } else if (
      /[(){}[\]:;,.]/.test(line[i]) &&
      !sOpen &&
      currentType !== TokenType.SingleLineComment
    ) {
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
        currentToken = "";
      }
    }
  }
  if (currentToken !== "") {
    tokens.push({ type: currentType, value: currentToken });
  }
  return tokens.filter((t) => t.type !== TokenType.Whitespace);
}

//with this log test, i have successfully defeated A.I
//console.log(tokenize("l bed = false"))
console.log(tokenize("l c = 'Heyo' ^ //(4,3)"), tokenizeLine("l c= 'Heyo' ^ //(4,3)"));

//original tokenize function, written by me and AIs worked together, but a bug was there so i wrote tokenize all by myself from scratch
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
    this.tokenizeLine = tokenize;
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
// if (currentType === TokenType.SingleLineComment) {
    //   currentToken += line[i];
    // }