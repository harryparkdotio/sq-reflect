export interface TypeDefinition {
  sql: string;
  alt: string | null;
  schema: string;
  type: string;
}

export interface ColumnDefinition {
  name: string;
  nullable: boolean;
  type: TypeDefinition;
}

export interface TableDefinition {
  name: string;
  schema?: string;
  columns: ColumnDefinition[];
}

export interface EnumDefinition {
  name: string;
  schema?: string;
  values: any[];
}

export interface RawTypeDefinition {
  alt: string | null;
  type: string;
  schema: string;
}

export interface RawColumnDefinition {
  name: string;
  nullable: boolean;
  type: string;
  alt: string | null;
  typeSchema: string;
}

export interface RawTableDefinition {
  name: string;
  columns: RawColumnDefinition[];
}

export interface RawEnumDefinition {
  name: string;
  values: any[];
}
