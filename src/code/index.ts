import { inlineLists, source } from 'common-tags';

import { EnumDefinition, TableDefinition, TypeDefinition } from '../sql/definitions';
import { Transform } from '../transform';

import { NamingStrategy, PassiveNamingStrategy } from './naming-strategy';

export type CodeOptions = Partial<{
  namingStrategy: NamingStrategy;
  emitMetadata: boolean;
}>;

export class Code {
  private readonly ns: NamingStrategy;
  private readonly definitions: string[];
  private opt: { meta: boolean };

  constructor(options: CodeOptions = {}) {
    this.ns = options.namingStrategy || new PassiveNamingStrategy();
    this.definitions = [];

    this.opt = {
      meta: options.emitMetadata || false,
    };
  }

  define(type: string): void {
    this.definitions.push(type);
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
      meta: string;
    }

    const cols = definition.columns.map<Cols>(col => ({
      type: this.type(col.type),
      prop: this.ns.property(col.name),
      ref: Transform.reserved(this.ns.type(col.name)),
      meta: col.type.sql,
    }));

    return source`
      export namespace ${_namespace} {
        ${cols.map(col => `export type ${col.ref} = ${col.type};`)}
      }

      export interface ${_interface} {
        ${[].concat(
          ...cols.map(col =>
            [
              `${this.opt.meta && col.meta ? this.meta({ type: col.meta }) : ''}`,
              `${col.prop}: ${_namespace}.${col.ref};`,
            ].filter(elem => elem)
          )
        )}
      }
    `;
  }

  type(definition: TypeDefinition) {
    const udt = !definition.type && this.definitions.find(def => def === definition.sql);

    const types = [definition.type || (udt && this.ns.udt(udt)) || 'any'];

    definition.nullable && types.push('null');

    return types.join(' | ');
  }

  meta(metadata: { [doc: string]: any }) {
    const meta = Object.keys(metadata);
    return inlineLists`/** ${meta.map(m => `@${m} ${metadata[m]}`)} */`;
  }
}
