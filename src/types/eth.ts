// Ethereum provider types
interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface EthereumProvider {
  isMetaMask?: boolean;
  on: (event: string, handler: (response: any) => void) => void;
  request: (args: RequestArguments) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
