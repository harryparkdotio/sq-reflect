jest.mock('../../../../src/transform');

import { SnakeCaseNamingStrategy } from '../../../../src/code/naming-strategy';
import { Transform } from '../../../../src/transform';

describe('SnakeCaseNamingStrategy', () => {
  describe('enum', () => {
    it('should call Transform.snake', () => {
      const text = 'enum';

      new SnakeCaseNamingStrategy().enum(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });

  describe('namespace', () => {
    it('should call Transform.snake', () => {
      const text = 'namespace';

      new SnakeCaseNamingStrategy().namespace(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });

  describe('type', () => {
    it('should call Transform.snake', () => {
      const text = 'type';

      new SnakeCaseNamingStrategy().type(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });

  describe('interface', () => {
    it('should call Transform.snake', () => {
      const text = 'interface';

      new SnakeCaseNamingStrategy().interface(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });

  describe('property', () => {
    it('should call Transform.snake', () => {
      const text = 'property';

      new SnakeCaseNamingStrategy().property(text);
      expect(Transform.snake).toHaveBeenCalledWith(text);
    });
  });

  describe('udt', () => {
    it('should call Transform.snake', () => {
      const text = 'udt';

      new SnakeCaseNamingStrategy().udt(text);
      expect(Transform.pascal).toHaveBeenCalledWith(text);
    });
  });
});
