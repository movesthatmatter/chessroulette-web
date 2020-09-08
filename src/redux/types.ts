/* eslint-disable @typescript-eslint/no-explicit-any */

export type GenericStateSlice<
  W extends { [k: string]: A },
  A extends (...args: any) => any
> = { [key in keyof W]: ReturnType<A> };
