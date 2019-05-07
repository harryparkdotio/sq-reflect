import { source } from 'common-tags';
import * as fse from 'fs-extra';

import { Code } from './code';
import { CamelCaseNamingStrategy, NamingStrategy, SnakeCaseNamingStrategy } from './code/naming-strategy';
import { Driver } from './driver/interfaces';
import { Postgres } from './driver/postgres';
import { EnumDefinition, TableDefinition } from './sql/definitions';
import { Meta } from './sql/meta';

interface Options {
  conn: string;
  schema: string;
  filename: string;
  case: string;
  meta: boolean;
  generics: boolean;
}

interface Data {
  enums: EnumDefinition[];
  tables: TableDefinition[];
}

export class SqReflect {
  private db: Driver;
  private meta: Meta;
  private data: Data;
  public content?: string;
  private filename: string;
  private code: Code;

  constructor(options: Options) {
    this.db = new Postgres(options.conn);

    let namingStrategy: NamingStrategy;

    switch (options.case) {
      case 'camel':
        namingStrategy = new CamelCaseNamingStrategy();
        break;
      case 'snake':
      default:
        namingStrategy = new SnakeCaseNamingStrategy();
        break;
    }

    this.meta = new Meta(this.db, { schema: options.schema });

    this.filename = options.filename;

    this.code = new Code({
      namingStrategy,
      emitMetadata: options.meta,
      emitGenerics: options.generics,
    });
  }

  async scrape() {
    await this.db.connect();

    this.data = {
      enums: await this.meta.Enums(),
      tables: await this.meta.Tables(),
    };

    if (this.data.tables.length === 0) {
      // tslint:disable-next-line:no-console
      console.warn('no tables were found.');
    }

    await this.db.disconnect();
  }

  async compile() {
    const code = this.code;
    const { enums, tables } = this.data;

    // define custom types
    enums.map(e => code.define(e.name));

    this.content = source`
      /**
       * THIS IS AN AUTO GENERATED FILE - DO NOT EDIT
       */

      /* eslint-disable */
      /* tslint:disable */

      ${[...enums.map(e => code.enum(e)), ...tables.map(t => code.table(t))].join('\n\n')}
    `;
  }

  async save() {
    await fse.ensureFile(this.filename);
    await fse.writeFile(this.filename, this.content);
  }
}
