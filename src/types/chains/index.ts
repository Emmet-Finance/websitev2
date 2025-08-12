import { arbitrum } from "./arbitrum";
import { arbitrumSepolia } from "./arbitrumSepolia";
import { avalanche } from "./avalanche";
import { avalancheFuji } from "./avalancheFuji";
import { base } from "./base";
import { baseSepolia } from "./baseSepolia";
import { ethereum } from "./ethereum";
import { manta } from "./manta";
import { optimism } from "./optimism";
import { optimismSepolia } from "./optimismSepolia";
import { polygon } from "./polygon";
import { polygonAmoy } from "./polygonAmoy";
import { sepolia } from "./sepolia";
import { ton } from "./ton";
import { tonTestnet } from "./tonTestnet";
import { solana } from "./solana";
import { songbird } from "viem/chains";
import { bsc } from "./bsc";
import { bscTestnet } from "./bscTestnet";
import { berachainBartio } from "./berachainBartio";
import { onlylayerTestnet } from "./onlylayerTestnet";

// https://github.com/wevm/viem/blob/main/src/chains/definitions

// MAINNETS:
export * from "./arbitrum";
export * from "./avalanche";
export * from "./base";
export * from "./ethereum";
export * from "./manta";
export * from "./optimism";
export * from "./polygon";
export * from "./solana";
export * from "./songbird";
export * from "./bsc";

// TESTNETS:
export * from "./arbitrumSepolia";
export * from "./avalancheFuji";
export * from "./baseSepolia";
export * from "./optimismSepolia";
export * from "./polygonAmoy";
export * from "./sepolia";

export type TChainDataParam = "bridge" | "id" | "icon" | "name" | "url";

export const MAINNETS = {
  arbitrum: arbitrum,
  avalanche: avalanche,
  base: base,
  ethereum: ethereum,
  manta: manta,
  optimism: optimism,
  polygon: polygon,
  songbird: songbird,
  ton: ton,
  solana: solana,
  bsc: bsc,
};

export const TESTNETS = {
  arbitrumSepolia: arbitrumSepolia,
  avalancheFuji: avalancheFuji,
  baseSepolia: baseSepolia,
  optimismSepolia: optimismSepolia,
  polygonAmoy: polygonAmoy,
  sepolia: sepolia,
  tonTestnet: tonTestnet,
  bscTestnet: bscTestnet,
  berachainBartio: berachainBartio,
  onlylayerTestnet: onlylayerTestnet,
};

export const SUPPORTED_CHAINS = { ...MAINNETS, ...TESTNETS };

export const ALL_CHAINS = Object.keys(SUPPORTED_CHAINS).map((chainName) => {
  return SUPPORTED_CHAINS[chainName as TChainName];
});

export type TChainName = keyof typeof SUPPORTED_CHAINS;

export const SUPPORTED_CHAIN_IDS: number[] = Object.keys(SUPPORTED_CHAINS).map(
  (chainName) => SUPPORTED_CHAINS[chainName as TChainName].id,
);

export const CHAIN_NAME_TO_ID: { [key in TChainName]: number } = {
  // Mainnets:
  arbitrum: 42161, //0xa4b1  (Arbitrum One)
  avalanche: 43114, // 0xa86a
  base: 8453, // 0x2105
  ethereum: 1, // 0x1
  optimism: 10, // 0xa (OP Mainnet)
  manta: 169,
  polygon: 137, // 0x89
  songbird: 19,
  ton: 65534, // 0xfffe
  solana: 5426,
  bsc: 56,
  // Testnets:
  arbitrumSepolia: 421614, // 0x66eee
  avalancheFuji: 43113, // 0xa869
  baseSepolia: 84532, // 0x14a34
  optimismSepolia: 11155420, // 0xaa37dc
  polygonAmoy: 80002, // 0x13881
  sepolia: 11155111, // 0xaa36a7
  tonTestnet: 65535, // 0xffff
  bscTestnet: 97,
  berachainBartio: 80084,
  onlylayerTestnet: 728696,
};

export const ChainNameToTypeChainName: { [key: string]: TChainName } = {
  // Mainnets:
  Arbitrum: "arbitrum",
  Avalanche: "avalanche",
  Base: "base",
  Ethereum: "ethereum",
  Manta: "manta",
  Optimism: "optimism",
  Polygon: "polygon",
  Songbird: "songbird",
  TON: "ton",
  BSC: "bsc",
  // Testnets:
  ArbSepolia: "arbitrumSepolia",
  Fuji: "avalancheFuji",
  BSepolia: "baseSepolia",
  OPSepolia: "optimismSepolia",
  Amoy: "polygonAmoy",
  Sepolia: "sepolia",
  TONTestnet: "tonTestnet",
  BSCTestnet: "bscTestnet",
  Bartio: "berachainBartio",
  OnlyTestnet: "onlylayerTestnet",
};

export const ChainToDestinationDomain: { [key in TChainName]: number } = {
  ethereum: 0,
  sepolia: 0,
  avalanche: 1,
  avalancheFuji: 1,
  optimism: 2,
  optimismSepolia: 2,
  arbitrum: 3,
  arbitrumSepolia: 3,
  base: 6,
  baseSepolia: 6,
  bsc: 56,
  manta: 169,
  polygon: 7,
  polygonAmoy: 7,
  ton: 65534,
  tonTestnet: 65535,
  solana: 102, // TODO: change
  // CCTP unsupported chains
  songbird: 19,
  bscTestnet: 56,
  berachainBartio: 80084,
  onlylayerTestnet: 728696,
};

export const DomainToChainName: { [key: number]: TChainName } = {
  0: "ethereum",
  1: "avalanche",
  2: "optimism",
  3: "arbitrum",
  6: "base",
  7: "polygon",
  65534: "ton",
  5: "solana", // TODO: change
  19: "songbird",
  56: "bsc",
  169: "manta",
};

export const DomainToChainNameTestnet: { [key: number]: TChainName } = {
  7: "polygonAmoy",
  65535: "tonTestnet",
  56: "bscTestnet",
  80084: "berachainBartio",
  728696: "onlylayerTestnet",
};

export const CHAIN_ID_TO_NAME: { [key: number]: TChainName } = {
  // Mainnets:
  42161: "arbitrum",
  43114: "avalanche",
  8453: "base",
  1: "ethereum",
  10: "optimism",
  137: "polygon",
  65534: "ton",
  5426: "solana",
  56: "bsc",
  19: "songbird",
  169: "manta",
  // Testnets:
  421614: "arbitrumSepolia",
  43113: "avalancheFuji",
  84532: "baseSepolia",
  11155420: "optimismSepolia",
  80002: "polygonAmoy",
  11155111: "sepolia",
  65535: "tonTestnet",
  97: "bscTestnet",
  80084: "berachainBartio",
  728696: "onlylayerTestnet",
};

export const SupportedDomains = [0, 1, 2, 3, 6, 7, 65534, 65535, 56, 4, 19]; // TODO: add solana

export const supportedChainnames: TChainName[] = Object.keys(
  SUPPORTED_CHAINS,
) as TChainName[];

export const CHAIN_LOGOS: { [key: string|TChainName]: string } = {
  // Mainnets:
  arbitrum: "img/chain/arbitrum.svg",
  avalanche: "img/chain/avalanche.svg",
  base: "img/chain/base.svg",
  ethereum: "img/chain/ethereum.svg",
  optimism: "img/chain/optimism.svg",
  manta: "img/chain/manta.svg",
  polygon: "img/chain/polygon.svg",
  ton: "img/chain/ton.svg",
  solana: "img/chain/solana.svg",
  songbird: "img/chain/songbird.svg",
  bsc: "img/chain/bsc.svg",
  // Testnets:
  arbitrumSepolia: "img/chain/arbitrum.svg",
  avalancheFuji: "img/chain/avalanche.svg",
  baseSepolia: "img/chain/base.svg",
  optimismSepolia: "img/chain/optimism.svg",
  polygonAmoy: "img/chain/polygon.svg",
  sepolia: "img/chain/ethereum.svg",
  tonTestnet: "img/chain/ton.svg",
  bscTestnet: "img/chain/bsc.svg",
  berachainBartio: "img/chain/berachain.png",
  onlylayerTestnet: "img/chain/onlylayer.png",
};
