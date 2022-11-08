import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import Web3 from "web3";
import {
  connectToMetaMask,
  getConnectedAccount,
} from "../helpers/metamaskProvider";
import { Account } from "../types/chain";

//todo: add Polkadot.js API support too
interface Web3Wallet {
  evm: Web3;
}

type Web3ProviderContextType = {
  wallet: Web3Wallet;
  isConnectedToEvm: boolean;
  getAccounts: () => Account[];
  setWallet: (wallet: Web3Wallet) => void;
  initEvmProvider: () => Promise<void>;
};

// initializing the context
export const WalletContext = createContext<Web3ProviderContextType | null>(
  null
);

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const Web3Provider = ({ children }: Props) => {
  const [h160Account, setH160Account] = useState<Account>();
  //const [ss58Account, setSs58Account] = useState<string[]>([]);
  const [isConnectedToEvm, setEvmConnection] = useState(false);
  const [wallet, setWallet] = useState<Web3Wallet>(() => {
    const initialState: Web3Wallet = {
      evm: new Web3(),
    };
    return initialState;
  });

  // check if the page is connected to the EVM RPC. We only perform this after the user connected their MetaMask.
  useEffect(() => {
    const fetchNetState = async () => {
      try {
        const connected = await wallet.evm.eth.net.isListening();
        if (connected) {
          console.log("Connected to the EVM RPC");
        }

        setEvmConnection(connected);
      } catch (e) {
        console.error(e);
      }
    };

    if (isConnectedToEvm) {
      fetchNetState().catch(console.error);
    }
  }, [isConnectedToEvm]);

  const initEvmProvider = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("The user does not have any Ethereum wallet installed");
    }
    // try to fetch accounts first
    let account = await getConnectedAccount();

    // if no account was loaded, try requesting one
    try {
      if (!account) {
        account = await connectToMetaMask();
      }
    } catch (e) {
      console.error(e);
    }

    // if we have all the accounts connected
    if (account) {
      // set the Eth provider as MetaMask
      wallet.evm.setProvider(window.ethereum as any);
      console.log(`Connected to account ${account}`);

      // set the connection status true if an account was loaded
      setEvmConnection(true);
      const evmAccount: Account = {
        address: account,
        type: "h160",
      };

      setH160Account(evmAccount);
    }
  }, [wallet]);

  // if the user changes the active account
  window.ethereum!.on("accountsChanged", initEvmProvider);

  const getAccounts = useCallback(() => {
    //todo: add substrate native accounts in the array
    return h160Account ? [h160Account] : [];
  }, [h160Account]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnectedToEvm,
        setWallet,
        initEvmProvider,
        getAccounts,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () =>
  useContext(WalletContext) as Web3ProviderContextType;
