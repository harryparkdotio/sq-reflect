jest.mock('../../../../src/transform');

import { CamelCaseNamingStrategy } from '../../../../src/code/naming-strategy';
import { Transform } from '../../../../src/transform';

describe('CamelCaseNamingStrategy', () => {
  describe('enum', () => {
    it('should call Transform.pascal', () => {
      const text = 'enum';

      new CamelCaseNamingStrategy().enum(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });

  describe('namespace', () => {
    it('should call Transform.pascal', () => {
      const text = 'namespace';

      new CamelCaseNamingStrategy().namespace(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });

  describe('type', () => {
    it('should call Transform.camel', () => {
      const text = 'type';

      new CamelCaseNamingStrategy().type(text);
      expect(Transform.camel).toHaveBeenCalledWith(text);
    });
  });

  describe('interface', () => {
    it('should call Transform.pascal', () => {
      const text = 'interface';

      new CamelCaseNamingStrategy().interface(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });

  describe('property', () => {
    it('should call Transform.camel', () => {
      const text = 'property';

      new CamelCaseNamingStrategy().property(text);
      expect(Transform.camel).toHaveBeenCalledWith(text);
    });
  });
});
