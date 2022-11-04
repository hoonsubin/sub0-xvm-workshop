import {
  Button,
  Card,
  CardContent,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const TokenTransfer = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ my: 5 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          Token View
        </Typography>
        <Typography variant="h5" component="div">
          Token Name
        </Typography>
        <div style={{ marginTop: 3 }}>
          <TextField id="outlined-basic" label="Address" variant="outlined" />
          {/* Check if the input address is SS58 or H160. If SS58, it will convert it to H160 and read the balance*/}
          <Button>Check Balance</Button>
        </div>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          32423.3263... ERC20
        </Typography>

        <Typography variant="h5" component="div">
          Transfer
        </Typography>
        <TextField id="outlined-basic" label="amount" variant="outlined" />
        <Button
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          From
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
          <MenuItem onClick={handleClose}>0xaf24...d23fa</MenuItem>
          <MenuItem onClick={handleClose}>14DZ8y...G51mZ</MenuItem>
          <MenuItem onClick={handleClose}>13ajxs...gd6eU</MenuItem>
        </Menu>
        
        <TextField id="outlined-basic" label="to" variant="outlined" />
        <Button>Transfer!</Button>
      </CardContent>
    </Card>
  );
};

export default TokenTransfer;
