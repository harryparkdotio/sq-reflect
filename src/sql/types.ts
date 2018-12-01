export interface TypeMap {
  type: string;
  types: string[];
}

export const typeMaps: TypeMap[] = [
  {
    type: 'string',
    types: [
      'bpchar',
      'char',
      'varchar',
      'text',
      'citext',
      'uuid',
      'bytea',
      'inet',
      'time',
      'timetz',
      'interval',
      'name',
    ],
  },
  {
    type: 'number',
    types: ['int2', 'int4', 'int8', 'float4', 'float8', 'numeric', 'money', 'oid'],
  },
  {
    type: 'boolean',
    types: ['bool'],
  },
  {
    type: 'object',
    types: ['json', 'jsonb'],
  },
  {
    type: 'Date',
    types: ['date', 'timestamp', 'timestamptz'],
  },
  {
    type: 'number[]',
    types: ['_int2', '_int4', '_int8', '_float4', '_float8', '_numeric', '_money'],
  },
  {
    type: 'boolean[]',
    types: ['_bool'],
  },
  {
    type: 'string[]',
    types: ['_varchar', '_text', '_citext', '_uuid', '_bytea'],
  },
  {
    type: 'object[]',
    types: ['_json', '_jsonb'],
  },
  {
    type: 'Date[]',
    types: ['_timestamptz'],
  },
];
