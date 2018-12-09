import { PassiveNamingStrategy } from '../../../../src/code/naming-strategy';

describe('PassiveNamingStrategy', () => {
  describe('enum', () => {
    it('should return input', () => {
      const text = 'enum';

      expect(new PassiveNamingStrategy().enum(text)).toBe(text);
    });
  });

  describe('namespace', () => {
    it('should return input', () => {
      const text = 'namespace';

      expect(new PassiveNamingStrategy().namespace(text)).toBe(text);
    });
  });

  describe('type', () => {
    it('should return input', () => {
      const text = 'type';

      expect(new PassiveNamingStrategy().type(text)).toBe(text);
    });
  });

  describe('interface', () => {
    it('should return input', () => {
      const text = 'interface';

      expect(new PassiveNamingStrategy().interface(text)).toBe(text);
    });
  });

  describe('property', () => {
    it('should return input', () => {
      const text = 'property';

      expect(new PassiveNamingStrategy().property(text)).toBe(text);
    });
  });

  describe('udt', () => {
    it('should return input', () => {
      const text = 'udt';

      expect(new PassiveNamingStrategy().udt(text)).toBe(text);
    });
  });
});
