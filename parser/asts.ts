

export enum ASTNodeType {
  Program,
  VariableDeclaration,
  Expression,
  Literal,
  Identifier,
  NotExpression,
  TernaryExpression,
  BinaryExpression,
  UnaryExpression,
  FunctionDeclaration,
  BlockStatement
}
type right = {
    type?:string;
    name?:string;
    operator?:string;
    left?:{
        type?:string;
        value?:string
    };
    right?:right
}
type left = {
    type?:string;
    value?:string
}
type init = {
    type?:string;
    value?:string;
    raw?:string
}
type params = left[]
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
  alternate?:ASTNode
}

export interface VariableDeclarationNode extends ASTNode {
  type: ASTNodeType.VariableDeclaration;
  identifier: string;
  dataType?: string;
  initializer: ASTNode | null;
}