# sq-reflect

sql typescript type generator

[![Travis](https://img.shields.io/travis/com/harryparkdotio/sq-reflect/master.svg?style=for-the-badge)](https://travis-ci.com/harryparkdotio/sq-reflect)
[![Codecov](https://img.shields.io/codecov/c/github/harryparkdotio/sq-reflect/master.svg?style=for-the-badge)](https://codecov.io/gh/harryparkdotio/sq-reflect)
[![license](https://img.shields.io/github/license/harryparkdotio/sq-reflect.svg?style=for-the-badge)](https://github.com/harryparkdotio/sq-reflect/blob/master/license)
[![npm](https://img.shields.io/npm/v/sq-reflect.svg?style=for-the-badge)](https://www.npmjs.com/package/sq-reflect)

## install

```bash
$ npm i -g sq-reflect
# or
$ yarn global add sq-reflect
```

## cli

```bash
sq-reflect [options]

Options:
  --help, -h         help                                              [boolean]
  --version, -v      version                                           [boolean]
  --conn, -c                                                 [string] [required]
  --filename, -f                                 [string] [default: "schema.ts"]
  --no-meta, -M      do not emit metadata             [boolean] [default: false]
  --no-generics, -G  do not emit type generics        [boolean] [default: false]
  --schema, -s       schema                         [string] [default: "public"]
  --snake
  --camel

Examples:
  sq-reflect --conn postgres://postgres@localhost:5432/db
```

## example

```sql
CREATE TYPE enum_user_status AS ENUM (
  'PENDING',
  'VERIFIED',
  'FAILED',
  'DISABLED'
);

CREATE TABLE "user" (
  id uuid PRIMARY KEY,
  status enum_user_status not null default 'PENDING',
  created_at timestamp,
  default boolean not null,
  data json not null,
  col unknown_type not null
);
```

```ts
export enum EnumUserStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  DISABLED = 'DISABLED',
}

export namespace UserFields {
  export type id = string;
  export type status = EnumUserStatus;
  export type created_at = Date | null;
  export type default_ = boolean;
  export type data<T = object> = T;
  export type col<T = any> = T;
}

export interface User<DataType, ColType> {
  /** @type uuid */
  id: UserFields.id;
  /** @type enum_user_status */
  status: UserFields.status;
  /** @type timestamp */
  created_at: UserFields.created_at;
  /** @type boolean */
  default: UserFields.default_;
  /** @type json */
  data: UserFields.data<DataType>;
  /** @type unknown_type */
  col: UserFields.col<ColType>;
}
```
