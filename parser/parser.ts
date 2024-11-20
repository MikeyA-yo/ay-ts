import { ASTNode, ASTNodeType, Variable } from "./asts";
import { TokenGen, tokens, TokenType } from "./tokens";

export class Parser {
  defines: Map<string, string>;
  private tokenizer: TokenGen;
  nodes: ASTNode[];
  parens: string[];
  braces: string[];
  bracs: string[];
  vars: Variable[];
  errors: string[];
  constructor(file: string) {
    this.tokenizer = new TokenGen(file);
    this.nodes = [];
    this.parens = [];
    this.braces = [];
    this.bracs = [];
    this.vars = [];
    this.errors = [];
    this.defines = new Map();
  }
  consume() {
    const token = this.tokenizer.getCurrentToken();
    this.tokenizer.next();
    return token;
  }
  expectPeek(t: TokenType) {
    let pk = this.tokenizer.peek();
    if (!pk) {
      return false;
    }
    if (pk.type === t) {
      return true;
    } else {
      return false;
    }
  }
  expectToken(t: TokenType) {
    let tk = this.tokenizer.getCurrentToken();
    if (!tk) {
      return false;
    }
    if (tk.type === t) {
      return true;
    } else {
      return false;
    }
  }
  expectPeekVal(v: string) {
    let pk = this.tokenizer.peek();
    if (!pk) {
      return false;
    }
    if (pk.value === v) {
      return true;
    } else {
      return false;
    }
  }
  expectTokenVal(v: string) {
    let tk = this.tokenizer.getCurrentToken();
    if (!tk) {
      return false;
    }
    if (tk.value === v) {
      return true;
    } else {
      return false;
    }
  }
  parseLiteral(): ASTNode {
    const token = this.consume();
    if (
      this.expectToken(TokenType.NewLine) ||
      this.expectToken(TokenType.EOF)
    ) {
      this.consume();
    }
    return {
      type: ASTNodeType.Literal,
      value: token?.value,
    };
  }
  isDefinedVar(v: string) {
    return this.vars.some((val) => val.val === v);
  }
  // parseNotnMinusExpression() {
  //   let val = this.consume().value;
  //   let initializer = val + this.consume().value;
  //   return initializer;
  // }
  parseNotnMinusExpression() {
    const operator = this.consume().value; // Consume the unary operator (! or -)
    const operand = this.expectTokenVal("(") ? this.parseParenExpr() : this.parseExpression();
    return {
      operator,
      operand,
    };
  }
  
  parseExpression() {
    let left;

    if (this.expectTokenVal("(")) {
      // Handle parenthesized expressions
      left = this.parseParenExpr();
    } else if(this.expectTokenVal("!") || this.expectTokenVal("-")){
      left = this.parseNotnMinusExpression()
    }else {
      // Consume basic literals/identifiers
      left = this.consume().value;
    }
    
    // Check if there’s an operator next
    if (this.expectToken(TokenType.Operator) || this.expectTokenVal(",")) {
      if (this.expectTokenVal(",")){
        this.tokenizer.getCurrentToken().value = "+"
        this.tokenizer.getCurrentToken().type = TokenType.Operator
      }
      const op = this.consume().value;
      
      // Handle the right-hand side of the expression
      let right;
      if (
        this.expectPeek(TokenType.EOF) ||
        this.expectPeek(TokenType.NewLine) ||
        this.expectPeekVal(";") ||
        this.expectPeekVal(")")
      ) {
        right = this.consume().value; // Simple right-hand expression
        if (
          !this.expectTokenVal(")")
        ) {
          this.consume();
        }
      } else {
        right = this.parseExpression(); // Recursively parse complex expressions
      }
      
      return {
        operator: op,
        left,
        right,
      };
    }

    return left; // Return single values if no operator is present
  }

  parseParenExpr() {
    this.consume(); // Consume the opening '('
    // Important Error checks:
    if(this.expectTokenVal(")")){
      this.errors.push("Empty parentheses!");
    }
    const expression = this.parseExpression(); // Parse the inner expression
    if (this.expectTokenVal(")")) {
      this.consume(); // Consume the closing ')'
    } else {
      this.errors.push("Unmatched parentheses!");
    }
   
    return { paren: expression }; // Return the parsed inner expression
  }

  parseVariable() {
    this.tokenizer.next();
    let identifier;
    let initializer;
    let dT = "unknown";
    if (this.expectToken(TokenType.Identifier)) {
      identifier = this.consume()?.value;
      //this check is used to know whether it's just a plain declaration, without any value initialised in the variable
      if (
        this.expectToken(TokenType.EOF) ||
        this.expectToken(TokenType.NewLine) ||
        this.expectTokenVal(";")
      ) {
        this.consume();
        return {
          type: ASTNodeType.VariableDeclaration,
          identifier,
        };
      }
      // here it is declaration and initialisation, so i have to check the type of value on the other side
      // to know how to go about parsing
      if (this.expectTokenVal(tokens.assign)) {
        this.consume();
        const leftTokenValues = this.tokenizer
          .getTokenLeftLine()
          .map((t) => t.value);
        switch (this.tokenizer.getCurrentToken().type) {
          case TokenType.Identifier:
            //todo
            if (leftTokenValues.length === 1) {
              // the identifier value
              let idtV = this.tokenizer.getCurrentToken().value;
              initializer = this.parseLiteral();
              if (this.isDefinedVar(idtV)) {
                let idDt = "";
                this.vars.map((v) => {
                  if (v.val === idtV) {
                    idDt = v.dataType;
                  }
                });
                dT = idDt;
              }
              let bL = this.nodes.length;
              this.vars.push({ dataType: dT, val: identifier, nodePos: bL });
            } else {
              if (
                this.tokenizer.peek().type === TokenType.Operator ||
                this.tokenizer.peek().value === ","
              ) {
                initializer = this.parseExpression();
              }
            }
            break;
          case TokenType.Literal:
            if (leftTokenValues.length === 1) {
              initializer = this.parseLiteral();
              dT = "number";
              let bL = this.nodes.length;
              this.vars.push({ dataType: dT, val: identifier, nodePos: bL });
            } else {
              initializer = this.parseExpression();
            }
            break;
          case TokenType.StringLiteral:
            //todo
            if (
              leftTokenValues.length === 1 ||
              this.expectPeek(TokenType.NewLine)
            ) {
              initializer = this.parseLiteral();
              dT = "string";
              let bL = this.nodes.length;
              this.vars.push({ dataType: dT, val: identifier, nodePos: bL });
            } else {
              initializer = this.parseExpression();
            }
            break;
          case TokenType.Punctuation:
            initializer = this.parseExpression();
            break;
          case TokenType.Operator:
            //prefix operators
            if (
              this.expectTokenVal(tokens.not) ||
              this.expectTokenVal(tokens.sub)
            ) {
              //todo
              initializer = this.parseExpression();
              break;
            } else {
              // another error, fallthrough
            }
          case TokenType.Keyword:
            if (this.expectTokenVal("true") || this.expectTokenVal("false")){
              initializer = this.parseExpression() ;
              this.vars.push({ dataType: "boolean", val: identifier, nodePos: this.nodes.length });
            }
            break;  
          default:
            this.errors.push(
              `Unexpected token: ${
                this.tokenizer.getCurrentToken()?.value
              } at variable initialization for ${identifier}`
            );
            this.tokenizer.toNewLine();
          // an error (variable value can't be keyword or operator, but some things like () and [], {} may fall in punctuation which can be a variable)
        }
        return {
          type: ASTNodeType.VariableDeclaration,
          identifier,
          initializer,
        };
      } else {
        this.errors.push(
          `Unexpected token: ${
            this.tokenizer.getCurrentToken()?.value
          } at variable initialization for ${identifier}`
        );
        this.consume();
        this.tokenizer.toNewLine();
      }
    } else {
      this.errors.push(
        `Unexpected token: ${
          this.tokenizer.getCurrentToken()?.value
        } at variable declaration`
      );
      this.consume();
      this.tokenizer.toNewLine();
    }
  }
  parseDefine() {
    if (this.expectPeek(TokenType.Identifier)) {
      this.consume();
      let identifier = this.consume().value;
      let initializer;
      if (this.expectTokenVal("-")) {
        this.consume();
        if (this.expectTokenVal(tokens.grT)) {
          this.consume();
          initializer = this.parseLiteral();
        }
      }
      this.defines.set(identifier, initializer.value);
      return {
        type: ASTNodeType.DefDecl,
        identifier,
        initializer,
      };
    } else {
      this.errors.push(
        `Unexpected token type: ${
          this.tokenizer.peek().value
        }, expected an identifier`
      );
      this.tokenizer.toNewLine();
    }
  }
  parseReturn() {
    if (
      this.expectPeek(TokenType.NewLine) ||
      this.expectPeekVal(";") ||
      this.expectPeekVal("}")
    ) {
      let rtToken = this.consume();
      if (
        this.expectToken(TokenType.NewLine) ||
        this.expectTokenVal(";") ||
        this.expectTokenVal("}")
      ) {
        this.consume();
        if (
          this.expectToken(TokenType.EOF) ||
          this.expectToken(TokenType.NewLine)
        ) {
          this.consume();
        }
      }
      return {
        type: ASTNodeType.Return,
        value: rtToken.value,
      };
    } else {
      if (
        this.expectPeek(TokenType.Identifier) ||
        this.expectPeek(TokenType.Literal) ||
        this.expectPeek(TokenType.StringLiteral)
      ) {
        let rtToken = this.consume();
        let isIdentifier = this.expectToken(TokenType.Identifier);
        const tk = this.consume();
        if (
          this.expectToken(TokenType.NewLine) ||
          this.expectTokenVal(";") ||
          this.expectTokenVal("}")
        ) {
          this.consume();
          if (
            this.expectToken(TokenType.EOF) ||
            this.expectToken(TokenType.NewLine)
          ) {
            this.consume();
          }
        }
        return {
          type: ASTNodeType.Return,
          initializer: {
            type: isIdentifier ? ASTNodeType.Identifier : ASTNodeType.Literal,
            value: tk.value,
          },
        };
      }
    }
  }
  parseBreakNCont() {
    if (
      this.expectPeek(TokenType.NewLine) ||
      this.expectPeekVal(";") ||
      this.expectPeekVal("}")
    ) {
      let rtToken = this.consume();
      if (
        this.expectToken(TokenType.NewLine) ||
        this.expectTokenVal(";") ||
        this.expectTokenVal("}")
      ) {
        this.consume();
        if (
          this.expectToken(TokenType.EOF) ||
          this.expectToken(TokenType.NewLine)
        ) {
          this.consume();
        }
      }
      return {
        type: ASTNodeType.Return,
        value: rtToken.value,
      };
    } else {
      let rtToken = this.consume();
      this.errors.push(
        `Unexpected token after ${rtToken.value} keyword: ${
          this.tokenizer.getCurrentToken()
            ? this.tokenizer.getCurrentToken().value
            : "End of file"
        }`
      );
      this.tokenizer.toNewLine();
      return {
        type: ASTNodeType.Return,
        value: rtToken.value,
      };
    }
  }
  checkAndParse() {
    let baseToken = this.tokenizer.getCurrentToken();
    switch (baseToken.type) {
      case TokenType.Keyword:
        switch (baseToken.value) {
          case tokens.l:
            let nodeV = this.parseVariable();
            nodeV && this.nodes.push(nodeV);
            break;
          case "def":
            let nodeD = this.parseDefine();
            nodeD && this.nodes.push(nodeD);
            break;
          case "return":
            let nodeR = this.parseReturn();
            nodeR && this.nodes.push(nodeR);
            break;
          case "break":
          case "continue":
            let nodeBC = this.parseBreakNCont();
            nodeBC && this.nodes.push(nodeBC);
            break;
          default:
          //hehe
        }
        break;
      case TokenType.Punctuation:
        if (baseToken.value === ";"){
          this.tokenizer.next();
        } else {
          this.errors.push(`Unexpected statement start: ${baseToken.value}`);
          this.tokenizer.next();
        } 
        break;
      case TokenType.NewLine:
        this.tokenizer.next();
        break;
      default:
        this.errors.push(`Unexpected statement start: ${baseToken.value}`);
        this.tokenizer.next();
      //Syntax Error Likely
    }
  }
  start() {
    // currently this.checkAndParse only executes line statements not blocks,
    //todo figure out how i'd do it with blocks
    //just figured how to handle block statements, i keep track of the line the block ends. i'd keep a variable to know also if we in block
    //
    while (this.tokenizer.getCurrentToken().type !== TokenType.EOF) {
      this.checkAndParse();
    }
  }
}
// 
const p = new Parser("l pexr = -(6 - 5) + -(8*8)\nl bool = true\nl myString = 'Hello, world!'");
p.start();
console.log(p.nodes, p.errors, p.vars);