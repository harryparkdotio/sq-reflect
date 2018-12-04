import * as Case from 'change-case';

import { reservedKeywords } from './constants';

export class Transform {
  static reserved(string: string): string {
    if (reservedKeywords.includes(string)) {
      return string + '_';
    }

    return string;
  }

  static camel(string: string): string {
    return Case.camel(string);
  }

  static pascal(string: string): string {
    return Case.pascal(string);
  }

  static snake(string: string): string {
    return Case.snake(string);
  }

  static dot(string: string): string {
    return Case.dot(string);
  }
}
