import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITokenSale {
    buyer: string;
    balance: number;
    pay: number;
    receive: number;
}

const initialState = {
    buyer: "",
    balance: 0,
    pay: 0,
    receive: 0,
} as ITokenSale;

export const tokensaleSlice = createSlice({
    name: "tokensale",
    initialState,
    reducers: {
        setBuyer(state: ITokenSale, action: PayloadAction<string>){
            state.buyer = action.payload;
        },
        setBalance(state: ITokenSale, action: PayloadAction<number>){
            state.balance = action.payload;
        },
        setPay(state: ITokenSale, action: PayloadAction<number>){
            state.pay = action.payload;
        },
        setReceive(state: ITokenSale, action: PayloadAction<number>){
            state.receive = action.payload;
        }
    }
});

export const {
    setBuyer,
    setBalance,
    setPay,
    setReceive,
} = tokensaleSlice.actions;

export default tokensaleSlice.reducer;