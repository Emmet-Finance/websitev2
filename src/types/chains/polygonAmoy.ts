import { polygonAmoy as viempolygonAmoy } from "viem/chains";
import { TEmmetChain } from ".";

export const polygonAmoy = {
  ...viempolygonAmoy,
  emmetBridge: {
    address: "0x32Ce282B7dc2526a341787Aa84599Dd3D8e7243C",
    blockCreated: 45310404,
  },
  emmetFeeOracle: {
    address: "0x8598059B6AC70E9a831638F670639c893d3C464d",
    blockCreated: 45306550,
  },
  name: "Amoy",
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
    public: {
      http: [
        // "https://rpc.ankr.com/polygon_mumbai",
        // "https://rpc.ankr.com/polygon_mumbai",
        "https://rpc-amoy.polygon.technology",
        "https://polygon-mumbai-pokt.nodies.app",
        "https://polygon-mumbai.blockpi.network/v1/rpc/public",
        "https://polygon-testnet.public.blastapi.io",
      ],
    },
  },
  testnet: true,
} as TEmmetChain;