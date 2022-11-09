import React from "react";
import TokenTransfer from "./components/TokenTransfer";
import { Container, Typography, Box, Link, Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletContext } from "./providers";

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
  const {
    wallet,
    initSubstrateProvider,
    initEvmProvider,
    isConnectedToSubstrate,
    isConnectedToEvm,
  } = useWalletContext();

  const handleClickConnectEvm = async () => {
    console.log("connecting to MetaMask");
    await initEvmProvider();
  };

  const handleClickConnectNative = async () => {
    console.log("Connecting to Talisman");
    await initSubstrateProvider();
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
              onClick={handleClickConnectEvm}
              variant="contained"
              disabled={isConnectedToEvm}
            >
              {isConnectedToEvm
                ? "Connected to MetaMask!"
                : "Connect your MetaMask"}
            </Button>
            <Button
              onClick={handleClickConnectNative}
              variant="contained"
              disabled={isConnectedToSubstrate}
            >
              {isConnectedToSubstrate
                ? "Connected to Talisman"
                : "Connect your Talisman"}
            </Button>
          </Stack>

          {isConnectedToEvm && isConnectedToSubstrate ? (
            <TokenTransfer />
          ) : (
            <></>
          )}

          <Copyright />
        </Box>
      </Container>
    </>
  );
}
