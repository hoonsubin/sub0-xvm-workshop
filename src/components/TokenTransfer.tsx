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
            <TextField
              id="outlined-basic"
              label="Account Address"
              variant="outlined"
            />
            {/* Check if the input address is SS58 or H160. If SS58, it will convert it to H160 and read the balance*/}
            <Button>Check Balance</Button>
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
          {
            activeAccount? (
              <Typography>
                {activeAccount.address}
              </Typography>
            ) : <></>
          }
          <TextField id="outlined-basic" label="to" variant="outlined" />
          <Button>Transfer!</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenTransfer;
