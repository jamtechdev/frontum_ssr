import { configureStore } from "@reduxjs/toolkit";
import compareProSlice from "./features/compareProduct/compareProSlice";

const store = configureStore({
  reducer: {
    comparePro: compareProSlice,
  },
});

export default store;
