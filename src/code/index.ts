import { source } from 'common-tags';

import { EnumDefinition, TableDefinition, TypeDefinition } from '../sql/definitions';
import { Transform } from '../transform';

import { NamingStrategy, PassiveNamingStrategy } from './naming-strategy';

export type CodeOptions = Partial<{
  namingStrategy: NamingStrategy;
}>;

export class Code {
  private readonly ns: NamingStrategy;

  constructor(options: CodeOptions = {}) {
    this.ns = options.namingStrategy || new PassiveNamingStrategy();
  }

  enum(definition: EnumDefinition) {
    const _enum = Transform.reserved(this.ns.enum(definition.name));

    return source`
      export enum ${_enum} {
        ${definition.values.sort().map(val => `${val} = '${val}',`)}
      }
    `;
  }

  table(definition: TableDefinition) {
    const _namespace = Transform.reserved(this.ns.namespace(`${definition.name}_fields`));
    const _interface = Transform.reserved(this.ns.interface(definition.name));

    interface Cols {
      type: string;
      prop: string;
      ref: string;
    }

    const cols = definition.columns.map<Cols>(col => ({
      type: this.type(col.type),
      prop: this.ns.property(col.name),
      ref: Transform.reserved(this.ns.type(col.name)),
    }));

    return source`
      export namespace ${_namespace} {
        ${cols.map(col => `export type ${col.ref} = ${col.type};`)}
      }

      export interface ${_interface} {
        ${cols.map(col => `${col.prop}: ${_namespace}.${col.ref};`)}
      }
    `;
  }

  type(definition: TypeDefinition) {
    const types = [definition.type || 'any', definition.nullable && 'null'];

    return types.filter(type => type).join(' | ');
  }
}
