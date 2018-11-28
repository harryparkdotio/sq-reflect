import * as dedent from 'dedent';

import { Driver } from '../driver/interfaces';

import { TypeMap, typeMaps } from './types';

import {
  ColumnDefinition,
  EnumDefinition,
  RawEnumDefinition,
  RawTableDefinition,
  RawTypeDefinition,
  TableDefinition,
  TypeDefinition,
} from './definitions';

interface BaseMetaOptions {
  schema: string;
  table: string;
}

type EnumsMetaOptions = Pick<BaseMetaOptions, 'schema'>;
type TablesMetaOptions = Pick<BaseMetaOptions, 'schema'>;

export class Meta {
  constructor(protected readonly db: Driver) {}

  static get defaultSchema(): string {
    return 'public';
  }

  async Enums(options: EnumsMetaOptions = { schema: Meta.defaultSchema }): Promise<EnumDefinition[]> {
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

    const definitions: RawEnumDefinition[] = await this.db.query(sql, [options.schema]);

    return definitions.map<EnumDefinition>(definition => ({
      schema: options.schema,
      ...definition,
    }));
  }

  async Tables(options: TablesMetaOptions = { schema: Meta.defaultSchema }): Promise<TableDefinition[]> {
    const sql = dedent`
      SELECT
        t.table_name "name",
        array_to_json(array_agg(
          json_build_object(
            'name', t.column_name,
            'nullable', t.is_nullable = 'YES',
            'type', t.udt_name,
            'alt', CASE WHEN t.data_type = 'USER-DEFINED' THEN NULL ELSE t.data_type END,
            'typeSchema', t.udt_schema
          )
        )) "columns"
      FROM (
        SELECT
          *
        FROM
          information_schema.columns c
        WHERE
          c.table_schema = $1
        ORDER BY
          c.ordinal_position ASC
      ) t
      GROUP BY
        t.table_name
      ORDER BY
        t.table_name ASC;`;

    const definitions: RawTableDefinition[] = await this.db.query(sql, [options.schema]);

    return definitions.map<TableDefinition>(definition => ({
      name: definition.name,
      schema: options.schema,
      columns: definition.columns.map<ColumnDefinition>(columnDefinition => ({
        name: columnDefinition.name,
        nullable: columnDefinition.nullable,
        type: this.mapType({
          alt: columnDefinition.alt,
          type: columnDefinition.type,
          schema: columnDefinition.typeSchema,
        }),
      })),
    }));
  }

  private mapType(type: RawTypeDefinition): TypeDefinition {
    const typeMap: Partial<TypeMap> = typeMaps.find(t => t.types.includes(type.type)) || {};

    return {
      sql: type.type,
      alt: type.alt,
      schema: type.schema,
      type: typeMap.type,
    };
  }
}
