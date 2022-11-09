# Sub0 XVM Contract Demo App

## Introduction

This repository contains the full project for the Sub0 developer conference workshop.
The demo will focus on controlling an EVM ERC20 tokens from a Substrate native account.
With XVM, we can create a developer environment where projects can reside either in EVM with Ethereum signers or WASM contract with Substrate native signers.

Because we are controlling the ERC20 tokens in the EVM environment from a native account, we will extensively use the [EVM mapped address](https://medium.com/astar-network/using-astar-network-account-between-substrate-and-evm-656643df22a0), which does not have a direct signer attached to it.

## Architecture

XVM (Cross-Virtual Machine) takes a very straight-forward approach to interoperability as XVM is completely synchronous in the same chain.

![XVM Architecture](img/xvm-diagram.jpg)

For the call to work, we encode the arguments that are passed to a smart contract function and feed them to the chain extension.
The chain extension will communicate with the XVM core and send the message to the correct VM adapter with the corresponding ID.
That is when the contract is executed on chain.

## Prerequisites and Preparation

This demo is made with Debian Linux in mind, but the same requirements should apply to any Unix variant OS like macOS.

1. Install [Rust](https://www.rust-lang.org/tools/install)
2. Install [Cargo Contract](https://github.com/paritytech/cargo-contract)
3. Install npm (I recommend using [NVM](https://github.com/nvm-sh/nvm))
4. Install an Ethereum wallet and a Substrate wallet to your browser (we will use MetaMask and Talisman on Firefox for this example)
5. Clone the [Astar collator node](https://github.com/AstarNetwork/Astar/tree/feature/pallet-xvm-v2) and check out the `feature/pallet-xvm-v2` branch
6. Build the Astar collator node using `cargo build --release`
7. Run the Astar collator in a local dev mode with the `--dev --tmp` flag
8. (Optional) Clone the [ink XVM SDK](https://github.com/AstarNetwork/ink-xvm-sdk) repository and build the contract using `cargo contract build` (note that you have to build directly from the contract folder like `erc20` or `psp22-controller`). Because this demo repository contains the pre-compiled contract binaries, this step is optional
9. Import the EVM developer account private key `0x01ab6e801c06e59ca97a14fc0a1978b27fa366fc87450e0b65459dd3515b7391` to your Ethereum wallet

Once you confirm that your collator is running in dev mode, your Ethereum wallet is connected to the local network, and you successfully imported the EVM dev account that is fully funded, you should be ready to go.

## Using the demo

1. Visit [Remix](https://remix.ethereum.org) and connect it with MetaMask (ensure that MetaMask is connected to the local node).
2. Deploy the ERC20 contract (`./contracts/erc20.sol`) to the EVM environment.
3. Copy the contract address and save it for later.
4. Access the local node with the Polkadot-js Portal and open the contract page. You can open it directly with this [link](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/contracts).
5. Deploy two WASM contracts, one is the ERC20 implementation in ink (`./contracts/xvm_sdk_erc20.contract`) and the PSP20 controller contract (`./contracts/xvm_sdk_psp22.contract).
6. When deploying the two on Polkadot-js Portal, the page will ask you to provide an EVM address as the argument for the constructor. Paste the contract address of the ERC20 that we saved.
7. Open the `./src/config.ts` file and paste the three contract addresses.
8. Run `yarn` on this project folder to install its dependencies.
9. Run `yarn start` to start the project.
10. Once you are in the page, connect the page with your MetaMask and Talisman.
11. (important) Make sure that all accounts are funded with native tokens to pay the gas fee, both on the native side and on the EVM side to their mapped address!
12. From here, you can decide to send the ERC20 token with the original issuer to any other accounts (another EVM account, or a Substrate native account).
13. If a native account has an ERC20 token, you can try to send it from there to another account.
