import { useEffect, useState } from "react";
import { useEthersSigner } from "./useEthersSigner";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "./storage";
import { sleep } from "emmet.js";
import { Signer } from "ethers";
import { Helper, TSymbol, TokensaleHelper, mainnetConfig, testnetConfig, } from "tokensale.sdk";
import { setAllowance, setAmount, setBalance, setPositions, setStaker } from "../store/stakingSlice";

export default function useStaking() {

    const { address, isConnected } = useAccount();
    const dispatch = useAppDispatch();
    const signer = useEthersSigner();
    const isTestnet: boolean = false;
    const decimals = 1e18;

    const stakingSlice = useAppSelector(state => state.staking);

    const [isAwaiting, setIsAwaiting] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [error, setError] = useState("");

    //----------------------------------------------------------------------------------
    async function getStaking(): Promise<Helper> {
        const instance = await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);

        if (!instance) {
            throw new Error("getStaking() returned undefined or null");
        }

        return instance;
    }
    //----------------------------------------------------------------------------------
    async function updateAllowance() {
        try {
            const staking: Helper = await getStaking();
            const allowance = await staking.stakingAllowance(address!, stakingSlice.token);

            dispatch(setAllowance(Number(allowance.toString()) / decimals))
        } catch (error: {message:string} | any) {
            console.warn("useStaking::updateAllowance", error)
            setError(error.message);
        }
    }
    //----------------------------------------------------------------------------------
    async function updateBalance() {
        try {
            const staking: Helper = await getStaking();
            const balance = await staking.balance(address!, stakingSlice.token as TSymbol);

            if (balance) {
                dispatch(setBalance(Number(balance.toString()) / decimals))
            }
        
        } catch (error: {message:string} | any) {
            console.warn("useStaking::updateBalance", error)
            setError("Error fetching the user token balance");
        }
    }
    //----------------------------------------------------------------------------------
    async function updatePositions() {
        try {
            const staking: Helper = await getStaking();
            const positions = await staking.positions(address!, stakingSlice.token);
            if (positions && positions.positions) {
                dispatch(setPositions(positions))
            }
        } catch (error: {message:string} | any) {
            console.warn("useStaking::updatePositions", error)
            setError(error.message);
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

            if (!staking.stakingApprove) {
                throw new Error("stakingApprove is undefined. Check if the staking contract is loaded.");
            }

            if (!signer) {
                throw new Error("Signer is undefined. Ensure wallet is connected.");
            }

            // console.log("Approving tokens:", amount);
            // console.log("Signer:", signer);
            console.log("Staking instance:", staking);
            console.log("Signer Address:", await signer.getAddress());
            console.log("Signer Provider:", signer.provider);

            const txHash = await staking.stakingApprove(
                signer as Signer, 
                BigInt(amount) * BigInt(decimals),
                stakingSlice.token);
            console.log("Approve TX", txHash)
            setError("Successful Approval!")
        } catch (error: {message:string} | any) {
            console.warn("useStaking::approve", error);
            setError("Approval Error...");
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
                stakingSlice.period,
                stakingSlice.token
            );
            if (result && typeof (result) === "string" && result.length > 0) {
                setTxHash(result);
                dispatch(setAmount(0));
                setError("Successful Staking!");
            }
        } catch (error: {message:string} | any) {
            console.warn("useStaking::stake", error);
            setError("Staking Error...");
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function withdraw(posIndex: number) {
        if (isAwaiting) return; // Prevent duplicate calls

        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();

            const result = await staking.closeStake(
                signer as Signer, 
                posIndex,
                stakingSlice.token
            );
            if (result && typeof (result) === "string" && result.length > 0) {
                setTxHash(result);
                setError("Successful Withdrawal!");
            }
        } catch (error: {message:string} | any) {
            console.warn("useStaking::withdraw", error);
            setError("Withdrawal Error...");
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------
    async function withdrawRewards(posIndex: number) {
        setIsAwaiting(true);
        try {
            const staking: Helper = await getStaking();
            const result = await staking.withdrawRewards(
                signer as Signer, 
                posIndex,
                stakingSlice.token
            );
            if (result && typeof (result) === "string" && result.length > 0) {
                setTxHash(result);
                setError("Successful Withdrawal!");
            }
        } catch (error: {message:string} | any) {
            console.warn("useStaking::withdrawRewards", error);
            setError("Rewards withdrawal Error...");
        }
        setIsAwaiting(false);
    }
    //----------------------------------------------------------------------------------

    useEffect(() => {

        if (!isConnected) {
            dispatch(setStaker(""))
            return;
        }

        let interval: NodeJS.Timeout;

        (async () => {
            await checkAll()
        })()

        // Then fetch data every 30 seconds
        interval = setInterval(checkAll, 30_000);


        return () => clearInterval(interval);

    }, [isConnected, stakingSlice.staker, stakingSlice.token]);

    return { approve, isAwaiting, txHash, stake, withdraw, withdrawRewards, error, setError }

}
