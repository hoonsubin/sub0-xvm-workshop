export const getConnectedAccount = async () => {
  const accounts: string[] = (await window.ethereum!.request({
    method: "eth_accounts",
  })) as string[];
  // return the account or an empty string to prevent returning undefine
  return accounts[0]? accounts[0] : "";
};

export const connectToMetaMask = async () => {
  try {
    const accounts: string[] = (await window.ethereum!.request({
      method: "eth_requestAccounts",
    })) as string[];

    return accounts[0];
  } catch (e: any) {
    // user rejected the request (EIP-1193)
    if (e.code === 4001) {
      throw new Error("User rejected the request");
    }
    throw new Error(e);
  }
};
