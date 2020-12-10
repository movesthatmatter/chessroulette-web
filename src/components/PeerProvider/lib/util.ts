const namespace = 'dstnd_';
export const wNamespace = (s: string) => `${namespace}${s}`;
export const woNamespace = (s: string) =>
  s.indexOf(namespace) > -1 ? s.slice(namespace.length) : s;

export type RoomCredentials = {
  id: string;
  code?: string;
}