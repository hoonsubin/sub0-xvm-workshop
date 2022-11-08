import BigNumber from "bignumber.js";
import BN from "bn.js";

export const denomToDecimal = (
  value: string | BigNumber | BN,
  decimal: number
) => {
  const minDenomVal = new BigNumber(value.toString());
  const decimalVal = new BigNumber(10).pow(decimal);
  return minDenomVal.div(decimalVal);
};
