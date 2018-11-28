import { Driver } from '../../../src/driver/interfaces';
import { RawEnumDefinition, RawTableDefinition, TableDefinition } from '../../../src/sql/definitions';
import { Meta } from '../../../src/sql/meta';

let queryResultMock = [];

const PostgresMock: Driver = {
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  query: jest.fn(),
};

beforeEach(() => {
  queryResultMock = [];
  PostgresMock.query = jest.fn().mockImplementation(() => queryResultMock);
});

describe('Meta', () => {
  describe('defaultSchema', () => {
    it('should return public', () => {
      expect(Meta.defaultSchema).toBe('public');
    });
  });

  describe('Enums', () => {
    it('should return an array of EnumDefinitions', async () => {
      (queryResultMock as RawEnumDefinition[]) = [
        {
          name: 'enum_user_status',
          values: ['PENDING', 'VERIFIED', 'DISABLED', 'FAILED'],
        },
      ];

      const meta = new Meta(PostgresMock);

      const enums = await meta.Enums();

      expect(enums).toEqual([
        {
          name: 'enum_user_status',
          schema: 'public',
          values: ['PENDING', 'VERIFIED', 'DISABLED', 'FAILED'],
        },
      ]);
    });

    it('should call db.query with default params', async () => {
      const meta = new Meta(PostgresMock);

      await meta.Enums();

      expect((PostgresMock.query as jest.Mock).mock.calls[0][1]).toEqual(['public']);
    });

    it('should call db.query with params', async () => {
      const meta = new Meta(PostgresMock);

      await meta.Enums({ schema: 'not_public' });

      expect((PostgresMock.query as jest.Mock).mock.calls[0][1]).toEqual(['not_public']);
    });
  });

  describe('Tables', () => {
    it('should return an array of TableDefinitions', async () => {
      (queryResultMock as RawTableDefinition[]) = [
        {
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'int4',
              typeSchema: 'pg_catalog',
              nullable: false,
              alt: 'integer',
            },
            {
              name: 'status',
              alt: null,
              type: 'enum_user_status',
              nullable: false,
              typeSchema: 'public',
            },
          ],
        },
      ];

      const meta = new Meta(PostgresMock);

      const tables = await meta.Tables();

      const UsersTable: TableDefinition = {
        name: 'users',
        schema: 'public',
        columns: [
          {
            name: 'id',
            nullable: false,
            type: {
              sql: 'int4',
              alt: 'integer',
              type: 'number',
              schema: 'pg_catalog',
            },
          },
          {
            name: 'status',
            nullable: false,
            type: {
              sql: 'enum_user_status',
              alt: null,
              type: undefined,
              schema: 'public',
            },
          },
        ],
      };

      expect(tables).toEqual([UsersTable]);
    });

    it('should call db.query with default params', async () => {
      (queryResultMock as RawTableDefinition[]) = [
        {
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'int4',
              typeSchema: 'pg_catalog',
              nullable: false,
              alt: 'integer',
            },
            {
              name: 'status',
              alt: null,
              type: 'enum_user_status',
              nullable: false,
              typeSchema: 'public',
            },
          ],
        },
      ];

      const meta = new Meta(PostgresMock);

      await meta.Tables();

      expect((PostgresMock.query as jest.Mock).mock.calls[0][1]).toEqual(['public']);
    });

    it('should call db.query with params', async () => {
      (queryResultMock as RawTableDefinition[]) = [];

      const meta = new Meta(PostgresMock);

      await meta.Tables({ schema: 'not_public' });

      expect((PostgresMock.query as jest.Mock).mock.calls[0][1]).toEqual(['not_public']);
    });
  });
});
