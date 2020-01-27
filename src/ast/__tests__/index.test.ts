import * as ts from 'typescript';

import {
  ClassType,
  ClassDefinition,
  EnumDefinition,
  AttributeDefinition,
} from '../../schema/definitions';
import { TypeGetterFn } from '../../schema/types';

import {
  buildAst,
  getTypeFromAttribute,
  buildEnum,
  buildAttribute,
  buildClass,
} from '..';

describe('getTypeFromAttribute', () => {
  test('should return correct type', () => {
    const attribute: AttributeDefinition = {
      name: 'id',
      nullable: false,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    const typeGetterFn: TypeGetterFn = () =>
      ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

    expect(getTypeFromAttribute(attribute, typeGetterFn)).toMatchSnapshot();
  });

  test('should return correct nullable type', () => {
    const attribute: AttributeDefinition = {
      name: 'id',
      nullable: true,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    const typeGetterFn: TypeGetterFn = () =>
      ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

    expect(getTypeFromAttribute(attribute, typeGetterFn)).toMatchSnapshot();
  });

  test('should return any when type unknown', () => {
    const attribute: AttributeDefinition = {
      name: 'id',
      nullable: false,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    const typeGetterFn: TypeGetterFn = () => null;

    expect(getTypeFromAttribute(attribute, typeGetterFn)).toMatchSnapshot();
  });

  test('should return any | null when type unknown but nullable', () => {
    const attribute: AttributeDefinition = {
      name: 'id',
      nullable: true,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    const typeGetterFn: TypeGetterFn = () => null;

    expect(getTypeFromAttribute(attribute, typeGetterFn)).toMatchSnapshot();
  });
});

describe('buildEnum', () => {
  test('should return enum declaration', () => {
    const enumDefinition: EnumDefinition = {
      id: 99999,
      name: 'enum_type_type_type',
      namespace_id: 2200,
      namespace: 'public',
      arr_id: null,
      arr_name: null,
      values: ['C', 'D'],
    };

    const [declaration, reference] = buildEnum(enumDefinition);

    expect(declaration).toMatchSnapshot();
    expect(reference).toMatchSnapshot();
  });

  test('should return enum declaration with array declaration', () => {
    const enumDefinition: EnumDefinition = {
      id: 99999,
      name: 'enum_type_type_type',
      namespace_id: 2200,
      namespace: 'public',
      arr_id: 100000,
      arr_name: '_enum_type_type_type',
      values: ['C', 'D'],
    };

    const [declaration, reference] = buildEnum(enumDefinition);

    expect(declaration).toMatchSnapshot();
    expect(reference).toMatchSnapshot();
  });
});

describe('buildAttribute', () => {
  test('should return interface property declaration', () => {
    const attributeDefinition: AttributeDefinition = {
      name: 'id',
      nullable: false,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    expect(
      buildAttribute(attributeDefinition, () =>
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      )
    ).toMatchSnapshot();
  });

  test('should return nullable interface property declaration', () => {
    const attributeDefinition: AttributeDefinition = {
      name: 'id',
      nullable: true,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    expect(
      buildAttribute(attributeDefinition, () =>
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      )
    ).toMatchSnapshot();
  });

  test('should return generic interface property declaration', () => {
    const attributeDefinition: AttributeDefinition = {
      name: 'id',
      nullable: false,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    expect(
      buildAttribute(attributeDefinition, () =>
        ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword)
      )
    ).toMatchSnapshot();
  });

  test('should return nullable generic interface property declaration', () => {
    const attributeDefinition: AttributeDefinition = {
      name: 'id',
      nullable: true,
      number: 1,
      default: 'uuid_generate_v4()',
      type: {
        id: 2950,
        name: 'uuid',
        namespace_id: 11,
        namespace: 'pg_catalog',
      },
    };

    expect(
      buildAttribute(attributeDefinition, () =>
        ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword)
      )
    ).toMatchSnapshot();
  });
});

describe('buildClass', () => {
  test('should return interface declaration', () => {
    const classDefinition = {
      id: 1000,
      name: 'user',
      namespace_id: 2200,
      namespace: 'public',
      type: ClassType.TABLE,
      attributes: [
        {
          name: 'id',
          nullable: false,
          number: 1,
          default: 'uuid_generate_v4()',
          type: {
            id: 2950,
            name: 'uuid',
            namespace_id: 11,
            namespace: 'pg_catalog',
          },
        },
        {
          name: 'default',
          number: 2,
          nullable: false,
          default: 'false',
          type: {
            id: 10,
            name: 'bool',
            namespace_id: 11,
            namespace: 'pg_catalog',
          },
        },
        {
          name: 'metadata',
          number: 3,
          nullable: false,
          default: null,
          type: {
            id: 114,
            name: 'json',
            namespace_id: 11,
            namespace: 'pg_catalog',
          },
        },
        {
          name: 'created_at',
          number: 4,
          nullable: false,
          default: 'now()',
          type: {
            id: 1184,
            name: 'timestamptz',
            namespace_id: 11,
            namespace: 'pg_catalog',
          },
        },
        {
          name: 'deleted_at',
          number: 5,
          nullable: true,
          default: null,
          type: {
            id: 1184,
            name: 'timestamptz',
            namespace_id: 11,
            namespace: 'pg_catalog',
          },
        },
        {
          name: 'type',
          number: 6,
          nullable: true,
          default: null,
          type: {
            id: 10001,
            name: '_enum_type_type',
            namespace_id: 2200,
            namespace: 'public',
          },
        },
        {
          name: 'type_type',
          number: 7,
          nullable: false,
          default: 'A',
          type: {
            id: 99999,
            name: 'enum_type_type_type',
            namespace_id: 2200,
            namespace: 'public',
          },
        },
      ],
    };

    expect(
      buildClass(classDefinition, () =>
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      )
    ).toMatchSnapshot();
  });
});

describe('buildAst', () => {
  test('should', () => {
    const classes: ClassDefinition[] = [
      {
        id: 1000,
        name: 'user',
        namespace_id: 2200,
        namespace: 'public',
        type: ClassType.TABLE,
        attributes: [
          {
            name: 'id',
            nullable: false,
            number: 1,
            default: 'uuid_generate_v4()',
            type: {
              id: 2950,
              name: 'uuid',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'default',
            number: 2,
            nullable: false,
            default: 'false',
            type: {
              id: 10,
              name: 'bool',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'metadata',
            number: 3,
            nullable: false,
            default: null,
            type: {
              id: 114,
              name: 'json',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'created_at',
            number: 4,
            nullable: false,
            default: 'now()',
            type: {
              id: 1184,
              name: 'timestamptz',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'deleted_at',
            number: 5,
            nullable: true,
            default: null,
            type: {
              id: 1184,
              name: 'timestamptz',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'type',
            number: 6,
            nullable: true,
            default: null,
            type: {
              id: 10001,
              name: '_enum_type_type',
              namespace_id: 2200,
              namespace: 'public',
            },
          },
          {
            name: 'type_type',
            number: 7,
            nullable: false,
            default: 'A',
            type: {
              id: 99999,
              name: 'enum_type_type_type',
              namespace_id: 2200,
              namespace: 'public',
            },
          },
        ],
      },
    ];

    const enums: EnumDefinition[] = [
      {
        id: 99999,
        name: 'enum_type_type_type',
        namespace_id: 2200,
        namespace: 'public',
        arr_id: null,
        arr_name: null,
        values: ['C', 'D'],
      },
      {
        id: 10000,
        name: 'enum_type_type',
        namespace_id: 2200,
        namespace: 'public',
        arr_id: 10001,
        arr_name: '_enum_type_type',
        values: ['A', 'B'],
      },
    ];

    const ast = buildAst(classes, enums);

    expect(ast).toMatchSnapshot();
  });
});
