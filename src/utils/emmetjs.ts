import { sleep, TLPData, TLPPosition, TonHelper, Web3Helper } from "emmet.js";
import { chainFactory } from "../store/chainFactory";
import { ChainToDestinationDomain, ChainNameToTypeChainName, TChainName } from "../types";

export type SupportedDomains = 0 | 1 | 2 | 3 | 5 | 6 | 7 | 56 | 169 | 65534 | 65535 | 728696 | 80084;

export async function getData(chain: string, token: string, address: string = "") {

    const emptyData = {
        decimals: 0,
        apy: 0,
        supply: 0,
        balance: 0,
        liquidityPoolInUSD: 0 // Number(liquidityPoolInUSD).toFixed(2),
    }

    try {
        const handler = chain && await getHandler(chain);

        if (handler) {
            await sleep(1000); // let time to update the handler
            const data: TLPData = await handler.getLpData(`elp${token}`);

            let validAddress = false;

            if(address){
                await sleep(1000); // let time to update the address
                validAddress = await isValidAddress(chain, address);
            }

            const decimalAmount: number = 10 ** Number(data.decimals);

            return {
                decimals: data.decimals ? Number(data.decimals) : 0,
                apy: data.apy ? Number(data.apy) / 100 : 0,
                // @ts-ignore
                supply: data.total_supply ? Number(data.total_supply) / decimalAmount : 0,
                // @ts-ignore
                balance: validAddress && data.available_underlying
                // @ts-ignore
                    ? (Number(data.available_underlying) / Number(decimalAmount))
                    : 0,
                liquidityPoolInUSD: 0n // Number(liquidityPoolInUSD).toFixed(2),
            };
        }

        await sleep(1000);
        return emptyData;

    } catch (error) {
        console.error("getData:", error);
        await sleep(10000);
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

export async function isValidAddress(chain: string, address: string): Promise<boolean> {
    const handler: Web3Helper | TonHelper = await getHandler(chain);
    const validAddress: boolean = await handler.validateAddress(address);
    return validAddress;
}