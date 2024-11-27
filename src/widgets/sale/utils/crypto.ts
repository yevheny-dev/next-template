export const createCipher = (salt: string): ((str: string) => string) => {
  const textToChars = (text: string) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n: string) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code: any) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text) => text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
};

export const createDecipher = (salt: string): ((str: string) => string) => {
  const textToChars = (text: string) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code: number) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return (encoded) =>
    (encoded.match(/.{1,2}/g) || [])
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
};
