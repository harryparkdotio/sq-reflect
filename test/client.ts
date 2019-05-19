import * as pg from 'pg';

export const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'test',
  port: (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 5432,
  user: process.env.DB_USER || 'postgres',
});
