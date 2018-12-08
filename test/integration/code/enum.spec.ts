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

describe('enum', () => {
  it('should return enum source', async () => {
    await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);

    const enums = await meta.Enums();

    const source = new Code().enum(enums[0]);

    expect(source).toBe(dedent`
      export enum enum_user_status {
        DISABLED = 'DISABLED',
        FAILED = 'FAILED',
        PENDING = 'PENDING',
        VERIFIED = 'VERIFIED',
      }
    `);
  });

  it('should return enum source using SnakeCaseNamingStrategy', async () => {
    await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);

    const enums = await meta.Enums();

    const source = new Code({ namingStrategy: new SnakeCaseNamingStrategy() }).enum(enums[0]);

    expect(source).toBe(dedent`
      export enum enum_user_status {
        DISABLED = 'DISABLED',
        FAILED = 'FAILED',
        PENDING = 'PENDING',
        VERIFIED = 'VERIFIED',
      }
    `);
  });

  it('should return enum source using CamelCaseNamingStrategy', async () => {
    await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);

    const enums = await meta.Enums();

    const source = new Code({ namingStrategy: new CamelCaseNamingStrategy() }).enum(enums[0]);

    expect(source).toBe(dedent`
      export enum EnumUserStatus {
        DISABLED = 'DISABLED',
        FAILED = 'FAILED',
        PENDING = 'PENDING',
        VERIFIED = 'VERIFIED',
      }
    `);
  });
});
