import 'reflect-metadata';
import * as ini from 'ini';
import * as fs from 'fs';

export interface IniOptions {
  file: string;
}

export interface Meta {
  groupName: string,
  propertyKey: string | symbol,
  type: any,
}

interface TypeProcessorFn {
  (input: string): any
}

export const typeProcessors: WeakMap<any, TypeProcessorFn> = new WeakMap();

typeProcessors.set(Number, (input: string) => parseFloat(input));

export function Ini(options: IniOptions): ClassDecorator {
  return (target: any) => {
    const meta = Reflect.getMetadata('props', target) as Meta[];
    const contents = fs.readFileSync(options.file).toString('utf-8');
    const data = ini.parse(contents);

    meta.forEach((row) => {
      Reflect.defineProperty(target, row.propertyKey, {
        get() {
          const proc = typeProcessors.get(row.type);
          const val = data[row.groupName][row.propertyKey];

          if (proc) {
            return proc(val);
          }

          return val;
        },
      });
    });
  };
}

export function IniValue(groupName: string): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    let meta = Reflect.getMetadata('props', target) as Meta[];
    const type = Reflect.getMetadata('design:type', target, propertyKey);

    if (!meta) {
      meta = [];
    }

    meta.push({
      groupName,
      propertyKey,
      type,
    });

    Reflect.defineMetadata('props', meta, target);
  };
}
