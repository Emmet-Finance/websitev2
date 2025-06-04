import {Chain, manta as viemManta } from 'viem/chains';

export const manta: Chain = {
    ...viemManta,
    name: 'Manta',
    testnet: false,
}