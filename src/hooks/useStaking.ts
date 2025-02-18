import { useEffect, useState } from "react";
import { useEthersSigner } from "./useEthersSigner";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "./storage";
import { sleep } from "emmet.js";
import { Signer } from "ethers";
import { Helper, Period, TokensaleHelper, mainnetConfig, testnetConfig, } from "tokensale.sdk";
import { setAllowance, setBalance, setPositions, setStaker } from "../store/stakingSlice";

export default function useStaking() {

    const { address, isConnected } = useAccount();
    const dispatch = useAppDispatch();
    const signer = useEthersSigner();
    const isTestnet: boolean = true;
    const decimals = 1e18;

    const stakingSlice = useAppSelector(state => state.staking);

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
            const allowance = await staking.stakingAllowance(address!);

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
    async function updatePositions() {
        try {
            const staking: Helper = await getStaking();
            const positions = await staking.positions(address!);
            if (positions && positions.positions) {
                dispatch(setPositions(positions))
            }
        } catch (error) {
            console.warn("useStaking::updatePositions", error)
        }
    }
    //----------------------------------------------------------------------------------
    async function checkAll() {
        await updatePositions();
        await sleep(1000)
        await updateBalance();
        await sleep(1000);
        await updateAllowance();
        isConnected && dispatch(setStaker(address!));
    }
    //----------------------------------------------------------------------------------
    async function approve(amount: number) {
        setIsAwaiting(true);

        try {
            const staking: Helper = await getStaking();
            await staking.stakingApprove(signer as Signer, BigInt(amount * decimals));
        } catch (error) {
            console.warn("useStaking::approve", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function stake() {
        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();
            const result = await staking.stake(
                signer as Signer, 
                BigInt(stakingSlice.amount), 
                stakingSlice.period)
            ;
            if (result && typeof (result) === "string" && result.length > 0) {
                setTxHash(result);
            }
        } catch (error) {
            console.warn("useStaking::stake", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function unstake(posIndex: number) {
        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();
            const result = await staking.unstake(signer as Signer, posIndex);
            if (result && typeof (result) === "string" && result.length > 0) {
                setTxHash(result);
            }
        } catch (error) {
            console.warn("useStaking::stake", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function withdrawRewards(posIndex: number) {
        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();
            const result = await staking.withdrawRewards(signer as Signer, posIndex);
            if (result && typeof (result) === "string" && result.length > 0) {
                setTxHash(result);
            }
        } catch (error) {
            console.warn("useStaking::stake", error)
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------

    useEffect(() => {

        if (!isConnected) return;

        let interval: NodeJS.Timeout;

        (async () => {
            await checkAll()
        })()

        // Then fetch data every 30 seconds
        interval = setInterval(checkAll, 30_000);


        return () => clearInterval(interval);

    }, [isConnected]);

    return { approve, isAwaiting, txHash, stake, unstake, withdrawRewards }

}
