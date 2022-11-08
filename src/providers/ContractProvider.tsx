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
import type { Contract } from "web3-eth-contract";
import { useWalletContext } from "./Web3Provider";
import { evmErc20Abi } from "../abi";
import { config } from "../config";

type ContractProviderContextType = {
  erc20Evm: Contract;
};

// initializing the context
export const ContractContext =
  createContext<ContractProviderContextType | null>(null);

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ContractProvider = ({ children }: Props) => {
  const { wallet } = useWalletContext();
  const [erc20Evm, setErc20Evm] = useState<Contract>(
    new wallet.evm.eth.Contract(evmErc20Abi as any, config.erc20EvmAddr)
  );

  useEffect(() => {
    const evmContract = new wallet.evm.eth.Contract(
      evmErc20Abi as any,
      config.erc20EvmAddr
    );

    setErc20Evm(evmContract);
  }, [wallet.evm]);

  return (
    <ContractContext.Provider value={{ erc20Evm }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () =>
  useContext(ContractContext) as ContractProviderContextType;
