import { Code } from '../../../src/code';
import { SnakeCaseNamingStrategy } from '../../../src/code/naming-strategy';

describe('code', () => {
  describe('define', () => {
    it('should define udt', () => {
      const spy = jest.spyOn(Array.prototype, 'push');
      const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });
      const definition = 'enum_user_status';

      code.define(definition);

      expect(Array.prototype.push).toHaveBeenCalledWith(definition);

      spy.mockRestore();
    });
  });

  describe('meta', () => {
    it('should return inline jsdoc string', () => {
      const code = new Code({ namingStrategy: new SnakeCaseNamingStrategy() });
      expect(code.meta({ type: 'a', default: 'b' })).toBe('/** @type a @default b */');
    });
  });
});
