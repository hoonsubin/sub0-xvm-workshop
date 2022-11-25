import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './transfer-flow.css';
import { Account } from '../types/chain';
import { useContractContext } from '../providers';
import * as polkaUtilsCrypto from '@polkadot/util-crypto';
import * as polkaUtils from '@polkadot/util';

type ContractType =
  | 'Contract Type'
  | 'ERC20 Smart Contract Address'
  | 'PSP22 XVM Smart Contract Address'
  | 'ERC20 XVM Smart Contract Address';

type SignerType = null | 'Substrate' | 'EVM';

const getShortenAddress = (address: string, place = 6): string => {
  return address
    ? `${address.slice(0, place)}${'.'.repeat(place)}${address.slice(-place)}`
    : '';
};

const TransactionFlow = ({
  fromAccount,
  toAddress,
}: {
  fromAccount: Account | undefined;
  toAddress: string;
}) => {
  const { erc20Evm, erc20Wasm, psp22Wasm } = useContractContext();
  const [destAddress, setDestAddress] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [signerType, setSignerType] = useState<SignerType>(null);
  const [contractType, setContractType] =
    useState<ContractType>('Contract Type');

  const handleUpdateSignerType = (): void => {
    if (!fromAccount) return;
    setSignerType(fromAccount.type === 'h160' ? 'EVM' : 'Substrate');
  };

  const handleUpdateStates = async (): Promise<void> => {
    handleUpdateSignerType();

    if (!fromAccount || !toAddress) return;
    const isDestAddressEvm = polkaUtilsCrypto.isEthereumAddress(toAddress);

    if (fromAccount.type === 'h160') {
      setContractType('ERC20 Smart Contract Address');
      const evmRecipient = isDestAddressEvm
        ? toAddress
        : polkaUtils.u8aToHex(polkaUtilsCrypto.addressToEvm(toAddress));
      setDestAddress(evmRecipient);
      setContractAddress(erc20Evm.options.address);
    }

    if (fromAccount.type === 'ss58') {
      setContractType(
        isDestAddressEvm
          ? 'ERC20 XVM Smart Contract Address'
          : 'PSP22 XVM Smart Contract Address'
      );
      const xvmContract = isDestAddressEvm
        ? erc20Wasm?.address.toString()
        : psp22Wasm?.address.toString();

      setContractAddress(xvmContract || '');
      setDestAddress(toAddress);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await handleUpdateStates();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [fromAccount, toAddress, erc20Evm, erc20Wasm, psp22Wasm]);

  return (
    <div className="wrapper">
      <div className="flow--title">
        <Typography variant="h5" component="div">
          Transaction Flow
        </Typography>
      </div>
      <div className="flow--box">
        <div className="flow--column">
          <span className="flow--text--title">Transaction Signer</span>
          <span className="flow--text--value">{signerType}</span>
        </div>
        <div className="flow--icon">
          <KeyboardArrowDownIcon
            className="flow--icon"
            color="primary"
            fontSize="large"
          />
        </div>
        <div className="flow--column">
          <span className="flow--text--title">{contractType}</span>
          <span className="flow--text--value">
            {getShortenAddress(contractAddress)}
          </span>
        </div>
        <div className="flow--icon">
          <KeyboardArrowDownIcon
            className="flow--icon"
            color="primary"
            fontSize="large"
          />
        </div>
        <div className="flow--column">
          <span className="flow--text--title">Destination</span>
          <span className="flow--text--value">
            {getShortenAddress(destAddress)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionFlow;
