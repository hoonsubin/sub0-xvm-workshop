// deploy the contract and fill in the contract address
export const config = {
  substrateEndpoint: 'ws://127.0.0.1:9944',
  psp22NativeAddr: process.env.REACT_APP_PSP22_NATIVE_ADDRESS || '',
  erc20NativeAddr: process.env.REACT_APP_ERC20_NATIVE_ADDRESS || '',
  erc20EvmAddr: process.env.REACT_APP_ERC20_EVM_ADDRESS || '',
};
