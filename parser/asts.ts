

export enum ASTNodeType {
  Program,
  VariableDeclaration,
  Expression,
  Literal,
  Identifier,
  TernaryExpression,
  BinaryExpression,
  UnaryExpression,
  FunctionDeclaration,
  DefDecl,
  BlockStatement,
  Return,
  IfElse,
  Loop,
  Break,
  Continue,
  CallExpression,
  MemberExpression,
  NewExpression,
  ArrayLiteral,
  ObjectLiteral
}
type right = ASTNode | string
type left = ASTNode | string
type init = {
    type?:string;
    value?:string;
    raw?:string
}
type params = left[]
type BinaryExpressionNode = {
  type: ASTNodeType;
  operator: string;
  left: ASTNode;
  right: ASTNode;
};
type VariableDeclarationNode = {
  type: ASTNodeType;
  identifier: string;
  initializer: ASTNode; // Initializer (could be a literal or expression)
};

type ReturnNode = {
  type:ASTNodeType,
  initializer?:ASTNode,
  value?:string
}

type IfElse = {
    //if-else
    type:ASTNodeType,
    test?:ASTNode;
    consequent?:ASTNode;
    alternate?:ASTNode
}
//i plan on using this to represent any kind of node at all, due to lack of proper typescript knowledge in dealing with seperation of concerns
export interface ASTNode {
  // base of literals and identifiers
  type: ASTNodeType;
  name?:string;
  value?:string;
  raw?:string;
  identifier?:string;
  initializer?:ASTNode | null;
  dataType?:string;
  // expression mostly 
  operator?:string;
  left?:left;
  right?:right;
  // i guess in variables
  init?:init;
  // block statements && functions
  body?:ASTNode;
  //functions
  params?:params;
  //if-else
  test?:ASTNode;
  consequent?:ASTNode;
  consequence?:ASTNode | ASTNode[];
  alternate?:ASTNode | ASTNode[];
  index?:ASTNode | ASTNode[];
  // expressions
  operand?:ASTNode | string;
  args?:ASTNode[];
  callee?:ASTNode | string;
  object?:ASTNode | string;
  property?:string | ASTNode;
  elements?:ASTNode[];
  properties?: ObjectProperty[];
  paren?:ASTNode | string;
  postop?:string;
  infixop?:string;
  upgrade?:ASTNode;
}
export interface ObjectProperty {
  key: string;
  value?: ASTNode | string;
  shorthand?: boolean;
  method?: boolean;
  params?: ASTNode[];
  body?: ASTNode | ASTNode[];
}
export interface Variable{
  dataType: string,
  val:string,
  nodePos:number
}
