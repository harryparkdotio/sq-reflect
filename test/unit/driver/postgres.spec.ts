jest.mock('pg');

import { Client } from 'pg';

import { Postgres } from '../../../src/driver/postgres';

describe('Postgres', () => {
  describe('constructor', () => {
    it('should create new instance of pg.Client', () => {
      const connectionString = '';

      // tslint:disable-next-line:no-unused-expression
      new Postgres(connectionString);

      expect(Client).toHaveBeenCalledWith(connectionString);
    });
  });

  describe('connect', () => {
    it('should call pg.Client.connect', async () => {
      const connectionString = '';
      const db = new Postgres(connectionString);

      expect(Client.prototype.connect).not.toHaveBeenCalled();

      await db.connect();

      expect(Client.prototype.connect).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should call pg.Client.end', async () => {
      const connectionString = '';
      const db = new Postgres(connectionString);

      expect(Client.prototype.end).not.toHaveBeenCalled();

      await db.disconnect();

      expect(Client.prototype.end).toHaveBeenCalled();
    });
  });

  describe('query', () => {
    it('should call pg.Client.query', async () => {
      const connectionString = '';
      const db = new Postgres(connectionString);

      const sql = 'SELECT * FROM now();';
      const params: any[] = [];

      expect(Client.prototype.query).not.toHaveBeenCalled();

      await db.query(sql, params);

      expect(Client.prototype.query).toHaveBeenLastCalledWith(sql, params);
    });
  });
});
