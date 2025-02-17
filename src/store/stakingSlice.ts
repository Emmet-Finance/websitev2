import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TUserPositions } from "tokensale.sdk/dist/types";

interface IStaking {
    amount: number;
    allowance: number;
    balance: number;
    positions: TUserPositions | undefined;
    staker: string;
}

const initialState = {
    amount: 0,
    allowance: 0,
    balance: 0,
    positions: undefined,
    staker: "",
}

export const stakingSlice = createSlice({
    name: "staking",
    initialState,
    reducers: {
        setAllowance(state: IStaking, action: PayloadAction<number>){
            state.allowance = action.payload;
        },
        setBalance(state: IStaking, action: PayloadAction<number>){
            state.balance = action.payload;
        },
        setStaker(state: IStaking, action: PayloadAction<string>){
            state.staker = action.payload;
        }
    }
});

export const {
    setAllowance,
    setBalance
} = stakingSlice.actions;

export default stakingSlice.reducer;