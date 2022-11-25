export const getShortenAddress = (address: string, place = 6): string => {
  return address
    ? `${address.slice(0, place)}${'.'.repeat(place)}${address.slice(-place)}`
    : '';
};
