import { configureStore } from "@reduxjs/toolkit";
import swapSliceReducer from "./swapSlice";
import bridgeSlice from "./bridgeSlice";
import explorerReducer from "./explorerSlice";
import poolSlice from "./poolSlice";
import poolsReducer from "./poolsSlice";
import stakingReducer from "./stakingSlice";
import tokensaleReducer from "./tokensaleSlice";
import claimingReducer from "./claiming";

export const store = configureStore({
  reducer: {
    bridge: bridgeSlice,
    claiming: claimingReducer,
    swap: swapSliceReducer,
    explorer: explorerReducer,
    pool: poolSlice,
    pools: poolsReducer,
    staking: stakingReducer,
    tokensale: tokensaleReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
