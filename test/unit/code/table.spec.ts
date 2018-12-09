import * as dedent from 'dedent';

import { Code } from '../../../src/code';
import { CamelCaseNamingStrategy, SnakeCaseNamingStrategy } from '../../../src/code/naming-strategy';
import { TableDefinition } from '../../../src/sql/definitions';

const definition: TableDefinition = {
  name: 'users',
  columns: [
    {
      name: 'id',
      type: {
        nullable: false,
        sql: 'int4',
        alt: 'integer',
        type: 'number',
        schema: 'pg_catalog',
      },
    },
    {
      name: 'first_name',
      type: {
        nullable: true,
        sql: 'varchar',
        alt: 'character varying',
        type: 'string',
        schema: 'pg_catalog',
      },
    },
    {
      name: 'Status',
      type: {
        nullable: false,
        sql: 'user_status',
        alt: null,
        type: null,
        schema: 'public',
      },
    },
    {
      name: 'exists',
      type: {
        nullable: false,
        sql: 'user_exists',
        alt: null,
        type: null,
        schema: 'public',
      },
    },
  ],
};

describe('table', () => {
  it('should return table source', () => {
    const code = new Code();

    code.define('user_status');

    const source = code.table(definition);

    expect(source).toBe(dedent`
      export namespace users_fields {
        export type id = number;
        export type first_name = string | null;
        export type Status = user_status;
        export type exists = any;
      }

      export interface users {
        id: users_fields.id;
        first_name: users_fields.first_name;
        Status: users_fields.Status;
        exists: users_fields.exists;
      }
    `);
  });

  it('should return enum source using SnakeCaseNamingStrategy', () => {
    const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

    code.define('user_status');

    const source = code.table(definition);

    expect(source).toBe(dedent`
      export namespace users_fields {
        export type id = number;
        export type first_name = string | null;
        export type status = user_status;
        export type exists = any;
      }

      export interface users {
        id: users_fields.id;
        first_name: users_fields.first_name;
        status: users_fields.status;
        exists: users_fields.exists;
      }
    `);
  });

  it('should return enum source using CamelCaseNamingStrategy', () => {
    const code = new Code({ namingStrategy: new CamelCaseNamingStrategy() });

    code.define('user_status');

    const source = code.table(definition);

    expect(source).toBe(dedent`
      export namespace UsersFields {
        export type id = number;
        export type firstName = string | null;
        export type status = UserStatus;
        export type exists = any;
      }

      export interface Users {
        id: UsersFields.id;
        firstName: UsersFields.firstName;
        status: UsersFields.status;
        exists: UsersFields.exists;
      }
    `);
  });

  it('should transform table name if reserved keyword', () => {
    const code = new Code();

    const source = code.table({
      name: 'default',
      columns: [],
    });

    expect(source).toBe(dedent`
      export namespace default_fields {\n  \n}

      export interface default_ {\n  \n}
    `);
  });

  it('should transform namespace type name if reserved keyword', () => {
    const code = new Code();

    const source = code.table({
      name: 'users',
      columns: [
        {
          name: 'default',
          type: {
            nullable: false,
            alt: null,
            type: 'string',
            sql: '',
            schema: 'pg_catalog',
          },
        },
      ],
    });

    expect(source).toBe(dedent`
      export namespace users_fields {
        export type default_ = string;
      }

      export interface users {
        default: users_fields.default_;
      }
    `);
  });

  it('should fallback to any for unknown type', () => {
    const code = new Code();

    const source = code.table({
      name: 'users',
      columns: [
        {
          name: 'field',
          type: {
            nullable: false,
            alt: null,
            type: null,
            sql: 'custom_type',
            schema: 'public',
          },
        },
      ],
    });

    expect(source).toBe(dedent`
      export namespace users_fields {
        export type field = any;
      }

      export interface users {
        field: users_fields.field;
      }
    `);
  });

  it('should use udt if defined', () => {
    const code = new Code();

    code.define('custom_type');

    const source = code.table({
      name: 'users',
      columns: [
        {
          name: 'field',
          type: {
            nullable: false,
            alt: null,
            type: null,
            sql: 'custom_type',
            schema: 'public',
          },
        },
      ],
    });

    expect(source).toBe(dedent`
      export namespace users_fields {
        export type field = custom_type;
      }

      export interface users {
        field: users_fields.field;
      }
    `);
  });
});
