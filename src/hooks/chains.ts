import chainData from "../data/lockAndMintChain.json";

export type TLnMChain = {
  id: number,
  name: string,
  icon: string,
  domain: number,
  requiresApproval: boolean,
  nativeCurrency: {
    name: string,
    symbol: string,
    decimals: number
  }
}

const chains: TLnMChain[] = chainData;

export type LockAndMintSupportedChainIDs = (typeof chains)[number]["domain"];

export default chains;
