import * as ts from 'typescript';

import { isGenericType } from '../types';

describe('isGenericType', () => {
  test('should return true for AnyKeyword', () => {
    expect(
      isGenericType(ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword))
    ).toBeTruthy();
  });

  test('should return true for ObjectKeyword', () => {
    expect(
      isGenericType(ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword))
    ).toBeTruthy();
  });

  test('should return false for StringKeyword', () => {
    expect(
      isGenericType(ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword))
    ).toBeFalsy();
  });
});
