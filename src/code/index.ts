import { inlineLists, source } from 'common-tags';

import { genericableTypes } from '../constants';
import {
  EnumDefinition,
  TableDefinition,
  TypeDefinition,
} from '../sql/definitions';
import { Transform } from '../transform';

import { NamingStrategy } from './naming-strategy';

export interface CodeOptions {
  namingStrategy: NamingStrategy;
  emitMetadata: boolean;
  emitGenerics: boolean;
}

type ParialCodeOptions = Partial<CodeOptions>;
type RequiredCodeOptions = Pick<CodeOptions, 'namingStrategy'>;

export class Code {
  private readonly ns: NamingStrategy;
  private readonly definitions: string[];
  private opt: { meta: boolean; generics: boolean };

  constructor(options: ParialCodeOptions & RequiredCodeOptions) {
    this.ns = options.namingStrategy;
    this.definitions = [];

    this.opt = {
      meta: options.emitMetadata || false,
      generics: options.emitGenerics || false,
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
    const _namespace = Transform.reserved(
      this.ns.namespace(`${definition.name}_fields`)
    );
    const _interface = Transform.reserved(this.ns.interface(definition.name));

    interface Cols {
      type: { type: string; nullable: string; generic: string };
      prop: string;
      ref: string;
      meta: object;
      generic: string;
    }

    const cols = definition.columns.map<Cols>(col => ({
      type: this.type(col.type),
      prop: this.ns.property(col.name),
      ref: Transform.reserved(this.ns.property(col.name)),
      meta: {
        type: col.type.sql,
        ...(col.type.default && { default: col.type.default }),
      },
      generic:
        this.opt.generics && genericableTypes.includes(this.type(col.type).type)
          ? this.ns.udt(col.name + '_type')
          : '',
    }));

    const generics = cols
      .filter(col => col.generic)
      .map(({ generic, type: { type } }) => `${generic} = ${type}`)
      .join(', ');

    return source`
      export namespace ${_namespace} {
        ${cols.map(
          ({ generic, ref, type }) =>
            `export type ${ref}${generic ? `<T = ${type.type}>` : ''} = ${
              generic ? type.generic : type.nullable
            };`
        )}
      }

      export interface ${_interface}${generics ? `<${generics}>` : ''} {
        ${[].concat(
          ...cols.map(({ generic, meta, prop, ref }) =>
            [
              `${this.opt.meta && meta ? this.meta(meta) : ''}`,
              `${prop}: ${_namespace}.${ref}${generic ? `<${generic}>` : ''};`,
            ].filter(elem => elem)
          )
        )}
      }
    `;
  }

  type(definition: TypeDefinition) {
    const udt =
      !definition.type && this.definitions.find(def => def === definition.sql);
    const type = definition.type || (udt && this.ns.udt(udt)) || 'any';
    const _null = definition.nullable ? ['null'] : [];

    return {
      type,
      nullable: [type, ..._null].join(' | '),
      generic: ['T', ..._null].join(' | '),
    };
  }

  meta(metadata: { [doc: string]: any }) {
    const meta = Object.keys(metadata);
    return inlineLists`/** ${meta.map(m => `@${m} ${metadata[m]}`)} */`;
  }
}
