import * as pg from 'pg';

import { EnumDefinition, ClassDefinition } from './definitions';

export const getEnums = async (
  client: pg.Client,
  schema: string = 'public'
): Promise<EnumDefinition[]> => {
  const queryText = `
    SELECT
      t.oid::INT "id",
      t.typname "name",
      n.oid::INT "namespace_id",
      n.nspname "namespace",
      ta.oid::INT "arr_id",
      ta.typname "arr_name",
      enum.values
    FROM (
      SELECT
        e.enumtypid::INT "id",
        array_agg((
          SELECT e.enumlabel::TEXT
          ORDER BY e.enumsortorder ASC
        )) "values"
      FROM pg_catalog.pg_enum e
      GROUP BY e.enumtypid
    ) "enum"
    JOIN pg_catalog.pg_type t ON t.oid = enum.id
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    LEFT JOIN pg_catalog.pg_type ta ON ta.oid = t.typarray AND t.typarray > 0
    WHERE
      n.nspname = $1
    ORDER BY t.typname ASC;
  `;

  return client.query(queryText, [schema]).then(r => r.rows);
};

export const getClasses = async (
  client: pg.Client,
  schema: string = 'public'
): Promise<ClassDefinition[]> => {
  const queryText = `
    SELECT
      classes.id,
      classes.name,
      classes.type,
      classes.namespace_id,
      classes.namespace,
      classes.attributes
    FROM (
      SELECT
        c.oid::INT "id",
        c.relname "name",
        c.relkind "type",
        n.oid::INT "namespace_id",
        n.nspname "namespace",
        json_agg(row_to_json(attr)) "attributes"
      FROM pg_catalog.pg_class c
      JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      CROSS JOIN LATERAL (
        SELECT
          a.attname "name",
          NOT a.attnotnull "nullable",
          a.attnum "number",
          json_build_object(
            'id', t.oid::INT,
            'name', t.typname,
            'namespace_id', n.oid::INT,
            'namespace', n.nspname
          ) "type",
          pg_catalog.pg_get_expr(d.adbin, d.adrelid) "default"
        FROM pg_catalog.pg_attribute a
        JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef
        WHERE
          a.attrelid = c.oid
          AND a.attnum > 0
          AND NOT a.attisdropped
      ) "attr"
      WHERE
        -- relkind = 'r' denotes an ordinary table
        -- relkind = 'v' denotes a view
        c.relkind = ANY('{"r","v"}')
        AND n.nspname = $1
      GROUP BY
        c.oid,
        c.relname,
        c.relkind,
        n.oid,
        n.nspname
    ) "classes"
    ORDER BY classes.name ASC;
  `;

  return client.query(queryText, [schema]).then(r => r.rows);
};
