import * as React from "react";
import TokenTransfer from "./components/TokenTransfer";
import { Container, Typography, Box, Link, Button } from "@mui/material";
import { Stack } from "@mui/system";

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
            <Button variant="contained">Connect MetaMask</Button>
            <Button variant="contained">Connect Talisman</Button>
          </Stack>

          <TokenTransfer />

          <Copyright />
        </Box>
      </Container>
    </>
  );
}
