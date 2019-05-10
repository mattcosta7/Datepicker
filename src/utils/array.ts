export const chunk = <T extends any[]>(arr: T, chunkSize: number): Array<T> => {
  const result: any[] = [];
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};
