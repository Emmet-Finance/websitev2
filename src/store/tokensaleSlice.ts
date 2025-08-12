import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCashTokenName} from "tokensale.sdk/dist/types";

interface ITokenSale {
    allowance: number;
    balance: number;
    buyer: string;
    cash: TCashTokenName;
    pay: number;
    receive: number;
}

const initialState = {
    allowance: 0,
    balance: 0,
    buyer: "",
    cash: "USDT",
    pay: 0,
    receive: 0,
} as ITokenSale;

export const tokensaleSlice = createSlice({
    name: "tokensale",
    initialState,
    reducers: {
        setAllowance(state: ITokenSale, action: PayloadAction<number>) {
            state.allowance = action.payload;
        },
        setBalance(state: ITokenSale, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
        setBuyer(state: ITokenSale, action: PayloadAction<string>) {
            state.buyer = action.payload;
        },
        setCash(state: ITokenSale, action: PayloadAction<TCashTokenName>) {
            state.cash = action.payload;
        },
        setPay(state: ITokenSale, action: PayloadAction<number>) {
            state.pay = action.payload;
            if(Number(state.pay) < 20) {
                state.receive = 0;
            } else if (Number(state.pay) < 1_000) {
                state.receive = Number(state.pay) * 90.09009009;
            } else if (Number(state.pay) >= 1_000 && Number(state.pay) < 5_000) {
                state.receive = Number(state.pay) * 92.59259259;
            } else if (Number(state.pay) >= 5_000 && Number(state.pay) < 20_000) {
                state.receive = Number(state.pay) * 93.45794393;
            } else if (Number(state.pay) >= 20_000 && Number(state.pay) < 50_000) {
                state.receive = Number(state.pay) * 95.23809524;
            } else if (Number(state.pay) >= 50_000 && Number(state.pay) < 100_000) {
                state.receive = Number(state.pay) * 98.03921569;
            } else if (Number(state.pay) >= 100_000) {
                state.receive = Number(state.pay) * 100;
            }
        },
        setReceive(state: ITokenSale, action: PayloadAction<number>) {
            state.receive = action.payload;
        }
    }
});

export const {
    setAllowance,
    setBalance,
    setBuyer,
    setCash,
    setPay,
    setReceive,
} = tokensaleSlice.actions;

export default tokensaleSlice.reducer;