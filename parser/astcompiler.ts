import { ASTNode, ASTNodeType } from "./asts";
import { Parser } from "./parser";
// AST to JavaScript compiler for AY language
// This file exports a function that takes an AST (array of nodes) and returns JavaScript code as a string

export default function compileAST(ast:ASTNode[]) {
  function compileNode(node) {
    if (!node) return "";
    switch (node.type) {
      case ASTNodeType.VariableDeclaration:
        if (node.initializer) {
          return `let ${node.identifier} = ${compileNode(node.initializer)};`;
        } else {
          return `let ${node.identifier};`;
        } 
      case ASTNodeType.Literal:
        return node.value;
      case ASTNodeType.FunctionDeclaration:
        return `function ${node.identifier || ""}(${(node.params||[]).map(compileNode).join(", ")}) {\n${(node.body||[]).map(compileNode).join("\n")}\n}`;
      case ASTNodeType.Return:
        if (node.initializer) {
          return `return ${compileNode(node.initializer)};`;
        } else if (node.value) {
          return `return ${node.value};`;
        } else {
          return "return;";
        }
      case ASTNodeType.Break:
        return "break;";
      case ASTNodeType.Continue:
        return "continue;";
      case ASTNodeType.IfElse:
        return compileIfElse(node);
      case ASTNodeType.Loop:
        return compileLoop(node);
      case "CallExpression":
        return `${node.identifier}(${(node.args||[]).map(compileNode).join(", ")})`;
      default:
        // Binary, Unary, Array, etc.
        if (node.operator && node.left !== undefined && node.right !== undefined) {
          // Handle string concatenation and other binary operations
          const left = compileNode(node.left);
          const right = compileNode(node.right);
          return `${left} ${node.operator} ${right}`;
        }
        if (node.postop && node.identifier) {
          return `${node.identifier}${node.postop};`;
        }
        if (node.infixop && node.identifier) {
          return `${node.infixop} ${node.identifier};`;
        }
        if (node.elements) {
          return `[${node.elements.map(compileNode).join(", ")}]`;
        }
        if (typeof node === "string") {
          return node;
        }
        return "";
    }
  }

  function compileIfElse(node) {
    const test = node.test ? compileTest(node.test) : "";
    const cons = Array.isArray(node.consequence) ? node.consequence : [node.consequence];
    const alt = node.alternate;
    let code = `if (${test}) {\n${cons.map(compileNode).join("\n")}\n}`;
    if (alt) {
      if (Array.isArray(alt)) {
        code += ` else {\n${alt.map(compileNode).join("\n")}\n}`;
      } else {
        code += ` else ${compileIfElse(alt)}`;
      }
    }
    return code;
  }

  function compileTest(test) {
    if (test.paren) {
      return `(${compileNode(test.paren.left)} ${test.paren.operator} ${compileNode(test.paren.right)})`;
    }
    if (test.operator && test.left !== undefined && test.right !== undefined) {
      return `(${compileNode(test.left)} ${test.operator} ${compileNode(test.right)})`;
    }
    return compileNode(test);
  }

  function compileLoop(node) {
    // For loop
    if (node.initializer && node.test && node.upgrade) {
      return `for (${compileNode(node.initializer)} ${compileTest(node.test)}; ${compileNode(node.upgrade).slice(0, -1)}) {\n${(node.body||[]).map(compileNode).join("\n")}\n}`;
    }
    // While loop
    if (node.test && node.body) {
      return `while ${compileTest(node.test)} {\n${(node.body||[]).map(compileNode).join("\n")}\n}`;
    }
    return "";
  }

  return ast.map(compileNode).join("\n");
}
// let f = Bun.file("./test.ay");
// const p = new Parser(await f.text());
// p.start();
// console.log(compileAST(p.nodes));
