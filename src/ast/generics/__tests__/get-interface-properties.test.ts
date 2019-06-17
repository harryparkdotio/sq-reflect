import * as ts from 'typescript';
import { getGenericInterfacePropertiesFromTypeParameters } from '../get-interface-properties';

describe('getGenericInterfacePropertiesFromTypeParameters', () => {
  test('should', () => {
    expect(
      getGenericInterfacePropertiesFromTypeParameters('abcd', [
        ts.createTypeParameterDeclaration(
          'aaa',
          undefined,
          ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        ),
      ])
    ).toMatchSnapshot();
  });

  test('should', () => {
    expect(
      getGenericInterfacePropertiesFromTypeParameters('abcd', [
        ts.createTypeParameterDeclaration(
          'abc',
          undefined,
          ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        ),
        ts.createTypeParameterDeclaration(
          'def',
          undefined,
          ts.createUnionTypeNode([
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword),
          ])
        ),
      ])
    ).toMatchSnapshot();
  });
});
