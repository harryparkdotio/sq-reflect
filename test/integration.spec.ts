import { client } from './client';
import * as schema from './../src/schema/schema';
import * as ast from './../src/ast';
import { astWriter } from './../src/ast/writer';

describe('integration', () => {
  beforeEach(async () => {
    await client.query(`
      CREATE TYPE enum_abc_color AS ENUM ('PENDING', 'COMPLETED', 'STARTED', 'READY', 'DONE', 'STOPPED', 'PAUSED', 'PARTIALLY_COMPLETE');
      CREATE TYPE enum_def_status AS ENUM ('BLUE', 'RED', 'GREEN', 'ORANGE', 'YELLOW');

      CREATE VIEW "some_data_2" AS (
        SELECT
          1 "a_number",
          'a' "a_letter",
          '{}'::JSON "an_object"
      );

      CREATE TABLE "not_user" (
        id         UUID PRIMARY KEY,
        metadata   JSON NOT NULL,
        def_status enum_def_status NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ NULL
      );
    `);
  });

  afterEach(async () => {
    await client.query(`
      DROP TABLE IF EXISTS "not_user";
      DROP VIEW IF EXISTS "some_data_2";

      DROP TYPE IF EXISTS enum_abc_color;
      DROP TYPE IF EXISTS enum_def_status;
    `);
  });

  it('should return type declarations', async () => {
    const classes = await schema.getClasses(client, 'public');
    const enums = await schema.getEnums(client, 'public');

    const statements = ast.buildAst(classes, enums);
    expect(astWriter(statements).join('\n\n')).toMatchSnapshot();
  });
});
