import * as path from 'path';
import * as os from 'os';

import { source } from 'common-tags';
import * as fse from 'fs-extra';

import { SqReflect } from '../../src';
import { Driver } from '../../src/driver/interfaces';
import { Postgres } from '../../src/driver/postgres';

const connectionString = 'postgres://postgres@localhost:5432/test';

async function up(d: Pick<Driver, 'query'>) {
  return d.query(`
    CREATE TABLE IF NOT EXISTS "user" (
      id serial PRIMARY KEY,
      first_name varchar not null,
      last_name varchar not null,
      email_address varchar not null,
      email_verified boolean not null default false,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp
    );
    
    CREATE TYPE enum_transaction_type AS ENUM (
      'PAYMENT',
      'REFUND'
    );

    CREATE TABLE IF NOT EXISTS "transaction" (
      id serial PRIMARY KEY,
      amount integer not null,
      payer_id integer not null REFERENCES "user"(id),
      transaction_type enum_transaction_type not null default 'PAYMENT',
      data json,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp
    );
  `);
}

async function down(d: Pick<Driver, 'query'>) {
  return d.query(`
    DROP TABLE IF EXISTS "transaction";
    DROP TYPE IF EXISTS enum_transaction_type;
    DROP TABLE IF EXISTS "user";
  `);
}

beforeAll(async () => {
  const db = new Postgres(connectionString);

  await db.connect();
  await down(db);
  await up(db);
  await db.disconnect();
});

afterAll(async () => {
  const db = new Postgres(connectionString);

  await db.connect();
  await down(db);
  await db.disconnect();
});

describe('e2e', () => {
  it('should work with snake case', async () => {
    const filename = path.join(os.tmpdir(), 'abc.ts');
    const sq = new SqReflect({
      filename,
      conn: connectionString,
      schema: 'public',
      meta: true,
      generics: true,
      case: 'snake',
    });

    await sq.scrape();
    await sq.compile();
    await sq.save();

    const contents = await fse.readFile(filename).then(f => f.toString());

    expect(contents).toBe(source`
      /**
       * THIS IS AN AUTO GENERATED FILE - DO NOT EDIT
       */

      /* eslint-disable */
      /* tslint:disable */

      export enum EnumTransactionType {
        PAYMENT = 'PAYMENT',
        REFUND = 'REFUND',
      }

      export namespace TransactionFields {
        export type id = number;
        export type amount = number;
        export type payer_id = number;
        export type transaction_type = EnumTransactionType;
        export type data<T = object> = T | null;
        export type created_at = Date;
        export type updated_at = Date;
        export type deleted_at = Date | null;
      }

      export interface Transaction<DataType = object> {
        /** @type int4 @default nextval('transaction_id_seq'::regclass) */
        id: TransactionFields.id;
        /** @type int4 */
        amount: TransactionFields.amount;
        /** @type int4 */
        payer_id: TransactionFields.payer_id;
        /** @type enum_transaction_type @default 'PAYMENT'::enum_transaction_type */
        transaction_type: TransactionFields.transaction_type;
        /** @type json */
        data: TransactionFields.data<DataType>;
        /** @type timestamp @default now() */
        created_at: TransactionFields.created_at;
        /** @type timestamp @default now() */
        updated_at: TransactionFields.updated_at;
        /** @type timestamp */
        deleted_at: TransactionFields.deleted_at;
      }

      export namespace UserFields {
        export type id = number;
        export type first_name = string;
        export type last_name = string;
        export type email_address = string;
        export type email_verified = boolean;
        export type created_at = Date;
        export type updated_at = Date;
        export type deleted_at = Date | null;
      }

      export interface User {
        /** @type int4 @default nextval('user_id_seq'::regclass) */
        id: UserFields.id;
        /** @type varchar */
        first_name: UserFields.first_name;
        /** @type varchar */
        last_name: UserFields.last_name;
        /** @type varchar */
        email_address: UserFields.email_address;
        /** @type bool @default false */
        email_verified: UserFields.email_verified;
        /** @type timestamp @default now() */
        created_at: UserFields.created_at;
        /** @type timestamp @default now() */
        updated_at: UserFields.updated_at;
        /** @type timestamp */
        deleted_at: UserFields.deleted_at;
      }
    `);
  });

  it('should work with camel case', async () => {
    const filename = path.join(os.tmpdir(), 'abc.ts');
    const sq = new SqReflect({
      filename,
      conn: connectionString,
      schema: 'public',
      meta: true,
      generics: true,
      case: 'camel',
    });

    await sq.scrape();
    await sq.compile();
    await sq.save();

    const contents = await fse.readFile(filename).then(f => f.toString());

    expect(contents).toBe(source`
      /**
       * THIS IS AN AUTO GENERATED FILE - DO NOT EDIT
       */

      /* eslint-disable */
      /* tslint:disable */

      export enum EnumTransactionType {
        PAYMENT = 'PAYMENT',
        REFUND = 'REFUND',
      }

      export namespace TransactionFields {
        export type id = number;
        export type amount = number;
        export type payerId = number;
        export type transactionType = EnumTransactionType;
        export type data<T = object> = T | null;
        export type createdAt = Date;
        export type updatedAt = Date;
        export type deletedAt = Date | null;
      }

      export interface Transaction<DataType = object> {
        /** @type int4 @default nextval('transaction_id_seq'::regclass) */
        id: TransactionFields.id;
        /** @type int4 */
        amount: TransactionFields.amount;
        /** @type int4 */
        payerId: TransactionFields.payerId;
        /** @type enum_transaction_type @default 'PAYMENT'::enum_transaction_type */
        transactionType: TransactionFields.transactionType;
        /** @type json */
        data: TransactionFields.data<DataType>;
        /** @type timestamp @default now() */
        createdAt: TransactionFields.createdAt;
        /** @type timestamp @default now() */
        updatedAt: TransactionFields.updatedAt;
        /** @type timestamp */
        deletedAt: TransactionFields.deletedAt;
      }

      export namespace UserFields {
        export type id = number;
        export type firstName = string;
        export type lastName = string;
        export type emailAddress = string;
        export type emailVerified = boolean;
        export type createdAt = Date;
        export type updatedAt = Date;
        export type deletedAt = Date | null;
      }

      export interface User {
        /** @type int4 @default nextval('user_id_seq'::regclass) */
        id: UserFields.id;
        /** @type varchar */
        firstName: UserFields.firstName;
        /** @type varchar */
        lastName: UserFields.lastName;
        /** @type varchar */
        emailAddress: UserFields.emailAddress;
        /** @type bool @default false */
        emailVerified: UserFields.emailVerified;
        /** @type timestamp @default now() */
        createdAt: UserFields.createdAt;
        /** @type timestamp @default now() */
        updatedAt: UserFields.updatedAt;
        /** @type timestamp */
        deletedAt: UserFields.deletedAt;
      }
    `);
  });

  it('should console.warn', async () => {
    const filename = path.join(os.tmpdir(), 'abc.ts');
    const sq = new SqReflect({
      filename,
      conn: connectionString,
      schema: 'non_existent_schema',
      meta: true,
      generics: true,
      case: 'camel',
    });

    const consoleWarnSpy = jest.spyOn(console, 'warn');

    await sq.scrape();
    await sq.compile();
    await sq.save();

    const contents = await fse.readFile(filename).then(f => f.toString());

    expect(contents).toBe(source`
      /**
       * THIS IS AN AUTO GENERATED FILE - DO NOT EDIT
       */

      /* eslint-disable */
      /* tslint:disable */
    `);

    expect(consoleWarnSpy).toHaveBeenCalledWith('no tables were found.');

    consoleWarnSpy.mockRestore();
  });
});
