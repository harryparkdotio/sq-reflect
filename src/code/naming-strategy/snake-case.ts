import { Transform } from '../../transform';

import { NamingStrategy } from '.';

export class SnakeCaseNamingStrategy extends NamingStrategy {
  enum(name: string) {
    return Transform.pascal(name);
  }

  namespace(name: string) {
    return Transform.pascal(name);
  }

  type(name: string) {
    return Transform.pascal(name);
  }

  interface(name: string) {
    return Transform.pascal(name);
  }

  property(name: string) {
    return Transform.snake(name);
  }

  udt(name: string) {
    return Transform.pascal(name);
  }
}
