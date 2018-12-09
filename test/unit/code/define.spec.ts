import { Code } from '../../../src/code';

describe('define', () => {
  it('should define udt', () => {
    const spy = jest.spyOn(Array.prototype, 'push');
    const code = new Code();
    const definition = 'enum_user_status';

    code.define(definition);

    expect(Array.prototype.push).toHaveBeenCalledWith(definition);

    spy.mockRestore();
  });
});
