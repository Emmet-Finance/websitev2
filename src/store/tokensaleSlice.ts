import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITokenSale {
    allowance: number;
    buyer: string;
    balance: number;
    pay: number;
    receive: number;
}

const initialState = {
    allowance: 0,
    buyer: "",
    balance: 0,
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
        setBuyer(state: ITokenSale, action: PayloadAction<string>) {
            state.buyer = action.payload;
        },
        setBalance(state: ITokenSale, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
        setPay(state: ITokenSale, action: PayloadAction<number>) {
            state.pay = action.payload;
            if(Number(state.pay) < 20) {
                state.receive = 0;
            } else if (Number(state.pay) < 1_000) {
                state.receive = Number(state.pay) * 100;
            } else if (Number(state.pay) >= 1_000 && Number(state.pay) < 5_000) {
                state.receive = Number(state.pay) * 102;
            } else if (Number(state.pay) >= 5_000 && Number(state.pay) < 20_000) {
                state.receive = Number(state.pay) * 103;
            } else if (Number(state.pay) >= 20_000 && Number(state.pay) < 50_000) {
                state.receive = Number(state.pay) * 105;
            } else if (Number(state.pay) >= 50_000 && Number(state.pay) < 100_000) {
                state.receive = Number(state.pay) * 108;
            } else if (Number(state.pay) >= 100_000) {
                state.receive = Number(state.pay) * 110;
            }
        },
        setReceive(state: ITokenSale, action: PayloadAction<number>) {
            state.receive = action.payload;
        }
    }
});

export const {
    setAllowance,
    setBuyer,
    setBalance,
    setPay,
    setReceive,
} = tokensaleSlice.actions;

export default tokensaleSlice.reducer;