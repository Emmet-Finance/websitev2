import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BridgeTokens, TOKEN_TO_TOKEN } from "../types";
import { TChainType, TokenType } from "./types";
import {
  filterAvailableFromTokens,
  filterAvailableToChain,
  filterAvailableToTokens,
  filterFromChains,
  filterToChains,
  filterTokens,
} from "../utils/filters";

export interface IBridgeState {
  allowance: number;
  alltokens: TokenType[];
  amount: number | string;
  balance: number;
  bridgeFee: number;
  deadline: number;
  decimals: number;
  error: string | undefined;
  fromChain: string;
  fromChains: TChainType[];
  fromContractAddress: string;
  fromHash: string;
  fromToken: string;
  fromTokens: TokenType[];
  isApproving: boolean;
  isFailure: boolean;
  isLoading: boolean;
  isReset: boolean;
  isRunning: boolean;
  isSuccess: boolean;
  isSwapping: boolean;
  isTransferProgressVisible: boolean;
  receive: number | string;
  receiver: string;
  slippage: number;
  tempAmount: number | string;
  timeElapsed: number;
  toBalance: number;
  toChain: string;
  toChains: TChainType[];
  toHash: string;
  toToken: string;
  toTokens: TokenType[];
  senderAddress: string;
  isTransferFromLp: boolean;
  tokenFee: number;
}

// FROM
const fromChain = "Polygon";
const fromToken = "USDT";

// TO
const toChain = "Manta";
const toToken = "USDT";

let fromTokens = filterAvailableFromTokens(fromChain, toChain);
fromTokens = fromTokens.length > 1
  ? fromTokens.splice(1,)
  : [];

let toChains = filterToChains(fromChain, toChain);
toChains = toChains.length > 1
  ? toChains.splice(1,)
  : [];

const initialState = {
  allowance: 0,
  alltokens: BridgeTokens,
  amount: "",
  balance: 0,
  bridgeFee: 0,
  deadline: 0,
  decimals: 18,
  error: undefined,
  fromChain,
  fromChains: filterFromChains(fromChain, toChain),
  fromContractAddress: "",
  fromHash: "",
  fromToken,
  fromTokens,
  isApproving: false,
  isFailure: false,
  isLoading: false,
  isReset: false,
  isRunning: false,
  isSuccess: false,
  isSwapping: false,
  isTransferProgressVisible: false,
  receive: "",
  receiver: "",
  slippage: 0.5,
  tempAmount: "",
  timeElapsed: 0,
  toBalance: 0,
  toChain,
  toChains,
  toHash: "",
  toToken,
  toTokens: filterTokens(toToken, fromChain, toChain),
  senderAddress: "",
  isTransferFromLp: false,
  tokenFee: 0,
} as IBridgeState;

export const bridgeSlice = createSlice({
  name: "bridge",
  initialState,
  reducers: {
    setBridgeAllowance(state: IBridgeState, action: PayloadAction<number>) {
      state.allowance = action.payload;
    },
    setBridgeAmount(state: IBridgeState, action: PayloadAction<number>) {
      state.amount = action.payload;
      if(state.toChain.toLowerCase().includes('ton') && state.toToken === "USDT"){
        state.tokenFee = Number(action.payload) * 3 / 1000;
      }
      if(state.toChain.toLowerCase().includes('polygon') && state.toToken === "USDT"){
        state.tokenFee = Number(action.payload) * 3 / 1000;
      }
    },
    setBridgeBalance(state: IBridgeState, action: PayloadAction<number>) {
      state.balance = action.payload;
    },
    setBridgeDeadline(state: IBridgeState, action: PayloadAction<number>) {
      state.deadline = action.payload;
    },
    setBridgeDecimals(
      state: IBridgeState,
      action: PayloadAction<number | bigint>,
    ) {
      if (typeof action.payload === "bigint") {
        state.decimals = parseInt(action.payload.toString());
      } else {
        state.decimals = action.payload;
      }
    },
    setBridgeError(
      state: IBridgeState,
      action: PayloadAction<string | undefined>,
    ) {
      state.error = action.payload;
      state.isFailure = action.payload ? true : false;
    },
    setBridgeFromChain(state: IBridgeState, action: PayloadAction<string>) {

      state.isSwapping = true;

      state.fromChain = action.payload;

      const toCh = filterAvailableToChain(action.payload);

      state.toChain = toCh[0].name;
      state.fromChains = filterFromChains(action.payload, state.toChain);

      const fromTok = filterAvailableFromTokens(action.payload, toCh[0].name);

      state.fromTokens = fromTok.length > 1 ? fromTok.slice(1,) : [];
      state.fromToken = fromTok[0].name;
      state.toToken = filterAvailableToTokens(fromTok[0].name)[0];

      const destTokens = filterTokens(
        fromTok[0].name,
        state.fromChain,
        toCh[0].name,
      );
      
      state.toTokens = destTokens.length > 0 ? destTokens.slice(1,): [];
      
      state.toChains = toCh.length > 0 ? toCh.slice(1,) : [];

      state.isSwapping = false;
    },
    setFromContractAddress(state: IBridgeState, action: PayloadAction<string>) {
      state.fromContractAddress = action.payload;
    },
    setBridgeFromHash(state: IBridgeState, action: PayloadAction<string>) {
      state.fromHash = action.payload;
    },
    setBridgeFee(state: IBridgeState, action: PayloadAction<number>) {
      state.bridgeFee = action.payload;
    },
    setBridgeFromToken(state: IBridgeState, action: PayloadAction<string>) {

      state.isSwapping = true;

      state.fromToken = action.payload;
      // state.toToken = action.payload;
      state.fromTokens = filterTokens(
        state.fromToken,
        state.fromChain,
        state.toChain,
      );
      state.toTokens = filterTokens(
        state.toToken,
        state.fromChain,
        state.toChain,
      );

      state.toToken = TOKEN_TO_TOKEN[state.fromToken as keyof typeof TOKEN_TO_TOKEN][0];

      state.isSwapping = false;

      // if(state.fromChain === "Polygon" && state.toChain === "Songbird"){
      //   state.fromToken = "USDT"
      //   state.toToken = "USDTem"
      // }

      // if(state.fromChain === "Songbird"  && state.toChain === "Polygon"){
      //   state.fromToken = "USDTem"
      //   state.toToken =  "USDT"
      // }
    },
    setBridgeIsApproving(state: IBridgeState, action: PayloadAction<boolean>) {
      state.isApproving = action.payload;
    },
    setBridgeIsFailure(state: IBridgeState, action: PayloadAction<boolean>) {
      state.isFailure = action.payload;
    },
    setBridgeIsLoading(state: IBridgeState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setBridgeIsReset(state: IBridgeState, action: PayloadAction<boolean>) {
      // Resets the transaction timer to zero
      state.isReset = action.payload;
      if (state.isReset) {
        state.isRunning = false;
      }
    },
    setBridgeIsRunning(state: IBridgeState, action: PayloadAction<boolean>) {
      // Stops the transaction timer
      state.isRunning = action.payload;
      if (state.isRunning) {
        state.isReset = false;
      }
    },
    setBridgeIsSuccess(state: IBridgeState, action: PayloadAction<boolean>) {
      state.isSuccess = action.payload;
    },
    setReceiver: (state: IBridgeState, action: PayloadAction<string>) => {
      state.receiver = action.payload;
    },
    setBridgeSlippage(state: IBridgeState, action: PayloadAction<number>) {
      // If we're bridging the same token
      if (state.fromToken === state.toToken) {
        state.slippage = 0;
        state.receive = state.amount;
      } else {
        // If we're swapping while bridging a slippage may occur
        state.slippage = action.payload;
        const slippageAmount = (Number(state.amount) * state.slippage) / 100;
        state.receive = Number(state.amount) - slippageAmount;
      }
    },
    setBridgeTempAmount(
      state: IBridgeState,
      action: PayloadAction<number | string>,
    ) {
      state.tempAmount = action.payload;
    },
    setBridgeTimeElapsed(state: IBridgeState, action: PayloadAction<number>) {
      state.timeElapsed = action.payload;
    },
    setBridgeToChain(state: IBridgeState, action: PayloadAction<string>) {
      state.isSwapping = true;

      state.toChain = action.payload;

      state.fromChains = filterFromChains(state.fromChain, state.toChain);

      state.toChains = filterToChains(state.fromChain, action.payload);

      const fromTok = filterAvailableFromTokens(state.fromChain, action.payload);
      console.log(state.fromChain, action.payload, "fromTok", fromTok)

      if(fromTok.length > 0){
        state.fromTokens = fromTok.length > 1 ? fromTok.slice(1,) : [];
        state.fromToken = fromTok[0].name;
        state.toToken = filterAvailableToTokens(fromTok[0].name)[0];
      }

      state.isSwapping = false;

    },
    setBridgeToBalance(state: IBridgeState, action: PayloadAction<number>) {
      state.toBalance = action.payload;
    },
    setBridgeToHash(state: IBridgeState, action: PayloadAction<string>) {
      state.toHash = action.payload;
    },
    setBridgeToToken(state: IBridgeState, action: PayloadAction<string>) {
      state.isSwapping = true;

      state.toToken = action.payload;
      // state.fromToken = action.payload;
      state.fromTokens = filterTokens(
        state.fromToken,
        state.fromChain,
        state.toChain,
      );
      state.toTokens = filterTokens(
        state.toToken,
        state.fromChain,
        state.toChain,
      );

      state.fromToken = TOKEN_TO_TOKEN[state.toToken as keyof typeof TOKEN_TO_TOKEN][0];

      state.isSwapping = false;
    },
    setSenderAddress(state: IBridgeState, action: PayloadAction<string>) {
      state.senderAddress = action.payload;
    },
    setBridgeTokenFee(state: IBridgeState, action: PayloadAction<number>) {
      state.tokenFee = action.payload;
    },
    setBridgeIsTransferFromLp(
      state: IBridgeState,
      action: PayloadAction<boolean>,
    ) {
      state.isTransferFromLp = action.payload;
    },
    swapBridgeChainsAndTokens(
      state: IBridgeState,
      action: PayloadAction<{
        fromChain: string;
        toChain: string;
        fromToken: string;
        toToken: string;
      }>,
    ) {
      state.isSwapping = true;
      state.fromChains = filterFromChains(state.fromChain, state.toChain);
      state.toChains = filterToChains(state.fromChain, state.toChain);
      state.fromChain = action.payload.fromChain;
      state.toChain = action.payload.toChain;
      state.fromToken = action.payload.fromToken;
      state.toToken = action.payload.toToken;
      [state.senderAddress, state.receiver] = [state.receiver, state.senderAddress];
      
      state.isSwapping = false;
    },
    resetBridgeProgress(state: IBridgeState) {
      state.isTransferProgressVisible = false;
      state.isFailure = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.isRunning = false;
      state.fromHash = "";
      state.toHash = "";
      state.timeElapsed = 0;
      state.isReset = true;
    },
    showBridgeProgress(state: IBridgeState) {
      state.isTransferProgressVisible = true;
      state.isReset = false;
      state.isRunning = true;
      state.isFailure = false;
      state.isSuccess = false;
      state.timeElapsed = 0;
      state.toHash = "";
    },
    setBridgeReceive(state: IBridgeState, action: PayloadAction<number>) {
      state.receive = action.payload;
    },
  },
  extraReducers(builder: any) { },
});

export const {
  setBridgeAllowance,
  setBridgeAmount,
  setBridgeBalance,
  setBridgeDeadline,
  setBridgeDecimals,
  setBridgeError,
  setBridgeFee,
  setBridgeFromChain,
  setBridgeFromHash,
  setBridgeFromToken,
  setBridgeToToken,
  setFromContractAddress,
  setBridgeIsApproving,
  setBridgeIsFailure,
  setBridgeIsLoading,
  setBridgeIsReset,
  setBridgeIsRunning,
  setReceiver,
  setBridgeIsSuccess,
  setBridgeSlippage,
  setBridgeTempAmount,
  setBridgeTimeElapsed,
  setBridgeToChain,
  setBridgeToBalance,
  setBridgeToHash,
  setSenderAddress,
  swapBridgeChainsAndTokens,
  resetBridgeProgress,
  showBridgeProgress,
  setBridgeIsTransferFromLp,
  setBridgeReceive,
  setBridgeTokenFee,
} = bridgeSlice.actions;

export default bridgeSlice.reducer;
