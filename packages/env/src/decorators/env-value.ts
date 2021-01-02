import "reflect-metadata";
import yn from 'yn';

type TypeProcessorFunction<R> = (v: string) => R;

let typeProcessors = new WeakMap<any, TypeProcessorFunction<any>>();

// tslint:disable-next-line:no-any
export function envValue(target: any, propertyKey: string | symbol) {
  const propertyType = Reflect.getMetadata("design:type", target, propertyKey);
  const defaultValue = target[propertyKey];

  Object.defineProperty(target, propertyKey, {
    // value   : getEnvValue(propertyKey, defaultValue, propertyType), // Without getter
    get        : () => getEnvValue(propertyKey, defaultValue, propertyType),
    set        : (value) => {
      process.env[propertyKey as string] = value.toString();
    },
    enumerable : true,
  });
}

// tslint:disable-next-line:no-any
function getEnvValue(
  propertyKey: string | symbol,
  defaultValue: string,
  propertyType: any
) {
  const k = propertyKey as string;

  if (!(k in process.env)) {
    return defaultValue;
  }

  const v = process.env[k];

  if (typeProcessors.has(propertyType)) {
    return typeProcessors.get(propertyType)(v);
  }

  return v;
}

envValue.registerProcessor = <F, T>(type: F, fn: TypeProcessorFunction<T>) => {
  typeProcessors.set(type, fn);
};

envValue.registerProcessor(Boolean, (v: string) => yn(v));
envValue.registerProcessor(Date, (v: string) => new Date(v));
envValue.registerProcessor(Number, (v: string) => parseFloat(v));
