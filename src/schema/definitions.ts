export interface TypeDefinition {
  id: number;
  name: string;
  namespace_id: number;
  namespace: string;
}

export interface EnumDefinition extends TypeDefinition {
  arr_id: number | null;
  arr_name: string | null;
  values: string[];
}

export interface AttributeDefinition {
  name: string;
  nullable: boolean;
  number: number;
  type: TypeDefinition;
  default: string | null;
}

export enum ClassType {
  TABLE = 'r',
  VIEW = 'v',
}

export interface ClassDefinition {
  id: number;
  name: string;
  type: ClassType;
  namespace_id: number;
  namespace: string;
  attributes: AttributeDefinition[];
}
