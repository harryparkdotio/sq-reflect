import * as ts from 'typescript';

const createTypeReferenceIdentifier = (text: string): ts.TypeReferenceNode =>
  ts.createTypeReferenceNode(ts.createIdentifier(text), undefined);

const primitiveTypes = {
  Number: ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  String: ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  Boolean: ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
  Any: ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
  Object: ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword),
  Date: createTypeReferenceIdentifier('Date'),
  Point: createTypeReferenceIdentifier('Point'),
  Circle: createTypeReferenceIdentifier('Circle'),
  Interval: createTypeReferenceIdentifier('Interval'),
  Buffer: createTypeReferenceIdentifier('Buffer'),
};

const arrayTypes = {
  NumberArray: ts.createArrayTypeNode(primitiveTypes.Number),
  StringArray: ts.createArrayTypeNode(primitiveTypes.String),
  BooleanArray: ts.createArrayTypeNode(primitiveTypes.Boolean),
  AnyArray: ts.createArrayTypeNode(primitiveTypes.Any),
  ObjectArray: ts.createArrayTypeNode(primitiveTypes.Object),
  DateArray: ts.createArrayTypeNode(primitiveTypes.Date),
  PointArray: ts.createArrayTypeNode(primitiveTypes.Point),
  CircleArray: ts.createArrayTypeNode(primitiveTypes.Circle),
  IntervalArray: ts.createArrayTypeNode(primitiveTypes.Interval),
  BufferArray: ts.createArrayTypeNode(primitiveTypes.Buffer),
};

const types = {
  ...primitiveTypes,
  ...arrayTypes,
};

export type OidMap = { [oid: number]: ts.TypeNode };

export const oidMap: Readonly<OidMap> = {
  16: types.Boolean, // bool
  17: types.Buffer, // bytea
  18: types.String, // char
  19: types.String, // name
  20: types.String, // int8
  21: types.Number, // int2
  23: types.Number, // int4
  25: types.String, // text
  26: types.String, // oid
  27: types.String, // tid
  28: types.String, // xid
  29: types.String, // cid
  114: types.Object, // json
  142: types.String, // xml
  143: types.StringArray, // _xml
  194: types.Any, // pg_node_tree
  199: types.ObjectArray, // _json
  210: types.Any, // smgr
  600: types.Point, // point
  601: types.Any, // lseg
  602: types.Any, // path
  603: types.Any, // box
  604: types.Any, // polygon
  628: types.Any, // line
  629: types.AnyArray, // _line
  650: types.Any, // cidr
  651: types.AnyArray, // _cidr
  700: types.Number, // float4
  701: types.Number, // float8
  702: types.Any, // abstime
  703: types.Any, // reltime
  704: types.Any, // tinterval
  718: types.Circle, // circle
  719: types.CircleArray, // _circle
  774: types.Any, // macaddr8
  775: types.AnyArray, // _macaddr8
  790: types.Any, // money
  791: types.AnyArray, // _money
  829: types.Any, // macaddr
  869: types.Any, // inet
  1000: types.BooleanArray, // _bool
  1001: types.BufferArray, // _bytea
  1002: types.StringArray, // _char
  1003: types.StringArray, // _name
  1005: types.NumberArray, // _int2
  1007: types.NumberArray, // _int4
  1009: types.StringArray, // _text
  1010: types.StringArray, // _tid
  1011: types.StringArray, // _xid
  1012: types.StringArray, // _cid
  1014: types.AnyArray, // _bpchar
  1015: types.StringArray, // _varchar
  1016: types.StringArray, // _int8
  1017: types.PointArray, // _point
  1018: types.AnyArray, // _lseg
  1019: types.AnyArray, // _path
  1020: types.AnyArray, // _box
  1021: types.NumberArray, // _float4
  1022: types.NumberArray, // _float8
  1023: types.AnyArray, // _abstime
  1024: types.AnyArray, // _reltime
  1025: types.AnyArray, // _tinterval
  1027: types.AnyArray, // _polygon
  1028: types.StringArray, // _oid
  1033: types.Any, // aclitem
  1034: types.AnyArray, // _aclitem
  1040: types.AnyArray, // _macaddr
  1041: types.AnyArray, // _inet
  1042: types.Any, // bpchar
  1043: types.String, // varchar
  1082: types.Date, // date
  1083: types.Date, // time
  1114: types.Date, // timestamp
  1115: types.DateArray, // _timestamp
  1182: types.DateArray, // _date
  1183: types.DateArray, // _time
  1184: types.Date, // timestamptz
  1185: types.DateArray, // _timestamptz
  1186: types.Interval, // interval
  1187: types.IntervalArray, // _interval
  1231: types.StringArray, // numeric
  1266: types.Any, // timetz
  1270: types.AnyArray, // _timetz
  1562: types.Any, // varbit
  1563: types.AnyArray, // _varbit
  1700: types.String, // numeric
  2949: types.AnyArray, // _txid_snapshot
  2950: types.String, // uuid
  2951: types.StringArray, // _uuid
  2970: types.Any, // txid_snapshot
  3220: types.Any, // pg_lsn
  3221: types.AnyArray, // _pg_lsn
  3361: types.Any, // pg_ndistinct
  3402: types.Any, // pg_dependencies
  3614: types.Any, // tsvector
  3615: types.Any, // tsquery
  3642: types.Any, // gtsvector
  3643: types.AnyArray, // _tsvector
  3644: types.AnyArray, // _gtsvector
  3645: types.AnyArray, // _tsquery
  3802: types.Object, // jsonb
  3807: types.ObjectArray, // _jsonb
};

export type TypeGetterFn = (oid: number) => ts.TypeNode | null;

export const typeGetterFn = (...customOidMaps: OidMap[]): TypeGetterFn => oid =>
  Object.assign(oidMap, ...customOidMaps)[oid] || null;
