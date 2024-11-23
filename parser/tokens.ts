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
  nullC: "??",
  equality: "==",
  inEqualty: "!=",
  subEql: "-=",
  addEql: "+=",
  mulEql: "*=",
  divEql: "/=",
  inc: "++",
  dec: "--",
  exp: "**",
  ororEql: "||=",
  andandEql: "&&=",
  grTEql: ">=",
  lsTEql: "<=",
  pow: "^",
};
export const opToks = [
  tokens.nullC,
  tokens.oror,
  tokens.andand,
  tokens.equality,
  tokens.inEqualty,
  tokens.lsT,
  tokens.grT,
  tokens.lsTEql,
  tokens.grTEql,
  tokens.add,
  tokens.sub,
  tokens.mul,
  tokens.div,
  tokens.pow,
  tokens.inc,
  tokens.dec,
  tokens.rem,
  tokens.shL,
  tokens.shR,
];
const keywords = [
  "l", // custom: like 'let'
  "def", // custom
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
const allowedKeysAsVal = ["true", "false", "this", "f"/* for functions as variables */, "new"]
export function isAllowedKey(key:string){
   return allowedKeysAsVal.includes(key)
}
export enum TokenType {
  Identifier,
  Operator,
  Keyword,
  Literal,
  StringLiteral,
  Whitespace,
  Punctuation,
  SingleLineComment,
  MultiLineComment,
  NewLine,
  EOF,
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
    const nextChar = line[i + 1] || "";
    // multi line comments
    if (line[i] === "/" && nextChar === "*"){
      currentType = TokenType.MultiLineComment;
      currentToken = "/*"
      i++ // skip * in /*
      continue
    }
    if (line[i] === "*" && nextChar === "/"){
      currentToken += "*/"
      i++ // skip / in */
      tokens.push({type: currentType, value:currentToken}) 
      currentType = TokenType.Identifier;
      currentToken = ""
      continue
    } 


    // Detect Windows-style newline \r\n
    if ((line[i] === "\r" && nextChar === "\n") && currentType !== TokenType.MultiLineComment) {
      if (currentType === TokenType.SingleLineComment){
        tokens.push({type: currentType, value:currentToken})
      }
      currentType = TokenType.NewLine
      tokens.push({ type: currentType, value: "\r\n" });
      i++; // Skip the \n part of \r\n  
      currentToken = ""; // Clear currentToken if needed for new lines
      continue;
    } 
    // Detect Mac-style \r and Unix-style \n newlines individually
    else if ((line[i] === "\r" || line[i] === "\n") && currentType !== TokenType.MultiLineComment) {
      if (currentType === TokenType.SingleLineComment){
        tokens.push({type: currentType, value:currentToken})
      }
      currentType = TokenType.NewLine
      tokens.push({ type: currentType, value: line[i] });
      currentToken = "";
      continue;
    }
    
    // this checks if it's a string quote character, controls the value of sOpen
    // notice how we also make sure we are not in a comment by checking the type
    if (
      (line[i] === '"' || line[i] === "'") &&
      currentType !== TokenType.SingleLineComment &&
      currentType !== TokenType.MultiLineComment
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
    if (sOpen || currentType === TokenType.SingleLineComment || currentType === TokenType.MultiLineComment) {
      currentToken += line[i];
      //start other tests, first for identifiers and keywords, notice you'd always see...
      // !sOpen && currentType !== TokenType.SingleLineComment, to make sure the code in the
      // block doesn't run when a string is open or when a comment is on
    }
    if (
      /[a-zA-Z_@]/.test(line[i]) &&
      !sOpen &&
      currentType !== TokenType.SingleLineComment &&
      currentType !== TokenType.MultiLineComment
    ) {
      //previous token is an identifier, just add up the character to it
      if (currentType == TokenType.Identifier) {
        currentToken += line[i];
        // it was another token type, now an identifier so we initialise the type and value fresh
      } else {
        currentType = TokenType.Identifier;
        currentToken = line[i];
      } //checks if it's the last character or not, passes if not last char
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
      currentType !== TokenType.SingleLineComment &&
      currentType !== TokenType.MultiLineComment
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
      currentType !== TokenType.SingleLineComment &&
      currentType !== TokenType.MultiLineComment
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
      currentType !== TokenType.SingleLineComment &&
      currentType !== TokenType.MultiLineComment
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
      currentType !== TokenType.SingleLineComment &&
      currentType !== TokenType.MultiLineComment
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
    if (currentType === TokenType.Identifier && isKeyword(currentToken)){
      currentType = TokenType.Keyword
    }
    tokens.push({ type: currentType, value: currentToken });
  }
  tokens.push({type: TokenType.EOF, value:""})
  //ignore whitespace token
  return tokens.filter((t) => t.type !== TokenType.Whitespace);
}

/**
 * class TokenGen: 
 * provides methods and functionalities for using and moving through tokens
 */
export class TokenGen {
  tokenizeLine: (line: string) => Token[];
  lines: string[];
  currentLine: number;
  tokens:Token[];
  currentTokenNo: number;
  constructor(file: string) {
    this.tokenizeLine = tokenize;
    this.lines = file.includes("\r\n") ? file.split("\r\n") : file.split("\n");
    this.tokens = this.tokenizeLine(file)
    this.currentLine = 0;
    this.currentTokenNo = 0;
  }
  /**
   * next() => token moves to the next non comment token
   */
  next(): void {
    if (this.tokens[this.currentTokenNo].type !== TokenType.EOF){
      this.currentTokenNo++;
      while(this.tokens[this.currentTokenNo].type === TokenType.SingleLineComment ||this.tokens[this.currentTokenNo].type === TokenType.MultiLineComment){
        this.currentTokenNo++;
      }
    }
  }
  /**
   * back() => token moves back to the next non comment token
   */
  back() {
    if (this.currentTokenNo !== 0) {
      this.currentTokenNo--;
      while(this.tokens[this.currentTokenNo].type === TokenType.SingleLineComment ||this.tokens[this.currentTokenNo].type === TokenType.MultiLineComment){
        this.currentTokenNo--;
      }
    } 
  }
  /**
   * Checks and returns future non comment tokens,  Does not change the current token
   * @param steps: Number of steps to peek or look ahead.
   * @returns the token peeked, if no steps is provided returns the next token
   */
  peek(steps?: number): Token {
    if(steps && (steps + 1 + this.currentTokenNo) < this.tokens.length){
      let pkNo = steps + 1 + this.currentTokenNo
      if(this.tokens[pkNo]){
        while (this.tokens[pkNo].type === TokenType.SingleLineComment ||this.tokens[pkNo].type === TokenType.MultiLineComment){
          if (this.tokens[pkNo + 1]){
            pkNo++
          }
       }
       return this.tokens[pkNo]
      }else{
        return this.getCurrentToken()
      }
    }else{
      let pkNo = this.currentTokenNo + 1
      if(this.tokens[pkNo]){
        while (this.tokens[pkNo].type === TokenType.SingleLineComment ||this.tokens[pkNo].type === TokenType.MultiLineComment){
          if (this.tokens[pkNo + 1]){
           pkNo++
          }
       }
       return this.tokens[pkNo]
      }else{
        return this.getCurrentToken()
      }
      
    }
    
  }
  /**
   * Like next(), but optionally takes a number (steps) to move through the next token
   * @param steps Number of tokens to skip
   * @returns The new current token after skipping
   */
  skip(steps?: number) {
    if(steps && (steps + this.currentTokenNo) < this.tokens.length){
      this.currentTokenNo += steps
      if (this.tokens[this.currentTokenNo]){
        while(this.tokens[this.currentTokenNo].type === TokenType.SingleLineComment ||this.tokens[this.currentTokenNo].type === TokenType.MultiLineComment){
          this.currentTokenNo++;
        }
        return this.tokens[this.currentTokenNo]
      }else{
        return this.getCurrentToken()
      }
    }else{
      this.next()
      return this.getCurrentToken()
    }
  }
  /**
   * 
   * @returns The current token
   */
  getCurrentToken() {
    return this.tokens[this.currentTokenNo]
  }
  /**
   * 
   * @returns An array of all the tokens left
   */
  getRemainingToken() {
    let tokensLeft: Token[] = this.tokens.slice(this.currentTokenNo + 1);
    return tokensLeft
  }
  /**
   * 
   * @returns an array of all the tokens left in a line
   */
  getTokenLeftLine() {
    let leftTokens = this.getRemainingToken();
    let leftLineToken:Token[] = []
    for (let i = 0; i < leftTokens.length; i++){
      if(leftTokens[i].type === TokenType.NewLine){
        leftLineToken.push(leftTokens[i]);
        break;
      }
      leftLineToken.push(leftTokens[i]);
    }
    if (this.getCurrentToken().type === TokenType.NewLine){
      leftLineToken = [this.getCurrentToken()]
    }
    return leftLineToken
  }
  /**
   * 
   * @returns An array of all the tokens in the current line
   */
  getFullLineToken() {
    let flToken:Token[] = [];
    for (let i = this.currentTokenNo; this.tokens[i].type != TokenType.NewLine; i--){
      flToken.push(this.tokens[i])
    }
    flToken.reverse()
    flToken.push(...this.getTokenLeftLine())
    return flToken;
  }
  /**
   * Moves the token ahead to a new line
   */
  toNewLine(){
    const leftTokens = this.getRemainingToken()
    for (let i = 0; i < leftTokens.length; i++){
      this.next()
      if(leftTokens[i].type === TokenType.NewLine){
        this.next()
        break
      }
    }
  }
}
