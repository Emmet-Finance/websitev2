import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TPool = {
    apy: number,
    chain: string,
    decimals: number,
    token: string,
    supply: number,
    rewards: number,
}

export type TPosition = {
    chain: string,
    token: string,
    balance: number,
    rewards: number
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
            if(action.payload.length >= state.pools.length){
                state.pools = action.payload;
            }
        },
        setPositions(state: IPoolsState, action: PayloadAction<TPosition[]>){
            if(action.payload.length >= state.positions.length){
                state.positions = action.payload;
            }
            
        },
    }
});

export const {
    setPools,
    setPositions
} = poolsSlice.actions;

export default poolsSlice.reducer;