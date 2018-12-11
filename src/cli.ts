#!/usr/bin/env node

import * as yargs from 'yargs';

import { SqReflect } from '.';

interface Opt {
  conn: string;
  filename: string;
  noMeta: boolean;
  noGenerics: boolean;
  schema: string;
  snake: boolean;
  camel: boolean;
}

const argv = yargs
  .usage('$0 [options]')
  .example('$0 --conn postgres://postgres@localhost:5432/db', '')
  .option('version', {
    alias: 'v',
    type: 'boolean',
    desc: 'version',
  })
  .option('help', {
    alias: 'h',
    type: 'boolean',
    desc: 'help',
  })
  .option('conn', {
    alias: 'c',
    type: 'string',
    nargs: 1,
  })
  .option('filename', {
    alias: 'f',
    default: 'schema.ts',
    type: 'string',
    nargs: 1,
  })
  .option('no-meta', {
    alias: 'M',
    type: 'boolean',
    desc: 'do not emit metadata',
    default: false,
  })
  .options('no-generics', {
    alias: 'G',
    type: 'boolean',
    desc: 'do not emit type generics',
    default: false,
  })
  .option('schema', {
    alias: 's',
    default: 'public',
    type: 'string',
    desc: 'schema',
    nargs: 1,
  })
  .option('snake', {
    conflicts: 'camel',
  })
  .option('camel', {
    conflicts: 'snake',
  })
  .demandOption(['conn']).argv;

if (process.argv.length <= 2) {
  yargs.showHelp();
}

async function run(v: Opt) {
  const sq = new SqReflect({
    filename: v.filename,
    schema: v.schema,
    conn: v.conn,
    generics: !v.noGenerics,
    meta: !v.noMeta,
    case: (v.snake && 'snake') || (v.camel && 'camel'),
  });

  await sq.scrape();
  await sq.compile();
  await sq.save();
}

// @ts-ignore
run(argv)
  .then(() => {
    // tslint:disable-next-line:no-console
    console.log('done');
    process.exit();
  })
  .catch((e: Error) => {
    // tslint:disable-next-line:no-console
    console.warn(e.message || e);
    process.exit(1);
  });
