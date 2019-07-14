import * as ts from 'typescript';
import * as Case from 'change-case';

import {
  ClassDefinition,
  AttributeDefinition,
  EnumDefinition,
} from '../schema/definitions';
import { getTypeFromOid, addTypeByOid } from '../schema/types';

import { genericTypeTransformer } from './transformers/generic-type';
import { isIdentifier } from './identifiers';

export const Transform = {
  enumName: (text: string) => Case.pascal(text),
  enumMember: (text: string) => Case.constant(text),
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
  attributeName: string,
  typeNode: ts.TypeNode | ts.TypeNode[]
): [ts.TypeNode[], ts.TypeParameterDeclaration[]] => {
  const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
  const transformers: ts.TransformerFactory<ts.TypeNode>[] = [
    genericTypeTransformer(attributeName, typeParameterReferenceArray),
  ];

  return [
    ts.transform(typeNode, transformers).transformed,
    typeParameterReferenceArray,
  ];
};

/* istanbul ignore next */
const makeIdentifier = (s: string): ts.Identifier =>
  (isIdentifier(s) && ts.createIdentifier(s)) || makeIdentifier(s + '_');

export const buildAst = (
  classes: ClassDefinition[],
  enums: EnumDefinition[]
) => {
  const statements: ts.Statement[] = [];

  enums.forEach(enm => {
    const enumDeclaration = ts.createEnumDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.createIdentifier(Transform.enumName(enm.name)),
      enm.values.map(value =>
        ts.createEnumMember(
          makeIdentifier(Transform.enumMember(value)),
          ts.createStringLiteral(value)
        )
      )
    );

    const enumTypeReference = ts.createTypeReferenceNode(
      enumDeclaration.name,
      undefined
    );

    addTypeByOid(enm.id, enumTypeReference);

    if (enm.arr_id) {
      addTypeByOid(enm.arr_id, ts.createArrayTypeNode(enumTypeReference));
    }

    statements.push(enumDeclaration);
  });

  classes.forEach(_class => {
    const interfaceNameIdentifier = ts.createIdentifier(
      Transform.interfaceName(_class.name)
    );

    const interfaceTypeParameters: ts.TypeParameterDeclaration[] = [];
    const interfaceMembers: ts.TypeElement[] = [];

    _class.attributes.forEach(attribute => {
      const attributeType = getTypeFromAttribute(attribute);

      const [genericType, genericTypeTypeParameters] = getGenericType(
        attribute.name,
        attributeType
      );

      interfaceTypeParameters.push(...genericTypeTypeParameters);

      const propertyDeclaration = ts.createPropertySignature(
        undefined,
        ts.createIdentifier(Transform.interfacePropertyName(attribute.name)),
        undefined,
        ts.createUnionTypeNode(genericType),
        undefined
      );

      interfaceMembers.push(propertyDeclaration);
    });

    const interfaceDeclaration = ts.createInterfaceDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      interfaceNameIdentifier,
      interfaceTypeParameters,
      undefined,
      interfaceMembers
    );

    statements.push(interfaceDeclaration);
  });

  return statements;
};
