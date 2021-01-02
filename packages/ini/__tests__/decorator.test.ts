import * as path from 'path';
import { Ini, IniValue } from '../src/ini';

describe('INI Decorator', () => {
  @Ini({
    file: path.join(__dirname, 'settings.ini'),
  })
  class Settings {
    @IniValue('Main')
    public static Key1: string;

    @IniValue('Main')
    public static Key2: string;

    @IniValue('Main')
    public static Number: number;

    @IniValue('Main')
    public static Bool: boolean;

    @IniValue('Main')
    public static BoolWithDefault: boolean;
  }
  it('Simple', () => {
    expect(Settings).toBeDefined();
    expect(Settings.Key1).toBe('Value1');
    expect(Settings.Key2).toBe('Value2');
    expect(Settings.Number).toBe(565);
    expect(Settings.Bool).toBe(true);
  });
});
