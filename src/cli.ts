import * as fs from 'fs';

import * as meow from 'meow';
import * as pg from 'pg';

import * as ast from './ast';
import * as schema from './schema/schema';
import { astWriter } from './ast/writer';

const cli = meow(
  `
    Usage
      $ sq-reflect --conn postgres://postgres@localhost:5432/db_name --file schema.ts
 
    Options
      --conn, -c  postgres connection string
      --file, -f  filename to save generated types  [string] [default: schema.ts]
      --schema, -s  postgres schema                 [string] [default: public]
 
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
      file: {
        type: 'string',
        alias: 'f',
        default: 'schema.ts',
      },
    },
  }
);

const run = async (cli: meow.Result) => {
  const { conn, file, schema: userSchema } = cli.flags;

  if (!conn) {
    console.error('--conn is required');
    cli.showHelp(1);
  }

  const client = new pg.Client(cli.flags.conn);

  await client.connect();

  const classes = await schema.getClasses(client, userSchema);
  const enums = await schema.getEnums(client, userSchema);

  await client.end();

  const statements = ast.buildAst(classes, enums);
  const strings = astWriter(statements).join('\n\n');

  fs.writeFileSync(file, strings);
};

run(cli).catch(err => {
  console.error(err);
});
