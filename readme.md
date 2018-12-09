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

## example

```sql
CREATE TYPE enum_user_status AS ENUM (
  'PENDING',
  'VERIFIED',
  'FAILED',
  'DISABLED'
);

CREATE TABLE "users" (
  id uuid PRIMARY KEY,
  status enum_user_status not null default 'PENDING',
  created_at timestamp,
  default boolean,
  data json,
  col unknown_type
);
```

```ts
export enum enum_user_status {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  DISABLED = 'DISABLED',
}

export namespace users_fields {
  export type id = string;
  export type status = enum_user_status;
  export type created_at = Date | null;
  export type default_ = boolean;
  export type data = object;
  export type col = any;
}

export interface users {
  /** @type uuid */
  id: users_fields.id;
  /** @type enum_user_status */
  status: users_fields.status;
  /** @type timestamp */
  created_at: users_fields.created_at;
  /** @type boolean */
  default: users_fields.default_;
  /** @type json */
  data: users_fields.data;
  /** @type unknown_type */
  col: users_fields.col;
}
```
