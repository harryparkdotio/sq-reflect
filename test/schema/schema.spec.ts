import { client } from '../client';
import * as schema from '../../src/schema/schema';
import {
  ClassType,
  ClassDefinition,
  EnumDefinition,
} from '../../src/schema/definitions';

describe('getEnums', () => {
  beforeEach(async () => {
    await client.query(`
      CREATE TYPE enum_abc_status AS ENUM ('PENDING', 'COMPLETED', 'STARTED', 'READY', 'DONE', 'STOPPED', 'PAUSED', 'PARTIALLY_COMPLETE');
      CREATE TYPE enum_def_color AS ENUM ('BLUE', 'RED', 'GREEN', 'ORANGE', 'YELLOW');
    `);
  });

  afterEach(async () => {
    await client.query(`
      DROP TYPE IF EXISTS enum_abc_status;
      DROP TYPE IF EXISTS enum_def_color;
    `);
  });

  it('should return empty array if no enums', async () => {
    const enums = await schema.getEnums(client, 'non-existent-schema');
    expect(enums).toHaveLength(0);
  });

  it('should return array of EnumDefinition', async () => {
    const enums = await schema.getEnums(client);

    expect(enums).toHaveLength(2);

    expect(enums).toMatchObject<EnumDefinition[]>([
      {
        id: expect.any(Number),
        name: 'enum_abc_status',
        namespace_id: 2200,
        namespace: 'public',
        arr_id: expect.any(Number),
        arr_name: '_enum_abc_status',
        values: [
          'PENDING',
          'COMPLETED',
          'STARTED',
          'READY',
          'DONE',
          'STOPPED',
          'PAUSED',
          'PARTIALLY_COMPLETE',
        ],
      },
      {
        id: expect.any(Number),
        name: 'enum_def_color',
        namespace_id: 2200,
        namespace: 'public',
        arr_id: expect.any(Number),
        arr_name: '_enum_def_color',
        values: ['BLUE', 'RED', 'GREEN', 'ORANGE', 'YELLOW'],
      },
    ]);
  });
});

describe('getClasses', () => {
  beforeEach(async () => {
    await client.query(`
      CREATE VIEW "some_data" AS (
        SELECT
          1 "a_number",
          'a' "a_letter",
          '{}'::JSON "an_object"
      );

      CREATE TABLE "user" (
        id         UUID PRIMARY KEY,
        metadata   JSON NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ NULL
      );
    `);
  });

  afterEach(async () => {
    await client.query(`
      DROP TABLE IF EXISTS "user";
      DROP VIEW IF EXISTS "some_data";
    `);
  });

  it('should return empty array if no classes', async () => {
    const classes = await schema.getClasses(client, 'non-existent-schema');
    expect(classes).toHaveLength(0);
  });

  it('should return array of ClassDefinition', async () => {
    const classes = await schema.getClasses(client);

    expect(classes).toHaveLength(2);

    expect(classes).toMatchObject<ClassDefinition[]>([
      {
        id: expect.any(Number),
        name: 'some_data',
        type: ClassType.VIEW,
        namespace_id: 2200,
        namespace: 'public',
        attributes: [
          {
            number: 1,
            name: 'a_number',
            nullable: true,
            default: null,
            type: {
              id: 23,
              name: 'int4',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            number: 2,
            name: 'a_letter',
            nullable: true,
            default: null,
            type: {
              id: 25,
              name: 'text',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            number: 3,
            name: 'an_object',
            nullable: true,
            default: null,
            type: {
              id: 114,
              name: 'json',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
        ],
      },
      {
        id: expect.any(Number),
        name: 'user',
        type: ClassType.TABLE,
        namespace_id: 2200,
        namespace: 'public',
        attributes: [
          {
            name: 'id',
            number: 1,
            nullable: false,
            default: null,
            type: {
              id: 2950,
              name: 'uuid',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'metadata',
            number: 2,
            nullable: false,
            default: null,
            type: {
              id: 114,
              name: 'json',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'created_at',
            number: 3,
            nullable: false,
            default: 'now()',
            type: {
              id: 1184,
              name: 'timestamptz',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
          {
            name: 'deleted_at',
            number: 4,
            nullable: true,
            default: null,
            type: {
              id: 1184,
              name: 'timestamptz',
              namespace_id: 11,
              namespace: 'pg_catalog',
            },
          },
        ],
      },
    ]);
  });
});
