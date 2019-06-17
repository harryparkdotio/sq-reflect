import * as meow from 'meow';
import * as pg from 'pg';
import * as fs from 'fs';

import * as ast from './ast';
import * as schema from './schema/schema';
import { astWriter } from './ast/writer';

const cli = meow(
  `
    Usage
      $ sq-reflect --conn postgres://postgres@localhost:5432/db_name --file schema.ts
 
    Options
      --conn, -c  postgres connection string
      --file, -f  filename to save generated types
      --schema, -s  postgres schema
 
    Examples
      $ sq-reflect --conn <conn> --file schema.ts
`,
  {
    flags: {
      help: {
        alias: 'h',
      },
      version: {
        alias: 'v',
      },
      conn: {
        type: 'string',
        alias: 'c',
      },
      schema: {
        type: 'string',
        alias: 's',
        default: 'public',
      },
    },
  }
);

const run = async (cli: meow.Result) => {
  const client = new pg.Client(cli.flags.conn);

  await client.connect();

  const classes = await schema.getClasses(client, cli.flags.schema);
  const enums = await schema.getEnums(client, cli.flags.schema);

  await client.end();

  const statements = ast.buildAst(classes, enums);
  const strings = astWriter(statements).join('\n\n');

  fs.writeFileSync(cli.flags.file, strings);
};

run(cli).catch(err => {
  console.error(err);
});
