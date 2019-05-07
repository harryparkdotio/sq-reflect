export abstract class NamingStrategy {
  public abstract enum(name: string): string;
  public abstract namespace(name: string): string;
  public abstract type(name: string): string;
  public abstract interface(name: string): string;
  public abstract property(name: string): string;
  public abstract udt(name: string): string;
}

export { CamelCaseNamingStrategy } from './camel-case';
export { SnakeCaseNamingStrategy } from './snake-case';
