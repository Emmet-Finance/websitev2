import {
  getContract as getViemContract,
  PublicClient,
} from "viem";

/**
 * Builds a contract handler
 * @param address of the required contract
 * @param abi a JSON-like interface to contract's binary
 * @param publicClient a signer | provider
 * @returns a functional contract handler
 */
export function getContract(
  address: string,
  abi: any,
  publicClient: PublicClient,
) {
  const contract = getViemContract({
    address: `0x${address.replace("0x", "")}`,
    abi,
    client: {
      public: publicClient,
    },
  });

  return contract;
}
