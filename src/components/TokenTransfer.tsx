import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Account } from "../types/chain";
import { useWalletContext } from "./Web3Provider";
import AccountOptions from "./AccountOptions";
import AddressInput from "./AddressInput";

const TokenTransfer = () => {
  const { getAccounts } = useWalletContext();
  const [activeAccount, setActiveAccount] = useState<Account>();

  const handleSelectAccount = (account: Account) => {
    setActiveAccount(account);
    console.log(`User selected account ${account.address}`);
  };

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
              onClick={(addr) => console.log(`Checking balance for ${addr}`)}
            />
          </div>

          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            32423.3263... ERC20
          </Typography>
        </div>

        <div>
          <Typography variant="h5" component="div">
            Transfer
          </Typography>
          <TextField id="outlined-basic" label="amount" variant="outlined" />

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
            onClick={(addr) => console.log(`Sending tokens to ${addr}`)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenTransfer;
