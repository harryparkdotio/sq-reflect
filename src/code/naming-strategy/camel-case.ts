import { Transform } from '../../transform';

import { NamingStrategy } from '.';

export class CamelCaseNamingStrategy extends NamingStrategy {
  enum(name: string) {
    return Transform.pascal(name);
  }

  namespace(name: string) {
    return Transform.pascal(name);
  }

  type(name: string) {
    return Transform.camel(name);
  }

  interface(name: string) {
    return Transform.pascal(name);
  }

  property(name: string) {
    return Transform.camel(name);
  }

  udt(name: string) {
    return Transform.pascal(name);
  }
}
