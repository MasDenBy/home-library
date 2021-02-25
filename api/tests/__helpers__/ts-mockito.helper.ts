/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { instance } from "ts-mockito";

export const resolvableInstance = <T extends {}>(mock: T) => new Proxy<T>(instance(mock), {
  get(target, name: PropertyKey) {
    if (["Symbol(Symbol.toPrimitive)", "then", "catch"].includes(name.toString())) {
      return undefined;
    }

    return (target as any)[name];
  }
});