import { Postgres } from '../../../src/driver/postgres';
import { Meta } from '../../../src/sql/meta';

const connectionString = 'postgres://postgres@localhost:5432/test';

let db: Postgres;

beforeEach(async () => {
  db = new Postgres(connectionString);
  await db.connect();
});

afterEach(async () => {
  await db.query(`DROP TYPE IF EXISTS enum_user_status;`);
  await db.disconnect();
});

describe('Meta', () => {
  describe('enums', () => {
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
});
