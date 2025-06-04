import { AddressBookKeys, sleep } from "emmet.js";
import { ChainNameToTypeChainName, SUPPORTED_CHAINS, TOKEN_DECIMALS, TTokenName } from "../types";
import { getHandler } from "../utils";

const handlerCache: Record<string, Awaited<ReturnType<typeof getHandler>>> = {};

export const getBalance = async (
  type: "Deposit" | "Withdraw",
  chain: string,
  token: string,
  account: string,
  setError: (message: string) => void,
) => {

  if (!account) {
    setError("Missing user account")
    return 0;
  }

  if (!chain) {
    setError("Missing chain ID")
    return 0;
  }

  if (!chain) {
    setError("Missing token name")
    return 0;
  }

  try {
    let handler = handlerCache[chain];
    if (!handler) {
      try {
        handler = await getHandler(chain);
        handlerCache[chain] = handler;
      } catch (e) {
        setError(`Failed to get handler for ${chain}`);
        return undefined; // important to avoid pushing 0
      }
    }

    if (handler) {
      const _chain = SUPPORTED_CHAINS[ChainNameToTypeChainName[chain]];

      //  Get & return coint balance
      if (token === _chain.nativeCurrency.symbol && type === "Deposit") {
        return (
          Number(await handler.balance(account)) /
          10 ** TOKEN_DECIMALS[token as TTokenName]
        );
      }

      // Get & return Token balance
      if ("address" in handler) {
        if (type === "Deposit") {
          const tokenAddress = await handler.address(token as AddressBookKeys);

          return (
            Number(await handler.tokenBalance(tokenAddress, account)) /
            10 ** Number(TOKEN_DECIMALS[token as TTokenName])
          );
        } else { // Withdraw
          const tokenAddress = await handler.address(
            `elp${token}` as AddressBookKeys,
          );
          return (
            Number(await handler.tokenBalance(tokenAddress, account)) /
            10 ** Number(TOKEN_DECIMALS[token as TTokenName])
          );
        }
      }
    }
    await sleep(1000);
    return 0;

  } catch (error: { message: string } | any) {
    console.error(error);
    setError(error.message);
    await sleep(10000)
  }
};

export const getSafeBalance = async (
  type: "Deposit" | "Withdraw",
  chain: string,
  token: string,
  account: string,
  setError: (message: string) => void
): Promise<number | undefined> => {
  try {
    const balance = await getBalance(type, chain, token, account, setError);
    return typeof balance === "number" && !isNaN(balance) ? balance : undefined;
  } catch (err) {
    setError("Balance fetch failed");
    return undefined;
  }
};