export interface NamingStrategy {
  enum(name: string): string;
  namespace(name: string): string;
  type(name: string): string;
  interface(name: string): string;
  property(name: string): string;
}

export { CamelCaseNamingStrategy } from './camel-case';
export { SnakeCaseNamingStrategy } from './snake-case';
export { PassiveNamingStrategy } from './passive';
