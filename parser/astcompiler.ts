import { ASTNode, ASTNodeType } from "./asts";
import { Parser } from "./parser";
// AST to JavaScript compiler for AY language
// This file exports a function that takes an AST (array of nodes) and returns JavaScript code as a string

export default function compileAST(ast:ASTNode[]) {
  function compileNode(node) {
    if (node === null || node === undefined) return "";
    if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
      return String(node);
    }
    if (typeof node !== "object") return "";
    switch (node.type) {
      case ASTNodeType.VariableDeclaration:
        if (node.initializer) {
          return `let ${node.identifier} = ${compileNode(node.initializer)};`;
        } else {
          return `let ${node.identifier};`;
        } 
      case ASTNodeType.Literal:
      case ASTNodeType.Identifier:
        return node.value ?? node.name ?? node.identifier ?? "";
      case ASTNodeType.FunctionDeclaration:
        return `function ${node.identifier || ""}(${(node.params||[]).map(compileNode).join(", ")}) {\n${(node.body||[]).map(compileNode).join("\n")}\n}`;
      case ASTNodeType.Return:
        if (node.initializer !== undefined && node.initializer !== null) {
          return `return ${compileNode(node.initializer)};`;
        }
        return "return;";
      case ASTNodeType.Break:
        return "break;";
      case ASTNodeType.Continue:
        return "continue;";
      case ASTNodeType.IfElse:
        return compileIfElse(node);
      case ASTNodeType.Loop:
        return compileLoop(node);
      case ASTNodeType.DefDecl:
        return "";
      case ASTNodeType.UnaryExpression:
        return `${node.operator || ""}${compileNode(node.operand)}`;
      case ASTNodeType.BinaryExpression:
        return `${compileNode(node.left)} ${node.operator} ${compileNode(node.right)}`;
      case ASTNodeType.CallExpression:
      case "CallExpression":
        return compileCall(node);
      case ASTNodeType.MemberExpression:
      case "MemberExpression":
        return `${compileNode(node.object)}.${typeof node.property === "string" ? node.property : compileNode(node.property)}`;
      case ASTNodeType.NewExpression:
      case "NewExpression":
        return compileNew(node);
      case ASTNodeType.ArrayLiteral:
        return `[${(node.elements||[]).map(compileNode).join(", ")}]`;
      case ASTNodeType.ObjectLiteral:
        return compileObject(node);
      case ASTNodeType.Throw:
        if (node.initializer !== undefined && node.initializer !== null) {
          return `throw ${compileNode(node.initializer)};`;
        }
        return "throw undefined;";
      case ASTNodeType.Try:
        return compileTry(node);
      default:
        return compileFallback(node);
    }
  }

  function compileObject(node) {
    const props = (node.properties || []).map((prop) => {
      if (prop.shorthand) {
        return prop.key;
      }
      if (prop.method) {
        const params = (prop.params || []).map(compileNode).join(", ");
        const body = (Array.isArray(prop.body) ? prop.body : prop.body ? [prop.body] : [])
          .map(compileNode)
          .join("\n");
        return `${prop.key}(${params}) {\n${body}\n}`;
      }
      return `${prop.key}: ${compileNode(prop.value)}`;
    });
    if (props.length === 0) {
      return "{}";
    }
    return `{ ${props.join(", ")} }`;
  }

  function compileCall(node) {
    const callee = node.callee !== undefined && node.callee !== null
      ? compileNode(node.callee)
      : node.identifier;
    return `${callee}(${(node.args||[]).map(compileNode).join(", ")})`;
  }

  function compileNew(node) {
    const callee = node.callee !== undefined && node.callee !== null
      ? compileNode(node.callee)
      : node.identifier;
    // `new Foo()` is parsed as new + CallExpression, which already includes ()
    if (node.callee && (node.callee.type === "CallExpression" || node.callee.type === ASTNodeType.CallExpression)) {
      return `new ${callee}`;
    }
    if (node.args) {
      return `new ${callee}(${node.args.map(compileNode).join(", ")})`;
    }
    return `new ${callee}`;
  }

  function compileFallback(node) {
    if (node.paren !== undefined) {
      return `(${compileNode(node.paren)})`;
    }
    if (node.operator && node.operand !== undefined) {
      return `${node.operator}${compileNode(node.operand)}`;
    }
    if (node.operator && node.left !== undefined && node.right !== undefined) {
      const left = compileNode(node.left);
      let right;
      if (node.right && node.right.paren) {
        right = compileTest(node.right);
      } else {
        right = compileNode(node.right);
      }
      return `${left} ${node.operator} ${right}`;
    }
    if (node.postop && node.identifier) {
      const ident = typeof node.identifier === "string" ? node.identifier : compileNode(node.identifier);
      return `${ident}${node.postop}`;
    }
    if (node.infixop && node.identifier) {
      const ident = typeof node.identifier === "string" ? node.identifier : compileNode(node.identifier);
      return `${node.infixop}${ident}`;
    }
    if (node.elements) {
      return `[${node.elements.map(compileNode).join(", ")}]`;
    }
    if (node.properties) {
      return compileObject(node);
    }
    if (node.index !== undefined && (node.object !== undefined || node.identifier)) {
      const obj = node.object !== undefined ? compileNode(node.object) : node.identifier;
      if (Array.isArray(node.index)) {
        return `${obj}[${node.index.map(compileNode).join("][")}]`;
      }
      return `${obj}[${compileNode(node.index)}]`;
    }
    if (node.type === "CallExpression") {
      return compileCall(node);
    }
    return "";
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
    if (!test) return "";
    if (test.paren !== undefined) {
      return `(${compileNode(test.paren)})`;
    }
    if (test.operator && test.left !== undefined && test.right !== undefined) {
      return `(${compileNode(test.left)} ${test.operator} ${compileNode(test.right)})`;
    }
    const compiled = compileNode(test);
    if (compiled.startsWith("(") && compiled.endsWith(")")) {
      return compiled;
    }
    return compiled ? `(${compiled})` : "";
  }

  function compileBlock(body) {
    const nodes = Array.isArray(body) ? body : body ? [body] : [];
    return nodes.map(compileNode).join("\n");
  }

  function compileTry(node) {
    let code = `try {\n${compileBlock(node.body)}\n}`;
    if (node.catchBody !== undefined) {
      const param = node.catchParam ? ` (${node.catchParam})` : "";
      code += ` catch${param} {\n${compileBlock(node.catchBody)}\n}`;
    }
    if (node.finallyBody !== undefined) {
      code += ` finally {\n${compileBlock(node.finallyBody)}\n}`;
    }
    return code;
  }

  function compileLoop(node) {
    // For loop
    if (node.initializer && node.test && node.upgrade) {
      return `for (${compileNode(node.initializer)} ${compileTest(node.test)}; ${compileNode(node.upgrade)}) {\n${(node.body||[]).map(compileNode).join("\n")}\n}`;
    }
    // While loop
    if (node.test && node.body) {
      return `while ${compileTest(node.test)} {\n${(node.body||[]).map(compileNode).join("\n")}\n}`;
    }
    return "";
  }

  return ast.map(compileNode).filter((line) => line !== "").join("\n");
}
// let f = Bun.file("./test.ay");
// const p = new Parser(await f.text());
// p.start();
// console.log(compileAST(p.nodes));
