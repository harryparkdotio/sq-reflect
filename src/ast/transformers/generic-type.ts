import * as ts from 'typescript';
import { isGenericType } from '../generics/types';

export const genericTypeTransformer = <T extends ts.Node>(
  typeParameters: ts.TypeParameterDeclaration[]
): ts.TransformerFactory<T> => {
  return (context: ts.TransformationContext) => {
    const visit: ts.Visitor = (node: ts.Node) => {
      /* istanbul ignore else */
      if (ts.isTypeNode(node)) {
        if (ts.isArrayTypeNode(node)) {
          return ts.visitEachChild(node, child => visit(child), context);
        } else if (
          ts.isUnionTypeNode(node) ||
          ts.isIntersectionTypeNode(node)
        ) {
          return ts.createUnionOrIntersectionTypeNode(
            node.kind,
            ts.visitNodes(node.types, visit)
          );
        }

        if (isGenericType(node)) {
          // FIXME: this won't work if there is more than one type parameter
          // ideally this would have excel style lettering (A --> Z, AA --> AZ, ...)
          const typeParameterIdentifier = ts.createIdentifier('T');

          typeParameters.push(
            ts.createTypeParameterDeclaration(
              typeParameterIdentifier,
              undefined,
              node
            )
          );

          return typeParameterIdentifier;
        }

        return node;
      }

      /* istanbul ignore next */
      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
};
