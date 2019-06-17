import { buildAst } from '..';

import { ClassType } from '../../schema/definitions';

describe('buildAst', () => {
  test('should', () => {
    const ast = buildAst([
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
        ],
      },
    ]);

    expect(ast).toMatchSnapshot();
  });
});
