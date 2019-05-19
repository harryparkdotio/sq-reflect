import * as dedent from 'dedent';

import { Driver } from '../driver/interfaces';

import { typeMaps } from './types';
import {
  ColumnDefinition,
  EnumDefinition,
  RawEnumDefinition,
  RawTableDefinition,
  TableDefinition,
} from './definitions';

interface MetaOptions {
  schema: string;
}

export class Meta {
  private schema: string;

  constructor(
    protected readonly db: Driver,
    options: Partial<MetaOptions> = {}
  ) {
    this.schema = options.schema || Meta.defaultSchema;
  }

  static get defaultSchema(): string {
    return 'public';
  }

  async Enums(): Promise<EnumDefinition[]> {
    const sql = dedent`
      SELECT
        t.typname "name",
        array_agg((SELECT e.enumlabel::TEXT ORDER BY e.enumsortorder)) "values"
      FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = $1
      GROUP BY t.typname
      ORDER BY t.typname ASC;`;

    const definitions: RawEnumDefinition[] = await this.db.query(sql, [
      this.schema,
    ]);

    return definitions.map<EnumDefinition>(definition => ({
      schema: this.schema,
      ...definition,
    }));
  }

  async Tables(): Promise<TableDefinition[]> {
    const sql = dedent`
      SELECT
        c.table_name "name",
        json_agg(
          json_build_object(
            'name', c.column_name,
            'nullable', c.is_nullable = 'YES',
            'type', c.udt_name,
            'alt', CASE WHEN c.data_type = 'USER-DEFINED' THEN NULL ELSE c.data_type END,
            'typeSchema', c.udt_schema,
            'default', c.column_default
          )
          ORDER BY
            c.ordinal_position ASC
        ) "columns"
      FROM
        information_schema.columns c
      WHERE
        c.table_schema = $1
        AND NOT EXISTS (
          SELECT
            1
          FROM
            pg_catalog.pg_views v
          WHERE
            v.viewname = c.table_name
        )
      GROUP BY
        c.table_name
      ORDER BY
        c.table_name;`;

    const definitions: RawTableDefinition[] = await this.db.query(sql, [
      this.schema,
    ]);

    return definitions.map<TableDefinition>(definition => ({
      name: definition.name,
      schema: this.schema,
      columns: definition.columns.map<ColumnDefinition>(columnDefinition => ({
        name: columnDefinition.name,
        type: {
          alt: columnDefinition.alt,
          sql: columnDefinition.type,
          nullable: columnDefinition.nullable,
          type: (
            typeMaps.find(t => t.types.includes(columnDefinition.type)) || {
              type: null,
            }
          ).type,
          schema: columnDefinition.typeSchema,
          default: columnDefinition.default,
        },
      })),
    }));
  }
}
