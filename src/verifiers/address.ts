import { Address } from "@ton/core";
// import { PublicKey } from '@solana/web3.js';

/**
 * Verifies validity of a potential EVM address
 * @param address a verified string
 * @returns `true` | `false`
 */
export function isEvmAddress(address: string): boolean {
  // Regular expression to match the EVM address format
  // Expected length 42 chars including `0x`
  // Can only contain hex chars 0-9 | a-f | A-F
  const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  // Test the address against the regex and return the result
  return evmAddressRegex.test(address);
}

/**
 * Verifies a Solana address
 * @param address a prospect Solana address
 * @returns true if valid, false otherwise
 */
// export function isValidSolanaAddress(address: string): boolean {
//     try {
//       const publicKey = new PublicKey(address);
//       return PublicKey.isOnCurve(publicKey);
//     } catch (error) {
//       return false;
//     }
//   }

/**
 * Validates a TON address
 * @param address a verified address
 * @returns true if valid, false otherwise
 */
export function isValidTonAddress(address: string) {
  try {
    if (address && address.length > 0) {
      Address.parse(address);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Returns a shortenned version of the address
 * @param address the full address
 * @param showFront the number of characters to show at the front
 * @param showEnd the number of characters at the end
 * @returns the beginning & the end of the address
 */
export function truncateAddress(address: string, showFront: number, showEnd: number) {
  return address
    ? `${address.slice(0, showFront)}...${address.slice(-showEnd)}`
    : "";
}