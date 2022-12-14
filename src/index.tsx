import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Web3Provider, ContractProvider } from "./providers";
import App from "./App";
import theme from "./theme";
import "@polkadot/api-augment";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Web3Provider>
      <ContractProvider>
        <App />
      </ContractProvider>
    </Web3Provider>
  </ThemeProvider>
);
