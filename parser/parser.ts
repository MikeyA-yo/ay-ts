import { ASTNode, ASTNodeType } from "./asts";
import { Token, TokenGen, tokens, TokenType } from "./tokens";

export class Parser {
  private tokenizer: TokenGen;
  nodes: ASTNode[]
  constructor(file: string) {
    this.tokenizer = new TokenGen(file);
    this.nodes = []
  }
  consume() {
    const token = this.tokenizer.getCurrentToken();
    this.tokenizer.next();
    return token;
  }
  parseLiteral(): ASTNode {
    const token = this.consume();
    return {
      type: ASTNodeType.Literal,
      value: token?.value,
    };
  }
  parseVariable() {
    this.tokenizer.next();
    let identifier;
    let initializer;
    if (this.tokenizer.getCurrentToken()?.type === TokenType.Identifier) {
      identifier = this.consume()?.value;
      //this check is used to know whether it's just a plain declaration, without any value initialised in the variable
      if(this.tokenizer.getTokenLeftLine()?.length === void 0){
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
            break;
          case TokenType.Literal:
            //todo
            if(leftTokenValues?.length === 0){
              initializer = this.parseLiteral();
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

const p = new Parser("l b = 'my string'\nl c = 'another string test'\nl nothing=23.544");
p.start();
console.log(p.nodes)