import {
  ClassType,
  ClassDefinition,
  EnumDefinition,
} from '../../schema/definitions';

import { buildAst } from '..';

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
