import { Transform } from '../../transform';

import { NamingStrategy } from '.';

export class SnakeCaseNamingStrategy implements NamingStrategy {
  enum(name: string) {
    return Transform.snake(name);
  }

  namespace(name: string) {
    return Transform.snake(name);
  }

  type(name: string) {
    return Transform.snake(name);
  }

  interface(name: string) {
    return Transform.snake(name);
  }

  property(name: string) {
    return Transform.snake(name);
  }
}
