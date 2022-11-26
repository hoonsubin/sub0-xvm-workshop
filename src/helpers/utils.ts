export const getShortenAddress = (address: string, place = 6): string => {
  return address
    ? `${address.slice(0, place)}${'.'.repeat(place)}${address.slice(-place)}`
    : '';
};

// Memo: format a number with commas as thousands separators
export const formatNumber = (value: number | string) => {
  const num = Number(Number(value).toFixed(2));
  return num.toLocaleString('en-US');
};
