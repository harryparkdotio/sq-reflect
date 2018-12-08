import * as dedent from 'dedent';

import { Code } from '../../../src/code';
import { CamelCaseNamingStrategy, SnakeCaseNamingStrategy } from '../../../src/code/naming-strategy';
import { Postgres } from '../../../src/driver/postgres';
import { Meta } from '../../../src/sql/meta';

const connectionString = 'postgres://postgres@localhost:5432/test';

let db: Postgres;
let meta: Meta;

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
  it('should return table source', async () => {
    await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
    await db.query(`CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp, status enum_user_status);`);

    const tables = await meta.Tables();

    const source = new Code().table(tables[0]);

    expect(source).toBe(dedent`
      export namespace users_fields {
        export type id = number;
        export type created_at = Date | null;
        export type status = any | null;
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

    const source = new Code({ namingStrategy: new SnakeCaseNamingStrategy() }).table(tables[0]);

    expect(source).toBe(dedent`
      export namespace users_fields {
        export type id = number;
        export type created_at = Date | null;
        export type status = any | null;
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
    await db.query(`CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp, status enum_user_status);`);

    const tables = await meta.Tables();

    const source = new Code({ namingStrategy: new CamelCaseNamingStrategy() }).table(tables[0]);

    expect(source).toBe(dedent`
      export namespace UsersFields {
        export type id = number;
        export type createdAt = Date | null;
        export type status = any | null;
      }

      export interface Users {
        id: UsersFields.id;
        createdAt: UsersFields.createdAt;
        status: UsersFields.status;
      }
    `);
  });
});
