import { configureStore } from "@reduxjs/toolkit";
import swapSliceReducer from "./swapSlice";
import bridgeSlice from "./bridgeSlice";
import explorerReducer from "./explorerSlice";
import poolSlice from "./poolSlice";
import poolsReducer from "./poolsSlice";
import tokensaleReducer from "./tokensaleSlice";

export const store = configureStore({
  reducer: {
    bridge: bridgeSlice,
    swap: swapSliceReducer,
    explorer: explorerReducer,
    pool: poolSlice,
    pools: poolsReducer,
    tokensale: tokensaleReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
