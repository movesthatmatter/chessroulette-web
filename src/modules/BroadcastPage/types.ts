export type ApiError = {
  type: 'BadRequest';
  value: unknown;
};

export type NDJsonReaderUniversal<T> = {
  read: () => Promise<
    | {
        done: false;
        value: T
      }
    | {
        done: true;
        value: undefined;
      }
  >;
};