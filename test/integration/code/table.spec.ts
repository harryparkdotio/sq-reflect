import * as dedent from 'dedent';

import { Code } from '../../../src/code';
import { CamelCaseNamingStrategy, SnakeCaseNamingStrategy } from '../../../src/code/naming-strategy';
import { Postgres } from '../../../src/driver/postgres';
import { Meta } from '../../../src/sql/meta';

const connectionString = 'postgres://postgres@localhost:5432/test';

let db: Postgres;
let meta: Meta;

beforeAll(async () => {
  db = new Postgres(connectionString);
  meta = new Meta(db);
  await db.connect();

  await db.query(`DROP TABLE IF EXISTS "users";`);
  await db.query(`DROP TYPE IF EXISTS enum_user_status;`);

  await db.disconnect();
});

beforeEach(async () => {
  db = new Postgres(connectionString);
  meta = new Meta(db);
  await db.connect();
});

afterEach(async () => {
  await db.query(`DROP TABLE IF EXISTS "users";`);
  await db.query(`DROP TYPE IF EXISTS enum_user_status;`);
  await db.disconnect();
});

describe('table', () => {
  describe('source', () => {
    it('should return table source', async () => {
      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
      await db.query(`CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp, status enum_user_status);`);

      const tables = await meta.Tables();
      const enums = await meta.Enums();

      const code = new Code();

      code.define(enums[0].name);

      const source = code.table(tables[0]);

      expect(source).toBe(dedent`
        export namespace users_fields {
          export type id = number;
          export type created_at = Date | null;
          export type status = enum_user_status | null;
        }

        export interface users {
          id: users_fields.id;
          created_at: users_fields.created_at;
          status: users_fields.status;
        }
      `);
    });

    it('should return table source using SnakeCaseNamingStrategy', async () => {
      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
      await db.query(`CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp, status enum_user_status);`);

      const tables = await meta.Tables();

      const enums = await meta.Enums();

      const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

      code.define(enums[0].name);

      const source = code.table(tables[0]);

      expect(source).toBe(dedent`
        export namespace users_fields {
          export type id = number;
          export type created_at = Date | null;
          export type status = enum_user_status | null;
        }

        export interface users {
          id: users_fields.id;
          created_at: users_fields.created_at;
          status: users_fields.status;
        }
      `);
    });

    it('should return table source using CamelCaseNamingStrategy', async () => {
      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
      await db.query(
        `CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp default now(), status enum_user_status);`
      );

      const tables = await meta.Tables();
      const enums = await meta.Enums();

      const code = new Code({ namingStrategy: new CamelCaseNamingStrategy() });

      code.define(enums[0].name);

      const source = code.table(tables[0]);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type createdAt = Date | null;
          export type status = EnumUserStatus | null;
        }

        export interface Users {
          id: UsersFields.id;
          createdAt: UsersFields.createdAt;
          status: UsersFields.status;
        }
      `);
    });
  });

  describe('metadata', () => {
    it('should return table source with metadata', async () => {
      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
      await db.query(
        `CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp default now(), status enum_user_status);`
      );

      const tables = await meta.Tables();
      const enums = await meta.Enums();

      const code = new Code({ emitMetadata: true });

      code.define(enums[0].name);

      const source = code.table(tables[0]);

      expect(source).toBe(dedent`
        export namespace users_fields {
          export type id = number;
          export type created_at = Date | null;
          export type status = enum_user_status | null;
        }

        export interface users {
          /** @type int4 */
          id: users_fields.id;
          /** @type timestamp @default now() */
          created_at: users_fields.created_at;
          /** @type enum_user_status */
          status: users_fields.status;
        }
      `);
    });

    it('should return table source with metadata using SnakeCaseNamingStrategy', async () => {
      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
      await db.query(
        `CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp default now(), status enum_user_status);`
      );

      const tables = await meta.Tables();
      const enums = await meta.Enums();

      const code = new Code({ emitMetadata: true, namingStrategy: new SnakeCaseNamingStrategy() });

      code.define(enums[0].name);

      const source = code.table(tables[0]);

      expect(source).toBe(dedent`
        export namespace users_fields {
          export type id = number;
          export type created_at = Date | null;
          export type status = enum_user_status | null;
        }

        export interface users {
          /** @type int4 */
          id: users_fields.id;
          /** @type timestamp @default now() */
          created_at: users_fields.created_at;
          /** @type enum_user_status */
          status: users_fields.status;
        }
      `);
    });

    it('should return table source with metadata using CamelCaseNamingStrategy', async () => {
      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
      await db.query(
        `CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp default now(), status enum_user_status);`
      );

      const tables = await meta.Tables();
      const enums = await meta.Enums();

      const code = new Code({ emitMetadata: true, namingStrategy: new CamelCaseNamingStrategy() });

      code.define(enums[0].name);

      const source = code.table(tables[0]);

      expect(source).toBe(dedent`
        export namespace UsersFields {
          export type id = number;
          export type createdAt = Date | null;
          export type status = EnumUserStatus | null;
        }

        export interface Users {
          /** @type int4 */
          id: UsersFields.id;
          /** @type timestamp @default now() */
          createdAt: UsersFields.createdAt;
          /** @type enum_user_status */
          status: UsersFields.status;
        }
      `);
    });
  });
});
