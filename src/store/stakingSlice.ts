import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Period, TUserPositions } from "tokensale.sdk/dist/types";

function estimateRewards(period: Period, amount: number): number {
    switch(period){
        case Period.Quarter:
            return amount * 24 / 100 / 4;
        case Period.Half:
            return amount * 24 / 100 / 2;
        case Period.Quarters3:
            return amount * 40 / 100 * 3 / 4;
        case Period.Year:
            return amount * 50 / 100;
        default:
            return 0;
    }
}

interface IStaking {
    amount: number;
    allowance: number;
    balance: number;
    estimatedReward: number
    period: Period;
    positions: TUserPositions | undefined;
    staker: string;
}

const initialState = {
    amount: 0,
    allowance: 0,
    balance: 0,
    estimatedReward: 0,
    period: Period.Year,
    positions: undefined,
    staker: "",
}

export const stakingSlice = createSlice({
    name: "staking",
    initialState,
    reducers: {
        setAmount(state: IStaking, action: PayloadAction<number>){
            state.amount = action.payload;
            state.estimatedReward = estimateRewards(state.period, state.amount);
        },
        setAllowance(state: IStaking, action: PayloadAction<number>){
            state.allowance = action.payload;
        },
        setBalance(state: IStaking, action: PayloadAction<number>){
            state.balance = action.payload;
        },
        setPeriod(state: IStaking, action: PayloadAction<Period>){
            state.period = action.payload;
            state.estimatedReward = estimateRewards(state.period, state.amount);
        },
        setPositions(state: IStaking, action: PayloadAction<TUserPositions | undefined>){
            state.positions = action.payload;
        },
        setStaker(state: IStaking, action: PayloadAction<string>){
            state.staker = action.payload;
        },
    }
});

export const {
    setAmount,
    setAllowance,
    setBalance,
    setPeriod,
    setPositions,
    setStaker,
} = stakingSlice.actions;

export default stakingSlice.reducer;