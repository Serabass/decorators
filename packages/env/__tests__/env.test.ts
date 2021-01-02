import { envValue } from "../src";

class Env {
  @envValue public static NODE_ENV: string;
}

describe('Env tests', () => {
  it('Simple', () => {
    expect(Env.NODE_ENV).toBe('test');

    Env.NODE_ENV = 'notest'
    expect(process.env.NODE_ENV).toBe('notest');
    expect(Env.NODE_ENV).toBe('notest');
  })
});