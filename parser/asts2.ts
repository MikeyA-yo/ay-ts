type BinaryExpressionNode = {
    type: 'BinaryExpression';
    operator: string;
    left: ASTNode;
    right: ASTNode;
  };
  
  type IdentifierNode = {
    type: 'Identifier';
    name: string;
  };
  
  type LiteralNode = {
    type: 'Literal';
    value: string;
    raw: string;
  };
  
  type VariableDeclarationNode = {
    type: 'VariableDeclaration';
    name: string;
    init: ASTNode; // Initializer (could be a literal or expression)
  };
  
  type FunctionDeclarationNode = {
    type: 'FunctionDeclaration';
    name: string;
    params: IdentifierNode[];
    body: ASTNode[]; // Could be a block of statements
  };
  
  export type ASTNode =
    | BinaryExpressionNode
    | IdentifierNode
    | LiteralNode
    | VariableDeclarationNode
    | FunctionDeclarationNode;
  