import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TPool = {
    apy: number,
    chain: string,
    decimals: number,
    token: string,
    supply: number,
    balance: number,
}

export type TPosition = {
    chain: string,
    token: string,
    balance: number,
    staked: number,
}

interface IPoolsState {
    pools: TPool [];
    positions: TPosition [];
}

const initialState = {
    pools: [],
    positions: [],
}

export const poolsSlice = createSlice({
    name: "pools",
    initialState,
    reducers: {
        setPools(state: IPoolsState, action: PayloadAction<TPool []>){
            state.pools = action.payload;
        },
        setPositions(state: IPoolsState, action: PayloadAction<TPosition[]>){
            state.positions = action.payload;
            
        },
    }
});

export const {
    setPools,
    setPositions
} = poolsSlice.actions;

export default poolsSlice.reducer;