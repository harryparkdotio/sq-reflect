import * as ts from 'typescript';

import { getTypeFromOid } from '../types';

describe('getTypeFromOid', () => {
  it('should return null when oid = 0 (unknown)', () => {
    expect(getTypeFromOid(0)).toBeNull();
  });

  it('should return Boolean when oid = 16 (bool)', () => {
    const typeFromOid = getTypeFromOid(16) as ts.TypeNode;

    expect(typeFromOid).not.toBeNull();
    expect(ts.isTypeNode(typeFromOid)).toBeTruthy();
    expect(typeFromOid.kind).toEqual(ts.SyntaxKind.BooleanKeyword);
  });

  it('should return Number when oid = 23 (int4)', () => {
    const typeFromOid = getTypeFromOid(23) as ts.TypeNode;

    expect(typeFromOid).not.toBeNull();
    expect(ts.isTypeNode(typeFromOid)).toBeTruthy();
    expect(typeFromOid.kind).toEqual(ts.SyntaxKind.NumberKeyword);
  });

  it('should return String when oid = 25 (text)', () => {
    const typeFromOid = getTypeFromOid(25) as ts.TypeNode;

    expect(typeFromOid).not.toBeNull();
    expect(ts.isTypeNode(typeFromOid)).toBeTruthy();
    expect(typeFromOid.kind).toEqual(ts.SyntaxKind.StringKeyword);
  });

  it('should return Object when oid = 114 (json)', () => {
    const typeFromOid = getTypeFromOid(114) as ts.TypeNode;

    expect(typeFromOid).not.toBeNull();
    expect(ts.isTypeNode(typeFromOid)).toBeTruthy();
    expect(typeFromOid.kind).toEqual(ts.SyntaxKind.ObjectKeyword);
  });

  it('should return Object when oid = 869 (inet)', () => {
    const typeFromOid = getTypeFromOid(869) as ts.TypeNode;

    expect(typeFromOid).not.toBeNull();
    expect(ts.isTypeNode(typeFromOid)).toBeTruthy();
    expect(typeFromOid.kind).toEqual(ts.SyntaxKind.AnyKeyword);
  });

  it('should return Date when oid = 1184 (timestamptz)', () => {
    const typeFromOid = getTypeFromOid(1184) as ts.TypeNode;

    expect(typeFromOid).not.toBeNull();
    expect(ts.isTypeNode(typeFromOid)).toBeTruthy();
    expect(typeFromOid.kind).toEqual(ts.SyntaxKind.TypeReference);
  });

  it('should return DateArray when oid = 1185 (_timestamptz)', () => {
    const typeFromOid = getTypeFromOid(1185) as ts.TypeNode;

    expect(typeFromOid).not.toBeNull();
    expect(ts.isTypeNode(typeFromOid)).toBeTruthy();
    expect(typeFromOid.kind).toEqual(ts.SyntaxKind.ArrayType);
  });
});
