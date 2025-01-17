import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
// Mock Data
import chainList from "../data/swapChains.json";
import coinsData from "../data/coins.json";
import { TChainType, TokenType } from "./types";
import { filterTwoTokens } from "../utils/filters";

interface ISwapState {
  amount: number;
  deadline: number;
  fromChain: string;
  fromToken: string;
  fromTokens: TokenType[];
  toToken: string;
  fromPrice: number;
  slippage: number;
  toChain: string;
  toPrice: number;
  tokens: TokenType[];
  toTokens: TokenType[];
}

// FROM
const fromChain = chainList[0].name;
const fromToken = coinsData[0].name;

// TO
const toChain = chainList[chainList.length - 1].name;
const toToken = coinsData[coinsData.length - 1].name;

let fromPrice = 0;
let toPrice = 0;

const initialState = {
  amount: 0,
  deadline: 0,
  fromChain,
  fromToken,
  fromTokens: filterTwoTokens(fromToken, toToken),
  toToken,
  fromPrice,
  receiver: "",
  slippage: 0.5,
  toChain,
  toPrice,
  tokens: coinsData,
  toTokens: filterTwoTokens(fromToken, toToken),
} as ISwapState;

export const swapslice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    setSwapAmount(state: ISwapState, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    setSwapFromChain(state: ISwapState, action: PayloadAction<string>) {
      state.fromChain = action.payload;
    },
    setFromToken: (state: ISwapState, action: PayloadAction<string>) => {
      state.fromToken = action.payload;
      // state.fromTokens = filterTwoTokens(state.fromToken, state.toToken);
      // state.tokens = filterTwoTokens(state.fromToken, state.toToken);
    },
    setSwapDeadline(state: ISwapState, action: PayloadAction<number>) {
      state.deadline = action.payload;
    },
    setSwapSlippage(state: ISwapState, action: PayloadAction<number>) {
      state.slippage = action.payload;
    },
    setToToken: (state: ISwapState, action: PayloadAction<string>) => {
      state.toToken = action.payload;
      // state.fromTokens = filterTwoTokens(state.fromToken, state.toToken);
      // state.tokens = filterTwoTokens(state.fromToken, state.toToken);
    },
    setFromPrice(state: ISwapState, action: PayloadAction<number>) {
      state.fromPrice = action.payload;
    },
    setToPrice(state: ISwapState, action: PayloadAction<number>) {
      state.toPrice = action.payload;
    },
  },
  extraReducers(builder: any) {},
});

export const {
  setSwapAmount,
  setSwapFromChain,
  setFromToken,
  setSwapDeadline,
  setSwapSlippage,
  setToToken,
  setFromPrice,
  setToPrice,
} = swapslice.actions;

export default swapslice.reducer;
