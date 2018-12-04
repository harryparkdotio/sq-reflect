jest.mock('change-case');

import * as Case from 'change-case';

import { reservedKeywords } from '../../src/constants';
import { Transform } from '../../src/transform';

describe('transform', () => {
  describe('reserved', () => {
    it.each(reservedKeywords)("should suffix reserved keyword with '_' for '%s'", keyword => {
      expect(Transform.reserved(keyword)).toBe(`${keyword}_`);
    });

    it("should not suffix non reserved keyword with '_'", () => {
      expect(Transform.reserved('abcd')).toBe('abcd');
    });
  });

  describe('camel', () => {
    it('should call case.camel', () => {
      const string = 'abcd';

      Transform.camel(string);
      expect(Case.camel).toHaveBeenCalledWith(string);
    });
  });

  describe('pascal', () => {
    it('should call case.pascal', () => {
      const string = 'abcd';

      Transform.pascal(string);
      expect(Case.pascal).toHaveBeenCalledWith(string);
    });
  });

  describe('snake', () => {
    it('should call case.snake', () => {
      const string = 'abcd';

      Transform.snake(string);
      expect(Case.snake).toHaveBeenCalledWith(string);
    });
  });

  describe('dot', () => {
    it('should call case.dot', () => {
      const string = 'abcd';

      Transform.dot(string);
      expect(Case.dot).toHaveBeenCalledWith(string);
    });
  });
});
