import React, { createContext, useContext, useState, useEffect } from "react";
import type { Contract } from "web3-eth-contract";
import { useWalletContext } from "./Web3Provider";
import { evmErc20Abi, wasmErc20Abi, wasmPsp22Abi } from "../abi";
import { config } from "../config";
import { ContractPromise } from "@polkadot/api-contract";

type ContractProviderContextType = {
  erc20Evm: Contract;
  erc20Wasm?: ContractPromise;
  psp22Wasm?: ContractPromise;
};

// initializing the context
export const ContractContext =
  createContext<ContractProviderContextType | null>(null);

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ContractProvider = ({ children }: Props) => {
  const { wallet } = useWalletContext();
  // initialize ERC20 on EVM
  const [erc20Evm, setErc20Evm] = useState<Contract>(
    new wallet.evm.eth.Contract(evmErc20Abi as any, config.erc20EvmAddr)
  );

  //note: This will not work becaus ewe need the API to be fully connected before loading the contract!

  // initialize ERC20 on Substrate
  const [erc20Wasm, setErc20Wasm] = useState<ContractPromise>();

  // initialize PSP22 on Substrate
  const [psp22Wasm, setPsp22Wasm] = useState<ContractPromise>();

  // initialize again when the component loads (maybe not needed)
  useEffect(() => {
    const evmContract = new wallet.evm.eth.Contract(
      evmErc20Abi as any,
      config.erc20EvmAddr
    );

    setErc20Evm(evmContract);
  }, [wallet.evm]);

  useEffect(() => {
    console.log(`Connected to Substrate RPC: ${wallet.substrate.isConnected}`);

    const initializeWasmContracts = async () => {
      const substrateApi = await wallet.substrate.isReady;
      const wasmErc20Contract = new ContractPromise(
        substrateApi,
        wasmErc20Abi,
        config.erc20NativeAddr
      );
      setErc20Wasm(wasmErc20Contract);

      const wasmPsp22Contract = new ContractPromise(
        substrateApi,
        wasmPsp22Abi,
        config.psp22NativeAddr
      );
      setPsp22Wasm(wasmPsp22Contract);

      console.log(
        `Connected to Substrate RPC: ${wallet.substrate.isConnected}`
      );
    };

    initializeWasmContracts().catch(console.log);
  }, [wallet.substrate]);

  return (
    <ContractContext.Provider value={{ erc20Evm, erc20Wasm, psp22Wasm }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () =>
  useContext(ContractContext) as ContractProviderContextType;
