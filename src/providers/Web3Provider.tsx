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
import { ApiPromise, WsProvider } from "@polkadot/api";
import { config } from "../config";
import {
  web3Enable,
  isWeb3Injected,
  web3Accounts,
} from "@polkadot/extension-dapp";
import * as polkaUtilsCrypto from "@polkadot/util-crypto";

//todo: add Polkadot.js API support too
interface Web3Wallet {
  evm: Web3;
  substrate: ApiPromise;
}

type Web3ProviderContextType = {
  wallet: Web3Wallet;
  isConnectedToEvm: boolean;
  isConnectedToSubstrate: boolean;
  getAccounts: () => Account[];
  setWallet: (wallet: Web3Wallet) => void;
  initEvmProvider: () => Promise<void>;
  initSubstrateProvider: () => Promise<void>;
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
  const [ss58Account, setSs58Account] = useState<Account[]>([]);
  const [isConnectedToEvm, setEvmConnection] = useState(false);
  const [isConnectedToSubstrate, setSubstrateConnection] = useState(false);
  const [wallet, setWallet] = useState<Web3Wallet>(() => {
    const initialState: Web3Wallet = {
      evm: new Web3(),
      substrate: new ApiPromise({
        provider: new WsProvider(config.substrateEndpoint),
      }),
    };
    return initialState;
  });

  // check if the page is connected to the EVM RPC. We only perform this after the user connected their MetaMask.
  useEffect(() => {
    const fetchNetState = async () => {
      try {
        const connectedEvm = await wallet.evm.eth.net.isListening();
        if (connectedEvm) {
          console.log("Connected to the EVM RPC");
        }

        setEvmConnection(connectedEvm);

        setWallet({
          ...wallet,
          evm: wallet.evm,
        });
      } catch (e) {
        console.error(e);
      }
    };

    if (isConnectedToEvm) {
      fetchNetState().catch(console.error);
    }
  }, [isConnectedToEvm]);

  // check if the page is connected to the Substrate RPC
  useEffect(() => {
    const fetchNetState = async () => {
      try {
        const connectedSubstrateWallet = await web3Accounts();
        const connectedSubstrateRpc = wallet.substrate.isConnected;

        const substrateConnectStat =
          connectedSubstrateRpc && connectedSubstrateWallet.length > 0;
        if (substrateConnectStat) {
          console.log("Connected to a Substrate wallet");
        }

        setWallet({
          ...wallet,
          substrate: await wallet.substrate.isReady,
        });

        setSubstrateConnection(substrateConnectStat);
      } catch (e) {
        console.error(e);
      }
    };

    if (isConnectedToEvm) {
      fetchNetState().catch(console.error);
    }
  }, [isConnectedToSubstrate]);

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
        name: "Alice Dev",
      };

      setH160Account(evmAccount);
    }
  }, [wallet]);

  // if the user changes the active account
  window.ethereum!.on("accountsChanged", initEvmProvider);

  // load Substrate wallet and set the signer
  const initSubstrateProvider = useCallback(async () => {
    if (!isWeb3Injected) {
      throw new Error("The user does not have any Substrate wallet installed");
    }

    const extensions = await web3Enable("XVM Demo");

    // set the first wallet as the signer (we assume there is only one wallet)
    wallet.substrate.setSigner(extensions[0].signer);

    const injectedAccounts = await web3Accounts();

    if (injectedAccounts.length > 0) {
      const accounts = injectedAccounts.map((i) => {
        return {
          address: polkaUtilsCrypto.encodeAddress(i.address, 5),
          type: "ss58",
          name: i.meta.name || "Talisman",
        } as Account;
      });
      setSs58Account(accounts);
      setSubstrateConnection(true);
    }
  }, [wallet]);

  const getAccounts = useCallback(() => {
    //todo: add substrate native accounts in the array

    return h160Account ? [h160Account, ...ss58Account] : ss58Account;
  }, [h160Account, ss58Account]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnectedToEvm,
        isConnectedToSubstrate,
        setWallet,
        initEvmProvider,
        initSubstrateProvider,
        getAccounts,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () =>
  useContext(WalletContext) as Web3ProviderContextType;
