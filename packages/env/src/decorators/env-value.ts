import "reflect-metadata";

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
    // tslint:disable-line:no-process-env
    return defaultValue;
  }

  const v = process.env[k]; // tslint:disable-line:no-process-env

  if (typeProcessors.has(propertyType)) {
    return typeProcessors.get(propertyType)(v);
  }

  return v;
}

// tslint:disable-next-line:no-any
envValue.registerProcessor = <F, T>(type: F, fn: TypeProcessorFunction<T>) => {
  typeProcessors.set(type, fn);
};

envValue.registerProcessor(Boolean, (v: string) => {
  switch (v.toLowerCase()) {
    case "true":
    case "1":
    case "on":
    case "yes":
      return true;
    case "false":
    case "0":
    case "off":
    case "no":
      return false;
    default:
      throw new Error(`Unknown boolean value: ${v}`);
    // ... throw an error, set false by default or do nothing
  }
});

envValue.registerProcessor(Date, (v: string) => new Date(v));
envValue.registerProcessor(Number, (v: string) => parseFloat(v));
