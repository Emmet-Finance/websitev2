import { sleep, TLPData, TLPPosition, TonHelper, Web3Helper } from "emmet.js";
import { chainFactory } from "../store/chainFactory";
import { ChainToDestinationDomain, ChainNameToTypeChainName, TChainName } from "../types";

export type SupportedDomains = 0 | 1 | 2 | 3 | 5 | 6 | 7 | 56 | 65534 | 65535 | 728696 | 80084;

export async function getData(chain: string, token: string, address: string = "") {

    const emptyData = {
        decimals: 0,
        apy: 0,
        totalSupply: 0,
        protocolFee: 0,
        protocolFeeAmount: 0,
        tokenFee: 0,
        feeGrowthGlobal: 0,
        feeDecimals: 0,
        pendingRewards: 0,
        liquidityPoolInUSD: 0 // Number(liquidityPoolInUSD).toFixed(2),
    }

    try {
        const handler = chain && await getHandler(chain);

        if (handler) {
            const data: TLPData = await handler.getLpData(`elp${token}`);

            let stakerPosition: TLPPosition = {} as TLPPosition;

            let validAddress = false;

            if(address){
                await sleep(1000); // let time to update the address

                validAddress = await isValidAddress(chain, address);

                if (validAddress) {
                    stakerPosition = await handler.getPosition(`elp${token}`, address);
                }
            }

            const decimalAmount: bigint = 10n ** data.decimals;

            return {
                decimals: data.decimals ? Number(data.decimals) : 0,
                apy: data.apy ? Number(data.apy) / 100 : 0,
                totalSupply: data.total_supply ? Number(data.total_supply / decimalAmount) : 0,
                protocolFee: data.protocol_fee ? Number(data.protocol_fee) : 0,
                protocolFeeAmount: data.protocol_fee_amount ? Number(data.protocol_fee_amount) : 0,
                tokenFee: data.token_fee ? Number(data.token_fee) : 0,
                feeGrowthGlobal: data.fee_growth_global ? Number(data.fee_growth_global / decimalAmount) : 0,
                feeDecimals: data.fee_decimals ? Number(data.fee_decimals) : 0,
                pendingRewards: validAddress && stakerPosition.rewards
                    ? (Number(stakerPosition.rewards) / Number(decimalAmount))
                    : 0,
                liquidityPoolInUSD: 0n // Number(liquidityPoolInUSD).toFixed(2),
            };
        }

        return emptyData;

    } catch (error) {
        console.error("getData:", error);
        // await sleep(1000);
        // return await getData(chain, token, address);
    }
}

export async function getHandler(chain: string): Promise<Web3Helper | TonHelper> {

    const chainName: TChainName = ChainNameToTypeChainName[chain];
    if (!chainName) {
        throw new Error("getHandler: Empty chain")
    }
    const domain: SupportedDomains = ChainToDestinationDomain[chainName] as SupportedDomains;
    const handler = await chainFactory.inner(domain);
    return handler;


}

export async function getPositions(chain: string, token: string, address: string): Promise<TLPPosition> {
    try {
        const handler = await getHandler(chain);
        const validAddress = await isValidAddress(chain, address);

        let stakerPosition: TLPPosition = {} as TLPPosition;

        if (validAddress) {
            stakerPosition = await handler.getPosition(`elp${token}`, address);
        }

        return stakerPosition;
    } catch (error: { message: string } | any) {
        console.error("getPositions:", error);
        await sleep(1000);
        return await getPositions(chain, token, address);
    }
}

export async function isValidAddress(chain: string, address: string): Promise<boolean> {
    const handler: Web3Helper | TonHelper = await getHandler(chain);
    const validAddress: boolean = await handler.validateAddress(address);
    return validAddress;
}