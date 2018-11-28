import * as dedent from 'dedent';

import { Driver } from '../driver/interfaces';

import { EnumDefinition, RawEnumDefinition } from './definitions';

interface BaseMetaOptions {
  schema: string;
  table: string;
}

type EnumsMetaOptions = Pick<BaseMetaOptions, 'schema'>;

export class Meta {
  constructor(protected readonly db: Driver) {}

  static get defaultSchema(): string {
    return 'public';
  }

  async Enums(options: EnumsMetaOptions = { schema: Meta.defaultSchema }): Promise<EnumDefinition[]> {
    const sql = dedent`
      SELECT
        t.typname "name",
        array_agg((SELECT e.enumlabel::TEXT)) "values"
      FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = $1
      GROUP BY t.typname
      ORDER BY t.typname ASC;`;

    const definitions: RawEnumDefinition[] = await this.db.query(sql, [options.schema]);

    return definitions.map<EnumDefinition>(definition => ({
      schema: options.schema,
      ...definition,
    }));
  }
}
