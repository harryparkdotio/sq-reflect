export interface TypeDefinition {
  name: string;
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

export interface RawEnumDefinition {
  name: string;
  values: any[];
}
