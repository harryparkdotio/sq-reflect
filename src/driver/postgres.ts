import { Client } from 'pg';

import { Driver } from './interfaces';

export class Postgres implements Driver {
  private readonly client: Client;

  constructor(connection: string) {
    this.client = new Client(connection);
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async query(sql: string, params?: any[]) {
    return await this.client.query(sql, params);
  }
}
