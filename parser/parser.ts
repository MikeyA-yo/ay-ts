import { ASTNode, ASTNodeType } from "./asts";
import { Token, TokenGen, tokens, TokenType } from "./tokens";

export class Parser {
  private tokenizer: TokenGen;
  nodes: ASTNode[]
  parens: string[];
  braces: string[];
  bracs: string[];
  constructor(file: string) {
    this.tokenizer = new TokenGen(file);
    this.nodes = [];
    this.parens = [];
    this.braces = [];
    this.bracs = []
  }
  consume() {
    const token = this.tokenizer.getCurrentToken();
    this.tokenizer.next();
    return token;
  }
  private groupBy(group: string): string {
    let mGroup = group; // Initial grouping character ('(', '[', '{')
    const closingChar = group === "{" ? "}" : group === "[" ? "]" : ")"; // Determine the corresponding closing character
    this.consume(); // Move past the opening group character
  
    while (this.tokenizer.getCurrentToken()?.value !== closingChar) {
      if (!this.tokenizer.getCurrentToken()) {
        throw new Error(`Unmatched grouping: expected ${closingChar}`);
      }
  
      let currentGroup = "";
  
      // Handle nested groups
      const currentTokenValue = this.tokenizer.getCurrentToken()?.value;
      if (currentTokenValue === "(" || currentTokenValue === "[" || currentTokenValue === "{") {
        currentGroup += this.groupBy(currentTokenValue); // Recursively handle nested groups
      } else if (currentTokenValue === "," || currentTokenValue === ";") {
        // Handle commas or semicolons (if present) within the group
        currentGroup += this.consume()?.value;
      } else {
        // Handle regular tokens (numbers, identifiers, etc.)
        currentGroup += this.consume()?.value;
      }
  
      mGroup += currentGroup;
    }
  
    this.consume(); // Consume the closing character
    return mGroup + closingChar;
  }
  
  
  parseLiteral(): ASTNode {
    const token = this.consume();
    return {
      type: ASTNodeType.Literal,
      value: token?.value,
    };
  }
  parseBinaryExpression(){
    let operator;
    let left = {
      type:this.tokenizer.getCurrentToken()?.type || ASTNodeType.Literal,
      value:this.tokenizer.getCurrentToken()?.value
    }
    let right;
    let value;
    this.consume();
    if(this.tokenizer.getTokenLeftLine()?.length !== 0){
      switch (this.tokenizer.getCurrentToken()?.type){
        case TokenType.Operator:
          // todo
          switch(this.tokenizer.getCurrentToken()?.value){
            case tokens.add:
            case tokens.sub:
            case tokens.div:
            case tokens.mul:    
              //todo arithmetric operations
              operator = this.consume()?.value;
              let token = this.tokenizer.getTokenLeftLine()
              if(token){
                 if(token.length > 1){
                   right = this.parseBinaryExpression();
                 }else{
                  value = this.consume()
                 }
              }
              break
            default:
              // probably an error    
          }
          break
        default:
          // another error only operators should be next, don't you think so too?  
      }
    }
    if(operator !== void 0 && right !== void 0){
      return {
        type: ASTNodeType.BinaryExpression,
        operator,
        left,
        right
      }
    }else{
      return {
        type: ASTNodeType.BinaryExpression,
        operator,
        left,
        value
      }
    }
  }
  parseVariable() {
    this.tokenizer.next();
    let identifier;
    let initializer;
    if (this.tokenizer.getCurrentToken()?.type === TokenType.Identifier) {
      identifier = this.consume()?.value;
      //this check is used to know whether it's just a plain declaration, without any value initialised in the variable
      if(this.tokenizer.getTokenLeftLine()?.length === 0){
        return {
          type:ASTNodeType.VariableDeclaration,
          identifier
        }
      }
      
      // here it is declaration and initialisation, so i have to check the type of value on the other side
      // to know how to go about parsing
      if (this.tokenizer.getCurrentToken()?.value === tokens.assign) {
        this.consume();
        const leftTokenValues = this.tokenizer.getTokenLeftLine()?.map(t => t.value)
        switch (this.tokenizer.getCurrentToken()?.type) {
          case TokenType.Identifier:
            //todo
            if(leftTokenValues?.length === 0){
              initializer = this.parseLiteral();
            }
            break;
          case TokenType.Literal:
            //todo
            if(leftTokenValues?.length === 0){
              initializer = this.parseLiteral();
            }else{
              initializer = this.parseBinaryExpression()
            }
            break;
          case TokenType.StringLiteral:
            //todo
            if(leftTokenValues?.length === 0){
              initializer = this.parseLiteral();
            }
            break;
          case TokenType.Punctuation:
            //todo
            initializer = this.groupBy(this.tokenizer.getCurrentToken()?.value ?? "(")
            break;
          case TokenType.Operator:
            if (this.tokenizer.getCurrentToken()?.value === tokens.not) {
              //todo
              break;
            } else {
              // another error, fallthrough
            }
          default:
          // an error (variable value can't be keyword or operator, but some things like () and [], {} may fall in punctuation which can be a variable)
        }
        return {
          type: ASTNodeType.VariableDeclaration,
          identifier,
          initializer
        }
      }
    }
  }
  checkAndParse() {
    let baseToken = this.tokenizer.getCurrentToken();
    switch (baseToken?.type) {
      case TokenType.Keyword:
        switch (baseToken.value) {
          case tokens.l:
            let node = this.parseVariable();
            node && this.nodes.push(node);
            break;
          default:
          //hehe
        }
        break;

      default:
      //Syntax Error Likely
    }
  }
  start() {
    // currently this.checkAndParse only executes line statements not blocks, 
    //todo figure out how i'd do it with blocks
    for (let i = 0; i < this.tokenizer.lines.length; i++){
      this.checkAndParse();
    }
  }
}

const p = new Parser("l b = 'my string'\nl c = b\nl bine = 3 * 3 + 6+44\nl bina =(7{n})\nl ob = lol");
p.start();
console.log(p.nodes);