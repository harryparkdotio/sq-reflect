# sq-reflect

postgres typescript type generator

### install

```bash
$ npm i --save-dev sq-reflect
# or
$ yarn add -D sq-reflect
```

### usage

```bash
$ sq-reflect --conn postgres://postgres@localhost:5432/db_name --file schema.ts
```

### example

**`schema.sql`**

```sql
CREATE TYPE enum_color AS ENUM (
  'RED',
  'GREEN',
  'BLUE'
);

CREATE TABLE "user" (
  id                        UUID PRIMARY KEY,
  metadata                  JSON NOT NULL,
  favorite_color enum_color NOT NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ NULL
);

CREATE VIEW users AS (
  SELECT
    id,
    metadata,
    favorite_color,
    created_at
  FROM "user"
  WHERE
    deleted_at IS NULL
  ORDER BY created_at DESC
);
```

generates

**`schema.ts`**

```ts
export enum EnumColor {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
}

export interface User<MetadataType = object> {
  id: string;
  metadata: MetadataType;
  favorite_color: EnumColor;
  created_at: Date;
  deleted_at: Date | null;
}

export interface Users<MetadataType = object> {
  id: string | null;
  metadata: MetadataType | null;
  favorite_color: EnumColor | null;
  created_at: Date | null;
}
```
