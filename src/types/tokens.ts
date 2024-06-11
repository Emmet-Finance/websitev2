export const BridgeTokens = [
  // {
  //   "cmc_id": 20641,
  //   "name": "EURC",
  //   "icon": "img/coin/eurc.svg",
  //   "price": 2062.25
  // },
  // {
  //   cmc_id: 3408,
  //   name: "USDC",
  //   icon: "img/coin/usdc.svg",
  //   price: 0.9998,
  // },
  {
    cmc_id: 3408,
    name: "USD//C",
    icon: "img/coin/usdc.svg",
    price: 0.9998,
  },
  // {
  //   cmc_id: 11419,
  //   name: "TON",
  //   icon: "img/chain/ton.svg",
  //   price: 7.09,
  // },
  // {
  //   cmc_id: 1027,
  //   name: "ETH",
  //   icon: "img/coin/eth.svg",
  //   price: 2062.25,
  // },
  // {
  //   "cmc_id":0,
  //   "name": "EMMET",
  //   "icon": "img/coin/emmet.svg",
  //   "price": 1
  // },
  // {
  //   "cmc_id":15489,
  //   "name": "SCRL",
  //   "icon": "img/coin/scoll.svg",
  //   "price": 0.000145
  // },
  // {
  //   "cmc_id":11840,
  //   "name": "OP",
  //   "icon": "img/coin/op.svg",
  //   "price": 1.73
  // },
  {
    cmc_id: 4943,
    name: "DAI",
    icon: "img/coin/dai.svg",
    price: 1,
  },
  // {
  //   "cmc_id":825,
  //   "name": "USDT",
  //   "icon": "img/coin/usdt.svg",
  //   "price": 1
  // }
];




export const TOKEN_DECIMALS = {
  DAI: 18,
  EMMET: 18,
  EURC: 6,
  ETH: 18,
  USDC: 6,
  "USD//C": 6,
  TON: 9,
  MATIC: 18,
  USDT: 18,
  WBTC: 18,
};

export type TTokenName = keyof typeof TOKEN_DECIMALS;

export const TOKEN_SYMBOL_TO_TOKEN = {
  "USD//C": "USDC",
  DAI: "DAI",
  TON: "TON",
  EMMET: "EMMET",
  ETH: "ETH",
  MATIC: "MATIC",
  USDT: "USDT",
};
