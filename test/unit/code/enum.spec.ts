import * as dedent from 'dedent';

import { Code } from '../../../src/code';
import { CamelCaseNamingStrategy, SnakeCaseNamingStrategy } from '../../../src/code/naming-strategy';
import { EnumDefinition } from '../../../src/sql/definitions';

describe('enum', () => {
  it('should return enum source using SnakeCaseNamingStrategy', () => {
    const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

    const definition: EnumDefinition = {
      name: 'users_status',
      values: ['DISABLED', 'PENDING', 'VERIFIED'],
    };

    const source = code.enum(definition);

    expect(source).toBe(dedent`
      export enum users_status {
        DISABLED = 'DISABLED',
        PENDING = 'PENDING',
        VERIFIED = 'VERIFIED',
      }
    `);
  });

  it('should return enum source using CamelCaseNamingStrategy', () => {
    const code = new Code({ namingStrategy: new CamelCaseNamingStrategy() });

    const definition: EnumDefinition = {
      name: 'users_status',
      values: ['DISABLED', 'PENDING', 'VERIFIED'],
    };

    const source = code.enum(definition);

    expect(source).toBe(dedent`
      export enum UsersStatus {
        DISABLED = 'DISABLED',
        PENDING = 'PENDING',
        VERIFIED = 'VERIFIED',
      }
    `);
  });

  it('should transform enum name if reserved keyword', () => {
    const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });

    const definition: EnumDefinition = {
      name: 'default',
      values: ['DISABLED', 'PENDING', 'VERIFIED'],
    };

    const source = code.enum(definition);

    expect(source).toBe(dedent`
      export enum default_ {
        DISABLED = 'DISABLED',
        PENDING = 'PENDING',
        VERIFIED = 'VERIFIED',
      }
    `);
  });
});
