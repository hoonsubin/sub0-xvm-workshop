import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import React from 'react';
import { Account } from '../types/chain';

type AccountOptionsProps = {
  onSelectAccount: (account: Account) => void;
  accounts: Account[];
  label: string;
};

const AccountOptions = ({
  onSelectAccount,
  accounts,
  label,
}: AccountOptionsProps) => {
  const handleSelectAccount = (event: any) => {
    const index: number = event.target.value;
    onSelectAccount(accounts[index]);
  };
  return (
    <FormControl fullWidth style={{ margin: '10px' }}>
      <InputLabel id="demo-simple-select-label">From</InputLabel>
      <Select
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        onChange={handleSelectAccount}>
        {accounts.map((account, index) => {
          return (
            <MenuItem key={account.address} value={index}>
              ({account.name}) {account.address} {index}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default AccountOptions;
