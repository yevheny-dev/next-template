export const uuidv4 = (): string => {
  return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: string): string => {
    const nC = Number(c);
    return (nC ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (nC / 4)))).toString(16);
  });
};
