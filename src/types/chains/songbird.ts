import { Chain } from "viem";

export const songbird: Chain = {
    id: 19,
    nativeCurrency: { name: "SGB", symbol: "SGB", decimals: 18},
    name: "Songbird",
    blockExplorers: {
        default: {
            name: "Songbird Explorer",
            url: "https://songbird-explorer.flare.network/",
        }
    },
    rpcUrls: {
        default: {
            http: ["https://endpoints.omniatech.io/v1/matic/mainnet/public"],
        },
        public: {
            http: ["https://endpoints.omniatech.io/v1/matic/mainnet/public"],
        },
    },
}