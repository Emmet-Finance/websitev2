import { Hash, TransactionReceipt } from "viem";
import { CHAIN_NAME_TO_ID, TChainName, TTokenName, TTxStatus } from "../types";
import { getSigner } from "./getSigner";
import FTBridge from "../abis/FTBridge";
import { addressToAccount, addressToBytes32 } from "./address";
import { sleep } from "./time";
import { getTxReceipt } from "./getTxReceipt";
import { chainFactoryTestnet } from "../store/chainFactory";
import { useTonConnect } from "../hooks/useTonConnect";
import { Chain } from "emmet.js/dist/factory/types";
/**
 * Submits a token for burning & transferring on another chain
 * @param chainName the name of a supported chain where burning happens
 * @param bridgeAddress the address of the Emmet.Finance CircleBurner contract
 * @param amount the number of wei a user wants to transfer
 * @param destinationDomain an internal Circle chain domain, currently in {0, 7}
 * @param mintRecipient the address of the beneficiary on the destination chain
 * @param tokenName the symbol of the transferred token, e.g. USDC
 * @param fee the compensation of the TX fee on the destination
 * @returns Struct {hash: Hash | undefined, status: 'success' | 'reverted' | 'failed', error: string | undefined}
 */
export async function EmmetSendInstallment(
  chainName: TChainName,
  bridgeAddress: Hash,
  amount: bigint,
  destinationDomain: number,
  mintRecipient: string,
  tokenName: TTokenName,
  fee: number
): Promise<{
  hash: Hash | undefined;
  status: TTxStatus;
  error: string | undefined;
}> {
  const { sender: tonSender } = useTonConnect();
  try {
    const fromChainID = CHAIN_NAME_TO_ID[chainName];

    if (fromChainID === Chain.TON) {
      const handler = await chainFactoryTestnet.inner(fromChainID);
      await chainFactoryTestnet.sendInstallment(
        handler,
        tonSender,
        amount,
        destinationDomain,
        tokenName,
        mintRecipient
      );
    }

    return {
      hash: undefined,
      status: "failed",
      error: "Something went wrong...",
    };
  } catch (error: { message: string } | any) {
    return { hash: undefined, status: "failed", error: error.message };
  }
}