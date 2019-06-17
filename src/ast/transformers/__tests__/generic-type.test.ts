import * as ts from 'typescript';
import { genericTypeTransformer } from '../generic-type';

const transform = <T extends ts.Node>(
  node: T | T[],
  transformer: ts.TransformerFactory<T>
): T[] => ts.transform(node, [transformer]).transformed;

describe('genericTypeTransformer', () => {
  test('should transform generic types from primitive to generic', () => {
    const node = ts.createArrayTypeNode(
      ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
    );

    const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
    const transformer = genericTypeTransformer(typeParameterReferenceArray);

    const result = transform(node, transformer);

    expect(result).toMatchSnapshot();
    expect(typeParameterReferenceArray).toMatchSnapshot();
  });

  test('should transform generic types from primitive to generic', () => {
    const node = ts.createUnionTypeNode([
      ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
      ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword),
    ]);

    const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
    const transformer = genericTypeTransformer(typeParameterReferenceArray);

    const result = transform(node, transformer);

    expect(result).toMatchSnapshot();
    expect(typeParameterReferenceArray).toMatchSnapshot();
  });

  test('should transform generic types from primitive to generic', () => {
    const node = ts.createIntersectionTypeNode([
      ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
      ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword),
    ]);

    const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
    const transformer = genericTypeTransformer(typeParameterReferenceArray);

    const result = transform(node, transformer);

    expect(result).toMatchSnapshot();
    expect(typeParameterReferenceArray).toMatchSnapshot();
  });

  test('should transform generic types from primitive to generic', () => {
    const node = ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

    const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
    const transformer = genericTypeTransformer(typeParameterReferenceArray);

    const result = transform(node, transformer);

    expect(result).toMatchSnapshot();
    expect(typeParameterReferenceArray).toMatchSnapshot();
  });

  test('should not transform generic types in type literal from primitive to generic', () => {
    const node = ts.createTypeLiteralNode([
      ts.createPropertySignature(
        undefined,
        ts.createIdentifier('a'),
        undefined,
        ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
        undefined
      ),
      ts.createPropertySignature(
        undefined,
        ts.createIdentifier('b'),
        undefined,
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        undefined
      ),
    ]);

    const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
    const transformer = genericTypeTransformer(typeParameterReferenceArray);

    const result = transform(node, transformer);

    expect(result).toMatchSnapshot();
    expect(typeParameterReferenceArray).toMatchSnapshot();
  });

  test('should', () => {
    const node = ts.createTypeReferenceNode(ts.createIdentifier('Array'), [
      ts.createTypeReferenceNode(ts.createIdentifier('Record'), [
        ts.createLiteralTypeNode(ts.createNumericLiteral('7')),
        ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
      ]),
    ]);

    const typeParameterReferenceArray: ts.TypeParameterDeclaration[] = [];
    const transformer = genericTypeTransformer(typeParameterReferenceArray);

    const result = transform(node, transformer);

    expect(result).toMatchSnapshot();
    expect(typeParameterReferenceArray).toMatchSnapshot();
  });
});
