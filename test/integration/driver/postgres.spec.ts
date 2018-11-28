import { Postgres } from '../../../src/driver/postgres';

describe('Postgres', () => {
  describe('connect', () => {
    it('should connect to db', async () => {
      const connectionString = 'postgres://postgres@localhost:5432/test';
      const db = new Postgres(connectionString);

      await expect(db.connect()).resolves.not.toThrow();
      await db.disconnect();
    });

    it('should throw if unable to connect to db', async () => {
      const connectionString = 'postgres://postgres@localhost:54321/lol';
      const db = new Postgres(connectionString);

      await expect(db.connect()).rejects.toThrow();
      await db.disconnect();
    });
  });
});
