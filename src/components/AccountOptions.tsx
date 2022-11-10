import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { Account } from "../types/chain";

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  //const [activeAccount, setAccount] = useState<Account>();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectAccount = (account: Account) => {
    onSelectAccount(account);
    // close the floating options after the user selects something
    handleClose();
  };
  return (
    <>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={accounts.length < 1}
      >
        {label}
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {accounts.map((i) => {
          return (
            <MenuItem key={i.address} onClick={() => handleSelectAccount(i)}>
              ({i.name}) {i.address}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default AccountOptions;
