import { useEffect, useState } from "react";
import { useEthersSigner } from "./useEthersSigner";
import { useAccount } from "wagmi";
import { useAppDispatch } from "./storage";
import { sleep } from "emmet.js";
import { Signer } from "ethers";
import { Helper, Period, TokensaleHelper, mainnetConfig, testnetConfig, } from "tokensale.sdk";
import { setAllowance, setBalance } from "../store/stakingSlice";

export default function useStaking() {

    const { address, isConnected } = useAccount();
    const dispatch = useAppDispatch();
    const signer = useEthersSigner();
    const isTestnet: boolean = false;
    const decimals = 1e18;

    const [isAwaiting, setIsAwaiting] = useState(false);
    const [txHash, setTxHash] = useState("");

    //----------------------------------------------------------------------------------
    async function getStaking(): Promise<Helper> {
        return await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig)
    }
    //----------------------------------------------------------------------------------
    async function updateAllowance() {
        try {
            const staking: Helper = await getStaking();
            const allowance = await staking.allowance(address!, "EMMET");

            if (allowance) {
                dispatch(setAllowance(Number(allowance.toString()) / decimals))
            }
        } catch (error) {
            console.warn("useStaking::updateAllowance", error)
        }
    }
    //----------------------------------------------------------------------------------
    async function updateBalance() {
        try {
            const staking: Helper = await getStaking();
            const balance = await staking.balance(address!, "EMMET");

            if (balance) {
                dispatch(setBalance(Number(balance.toString()) / decimals))
            }
        } catch (error) {
            console.warn("useStaking::updateBalance", error)
        }
    }
    //----------------------------------------------------------------------------------
    async function checkAll() {
        await updateBalance();
        await sleep(1000);
        await updateAllowance();
        isConnected && dispatch(setStaker(address!));
    }
    //----------------------------------------------------------------------------------
    async function  approve(amount: number) {
        setIsAwaiting(true);

        try {
            const staking: Helper = await getStaking();
            await staking.approve(signer as Signer, BigInt(amount * decimals));
        } catch (error) {
            console.warn("useStaking::approve", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function  stake(amount: number, period: Period) {
        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();
            const result = await staking.stake(signer as Signer, BigInt(amount), period);
            if(result && typeof(result) === "string" && result.length > 0){
                setTxHash(result);
            }
        } catch (error) {
            console.warn("useStaking::stake", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function  unstake(posIndex: number) {
        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();
            const result = await staking.unstake(signer as Signer, posIndex);
            if(result && typeof(result) === "string" && result.length > 0){
                setTxHash(result);
            }
        } catch (error) {
            console.warn("useStaking::stake", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function  withdrawRewards(posIndex: number) {
        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();
            const result = await staking.withdrawRewards(signer as Signer, posIndex);
            if(result && typeof(result) === "string" && result.length > 0){
                setTxHash(result);
            }
        } catch (error) {
            console.warn("useStaking::stake", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------

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


    return {approve,  isAwaiting, txHash, stake, unstake, withdrawRewards}

}

function setStaker(arg0: string): any {
    throw new Error("Function not implemented.");
}
