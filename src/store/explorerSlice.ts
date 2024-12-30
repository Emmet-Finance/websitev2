import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TxDetails, SearchDataType } from "../types";

export interface DetailedTx {
  txHash: string;
  nonce: number;
  sentAmount: number;
  receivedAmount: number;
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  recipient: string;
  originalHash: string;
  destinationHash: string;
  started: number;
  finished: number;
  fromChainTimestamp: number;
  targetChainTimestamp: number;
  fromChainFees: number;
  targetChainFees: number;
  protocolFee: number;
}

export interface IExplorerState {
  bridgeTransaction: DetailedTx;
  filter: string;
  filterType: SearchDataType;
  tableData: TxDetails[];
}

const initialState: IExplorerState = {
  bridgeTransaction: {
    sentAmount: 0,
    receivedAmount: 0,
    fromToken: "USDT",
    toToken: "USDT",
    destinationHash: "",
    originalHash: "",
    fromChainId: 0,
    toChainId: 0,
    nonce: 0,
    recipient: "",
    fromChainFees: 0,
    fromChainTimestamp: 0,
    targetChainFees: 0,
    targetChainTimestamp: 0,
    finished: Date.now(),
    started: Date.now(),
    txHash: "",
    protocolFee: 0,
  },
  filter: "",
  filterType: SearchDataType.None,
  tableData: [],
};

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    setSearchFilter(state: IExplorerState, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    setSearchFilterType(
      state: IExplorerState,
      action: PayloadAction<SearchDataType>,
    ) {
      state.filterType = action.payload;
    },
    setBridgeTransaction(
      state: IExplorerState,
      action: PayloadAction<DetailedTx>,
    ) {
      state.bridgeTransaction = action.payload;
    },
    setBridgeTimeElapsedSinceStart(
      state: IExplorerState,
      action: PayloadAction<number>,
    ) {
      // state.bridgeTransaction.age = action.payload;
    },
    resetBridgeTransactionData(state: IExplorerState) {
      state.bridgeTransaction = initialState.bridgeTransaction;
    },
    setTableData(state: IExplorerState, action: PayloadAction<TxDetails[]>) {
      state.tableData = action.payload;
    },
  },
  extraReducers(builder: any) {},
});

export const {
  setSearchFilter,
  setSearchFilterType,
  resetBridgeTransactionData,
  setBridgeTransaction,
  setTableData,
} = explorerSlice.actions;

export default explorerSlice.reducer;
