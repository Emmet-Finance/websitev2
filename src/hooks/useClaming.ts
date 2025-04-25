import { useAccount } from "wagmi";
import { useAppDispatch } from "./storage";
import { useEthersSigner } from "./useEthersSigner";
import { useEffect, useState } from "react";
import { Helper, mainnetConfig, sleep, TAirdropPosition, testnetConfig, TokensaleHelper } from "tokensale.sdk";
import { setClaimable, setPositions, setStaker } from "../store/claiming";


export default function useClaming() {
    const { address, isConnected } = useAccount();
    const dispatch = useAppDispatch();
    const signer = useEthersSigner();
    const isTestnet: boolean = false;
    const decimals = 1e18;

    const [isAwaiting, setIsAwaiting] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [error, setError] = useState("");

    //----------------------------------------------------------------------------------
    async function getHelper(): Promise<Helper> {
        const instance = await TokensaleHelper(isTestnet ? testnetConfig : mainnetConfig);

        if (!instance) {
            throw new Error("getClaming() returned undefined or null");
        }

        return instance;
    }
    //----------------------------------------------------------------------------------
    async function updateClaimable() {
        try {
            const tokensale: Helper = await getHelper();
            const claimable = await tokensale.claimableAirdrop(address!);

            if (claimable) {
                dispatch(setClaimable(Number(claimable.toString()) / decimals))
            }
        } catch (error) {
            console.warn("useClaming::updateClaimable", error)
        }
    }
    //----------------------------------------------------------------------------------
    async function updatePositions() {
        try {
            const tokensale: Helper = await getHelper();
            const positions: TAirdropPosition = await tokensale.positionsAirdrop(address!);

            if (positions) {
                dispatch(setPositions({
                    locked: positions.locked / decimals,
                    unlocked: positions.unlocked / decimals
                }))
            }
        } catch (error) {
            console.warn("useClaming::updatePositions", error)
        }
    }
    //----------------------------------------------------------------------------------
    async function checkAll() {
        dispatch(setStaker(address!));
        await updateClaimable();
        await sleep(1000);
        await updatePositions();
    }
    async function claim() {
        try {
            setIsAwaiting(true);
            const tokensale: Helper = await getHelper();
            const txHash = await tokensale.claim(signer as any);
            setTxHash(txHash as string);
            setIsAwaiting(false);
        } catch (error: any) {
            console.warn("useClaming::claim", error)
            setError(error.message)
            setIsAwaiting(false);
        }
    }
    //----------------------------------------------------------------------------------
    useEffect(() => {
        if(!isConnected && !address) {
            dispatch(setStaker(""));
            dispatch(setClaimable(0));
            dispatch(setPositions({ locked: 0, unlocked: 0 }));
        }
    }, [isConnected, address])
    //----------------------------------------------------------------------------------
    useEffect(() => {

        let interval: NodeJS.Timeout;

        if (isConnected) {

            (async () => {
                await checkAll()
            })()

            // Then fetch data every 10 seconds
            interval = setInterval(checkAll, 10_000);

        }

        return () => clearInterval(interval);

    });
    //----------------------------------------------------------------------------------
    return { claim, txHash, error, isAwaiting };
}