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
        default: null,
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
        default: null,
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
        default: null,
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
        default: 'true',
      },
    },
  ],
};

const genericsDefinition: TableDefinition = {
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
        default: null,
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
        default: null,
      },
    },
    {
      name: 'Status',
      type: {
        nullable: false,
        sql: 'json',
        alt: null,
        type: 'object',
        schema: 'public',
        default: null,
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
        default: 'true',
      },
    },
  ],
};

describe('table', () => {
  describe('source', () => {
    it('should return table source using SnakeCaseNamingStrategy', () => {
      const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

      code.define('user_status');

      const source = code.table(definition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type first_name = string | null;
          export type status = UserStatus;
          export type exists = any;
        }
  
        export interface Users {
          id: UsersFields.id;
          first_name: UsersFields.first_name;
          status: UsersFields.status;
          exists: UsersFields.exists;
        }
      `);
    });

    it('should return table source using CamelCaseNamingStrategy', () => {
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
  });

  it('should transform table name if reserved keyword', () => {
    const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

    const source = code.table({
      name: 'default',
      columns: [],
    });

    expect(source).toBe(dedent`
      export namespace DefaultFields {\n  \n}

      export interface Default {\n  \n}
    `);
  });

  it('should transform namespace type name if reserved keyword', () => {
    const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

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
            default: null,
          },
        },
      ],
    });

    expect(source).toBe(dedent`
      export namespace UsersFields {
        export type default_ = string;
      }

      export interface Users {
        default: UsersFields.default_;
      }
    `);
  });

  it('should fallback to any for unknown type', () => {
    const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

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
            default: null,
          },
        },
      ],
    });

    expect(source).toBe(dedent`
      export namespace UsersFields {
        export type field = any;
      }

      export interface Users {
        field: UsersFields.field;
      }
    `);
  });

  it('should use udt if defined', () => {
    const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

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
            default: null,
          },
        },
      ],
    });

    expect(source).toBe(dedent`
      export namespace UsersFields {
        export type field = CustomType;
      }

      export interface Users {
        field: UsersFields.field;
      }
    `);
  });

  describe('metadata', () => {
    it('should return table source with metadata using SnakeCaseNamingStrategy', () => {
      const code = new Code({ emitMetadata: true, namingStrategy: new SnakeCaseNamingStrategy() });

      code.define('user_status');

      const source = code.table(definition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type first_name = string | null;
          export type status = UserStatus;
          export type exists = any;
        }

        export interface Users {
          /** @type int4 */
          id: UsersFields.id;
          /** @type varchar */
          first_name: UsersFields.first_name;
          /** @type user_status */
          status: UsersFields.status;
          /** @type user_exists @default true */
          exists: UsersFields.exists;
        }
      `);
    });

    it('should return table source with metadata using CamelCaseNamingStrategy', () => {
      const code = new Code({ emitMetadata: true, namingStrategy: new CamelCaseNamingStrategy() });

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
          /** @type int4 */
          id: UsersFields.id;
          /** @type varchar */
          firstName: UsersFields.firstName;
          /** @type user_status */
          status: UsersFields.status;
          /** @type user_exists @default true */
          exists: UsersFields.exists;
        }
      `);
    });
  });

  describe('generics', () => {
    it('should return table source with generics using SnakeCaseNamingStrategy', () => {
      const code = new Code({ emitGenerics: true, namingStrategy: new SnakeCaseNamingStrategy() });

      code.define('user_status');

      const source = code.table(definition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type first_name = string | null;
          export type status = UserStatus;
          export type exists<T = any> = T;
        }

        export interface Users<ExistsType = any> {
          id: UsersFields.id;
          first_name: UsersFields.first_name;
          status: UsersFields.status;
          exists: UsersFields.exists<ExistsType>;
        }
      `);
    });

    it('should return table source with generics using CamelCaseNamingStrategy', () => {
      const code = new Code({ emitGenerics: true, namingStrategy: new CamelCaseNamingStrategy() });

      code.define('user_status');

      const source = code.table(definition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type firstName = string | null;
          export type status = UserStatus;
          export type exists<T = any> = T;
        }

        export interface Users<ExistsType = any> {
          id: UsersFields.id;
          firstName: UsersFields.firstName;
          status: UsersFields.status;
          exists: UsersFields.exists<ExistsType>;
        }
      `);
    });

    it('should return table source with multiple generics using SnakeCaseNamingStrategy', () => {
      const code = new Code({ emitGenerics: true, namingStrategy: new SnakeCaseNamingStrategy() });

      const source = code.table(genericsDefinition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type first_name = string | null;
          export type status<T = object> = T;
          export type exists<T = any> = T;
        }

        export interface Users<StatusType = object, ExistsType = any> {
          id: UsersFields.id;
          first_name: UsersFields.first_name;
          status: UsersFields.status<StatusType>;
          exists: UsersFields.exists<ExistsType>;
        }
      `);
    });

    it('should return table source with multiple generics using CamelCaseNamingStrategy', () => {
      const code = new Code({ emitGenerics: true, namingStrategy: new CamelCaseNamingStrategy() });

      const source = code.table(genericsDefinition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type firstName = string | null;
          export type status<T = object> = T;
          export type exists<T = any> = T;
        }

        export interface Users<StatusType = object, ExistsType = any> {
          id: UsersFields.id;
          firstName: UsersFields.firstName;
          status: UsersFields.status<StatusType>;
          exists: UsersFields.exists<ExistsType>;
        }
      `);
    });
  });

  describe('metadata + generics', () => {
    it('should return table source with metadata + generics using SnakeCaseNamingStrategy', () => {
      const code = new Code({ emitGenerics: true, emitMetadata: true, namingStrategy: new SnakeCaseNamingStrategy() });

      code.define('user_status');

      const source = code.table(definition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type first_name = string | null;
          export type status = UserStatus;
          export type exists<T = any> = T;
        }

        export interface Users<ExistsType = any> {
          /** @type int4 */
          id: UsersFields.id;
          /** @type varchar */
          first_name: UsersFields.first_name;
          /** @type user_status */
          status: UsersFields.status;
          /** @type user_exists @default true */
          exists: UsersFields.exists<ExistsType>;
        }
      `);
    });

    it('should return table source with metadata + generics using CamelCaseNamingStrategy', () => {
      const code = new Code({ emitGenerics: true, emitMetadata: true, namingStrategy: new CamelCaseNamingStrategy() });

      code.define('user_status');

      const source = code.table(definition);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type firstName = string | null;
          export type status = UserStatus;
          export type exists<T = any> = T;
        }

        export interface Users<ExistsType = any> {
          /** @type int4 */
          id: UsersFields.id;
          /** @type varchar */
          firstName: UsersFields.firstName;
          /** @type user_status */
          status: UsersFields.status;
          /** @type user_exists @default true */
          exists: UsersFields.exists<ExistsType>;
        }
      `);
    });
  });
});
