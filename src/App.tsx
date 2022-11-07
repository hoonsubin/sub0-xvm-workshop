import React, { useEffect, useState } from "react";
import TokenTransfer from "./components/TokenTransfer";
import { Container, Typography, Box, Link, Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletContext } from "./components/Web3Provider";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://astar.network/">
        Astar Foundation
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  const { wallet, getAccounts, initEvmProvider, isConnectedToEvm } =
    useWalletContext();

  const _onClickConnectEvm = async () => {
    console.log("connecting to MetaMask");
    await initEvmProvider();
    console.log();
  };

  const _onClickConnectNative = async () => {
    console.log("Connecting to Talisman");
  };

  return (
    <>
      <Container maxWidth="md">
        <Box sx={{ my: 5 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Hoon's Sub0 2022 XVM Demo
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={_onClickConnectEvm}
              variant="contained"
              disabled={isConnectedToEvm}
            >
              Connect MetaMask
            </Button>
            <Button onClick={_onClickConnectNative} variant="contained">
              Connect Talisman
            </Button>
          </Stack>

          <TokenTransfer />

          <Copyright />
        </Box>
      </Container>
    </>
  );
}
