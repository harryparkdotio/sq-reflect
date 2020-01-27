import * as ts from 'typescript';

import { Transform } from '..';

export const getGenericInterfacePropertiesFromTypeParameters = (
  attributeName: string,
  typeParameters: ts.TypeParameterDeclaration[]
): [ts.TypeParameterDeclaration[], ts.TypeReferenceNode[]] => {
  const {
    interfaceTypeParameters,
    propertyTypeTypeArguments,
  } = typeParameters.reduce<{
    interfaceTypeParameters: ts.TypeParameterDeclaration[];
    propertyTypeTypeArguments: ts.TypeReferenceNode[];
  }>(
    (acc, tp, idx) => {
      const interfaceTypeParameterIdentifier = ts.createIdentifier(
        Transform.interfaceTypeParameterName(
          typeParameters.length > 1
            ? `${attributeName}_${idx.toString()}_type`
            : `${attributeName}_type`
        )
      );

      acc.interfaceTypeParameters.push(
        ts.createTypeParameterDeclaration(
          interfaceTypeParameterIdentifier,
          undefined,
          tp.default
        )
      );
      acc.propertyTypeTypeArguments.push(
        ts.createTypeReferenceNode(interfaceTypeParameterIdentifier, undefined)
      );
      return acc;
    },
    { interfaceTypeParameters: [], propertyTypeTypeArguments: [] }
  );

  return [interfaceTypeParameters, propertyTypeTypeArguments];
};
