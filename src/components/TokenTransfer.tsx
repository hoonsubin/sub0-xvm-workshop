import { Card, CardContent, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Account } from "../types/chain";
import { useWalletContext, useContractContext } from "../providers";
import AccountOptions from "./AccountOptions";
import AddressInput from "./AddressInput";
import * as helpers from "../helpers";
import BigNumber from "bignumber.js";

interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
}

const TokenTransfer = () => {
  const { getAccounts } = useWalletContext();
  const { erc20Evm } = useContractContext();
  const [activeAccount, setActiveAccount] = useState<Account>();
  const [sendAmount, setSendAmount] = useState<BigNumber>(new BigNumber(0));
  const [tokenBal, setTokenBal] = useState("0");
  const [tokenMeta, setTokenMeta] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    decimals: 1,
  });

  const handleOnCheckBalance = async (addr: string) => {
    console.log(`Checking balance for ${addr}`);
    const balance = await erc20Evm.methods.balanceOf(addr).call();
    setTokenBal(helpers.denomToDecimal(balance, tokenMeta.decimals).toFixed());
  };

  const handleSelectAccount = (account: Account) => {
    setActiveAccount(account);
  };

  const handleTokenTransfer = async (to: string) => {
    if (!activeAccount) {
      throw new Error("No active account selected");
    }

    const amount = sendAmount.toFixed();
    const fromAccount = activeAccount?.address;

    console.log(`Transferring ${amount} Wei from ${fromAccount} to ${to}`);

    if (activeAccount.type === "h160") {
      const result = await erc20Evm.methods
        .transfer(to, amount)
        .send({ from: fromAccount });
      console.log(result);
    } else {
      //todo: ensure that we refactor this to support Substrate transactions later
      throw new Error("Substrate native transaction not implemented yet");
    }
  };

  // fetching token metadata upon render
  useEffect(() => {
    const fetchErc20 = async () => {
      const tokenName = await erc20Evm.methods.name().call();
      const symbol = await erc20Evm.methods.symbol().call();
      const decimals = await erc20Evm.methods.decimals().call();

      setTokenMeta({
        name: tokenName,
        symbol,
        decimals,
      });
    };

    fetchErc20();
  }, [erc20Evm]);

  return (
    <Card sx={{ my: 5 }}>
      <CardContent>
        <div>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Token View
          </Typography>
          <Typography variant="h5" component="div">
            Token Name
          </Typography>
          <div style={{ marginTop: 3 }}>
            <AddressInput
              inputLabel="Account Address"
              buttonLabel="Check Balance"
              onClick={handleOnCheckBalance}
            />
          </div>

          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {tokenBal} {tokenMeta.symbol}
          </Typography>
        </div>

        <div>
          <Typography variant="h5" component="div">
            Transfer
          </Typography>
          <TextField
            id="outlined-basic"
            label="amount"
            variant="outlined"
            onChange={(i) =>
              setSendAmount(
                new BigNumber(
                  helpers.decimalToDenom(i.target.value, tokenMeta.decimals)
                )
              )
            }
          />

          <AccountOptions
            accounts={getAccounts()}
            onSelectAccount={handleSelectAccount}
            label="From"
          />
          {activeAccount ? (
            <Typography>{activeAccount.address}</Typography>
          ) : (
            <></>
          )}
          <AddressInput
            inputLabel="to"
            buttonLabel="Transfer!"
            onClick={handleTokenTransfer}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenTransfer;
