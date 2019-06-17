import * as ts from 'typescript';

import { Transform } from '..';

export const getGenericInterfacePropertiesFromTypeParameters = (
  attributeName: string,
  typeParameters: ts.TypeParameterDeclaration[]
): [ts.TypeParameterDeclaration[], ts.TypeReferenceNode[]] => {
  const interfaceTypeParameters: ts.TypeParameterDeclaration[] = [];
  const propertyTypeTypeArguments: ts.TypeReferenceNode[] = [];

  typeParameters.forEach((tp, idx) => {
    const interfaceTypeParameterIdentifier = ts.createIdentifier(
      Transform.interfaceTypeParameterName(
        typeParameters.length > 1
          ? `${attributeName}_${idx.toString()}_type`
          : `${attributeName}_type`
      )
    );

    interfaceTypeParameters.push(
      ts.createTypeParameterDeclaration(
        interfaceTypeParameterIdentifier,
        undefined,
        tp.default
      )
    );

    propertyTypeTypeArguments.push(
      ts.createTypeReferenceNode(interfaceTypeParameterIdentifier, undefined)
    );
  });

  return [interfaceTypeParameters, propertyTypeTypeArguments];
};
