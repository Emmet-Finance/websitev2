
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAppSelector, useAppDispatch } from "./storage";
import { useEthersSigner } from "./useEthersSigner";
import type { Helper } from "tokensale.sdk/dist/types"
import { mainnetConfig, testnetConfig, TokensaleHelper } from "tokensale.sdk/dist";
import { setAllowance, setBalance, setBuyer } from "../store/tokensaleSlice";
import { sleep } from "emmet.js";
import { Signer } from "ethers";

export default function useTokenSale() {
    const { address, isConnected } = useAccount();
    const dispatch = useAppDispatch();
    const signer = useEthersSigner();
    const isTestnet: boolean = true;

    const [isAwaiting, setIsAwaiting] = useState(false);

    async function updateAllowance() {
        try {
            const tokensale: Helper = await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);
            const allowance = await tokensale.allowance(address!, "USDT");

            if(allowance){
                dispatch(setAllowance(Number(allowance.toString()) / 1e6))
            }
        } catch (error) {
            console.warn("useTokenSale::updateAllowance", error)
        }
    }

    async function updateBalance(){
        try {
            const tokensale: Helper = await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);
            const balance = await tokensale.balance(address!, "USDT");

            if(balance){
                dispatch(setBalance(Number(balance.toString()) / 1e6))
            }
        } catch (error) {
            console.warn("useTokenSale::updateBalance", error)
        }
    }

    async function checkAll() {
        await updateBalance();
        await sleep(1000);
        await updateAllowance();
        isConnected && dispatch(setBuyer(address!));
    }

    async function  approve(amount: number) {
        setIsAwaiting(true);

        try {
            const tokensale: Helper = await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);
            await tokensale.approve(signer as Signer, BigInt(amount * 1e6));
        } catch (error) {
            console.warn("useTokenSale::approve", error)
        }
        setIsAwaiting(false);
    }

    async function purchase(amount: number, ref: string) {
        setIsAwaiting(true);
        try {
            const tokensale: Helper = await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);
            await tokensale.buy(signer as Signer, BigInt(amount * 1e6), ref);
        } catch (error) {
            console.warn("useTokenSale::purchase", error);
        }
        setIsAwaiting(false);
    }

    async function saveRef(ref:string) {
        try {
            const tokensale: Helper = await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);
            await tokensale.createReference(signer as Signer, ref);
        } catch (error) {
            console.warn("useTokenSale::saveRef", error);
        }
    }

    useEffect(() => {

        let interval: NodeJS.Timeout;

        if(isConnected){

            (async () => {
                await checkAll()
            })()

            // Then fetch data every 10 seconds
            interval = setInterval(checkAll, 10_000);

        }

        return () => clearInterval(interval);

    });

    return {approve, purchase, saveRef, isAwaiting}

}