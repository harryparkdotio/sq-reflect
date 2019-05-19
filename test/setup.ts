import { client } from './client';

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.end();
});
