export const flatten = <T>(arr: T[][]): T[] =>
  arr.reduce<T[]>((a, b) => a.concat(b), []);
