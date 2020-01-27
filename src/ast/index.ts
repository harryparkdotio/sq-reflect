import * as ts from 'typescript';
import * as Case from 'change-case';

import { flatten } from '../utils';
import {
  ClassDefinition,
  AttributeDefinition,
  EnumDefinition,
} from '../schema/definitions';
import { OidMap, typeGetterFn, TypeGetterFn } from '../schema/types';

import { genericTypeTransformer } from './transformers/generic-type';
import { isIdentifier } from './identifiers';

export const Transform = {
  enumName: (text: string) => Case.pascal(text),
  enumMember: (text: string) => Case.constant(text),
  interfaceName: (text: string) => Case.pascal(text),
  interfaceTypeParameterName: (text: string) => Case.pascal(text),
  interfacePropertyName: (text: string) => Case.snake(text),
};

export const getTypeFromAttribute = (
  attribute: AttributeDefinition,
  typeGetter: TypeGetterFn
): [ts.TypeNode] | [ts.TypeNode, ts.TypeNode] => {
  const typeNode =
    typeGetter(attribute.type.id) ||
    ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);

  if (attribute.nullable) {
    return [typeNode, ts.createNull()];
  }

  return [typeNode];
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

export const buildEnum = (
  definition: EnumDefinition
): [ts.EnumDeclaration, OidMap] => {
  const enumDeclaration = ts.createEnumDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.createIdentifier(Transform.enumName(definition.name)),
    definition.values.map(value =>
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

  const customOidMap: OidMap = { [definition.id]: enumTypeReference };

  if (definition.arr_id) {
    customOidMap[definition.arr_id] = ts.createArrayTypeNode(enumTypeReference);
  }

  return [enumDeclaration, customOidMap];
};

export const buildAttribute = (
  attribute: AttributeDefinition,
  typeGetter: TypeGetterFn
): [ts.TypeParameterDeclaration[], ts.PropertySignature] => {
  const attributeType = getTypeFromAttribute(attribute, typeGetter);

  const [genericType, genericTypeTypeParameters] = getGenericType(
    attribute.name,
    attributeType
  );

  const propertySignature = ts.createPropertySignature(
    undefined,
    ts.createIdentifier(Transform.interfacePropertyName(attribute.name)),
    undefined,
    ts.createUnionTypeNode(genericType),
    undefined
  );

  return [genericTypeTypeParameters, propertySignature];
};

export const buildClass = (
  _class: ClassDefinition,
  typeGetter: TypeGetterFn
): ts.InterfaceDeclaration => {
  const interfaceNameIdentifier = ts.createIdentifier(
    Transform.interfaceName(_class.name)
  );

  const attributes = _class.attributes.map(a => buildAttribute(a, typeGetter));

  const interfaceTypeParameters: ts.TypeParameterDeclaration[] = flatten(
    attributes.map(a => a[0])
  );
  const interfaceMembers: ts.TypeElement[] = attributes.map(a => a[1]);

  const interfaceDeclaration = ts.createInterfaceDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    interfaceNameIdentifier,
    interfaceTypeParameters,
    undefined,
    interfaceMembers
  );

  return interfaceDeclaration;
};

export const buildAst = (
  classes: ClassDefinition[],
  enums: EnumDefinition[]
) => {
  const assembledEnums = enums.map(e => buildEnum(e));
  const enumTypeReferences = assembledEnums.map(e => e[1]);

  const assembledClasses = classes.map(c =>
    buildClass(c, typeGetterFn(...enumTypeReferences))
  );

  const statements: ts.Statement[] = [
    ...assembledEnums.map(e => e[0]),
    ...assembledClasses,
  ];

  return statements;
};
