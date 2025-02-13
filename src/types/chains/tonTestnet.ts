import { Chain } from "viem";
import { getHttpEndpoint } from "@orbs-network/ton-access";

const rpc = await getHttpEndpoint({ network: "testnet" }).catch((e) => {
  console.error(e);
  return "";
});

export const tonTestnet: Chain = {
  name: "TONTestnet",
  rpcUrls: {
    default: {
      http: ["https://testnet-ton-node.emmet.finance/jsonRPC"],
    },
    public: {
      http: ["https://testnet-ton-node.emmet.finance/jsonRPC"],
    },
  },
  testnet: true,
  id: 65535,
  nativeCurrency: { name: "TON", symbol: "TON", decimals: 9 },
  blockExplorers: {
    default: {
      name: "TONScan",
      url: "https://testnet.tonviewer.com",
    },
  },
};
