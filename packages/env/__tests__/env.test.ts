import { envValue } from "../src";

process.env.YES_VALUE = 'yes';
process.env.NO_VALUE = 'no';

class Env {
  @envValue public static NODE_ENV: string;
  @envValue public static YES_VALUE: boolean;
  @envValue public static NO_VALUE: boolean;
}
 
describe('Env tests', () => {
  it('Simple', () => {
    expect(Env.NODE_ENV).toBe('test');

    Env.NODE_ENV = 'notest'
    expect(process.env.NODE_ENV).toBe('notest');
    expect(Env.NODE_ENV).toBe('notest');
    expect(Env.YES_VALUE).toBe(true);
    expect(Env.NO_VALUE).toBe(false);
  })
});
