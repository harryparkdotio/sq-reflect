export interface TypeDefinition {
  sql: string;
  alt: string | null;
  nullable: boolean;
  schema: string;
  type: string | null;
  default: string | null;
}

export interface ColumnDefinition {
  name: string;
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

export interface RawColumnDefinition {
  name: string;
  nullable: boolean;
  type: string;
  alt: string | null;
  typeSchema: string;
  default: string | null;
}

export interface RawTableDefinition {
  name: string;
  columns: RawColumnDefinition[];
}

export interface RawEnumDefinition {
  name: string;
  values: any[];
}
