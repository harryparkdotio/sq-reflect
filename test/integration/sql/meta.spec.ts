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
  await db.query(`DROP TABLE IF EXISTS "comments";`);
  await db.query(`DROP TABLE IF EXISTS "users";`);
  await db.query(`DROP TYPE IF EXISTS enum_user_status;`);
  await db.query(`DROP TYPE IF EXISTS enum_comment_type;`);
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
      await db.query(`CREATE TYPE enum_comment_type AS ENUM ('PUBLIC', 'PRIVATE');`);
      await db.query(`CREATE TABLE "users" (id int PRIMARY KEY, created_at timestamp, status enum_user_status);`);
      await db.query(
        `CREATE TABLE "comments" (id int PRIMARY KEY, user_id int references users(id), comment text, created_at timestamp, type enum_comment_type);`
      );

      const tables = await meta.Tables();

      const UsersTable: TableDefinition = {
        name: 'users',
        schema: 'public',
        columns: [
          {
            name: 'id',
            type: {
              nullable: false,
              type: 'number',
              sql: 'int4',
              alt: 'integer',
              schema: 'pg_catalog',
            },
          },
          {
            name: 'created_at',
            type: {
              nullable: true,
              type: 'Date',
              schema: 'pg_catalog',
              sql: 'timestamp',
              alt: 'timestamp without time zone',
            },
          },
          {
            name: 'status',
            type: {
              nullable: true,
              type: null,
              sql: 'enum_user_status',
              alt: null,
              schema: 'public',
            },
          },
        ],
      };

      const CommentsTable: TableDefinition = {
        name: 'comments',
        schema: 'public',
        columns: [
          {
            name: 'id',
            type: {
              nullable: false,
              type: 'number',
              sql: 'int4',
              alt: 'integer',
              schema: 'pg_catalog',
            },
          },
          {
            name: 'user_id',
            type: {
              nullable: true,
              type: 'number',
              sql: 'int4',
              alt: 'integer',
              schema: 'pg_catalog',
            },
          },
          {
            name: 'comment',
            type: {
              nullable: true,
              type: 'string',
              sql: 'text',
              alt: 'text',
              schema: 'pg_catalog',
            },
          },
          {
            name: 'created_at',
            type: {
              nullable: true,
              type: 'Date',
              schema: 'pg_catalog',
              sql: 'timestamp',
              alt: 'timestamp without time zone',
            },
          },
          {
            name: 'type',
            type: {
              nullable: true,
              type: null,
              sql: 'enum_comment_type',
              alt: null,
              schema: 'public',
            },
          },
        ],
      };

      expect(tables).toEqual([CommentsTable, UsersTable]);
    });
  });
});
