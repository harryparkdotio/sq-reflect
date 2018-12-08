import { NamingStrategy } from '.';

export class PassiveNamingStrategy implements NamingStrategy {
  enum(name: string) {
    return name;
  }

  namespace(name: string) {
    return name;
  }

  type(name: string) {
    return name;
  }

  interface(name: string) {
    return name;
  }

  property(name: string) {
    return name;
  }
}
