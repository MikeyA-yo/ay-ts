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

  private skipNewlines() {
    while (this.expectToken(TokenType.NewLine)) {
      this.consume();
    }
  }

  private isEOF() {
    return this.tokenizer.getCurrentToken()?.type === TokenType.EOF;
  }

  private binaryPrec(op: string): number {
    switch (op) {
      case "=":
      case "+=":
      case "-=":
      case "*=":
      case "/=":
      case "%=":
      case "&&=":
      case "||=":
        return 1;
      case "??":
        return 2;
      case "||":
        return 3;
      case "&&":
        return 4;
      case "==":
      case "!=":
      case "===":
      case "!==":
        return 5;
      case "<":
      case ">":
      case "<=":
      case ">=":
        return 6;
      case "<<":
      case ">>":
      case ">>>":
        return 7;
      case "+":
      case "-":
      case "~":
        return 8;
      case "*":
      case "/":
      case "%":
        return 9;
      case "^":
      case "**":
        return 10;
      default:
        return -1;
    }
  }

  private isRightAssoc(op: string): boolean {
    return (
      op === "=" ||
      op === "+=" ||
      op === "-=" ||
      op === "*=" ||
      op === "/=" ||
      op === "%=" ||
      op === "&&=" ||
      op === "||=" ||
      op === "**" ||
      op === "^"
    );
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
    const operand = this.parseUnary();
    return <ASTNode><unknown>{
      type: ASTNodeType.UnaryExpression,
      operator,
      operand,
    };
  }
  parseArgList(): ASTNode[] {
    const args: ASTNode[] = [];
    this.consume(); // Consume the opening '('
    this.skipNewlines();
    if (this.expectTokenVal(")")) {
      this.consume();
      return args;
    }
    while (!this.expectTokenVal(")") && !this.isEOF()) {
      this.skipNewlines();
      if (this.expectTokenVal(")")) {
        break;
      }
      const arg = this.parseExpression();
      if (!arg) {
        this.addError(`SyntaxError: Invalid argument in function call`);
        break;
      }
      args.push(arg);
      this.skipNewlines();
      if (this.expectTokenVal(",")) {
        this.consume();
      } else if (!this.expectTokenVal(")")) {
        this.addError(`SyntaxError: Expected ',' or ')' in function call`);
        break;
      }
    }
    if (this.expectTokenVal(")")) {
      this.consume();
    } else {
      this.addError(`SyntaxError: Unmatched parentheses in function call`);
    }
    return args;
  }
  parseCallExpr() {
    const identifier = this.consume().value; // Consume the function identifier
    if (!this.expectTokenVal("(")) {
      this.addError(`SyntaxError: Expected '(' after function identifier '${identifier}'`);
      return null;
    }
    const args = this.parseArgList();
    return <ASTNode><unknown>{
      type: "CallExpression",
      identifier,
      callee: identifier,
      args,
    };
  }
  parseUnary(): ASTNode {
    if (
      this.expectTokenVal("!") ||
      this.expectTokenVal("-") ||
      this.expectTokenVal("++") ||
      this.expectTokenVal("--")
    ) {
      const operator = this.consume().value;
      const operand = this.parseUnary();
      if (!operand) {
        this.addError(`Expected expression after '${operator}'`);
      }
      if (operator === "++" || operator === "--") {
        const identifier =
          typeof operand === "string"
            ? operand
            : (operand as any)?.identifier || (operand as any)?.name;
        return <ASTNode><unknown>{ infixop: operator, identifier: identifier ?? operand };
      }
      return <ASTNode><unknown>{
        type: ASTNodeType.UnaryExpression,
        operator,
        operand,
      };
    }
    if (this.expectTokenVal("new")) {
      this.consume();
      const callee = this.parseUnary();
      return <ASTNode><unknown>{
        type: "NewExpression",
        callee,
        identifier: typeof callee === "string" ? callee : (callee as any)?.identifier,
        args: (callee as any)?.args,
      };
    }
    return this.parsePostfix();
  }
  parsePostfix(): ASTNode {
    let left = this.parsePrimary();
    if (!left) {
      return left;
    }
    while (true) {
      if (this.expectTokenVal("(")) {
        const args = this.parseArgList();
        const identifier =
          typeof left === "string"
            ? left
            : (left as any)?.identifier || (left as any)?.name;
        left = <ASTNode><unknown>{
          type: "CallExpression",
          identifier,
          callee: left,
          args,
        };
      } else if (this.expectTokenVal("[")) {
        this.consume();
        this.skipNewlines();
        const index = this.parseExpression();
        this.skipNewlines();
        if (this.expectTokenVal("]")) {
          this.consume();
        } else {
          this.addError(`SyntaxError: Expected ']' after index`);
          break;
        }
        left = <ASTNode><unknown>{
          object: left,
          identifier: typeof left === "string" ? left : undefined,
          index,
        };
      } else if (this.expectTokenVal(".")) {
        this.consume();
        if (
          !this.expectToken(TokenType.Identifier) &&
          !this.expectToken(TokenType.Keyword)
        ) {
          this.addError(`SyntaxError: Expected property name after '.'`);
          break;
        }
        // Keep the raw property name — defines should not rewrite obj.var to obj.l
        const property = this.tokenizer.getCurrentToken().value;
        this.tokenizer.next();
        left = <ASTNode><unknown>{
          type: "MemberExpression",
          object: left,
          property,
        };
      } else if (this.expectTokenVal("++") || this.expectTokenVal("--")) {
        const postop = this.consume().value;
        const identifier =
          typeof left === "string"
            ? left
            : (left as any)?.identifier || (left as any)?.name;
        left = <ASTNode><unknown>{
          postop,
          identifier: identifier ?? left,
        };
      } else {
        break;
      }
    }
    return left;
  }
  parsePrimary(): ASTNode {
    if (this.expectTokenVal("(")) {
      return this.parseParenExpr() as ASTNode;
    }
    if (this.expectTokenVal("[")) {
      return this.parseArray();
    }
    if (this.expectTokenVal("{")) {
      return this.parseObject();
    }
    if (this.expectTokenVal("f")) {
      return this.parseFunc();
    }
    if (this.expectToken(TokenType.Identifier)) {
      return this.consume().value as unknown as ASTNode;
    }
    if (
      this.expectToken(TokenType.Literal) ||
      this.expectToken(TokenType.StringLiteral)
    ) {
      return this.consume().value as unknown as ASTNode;
    }
    if (
      this.expectTokenVal("true") ||
      this.expectTokenVal("false") ||
      this.expectTokenVal("null") ||
      this.expectTokenVal("this")
    ) {
      return this.consume().value as unknown as ASTNode;
    }
    this.addError(
      `Invalid expression - Expected identifier, number, string, or parenthesized expression, got '${this.tokenizer.getCurrentToken()?.value}'`
    );
    return null;
  }
  parseArray() {
    let elements: ASTNode[] = [];
    this.consume(); // Consume the opening '['

    if (this.expectTokenVal("]")) {
      this.consume();
      return <ASTNode><unknown>{ type: ASTNodeType.ArrayLiteral, elements };
    }

    while (!this.expectTokenVal("]") && !this.isEOF()) {
      // Skip newlines
      if (this.expectToken(TokenType.NewLine)) {
        this.consume();
        continue;
      }

      const pos = this.tokenizer.currentTokenNo;
      let element = this.parseExpression();
      if (!element) {
        this.addError(`SyntaxError: Invalid array element`);
        break;
      }
      if (this.tokenizer.currentTokenNo === pos) {
        this.addError(`SyntaxError: Invalid array element`);
        this.consume();
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

    return <ASTNode><unknown>{ type: ASTNodeType.ArrayLiteral, elements };
  }
  parseObject() {
    this.consume(); // Consume the opening '{'
    this.skipNewlines();
    const properties: {
      key: string;
      value?: ASTNode | string;
      shorthand?: boolean;
      method?: boolean;
      params?: ASTNode[];
      body?: ASTNode[];
    }[] = [];

    if (this.expectTokenVal("}")) {
      this.consume();
      return <ASTNode><unknown>{ type: ASTNodeType.ObjectLiteral, properties };
    }

    while (!this.expectTokenVal("}") && !this.isEOF()) {
      this.skipNewlines();
      if (this.expectTokenVal("}")) {
        break;
      }
      if (this.expectTokenVal(",")) {
        this.consume();
        continue;
      }

      const pos = this.tokenizer.currentTokenNo;
      const prop = this.parseObjectProperty();
      if (!prop) {
        break;
      }
      properties.push(prop);

      this.skipNewlines();
      if (this.expectTokenVal(",")) {
        this.consume();
      } else if (!this.expectTokenVal("}")) {
        this.addError(
          `SyntaxError: Expected ',' or '}' in object literal - Found '${this.tokenizer.getCurrentToken()?.value}' instead`
        );
        break;
      }

      if (this.tokenizer.currentTokenNo === pos) {
        this.addError(`SyntaxError: Invalid object property`);
        this.consume();
        break;
      }
    }

    if (this.expectTokenVal("}")) {
      this.consume();
    } else {
      this.addError(`SyntaxError: Unmatched braces in object literal - Expected '}' to close '{'`);
    }

    return <ASTNode><unknown>{ type: ASTNodeType.ObjectLiteral, properties };
  }
  parseObjectProperty() {
    const token = this.tokenizer.getCurrentToken();
    if (!token || token.type === TokenType.EOF) {
      this.addError(`SyntaxError: Expected property name in object literal`);
      return null;
    }

    let key: string;
    let canShorthand = false;
    if (
      token.type === TokenType.Identifier ||
      token.type === TokenType.Keyword ||
      token.type === TokenType.Literal ||
      token.type === TokenType.StringLiteral
    ) {
      // Raw name so `def` aliases do not rewrite object keys
      key = token.value;
      canShorthand = token.type === TokenType.Identifier;
      this.tokenizer.next();
    } else {
      this.addError(
        `SyntaxError: Expected property name in object literal, got '${token.value}'`
      );
      return null;
    }

    this.skipNewlines();

    // method shorthand: { greet(name) { return name } }
    if (this.expectTokenVal("(")) {
      const params = this.parseFuncParams();
      this.skipNewlines();
      if (!this.expectTokenVal("{")) {
        this.addError(
          `SyntaxError: Expected '{' for object method '${key}'`
        );
        return { key, method: true, params, body: [] };
      }
      const body = this.parseBlockStmt();
      return { key, method: true, params, body };
    }

    if (this.expectTokenVal(":")) {
      this.consume();
      this.skipNewlines();
      const value = this.parseExpression();
      if (!value) {
        this.addError(`SyntaxError: Expected value after ':' for property '${key}'`);
      }
      return { key, value };
    }

    if (canShorthand && (this.expectTokenVal(",") || this.expectTokenVal("}"))) {
      return { key, shorthand: true, value: key };
    }

    this.addError(
      `SyntaxError: Expected ':' after property name '${key}' in object literal`
    );
    return { key, value: key };
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
  parseExpression(minPrec: number = 0) {
    let left = this.parseUnary();
    if (!left) {
      return left;
    }

    while (this.expectToken(TokenType.Operator) || this.expectTokenVal("~")) {
      if (this.expectTokenVal("~")) {
        this.tokenizer.getCurrentToken().value = "+";
        this.tokenizer.getCurrentToken().type = TokenType.Operator;
      }
      const op = this.tokenizer.getCurrentToken().value;
      const prec = this.binaryPrec(op);
      if (prec < 0 || prec < minPrec) {
        break;
      }
      this.consume();
      this.skipNewlines();
      const nextMin = this.isRightAssoc(op) ? prec : prec + 1;
      const right = this.parseExpression(nextMin);
      if (!right) {
        this.addError(
          `Invalid expression after operator '${op}' - Expected identifier, number, string, or parenthesized expression`
        );
        return left;
      }
      left = <ASTNode><unknown>{
        type: ASTNodeType.BinaryExpression,
        operator: op,
        left,
        right,
      };
    }

    return left;
  }

  parseParenExpr() {
    this.consume(); // Consume the opening '('
    this.skipNewlines();
    // Important Error checks:
    if (this.expectTokenVal(")")) {
      this.addError("Empty parentheses - Expected an expression inside parentheses");
    }
    const expression = this.parseExpression(); // Parse the inner expression
    this.skipNewlines();
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
    if (this.expectToken(TokenType.Identifier)) {
      identifier = this.consume()?.value;
      //this check is used to know whether it's just a plain declaration, without any value initialised in the variable
      if (
        this.expectToken(TokenType.EOF) ||
        this.expectToken(TokenType.NewLine) ||
        this.expectTokenVal(";")
      ) {
        this.consume();
        this.vars.push({
          dataType: "unknown",
          val: identifier,
          nodePos: this.nodes.length,
        });
        return <ASTNode>{
          type: ASTNodeType.VariableDeclaration,
          identifier,
        };
      }
      if (this.expectTokenVal(tokens.assign)) {
        this.consume();
        this.skipNewlines();
        initializer = this.parseExpression();
        if (!initializer) {
          this.addError(
            `Unexpected token '${this.tokenizer.getCurrentToken()?.value}' of type ${this.tokenizer.getCurrentToken()?.type} at variable initialization for '${identifier}' - Expected a value (number, string, boolean, function, or expression)`
          );
          this.tokenizer.toNewLine();
        }
        this.vars.push({
          dataType: "unknown",
          val: identifier,
          nodePos: this.nodes.length,
        });
        if (
          this.expectToken(TokenType.NewLine) ||
          this.expectTokenVal(";")
        ) {
          this.consume();
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
    this.consume(); // consume 'return'
    if (
      this.expectToken(TokenType.NewLine) ||
      this.expectToken(TokenType.EOF) ||
      this.expectTokenVal(";") ||
      this.expectTokenVal("}")
    ) {
      if (this.expectToken(TokenType.NewLine) || this.expectTokenVal(";")) {
        this.consume();
      }
      return <ASTNode>{
        type: ASTNodeType.Return,
      };
    }
    const tk = this.parseExpression();
    if (
      this.expectToken(TokenType.NewLine) ||
      this.expectTokenVal(";")
    ) {
      this.consume();
    }
    return <ASTNode>{
      type: ASTNodeType.Return,
      initializer: tk,
    };
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
    while (!this.expectTokenVal(")") && !this.isEOF()) {
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
    while (!this.expectTokenVal("}") && !this.isEOF()) {
      // Skip newlines and statement terminator
      if (this.expectToken(TokenType.NewLine) || this.expectTokenVal(";")) {
        this.consume();
        continue;
      }
      const pos = this.tokenizer.currentTokenNo;
      let node = this.checkParseReturn();
      if (node) {
        body.push(node);
      }
      if (this.tokenizer.currentTokenNo === pos) {
        this.addError(
          `Unexpected token '${this.tokenizer.getCurrentToken()?.value}' in block`
        );
        this.consume();
        if (this.isEOF()) {
          break;
        }
      }
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
    this.skipNewlines();
    if (this.expectTokenVal(")")) {
      this.consume();
    } else {
      this.addError(
        `SyntaxError: Expected ')' after for loop header, got '${this.tokenizer.getCurrentToken()?.value}'`
      );
    }
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
        case "imp@":
        case "exp@":
          this.addError(
            `'${resolvedValue}' is reserved for module import/export and is not implemented yet`
          );
          this.consume();
          this.tokenizer.toNewLine();
          break;
        case "true":
        case "false":
        case "null":
        case "this":
        case "new":
          node = this.parseExpression();
          break;
        default:
          this.addError(
            `Unexpected keyword '${resolvedValue}' - Cannot start a statement with this keyword`
          );
          this.consume();
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
            node = this.parseExpression();
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
        case "imp@":
        case "exp@":
          this.addError(
            `'${resolvedValue}' is reserved for module import/export and is not implemented yet`
          );
          this.consume();
          this.tokenizer.toNewLine();
          break;
        case "true":
        case "false":
        case "null":
        case "this":
        case "new":
          let nodeKw = this.parseExpression();
          nodeKw && this.nodes.push(nodeKw);
          break;
        default:
          this.addError(
            `Unexpected keyword '${resolvedValue}' - Cannot start a statement with this keyword`
          );
          this.consume();
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
      const pos = this.tokenizer.currentTokenNo;
      this.checkAndParse();
      if (this.tokenizer.currentTokenNo === pos) {
        const tok = this.tokenizer.getCurrentToken();
        if (!tok || tok.type === TokenType.EOF) {
          break;
        }
        this.addError(
          `Unexpected token '${tok.value}' - parser could not advance`
        );
        this.consume();
      }
    }
  }
}
// Can now parse myprogram.ay, for now i'll build compiler for this and work on adding more language features after
// Deno.readTextFileSync("./myprogram.ay")
// let f = Bun.file("./myprogram.ay");
// const p = new Parser(await f.text());
// p.start();
// console.log(p.nodes, p.errors, p.vars);
