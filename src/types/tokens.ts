import TOKEN_DECIMALS from "../data/tokenDecimals.json";
import TOKEN_SYMBOL_TO_TOKEN from "../data/tokenSymbols.json";
import TOKEN_TO_TOKEN from "../data/bridgeTokenMap.json";

export {
  TOKEN_DECIMALS,
  TOKEN_SYMBOL_TO_TOKEN,
  TOKEN_TO_TOKEN
};

export const BridgeTokens = [
  {
    cmc_id: 3408,
    name: "USDC",
    icon: "img/coin/usdc.svg",
    price: 0.9998,
  },
  {
    cmc_id: 11419,
    name: "TON",
    icon: "img/chain/ton.svg",
    price: 5.09,
  },
  {
    cmc_id: 19198,
    name: "NTM",
    icon: "img/coin/NTM.png",
    price: 0.001
  },
  {
    "cmc_id":825,
    "name": "USDT",
    "icon": "img/coin/usdt.svg",
    "price": 1
  },
  {
    "cmc_id": 0,
    "name": "LKY",
    "icon": "img/coin/LKY.svg",
    "price": 0.001
  },
  {
    "cmc_id": 0,
    "name": "USDTem",
    "icon": "img/coin/usdtem.svg",
    "price": 1
  }
];

export const CHAIN_TO_TOKENS: {[key:string]: string[]} = {
  Avalanche: ["USDC"],
  BSC: ["NTM", "LKY"],
  Polygon: ["USDT", "USDC"],
  Songbird: ["USDTem"],
  TON: ["USDT", "NTM", "LKY"],
};

export type TSupportedChain = keyof typeof CHAIN_TO_TOKENS;

export const CHAIN_TO_TOKENS_TREE: {[key:TSupportedChain|string]:{
  [key:TSupportedChain|string]: string[]
}} = {
  Avalanche: {
    Polygon: ["USDC"],
  },
  BSC: {
    TON:["NTM", "LKY"]
  },
  Polygon: {
    Avalanche: ["USDC"],
    Songbird: ["USDT"],
    TON: ["USDT"],
  },
  Songbird: {
    Polygon: ["USDTem"],
    TON: ["USDTem"]
  },
  TON: {
    BSC:["NTM", "LKY"],
    Polygon: ["USDT"],
    Songbird: ["USDT"],
  },
};

export type TTokenName = keyof typeof TOKEN_DECIMALS;

