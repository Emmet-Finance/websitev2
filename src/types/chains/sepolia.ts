import { sepolia as viemSepolia } from 'viem/chains';
import { TEmmetChain } from '.';

export const sepolia = {
  ...viemSepolia,
  emmetBridge: {
    address: "0x87f26F3C4F2D0c3d8E467B125E5dcE35B830C3f2",
    blockCreated: 5170589
  },
  emmetFeeOracle: {
    address: "0x385B3516722A62e19B3E81f70CC1D3073ddf4521",
    blockCreated: 5179056
  },
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://ethereum-sepolia.publicnode.com'],
    },
    public: {
      http: [
        'https://ethereum-sepolia.publicnode.com',
        'https://rpc.notadegen.com/eth/sepolia',
        'https://eth-sepolia.public.blastapi.io',
        'https://eth-sepolia-public.unifra.io'
      ],
    },
  },
  testnet: true,
} as TEmmetChain;