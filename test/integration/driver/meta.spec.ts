import { Postgres } from '../../../src/driver/postgres';
import { TableDefinition } from '../../../src/sql/definitions';
import { Meta } from '../../../src/sql/meta';

const connectionString = 'postgres://postgres@localhost:5432/test';

let db: Postgres;

beforeEach(async () => {
  db = new Postgres(connectionString);
  await db.connect();
});

afterEach(async () => {
  await db.query(`DROP TABLE IF EXISTS "users";`);
  await db.query(`DROP TYPE IF EXISTS enum_user_status;`);
  await db.disconnect();
});

describe('Meta', () => {
  describe('Enums', () => {
    it('should return an empty array if no enums', async () => {
      const meta = new Meta(db);

      const enums = await meta.Enums();

      expect(enums).toEqual([]);
    });

    it('should return an array of EnumDefinitions', async () => {
      const meta = new Meta(db);

      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);

      const enums = await meta.Enums();

      expect(enums).toEqual([
        {
          name: 'enum_user_status',
          schema: 'public',
          values: ['PENDING', 'VERIFIED', 'FAILED', 'DISABLED'],
        },
      ]);
    });
  });

  describe('Tables', () => {
    it('should return an empty array if no tables', async () => {
      const meta = new Meta(db);

      const tables = await meta.Tables();

      expect(tables).toEqual([]);
    });

    it('should return an array of TableDefinitions', async () => {
      const meta = new Meta(db);

      await db.query(`CREATE TYPE enum_user_status AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'DISABLED');`);
      await db.query(`CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp, status enum_user_status);`);

      const tables = await meta.Tables();

      const UsersTable: TableDefinition = {
        name: 'users',
        schema: 'public',
        columns: [
          {
            name: 'id',
            nullable: false,
            type: {
              type: 'number',
              sql: 'int4',
              alt: 'integer',
              schema: 'pg_catalog',
            },
          },
          {
            name: 'created_at',
            nullable: true,
            type: {
              type: 'Date',
              schema: 'pg_catalog',
              sql: 'timestamp',
              alt: 'timestamp without time zone',
            },
          },
          {
            name: 'status',
            nullable: true,
            type: {
              type: undefined,
              sql: 'enum_user_status',
              alt: null,
              schema: 'public',
            },
          },
        ],
      };

      expect(tables).toEqual([UsersTable]);
    });
  });
});
