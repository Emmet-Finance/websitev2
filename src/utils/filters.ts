// Mock Data
import chainList from "../data/lockAndMintChain.json";
import coinsData from "../data/coins.json";
import { BridgeTokens, CHAIN_TO_TOKENS_TREE, TOKEN_TO_TOKEN, TSupportedChain } from "../types/tokens";
import { TChainType, TokenType } from "../store/types";
import { CHAIN_TO_TOKENS } from "../types";

/**
 * Used by the bridge to disable sending inside the same chain
 * @param chain1 from chain name
 * @param chain2 to chain name
 * @returns an array of yet unselected chain names
 */
export function filterTwoChains(chain1: string, chain2: string): TChainType[] {
  return chainList.filter(
    (chain: TChainType) => chain.name !== chain1 && chain.name !== chain2,
  );
}

/**
 * Excludes the from & to chains from the list of selectable
 * @param selectedFromChain the from chain name
 * @param selectedToChain the to chain name
 * @returns a filtered list
 */
export function filterFromChains(
  selectedFromChain: string,
  selectedToChain: string,
): TChainType[] {
  return chainList.filter(
    (chain: TChainType) =>
      chain.name !== selectedFromChain && chain.name !== selectedToChain,
  );
}

/**
 * Excludes the from & to chains from the list of selectable
 * @param selectedFromChain the from chain name
 * @param selectedToChain the to chain name
 * @returns a filtered list
 */
export function filterToChains(
  selectedFromChain: TSupportedChain,
  selectedToChain: TSupportedChain,
): TChainType[] {

  const supportedDestinations = CHAIN_TO_TOKENS_TREE[selectedFromChain];

  let destChains: TChainType[] = []

  for (const chainKey of Object.keys(supportedDestinations)) {
    const availableTokens: string[] = supportedDestinations[chainKey];
    if (availableTokens.length > 0 && chainKey !== selectedFromChain) {

      const foundChain: TChainType = chainList.filter((chain: TChainType) => chain.name === chainKey)[0]

      destChains.push(foundChain);
    }
  }

  destChains.filter((chain: TChainType) => selectedToChain === chain.name)

  return destChains;
}

/**
 * Used in Swap, filteres out already selected tokens
 * @param name1 from token symbol
 * @param name2 to token symbol
 * @returns an array of yet unsellected tokens
 */
export function filterTwoTokens(name1: string, name2: string): TokenType[] {
  return coinsData.filter(
    (token: TokenType) => token.name !== name1 && token.name !== name2,
  );

}

/**
 * Fetches supported tokens
 * @param fromChain 
 * @param toChain 
 * @returns a filtered list of chains
 */
export function getSupportedTokens(fromChain: string, toChain: string) {
  // @ts-ignore
  const fromChainSupportedTokens = new Set<string>(CHAIN_TO_TOKENS[fromChain]);
  // @ts-ignore
  const toChainSupportedTokens = new Set<string>(CHAIN_TO_TOKENS[toChain]);

  // @ts-ignore
  const supportedTokens = fromChainSupportedTokens.intersection(
    toChainSupportedTokens,
  );
  return Array.from(supportedTokens);
}

/**
 * Used in the Bridge only
 * @param name name of the selected token
 * @returns an array of yet unselected tokens
 */
export function filterOneToken(
  name: string,
  fromChain: string,
  toChain: string,
): TokenType[] {
  const supportedTokens = getSupportedTokens(fromChain, toChain);

  return BridgeTokens.filter(
    (token: TokenType) =>
      token.name !== name && supportedTokens.includes(token.name),
  );
}

/**
 * Filters BridgeTokens based on allowed tokens
 * @param selectedToken 
 * @param fromChain 
 * @param toChain 
 * @returns 
 */
export function filterTokens(
  selectedToken: string,
  fromChain: TSupportedChain,
  toChain: TSupportedChain,
): TokenType[] {

  let tokens = BridgeTokens.filter(
    (token: TokenType) =>
      CHAIN_TO_TOKENS[fromChain]?.includes(token.name)
  );

  tokens = tokens.filter(i => i.name === selectedToken);

  return tokens;
}

export function getTokenByName(tokenName: string): TokenType {
  return coinsData.find(i => i.name === tokenName) as TokenType;
}

// ==================== BRAND NEW FILTERS ====================

export function filterAvailableToChain(fromChain: TSupportedChain): TChainType[] {
  const keys = Object.keys(CHAIN_TO_TOKENS_TREE[fromChain]) as string[];
  let available: TChainType[] = []
  for (const key of keys) {
    available.push(chainList.find(i => i.name === key) as TChainType)
  }
  return available;
}

export function filterAvailableFromTokens(fromChain: TSupportedChain, toChain: TSupportedChain): TokenType[] {

  const available: TokenType[] = [];

  const tokenList = CHAIN_TO_TOKENS_TREE[fromChain][toChain];

  if (tokenList) {

    for (const token of tokenList) {
      available.push(BridgeTokens.filter(i => i.name === token)[0])
    }
  }

  // console.log("filterAvailableFromTokens", "from", fromChain, "to",toChain,  "available", available)

  return available;
}

export function filterAvailableToTokens(fromToken: string) {
  return TOKEN_TO_TOKEN[fromToken as keyof typeof TOKEN_TO_TOKEN];
}
