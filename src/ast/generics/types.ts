import * as ts from 'typescript';

const genericTypes: ts.SyntaxKind[] = [
  ts.SyntaxKind.AnyKeyword,
  ts.SyntaxKind.ObjectKeyword,
];

export const isGenericType = (node: ts.Node): boolean =>
  genericTypes.includes(node.kind);
