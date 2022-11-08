import BigNumber from "bignumber.js";

export const denomToDecimal = (value: string, decimal: number) => {
  const minDenomVal = new BigNumber(value.toString());
  const decimalVal = new BigNumber(10).pow(decimal);
  return minDenomVal.div(decimalVal);
};

export const decimalToDenom = (value: string, decimal: number) => {
  const fraction = new BigNumber(value);
  const decimalVal = new BigNumber(10).pow(decimal);

  return fraction.multipliedBy(decimalVal);
};
