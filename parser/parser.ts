import { ASTNode, ASTNodeType, Variable } from "./asts";
import { isAllowedKey,  TokenGen, tokens, TokenType } from "./tokens";

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

  private addError(message: string) {
    const line = this.tokenizer.getCurrentLineNumber();
    const column = this.tokenizer.getCurrentColumnNumber();
    const currentToken = this.tokenizer.getCurrentToken();
    
    // Get the actual source line from the original file
    const actualSourceLine = this.tokenizer.lines[line - 1] || "(empty line)";
    
    // Create a pointer to show where the error is
    const pointer = ' '.repeat(Math.max(0, column - 1)) + '^';
    
    const errorMsg = `
Error at Line ${line}, Column ${column}: ${message}
${actualSourceLine}
${pointer}

Current token: "${currentToken?.value || 'EOF'}" (${currentToken?.type || 'EOF'})`;
    
    this.errors.push(errorMsg);
  }

  // Resolve defined aliases - replace any defined keyword with its actual value
  private resolveDefine(value: string): string {
    return this.defines.has(value) ? this.defines.get(value)! : value;
  }

  consume() {
    const token = this.tokenizer.getCurrentToken();
    // Create a new token with resolved value if it's a define
    const resolvedToken = {
      ...token,
      value: this.resolveDefine(token.value)
    };
    this.tokenizer.next();
    return resolvedToken;
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
    // Check both the original value and the resolved value (for defines)
    const resolvedValue = this.resolveDefine(pk.value);
    if (pk.value === v || resolvedValue === v) {
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
    // Check both the original value and the resolved value (for defines)
    const resolvedValue = this.resolveDefine(tk.value);
    if (tk.value === v || resolvedValue === v) {
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
    return <ASTNode>{
      type: ASTNodeType.Literal,
      value: token.value,
    };
  }
  isDefinedVar(v: string) {
    return this.vars.some((val) => val.val === v);
  }
  parseNotnMinusExpression() {
    const operator = this.consume().value; // Consume the unary operator (! or -)
    const operand = this.expectTokenVal("(")
      ? this.parseParenExpr()
      : this.parseExpression();
    return <ASTNode><unknown>{
      operator,
      operand,
    };
  }
  parseCallExpr() {
    const identifier = this.consume().value; // Consume the function identifier
    const args: ASTNode[] = [];

    if (!this.expectTokenVal("(")) {
      this.addError(`SyntaxError: Expected '(' after function identifier '${identifier}'`);
      return null; // Return null if parentheses are not found
    }

    this.consume(); // Consume the opening '('

    // Check for an empty argument list
    if (this.expectTokenVal(")")) {
      this.consume(); // Consume the closing ')'
      return <ASTNode><unknown>{
        type: "CallExpression",
        identifier,
        args,
      };
    }

    // Parse the arguments
    while (!this.expectTokenVal(")")) {
      const arg = this.parseExpression();
      if (!arg) {
        this.addError(`SyntaxError: Invalid argument in function call '${identifier}'`);
        break; // Prevent infinite loops if parseExpression fails
      }
      args.push(arg); // Collect the parsed argument
      if (this.expectTokenVal(",")) {
        this.consume(); // Consume the comma separator
      } else if (!this.expectTokenVal(")")) {
        this.addError(`SyntaxError: Expected ',' or ')' in function call '${identifier}'`);
        break;
      }
    }

    if (this.expectTokenVal(")")) {
      this.consume(); // Consume the closing ')'
    } else {
      this.addError(`SyntaxError: Unmatched parentheses in function call '${identifier}'`);
    }

    return <ASTNode><unknown>{
      type: "CallExpression",
      identifier,
      args,
    };
  }
  parseArray() {
    let elements: ASTNode[] = [];
    this.consume(); // Consume the opening '['

    if (this.expectTokenVal("]")) {
      this.consume();
      return <ASTNode><unknown>{ elements };
    }

    while (!this.expectTokenVal("]")) {
      // Skip newlines
      if (this.expectToken(TokenType.NewLine)) {
        this.consume();
        continue;
      }

      let element = this.parseExpression();
      if (!element) {
        this.addError(`SyntaxError: Invalid array element`);
        break;
      }
      elements.push(element);

      if (this.expectTokenVal(",")) {
        this.consume(); // Consume the comma separator
      } else if (!this.expectTokenVal("]")) {
        this.addError(`SyntaxError: Expected ',' or ']' in array`);
        break;
      }
    }

    if (this.expectTokenVal("]")) {
      this.consume(); // Consume the closing ']'
    } else {
      this.addError(`SyntaxError: Unmatched brackets in array`);
    }

    return <ASTNode><unknown>{ elements };
  }
  parseIncDec() {
    if (
      this.expectToken(TokenType.Operator) &&
      this.expectPeek(TokenType.Identifier)
    ) {
      let infixop = this.consume().value;
      let identifier = this.consume().value;
      return <ASTNode><unknown>{ infixop, identifier };
    } else {
      let identifier = this.consume().value;
      let postop = this.consume().value;
      return <ASTNode><unknown>{
        postop,
        identifier,
      };
    }
  }
  parseArrIndex(){
    let identifier = this.consume().value; // Consume the array identifier
    if (!this.expectTokenVal("[")) {
      this.addError(`SyntaxError: Expected '[' after array identifier '${identifier}'`);
      return null;
    }

    let indexNodes: ASTNode[] = [];

    // Handle multiple nested indices like ident[0][1][2]
    while (this.expectTokenVal("[")) {
      this.consume(); // Consume the opening '['

      const index = this.parseExpression();
      if (!index) {
      this.addError(`SyntaxError: Invalid array index for '${identifier}'`);
      return null;
      }
      indexNodes.push(index);

      if (!this.expectTokenVal("]")) {
      this.addError(`SyntaxError: Expected ']' after array index for '${identifier}'`);
      return null;
      }
      this.consume(); // Consume the closing ']'
    }

    // If only one index, return as single node, else as array
    const index = indexNodes.length === 1 ? indexNodes[0] : indexNodes;

    return <ASTNode><unknown>{
      identifier,
      index,
    };
  }
  parseExpression() {
    let left;

    if (this.expectTokenVal("(")) {
      // Handle parenthesized expressions
      left = this.parseParenExpr();
    } else if (this.expectTokenVal("!") || this.expectTokenVal("-")) {
      left = this.parseNotnMinusExpression();
    } else if (
      this.expectToken(TokenType.Identifier) &&
      this.expectPeekVal("(")
    ) {
      left = this.parseCallExpr();
    } else if (this.expectTokenVal("[")) {
      left = this.parseArray();
    } else if (this.expectToken(TokenType.Identifier) && this.expectPeekVal("[")) {
      left = this.parseArrIndex();
    } else if (this.expectTokenVal("f")) {
      left = this.parseFunc();
    } else if (
      this.expectTokenVal("--") ||
      this.expectTokenVal("++") ||
      (this.expectToken(TokenType.Identifier) &&
        (this.expectPeekVal("--") || this.expectPeekVal("++")))
    ) {
      left = this.parseIncDec();
    } else {
      // Consume basic literals/identifiers
      left = this.consume().value;
    }

    // Check if there’s an operator next
    if (this.expectToken(TokenType.Operator) || this.expectTokenVal("~")) {
      if (this.expectTokenVal("~")) {
        this.tokenizer.getCurrentToken().value = "+";
        this.tokenizer.getCurrentToken().type = TokenType.Operator;
      }
      const op = this.consume().value;
      // Validate the next token for the right-hand side
      if (
        !this.expectToken(TokenType.Identifier) &&
        !this.expectToken(TokenType.Literal) &&
        !this.expectToken(TokenType.StringLiteral) &&
        !this.expectTokenVal("(")
      ) {
        this.addError(`Invalid expression after operator '${op}' - Expected identifier, number, string, or parenthesized expression`);
        return left; // Return what we have so far
      }

      // Handle the right-hand side of the expression
      let right;
      if (
        //Line and file end terminators
        this.expectPeek(TokenType.EOF) ||
        this.expectPeek(TokenType.NewLine) ||
        this.expectPeekVal(";") ||
        //parentheses expr
        this.expectPeekVal(")") ||
        //array values and function call exprs end
        this.expectPeekVal(",")
      ) {
        right = this.consume().value; // Simple right-hand expression (now resolved)
        if (!this.expectTokenVal(")") && !this.expectTokenVal(",")) {
          this.consume();
        }
      } else {
        right = this.parseExpression(); // Recursively parse complex expressions
      }

      return <ASTNode>{
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
    if (this.expectTokenVal(")")) {
      this.addError("Empty parentheses - Expected an expression inside parentheses");
    }
    const expression = this.parseExpression(); // Parse the inner expression
    if (this.expectTokenVal(")")) {
      this.consume(); // Consume the closing ')'
    } else {
      this.addError("Unmatched parentheses - Missing closing ')' for opening '('");
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
        return <ASTNode>{
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
              initializer = this.parseExpression();
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
              this.expectTokenVal(tokens.sub) ||
              this.expectTokenVal("--") ||
              this.expectTokenVal("++")
            ) {
              //todo
              initializer = this.parseExpression();
              break;
            } else {
              // another error, fallthrough
            }
          case TokenType.Keyword:
            if (this.expectTokenVal("true") || this.expectTokenVal("false")) {
              initializer = this.parseExpression();
              this.vars.push({
                dataType: "boolean",
                val: identifier,
                nodePos: this.nodes.length,
              });
            } else {
              if (isAllowedKey(this.tokenizer.getCurrentToken().value)) {
                switch (this.tokenizer.getCurrentToken().value) {
                  case "f":
                    initializer = this.parseFunc();
                    break;
                  default:
                    initializer = this.parseLiteral();
                }
              }
            }
            break;
          default:
            this.addError(
              `Unexpected token '${this.tokenizer.getCurrentToken()?.value}' of type ${this.tokenizer.getCurrentToken()?.type} at variable initialization for '${identifier}' - Expected a value (number, string, boolean, function, or expression)`
            );
            this.tokenizer.toNewLine();
          // an error (variable value can't be keyword or operator, but some things like () and [], {} may fall in punctuation which can be a variable)
        }
        return <ASTNode>{
          type: ASTNodeType.VariableDeclaration,
          identifier,
          initializer,
        };
      } else {
        this.addError(
          `Unexpected token '${this.tokenizer.getCurrentToken()?.value}' after variable identifier '${identifier}' - Expected '=' for variable assignment`
        );
        this.consume();
        this.tokenizer.toNewLine();
      }
    } else {
      this.addError(
        `Unexpected token '${this.tokenizer.getCurrentToken()?.value}' of type ${this.tokenizer.getCurrentToken()?.type} in variable declaration - Expected identifier after 'l' keyword`
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
          this.defines.set(identifier, initializer.value);
        }else{
          this.addError(`Unexpected token: ${this.consume().value}, expected >`)
        }
      }else{
        this.addError(`Unexpected token: ${this.consume().value}, expected def chain ->`)
      }
      return <ASTNode>{
        type: ASTNodeType.DefDecl,
        identifier,
        initializer,
      };
    } else {
      this.addError(
        `Unexpected token type: '${this.tokenizer.peek().value}' (${this.tokenizer.peek().type}) after 'def' keyword - Expected identifier to define`
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
      return <ASTNode>{
        type: ASTNodeType.Return,
        value: rtToken.value,
      };
    } else {
      if (
        this.expectPeek(TokenType.Identifier) ||
        this.expectPeek(TokenType.Literal) ||
        this.expectPeek(TokenType.StringLiteral) ||
        isAllowedKey(this.tokenizer.peek().value)
      ) {
        this.consume();
        const tk = this.parseExpression();

        return <ASTNode>{
          type: ASTNodeType.Return,
          initializer: tk,
        };
      }
      this.addError(`Unexpected token '${this.tokenizer.getCurrentToken()?.value}' after return statement - Expected newline, semicolon, or end of block`);
      this.consume();
    }
  }
  parseBreakNCont() {
    const keyword = this.consume(); // Get the break or continue keyword
    
    if (
      this.expectToken(TokenType.NewLine) ||
      this.expectToken(TokenType.EOF) ||
      this.expectTokenVal(";") ||
      this.expectTokenVal("}")
    ) {
      // Valid termination for break/continue
      if (this.expectToken(TokenType.NewLine) || this.expectTokenVal(";")) {
        this.consume();
      }
      
      return <ASTNode>{
        type: keyword.value === "break" ? ASTNodeType.Break : ASTNodeType.Continue,
        value: keyword.value,
      };
    } else {
      this.addError(
        `Unexpected token '${this.tokenizer.getCurrentToken()?.value}' after ${keyword.value} keyword - Expected newline, semicolon, or end of block`
      );
      this.tokenizer.toNewLine();
      return <ASTNode>{
        type: keyword.value === "break" ? ASTNodeType.Break : ASTNodeType.Continue,
        value: keyword.value,
      };
    }
  }
  parseFunc() {
    this.consume();
    let identifier;
    let params;
    let body;
    if (this.expectToken(TokenType.Identifier)) {
      // parse
      identifier = this.consume().value;
      if (this.expectTokenVal("(")) {
        params = this.parseFuncParams();
        if (this.expectTokenVal("{")) {
          body = this.parseBlockStmt();
        } else {
          this.addError(`Expected '{' for function body`);
        }
        return <ASTNode>{
          type: ASTNodeType.FunctionDeclaration,
          identifier,
          params,
          body,
        };
      } else {
        this.addError(`Expected '(' at function declaration`);
        return null; // Stop parsing this function
      }
    } else {
      // potential error, will assert at the end,if the function isn't called
      if (this.expectTokenVal("(")) {
        params = this.parseFuncParams();
        if (this.expectTokenVal("{")) {
          body = this.parseBlockStmt();
        } else {
          this.addError(`Expected '{' for function body`);
        }
        return <ASTNode>{
          type: ASTNodeType.FunctionDeclaration,
          params,
          body,
        };
      } else {
        this.addError(`Expected '(' at anonymouds or function declaration`);
      }
    }
  }
  parseFuncParams() {
    this.consume();
    let params: ASTNode[] = [];
    while (!this.expectTokenVal(")")) {
      const arg = this.parseLiteral();
      if (!arg) {
        this.addError(`SyntaxError: Invalid argument in function declaration - Expected parameter name`);
        break; // Prevent infinite loops if parseExpression fails
      }
      params.push(arg); // Collect the parsed argument
      if (this.expectTokenVal(",")) {
        this.consume(); // Consume the comma separator
      } else if (!this.expectTokenVal(")")) {
        this.addError(`SyntaxError: Expected ',' or ')' in function declaration parameters - Found '${this.tokenizer.getCurrentToken()?.value}' instead`);
        break;
      }
    }
    if (this.expectTokenVal(")")) {
      this.consume();
    } else {
      this.addError(`SyntaxError: Unmatched parentheses in function declaration - Expected closing ')'`);
    }
    return params;
  }
  parseBlockStmt() {
    this.consume();
    let body: ASTNode[] = [];
    while (!this.expectTokenVal("}")) {
      // Skip newlines and statement terminator
      if (this.expectToken(TokenType.NewLine) || this.expectTokenVal(";")) {
        this.consume();
        continue;
      }
      let node = this.checkParseReturn();
      body.push(node);
    }
    if (this.expectTokenVal("}")) {
      this.consume();
    } else {
      this.addError(`Block not closed properly - Expected '}' to close block opened with '{'`);
    }
    return body;
  }
  parseIfElse() {
    this.consume();
    let test;
    let consequence;
    let alternate;
    if (this.expectTokenVal("(")) {
      test = this.parseExpression();
    } else {
      this.addError(
        `SyntaxError: Expected '(' for if condition, got '${this.tokenizer.getCurrentToken()?.value}' - If statements require parentheses around the condition`
      );
      return null;
    }
    if (!this.expectTokenVal("{")) {
      this.addError(
        `SyntaxError: Expected '{' to start if statement body, got '${this.tokenizer.getCurrentToken()?.value}' - Code blocks must be wrapped in curly braces`
      );
      return null;
    }
    consequence = this.parseBlockStmt();
    if (!this.expectTokenVal("else")) {
      return <ASTNode>{
        type: ASTNodeType.IfElse,
        test,
        consequence,
      };
    }
    this.consume();
    if (this.expectTokenVal("if") || this.expectTokenVal("{")) {
      if (this.expectTokenVal("{")) {
        alternate = this.parseBlockStmt();
      } else {
        alternate = this.parseIfElse();
      }
      return <ASTNode>{
        type: ASTNodeType.IfElse,
        test,
        consequence,
        alternate,
      };
    } else {
      this.addError(
        `SyntaxError: Unexpected token '${this.tokenizer.getCurrentToken()?.value}' after else keyword - Expected 'if' for else-if or '{' for else block`
      );
      return null;
    }
  }
  parseWhileLoop() {
    this.consume();
    let test;
    let body;
    if (!this.expectTokenVal("(")) {
      this.addError(
        `SyntaxError: Expected '(' for while condition, got '${this.tokenizer.getCurrentToken()?.value}' - While loops require parentheses around the condition`
      );
      return null;
    }
    test = this.parseExpression();
    if (!this.expectTokenVal("{")) {
      this.addError(
        `SyntaxError: Expected '{' to start while loop body, got '${this.tokenizer.getCurrentToken()?.value}' - Code blocks must be wrapped in curly braces`
      );
      return null;
    }
    body = this.parseBlockStmt();
    return <ASTNode>{
      type: ASTNodeType.Loop,
      test,
      body,
    };
  }
  parseForLoop(){
    this.consume();
    let initializer;
    let test;
    let upgrade;
    let body;
    if (!this.expectTokenVal("(")) {
      this.addError(
        `SyntaxError: Expected '(' for for loop, got '${this.tokenizer.getCurrentToken()?.value}' - For loops require parentheses around the initialization, condition, and update`
      );
      return null;
    }
    this.consume();
    initializer = this.parseVariable();
    if (this.expectToken(TokenType.NewLine) || this.expectTokenVal(";")) {
      this.consume();
    }
    test = this.parseExpression();
    if (this.expectToken(TokenType.NewLine) || this.expectTokenVal(";")) {
      this.consume();
    }
    upgrade = this.parseExpression();
    this.consume()
    if (this.expectToken(TokenType.NewLine) || this.expectTokenVal(";")) {
      this.consume();
    }
    if (!this.expectTokenVal("{")) {
      this.addError(
        `SyntaxError: Expected '{' to start for loop body, got '${this.tokenizer.getCurrentToken()?.value}' - Code blocks must be wrapped in curly braces`
      );
      return null;
    }
    body = this.parseBlockStmt();
    return{
      type:ASTNodeType.Loop,
      initializer,
      test,
      upgrade,
      body
    }
  }
  checkParseReturn() {
    let baseToken = this.tokenizer.getCurrentToken();
    let node;
    
    // First check if this is a keyword, then resolve any defines
    const resolvedValue = this.resolveDefine(baseToken.value);
    
    // Check if the resolved value is a keyword, even if the original wasn't
    const isResolvedKeyword = baseToken.type === TokenType.Keyword || 
                             (baseToken.type === TokenType.Identifier && this.defines.has(baseToken.value));
    
    if (isResolvedKeyword) {
      switch (resolvedValue) {
        case tokens.l:
          node = this.parseVariable();
          break;
        case "def":
          node = this.parseDefine();
          break;
        case "return":
          node = this.parseReturn();
          break;
        case "break":
        case "continue":
          node = this.parseBreakNCont();
          break;
        case "f":
          node = this.parseFunc();
          break;
        case "if":
          node = this.parseIfElse();
          break;
        case "while":
          node = this.parseWhileLoop();
          break;
        case "for":
          node = this.parseForLoop()  
          break
        default:
          //hehe
      }
    } else {
      switch (baseToken.type) {
        case TokenType.Punctuation:
          if (baseToken.value === ";") {
            this.tokenizer.next();
          } else {
            this.addError(`Unexpected punctuation: '${baseToken.value}' - Cannot start a statement with this punctuation`);
            this.tokenizer.next();
          }
          break;
        case TokenType.NewLine:
          this.tokenizer.next();
          break;
        case TokenType.Identifier:
        case TokenType.Literal:
        case TokenType.StringLiteral:
          node = this.parseExpression();
          break;
        case TokenType.Operator:
          if (
            this.expectTokenVal(tokens.not) ||
            this.expectTokenVal(tokens.sub) ||
            this.expectTokenVal("--") ||
            this.expectTokenVal("++")
          ) {
            let nodeO = this.parseExpression();
            nodeO && this.nodes.push(nodeO);
          } else {
            this.addError(`Unexpected operator: '${baseToken.value}' - Cannot start a statement with this operator (expected prefix operators like !, -, ++, --)`);
            this.tokenizer.next();
          }
          break;
        default:
          this.addError(`Unexpected statement start: '${baseToken.value}' - Expected variable declaration (l), function (f), if statement, loop, or expression`);
          this.tokenizer.next();
        //Syntax Error Likely
      }
    }
    return node;
  }
  checkAndParse() {
    let baseToken = this.tokenizer.getCurrentToken();
    
    // First check if this is a keyword, then resolve any defines
    const resolvedValue = this.resolveDefine(baseToken.value);
    
    // Check if the resolved value is a keyword, even if the original wasn't
    const isResolvedKeyword = baseToken.type === TokenType.Keyword || 
                             (baseToken.type === TokenType.Identifier && this.defines.has(baseToken.value));
    
    if (isResolvedKeyword) {
      switch (resolvedValue) {
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
        case "f":
          let nodeF = this.parseFunc();
          nodeF && this.nodes.push(nodeF);
          break;
        case "if":
          let nodeIf = this.parseIfElse();
          nodeIf && this.nodes.push(nodeIf);
          break;
        case "while":
          let nodeW = this.parseWhileLoop();
          nodeW && this.nodes.push(nodeW);
          break;
        case "for":
          let nodeFo = this.parseForLoop();
          nodeFo && this.nodes.push(nodeFo);
          break;   
        default:
          this.consume();
          //hehe
      }
    } else {
      switch (baseToken.type) {
      case TokenType.Punctuation:
        if (baseToken.value === ";") {
          this.tokenizer.next();
        } else {
          this.addError(`Unexpected punctuation: '${baseToken.value}' - Cannot start a statement with this punctuation`);
          this.tokenizer.next();
        }
        break;
      case TokenType.NewLine:
        this.tokenizer.next();
        break;
      case TokenType.Identifier:
      case TokenType.Literal:
      case TokenType.StringLiteral:
        let nodeE = this.parseExpression();
        nodeE && this.nodes.push(nodeE);
        break;
      case TokenType.Operator:
        if (
          this.expectTokenVal(tokens.not) ||
          this.expectTokenVal(tokens.sub) ||
          this.expectTokenVal("--") ||
          this.expectTokenVal("++")
        ) {
          let nodeO = this.parseExpression();
          nodeO && this.nodes.push(nodeO);
        } else {
          this.addError(`Unexpected operator: '${baseToken.value}' - Cannot start a statement with this operator (expected prefix operators like !, -, ++, --)`);
          this.tokenizer.next();
        }
        break;
      default:
        this.addError(`Unexpected statement start: '${baseToken.value}' - Expected variable declaration (l), function (f), if statement, loop, or expression`);
        this.tokenizer.next();
      //Syntax Error Likely
      }
    }
  }
  start() {
    while (this.tokenizer.getCurrentToken().type !== TokenType.EOF) {
      this.checkAndParse();
    }
  }
}
// Can now parse myprogram.ay, for now i'll build compiler for this and work on adding more language features after
// Deno.readTextFileSync("./myprogram.ay")
// let f = Bun.file("./myprogram.ay");
// const p = new Parser(await f.text());
// p.start();
// console.log(p.nodes, p.errors, p.vars);
