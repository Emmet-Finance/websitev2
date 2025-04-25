import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TAirdropPosition } from "tokensale.sdk";

interface IClaiming {
    staker: string;
    positions: TAirdropPosition;
    claimable: number;
}

const initialState = {
    staker: "",
    positions: {
        locked: 0,
        unlocked: 0,
    },
    claimable: 0
} as IClaiming;

export const claimingSlice = createSlice({
    name: "claiming",
    initialState,
    reducers: {
        setStaker(state: IClaiming, action: PayloadAction<string>) {
            state.staker = action.payload;
        },
        setPositions(state: IClaiming, action: PayloadAction<TAirdropPosition>) {
            state.positions = action.payload;
        },
        setClaimable(state: IClaiming, action: PayloadAction<number>) {
            state.claimable = action.payload;
        }
    }
});

export const {
    setStaker,
    setPositions,
    setClaimable
} = claimingSlice.actions;

export default claimingSlice.reducer;