import * as ts from 'typescript';
import { ClassDefinition, AttributeDefinition } from '../schema/definitions';
import { getTypeFromOid } from '../schema/types';

import * as Case from 'change-case';
import { genericTypeTransformer } from './transformers/generic-type';
import { isIdentifier } from './identifiers';

export const Transform = {
  namespaceName: (text: string) => Case.pascal(text),
  namespaceTypeAliasName: (text: string) => Case.camel(text),
  interfaceName: (text: string) => Case.pascal(text),
  interfaceTypeParameterName: (text: string) => Case.pascal(text),
  interfacePropertyName: (text: string) => Case.snake(text),
};

const getTypeFromAttribute = (
  attribute: AttributeDefinition
): ts.TypeNode[] => {
  const typeNodeArray: ts.TypeNode[] = [
    getTypeFromOid(attribute.type.id) ||
      ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
  ];

  if (attribute.nullable) {
    typeNodeArray.push(ts.createNull());
  }

  return typeNodeArray;
};

const getGenericType = (
  typeNode: ts.TypeNode | ts.TypeNode[]
): [ts.TypeNode[], ts.TypeParameterDeclaration[]] => {
  const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
  const transformers: ts.TransformerFactory<ts.TypeNode>[] = [
    genericTypeTransformer(typeParameterReferenceArray),
  ];

  return [
    ts.transform(typeNode, transformers).transformed,
    typeParameterReferenceArray,
  ];
};

const getGenericInterfacePropertyTypeParametersFrom = (
  attributeName: string,
  typeParameters: ts.TypeParameterDeclaration[]
): [ts.TypeParameterDeclaration[], ts.TypeReferenceNode[]] => {
  const interfaceTypeParameters: ts.TypeParameterDeclaration[] = [];
  const propertyTypeTypeArguments: ts.TypeReferenceNode[] = [];

  typeParameters.forEach((tp, idx) => {
    const interfaceTypeParameterIdentifier = ts.createIdentifier(
      Transform.interfaceTypeParameterName(
        /* istanbul ignore next */
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

const makeIdentifier = (s: string): ts.Identifier =>
  (isIdentifier(s) && ts.createIdentifier(s)) || makeIdentifier(s + '_');

export const buildAst = (classes: ClassDefinition[]) => {
  const statements: ts.Statement[] = [];

  classes.forEach(_class => {
    const namespaceNameIdentifier = ts.createIdentifier(
      Transform.namespaceName([_class.name, 'fields'].toString())
    );
    const interfaceNameIdentifier = ts.createIdentifier(
      Transform.interfaceName(_class.name)
    );

    const interfaceTypeParameters: ts.TypeParameterDeclaration[] = [];
    const namespaceBodyStatements: ts.Statement[] = [];
    const interfaceMembers: ts.TypeElement[] = [];

    _class.attributes.forEach(attribute => {
      const attributeType = getTypeFromAttribute(attribute);

      const [genericType, genericTypeTypeParameters] = getGenericType(
        attributeType
      );

      const typeAliasDeclaration = ts.createTypeAliasDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)],
        makeIdentifier(Transform.namespaceTypeAliasName(attribute.name)),
        genericTypeTypeParameters,
        ts.createUnionTypeNode(genericType)
      );

      const namespaceTypeAliasReference = ts.createQualifiedName(
        namespaceNameIdentifier,
        typeAliasDeclaration.name
      );

      namespaceBodyStatements.push(typeAliasDeclaration);

      const [
        interfaceTypeParametersForProperty,
        propertyTypeTypeArguments,
      ] = getGenericInterfacePropertyTypeParametersFrom(
        attribute.name,
        genericTypeTypeParameters
      );

      interfaceTypeParameters.push(...interfaceTypeParametersForProperty);

      const propertyDeclaration = ts.createPropertySignature(
        undefined,
        ts.createIdentifier(Transform.interfacePropertyName(attribute.name)),
        undefined,
        ts.createTypeReferenceNode(
          namespaceTypeAliasReference,
          propertyTypeTypeArguments
        ),
        undefined
      );

      interfaceMembers.push(propertyDeclaration);
    });

    const namespaceDeclaration = ts.createModuleDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      namespaceNameIdentifier,
      ts.createModuleBlock(namespaceBodyStatements),
      ts.NodeFlags.Namespace
    );

    const interfaceDeclaration = ts.createInterfaceDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      interfaceNameIdentifier,
      interfaceTypeParameters,
      undefined,
      interfaceMembers
    );

    statements.push(namespaceDeclaration, interfaceDeclaration);
  });

  return statements;
};
