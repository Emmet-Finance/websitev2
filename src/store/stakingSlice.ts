import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Period, TPosition, TTokenName, TUserPositions } from "tokensale.sdk/dist/types";

export function estimateRewards(period: Period, amount: number): number {
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

export const STAKING_ICONS = {
    EMMET: "/img/coin/emmet.svg",
    NTM: "/img/coin/NTM.svg"
}

interface IStaking {
    amount: number;
    allowance: number;
    balance: number;
    estimatedReward: number
    period: Period;
    positions: TUserPositions | undefined;
    selPosition: TPosition | undefined;
    selPosIndex: number;
    staker: string;
    token: TTokenName
    tokens: TTokenName[]
}

const initialState = {
    amount: 0,
    allowance: 0,
    balance: 0,
    estimatedReward: 0,
    period: Period.Year,
    positions: undefined,
    selPosition: undefined,
    selPosIndex: 0,
    staker: "",
    token: "EMMET",
    tokens: ["EMMET", "NTM"]
} as IStaking;

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
            if(state.positions && state.positions?.positions){
                state.selPosition = state.positions?.positions[0];
            }
        },
        setSelPosition(state: IStaking, action: PayloadAction<number>){
            if(state.positions && state.positions?.positions){
                if(action.payload >= 0 &&  action.payload < state.positions?.positions.length){
                    state.selPosIndex = action.payload;
                    state.selPosition = state.positions?.positions[action.payload];
                }
            }
        },
        setStaker(state: IStaking, action: PayloadAction<string>){
            state.staker = action.payload;
        },
        setToken(state: IStaking, action: PayloadAction<TTokenName>){
            state.token = action.payload;
        },
    }
});

export const {
    setAmount,
    setAllowance,
    setBalance,
    setPeriod,
    setPositions,
    setSelPosition,
    setStaker,
    setToken,
} = stakingSlice.actions;

export default stakingSlice.reducer;