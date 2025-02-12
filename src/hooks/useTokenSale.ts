
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAppDispatch } from "./storage";
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
    const isTestnet: boolean = false;
    const decimals = 1e18;

    const [isAwaiting, setIsAwaiting] = useState(false);
    const [registered, setRegistered] = useState(false);

    async function getTokenSale(): Promise<Helper>{
        return await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);
    }

    async function updateAllowance() {
        try {
            const tokensale: Helper = await getTokenSale();
            const allowance = await tokensale.allowance(address!, "USDT");

            if(allowance){
                dispatch(setAllowance(Number(allowance.toString()) / decimals))
            }
        } catch (error) {
            console.warn("useTokenSale::updateAllowance", error)
        }
    }

    async function updateBalance(){
        try {
            const tokensale: Helper = await getTokenSale();
            const balance = await tokensale.balance(address!, "USDT");

            if(balance){
                dispatch(setBalance(Number(balance.toString()) / decimals))
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
            const tokensale: Helper = await getTokenSale();
            await tokensale.approve(signer as Signer, BigInt(amount * decimals));
        } catch (error) {
            console.warn("useTokenSale::approve", error)
        }
        setIsAwaiting(false);
    }

    async function purchase(amount: number, ref: string) {
        setIsAwaiting(true);
        try {
            const tokensale: Helper = await getTokenSale();
            await tokensale.buy(signer as Signer, BigInt(amount * decimals), ref);
        } catch (error) {
            console.warn("useTokenSale::purchase", error);
        }
        setIsAwaiting(false);
    }

    async function saveRef(ref:string) {
        try {
            const tokensale: Helper = await getTokenSale();
            await tokensale.createReference(signer as Signer, ref);
        } catch (error) {
            console.warn("useTokenSale::saveRef", error);
        }
    }

    async function isRefRegistered(ref: string) {
        if(!registered){
            try {
                const tokensale: Helper = await getTokenSale();
                setRegistered(await tokensale.isRegisteredRef(ref));
            } catch (error) {
                console.warn("useTokenSale::isRefRegistered", error);
            }
            await sleep(1000);
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

    return {approve, purchase, saveRef, isRefRegistered, registered, isAwaiting}

}