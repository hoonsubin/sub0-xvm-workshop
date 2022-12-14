import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './transfer-flow.css';
import { Account } from '../types/chain';
import { useContractContext } from '../providers';
import * as polkaUtilsCrypto from '@polkadot/util-crypto';
import * as polkaUtils from '@polkadot/util';
import { getShortenAddress } from '../helpers';
import { wasmErc20Abi, wasmPsp22Abi } from '../abi';

type SignerType = null | 'Substrate' | 'EVM';

const TransactionFlow = ({
  fromAccount,
  toAddress,
}: {
  fromAccount: Account | undefined;
  toAddress: string;
}) => {
  const { erc20Evm, erc20Wasm, psp22Wasm } = useContractContext();
  const [destAddress, setDestAddress] = useState<string>('');
  const [signerType, setSignerType] = useState<SignerType>(null);
  const [contractName, setContractName] = useState<string>('');

  const isMappedH160 =
    signerType === 'EVM' && !polkaUtilsCrypto.isEthereumAddress(toAddress);

  const handleUpdateSignerType = (): void => {
    if (!fromAccount) return;
    setSignerType(fromAccount.type === 'h160' ? 'EVM' : 'Substrate');
  };

  const handleUpdateStates = async (): Promise<void> => {
    handleUpdateSignerType();

    if (!fromAccount || !toAddress) return;
    const isDestAddressEvm = polkaUtilsCrypto.isEthereumAddress(toAddress);

    if (fromAccount.type === 'h160') {
      setContractName('ERC20 Smart Contract');
      const evmRecipient = isDestAddressEvm
        ? toAddress
        : polkaUtils.u8aToHex(polkaUtilsCrypto.addressToEvm(toAddress));
      setDestAddress(evmRecipient);
    }

    if (fromAccount.type === 'ss58') {
      setContractName(
        isDestAddressEvm
          ? wasmErc20Abi.contract.name
          : wasmPsp22Abi.contract.name
      );
      const xvmContract = isDestAddressEvm
        ? erc20Wasm?.address.toString()
        : psp22Wasm?.address.toString();

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
          <span className="flow--text--title">Smart Contract</span>
          <span className="flow--text--value">{contractName}</span>
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
          {isMappedH160 && (
            <span className="flow--text--remark">(Mapped H160 Address)</span>
          )}
          <span className="flow--text--value">
            {getShortenAddress(destAddress)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionFlow;
