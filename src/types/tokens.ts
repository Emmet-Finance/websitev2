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
    cmc_id: 0,
    name: "Bolgur",
    icon: "img/coin/Bolgur.png",
    price: 0.0002106,
  },
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
  // {
  //   cmc_id: 1027,
  //   name: "ETH",
  //   icon: "img/coin/eth.svg",
  //   price: 2062.25,
  // },
  {
    "cmc_id":0,
    "name": "EMMET",
    "icon": "img/coin/emmet.svg",
    "price": 1
  },
  // {
  //   "cmc_id":11840,
  //   "name": "OP",
  //   "icon": "img/coin/op.svg",
  //   "price": 1.73
  // },
  // {
  //   cmc_id: 4943,
  //   name: "DAI",
  //   icon: "img/coin/dai.svg",
  //   price: 1,
  // },
  // {
  //   "cmc_id":825,
  //   "name": "USDT",
  //   "icon": "img/coin/usdt.svg",
  //   "price": 1
  // }
  {
    cmc_id: 26960,
    name: "GrabClub",
    icon: "img/coin/grabclub.png",
    price: 1,
  },
  // {
  //   cmc_id: 26961,
  //   name: "$CAVI",
  //   icon: "img/coin/cavi.png",
  //   price: 1,
  // },
];

export const CHAIN_TO_TOKENS: {[key:string]: string[]} = {
  // Mainnets
  Avalanche: ["USDC", "EMMET"],
  BSC: ["NTM", "Bolgur"],
  Polygon: ["USDC", "EMMET", "GrabClub", "TON"],
  TON: ["TON", "NTM", "GrabClub", "Bolgur"],
  // Testnets
};

export type TSupportedChain = keyof typeof CHAIN_TO_TOKENS;

export const CHAIN_TO_TOKENS_TREE: {[key:TSupportedChain|string]:{
  [key:TSupportedChain|string]: string[]
}} = {
  // Mainnets
  Avalanche: {
    Avalanche: [],
    BSC:[],
    Polygon: ["USDC", "EMMET"],
    TON: [],
  },
  BSC: {
    Avalanche: [],
    Polygon:[],
    TON:["NTM", "Bolgur"]
  },
  Polygon: {
    Avalanche: ["USDC", "EMMET"],
    BSC:[],
    Polygon: [],
    TON: ["GrabClub"],
  },
  TON: {
    Avalanche: [],
    BSC:["NTM", "Bolgur"],
    Polygon: ["GrabClub"],
    TON: [],
  },
};

export type TTokenName = keyof typeof TOKEN_DECIMALS;

