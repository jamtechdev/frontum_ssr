import { createSlice, nanoid } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const initialState = {
  compareProduct: [],
  guideCompareProduct: [],
  text_part_main: "",
};
export const compareProSlice = createSlice({
  name: "compareProduct",
  initialState,
  reducers: {
    addCompareProduct: (state, action) => {
      state.compareProduct = [];
      state.compareProduct.push(action.payload);
    },
    updateCompareProduct: (state, action) => {
      const { key, data } = action.payload || {};
      // Check if key is defined and data is an object
      if (key && typeof data === "object") {
        if (key === "productSecond") {
          state.compareProduct[0].productSecond = data;
        }
        if (key === "productThird") {
          state.compareProduct[0].productThird = data;
        }
      }
    },
    deleteCompareProduct: (state, action) => {
      if (
        state.compareProduct[0]?.productFirst &&
        action.payload.key === "productFirst"
      ) {
        state.compareProduct[0].productFirst = null;
      }
      if (
        state.compareProduct[0]?.productSecond &&
        action.payload.key === "productSecond"
      ) {
        state.compareProduct[0].productSecond = null;
      }
      if (
        state.compareProduct[0]?.productThird &&
        action.payload.key === "productThird"
      ) {
        state.compareProduct[0].productThird = null;
      }
    },
    addCompareProductForGuide: (state, action) => {
      const comparedProGuide = {
        id: action.payload.id,
        name: action.payload.name,
        category_id: action.payload.category_id,
        category_url: action.payload.category_url,
        permalink: action.payload.permalink,
        image: action.payload.image,
      };
      // here check item in compare list or not
      const existingItem = state.guideCompareProduct.find(
        (item) => item.id === comparedProGuide.id
      );
      if (existingItem) {
        toast.error("Item already exists in compare list");
      } else {
        state.guideCompareProduct.push(comparedProGuide);
      }
    },
    removeCompareProductForGuide: (state, action) => {
      state.guideCompareProduct = state.guideCompareProduct.filter(
        (item) => item.id !== action.payload
      );
    },
    resetGuideCompareProduct: (state) => {
      state.guideCompareProduct = [];
      state.compareProduct = [];
      // ... reset other state properties if needed
    },
    storeTextPartShortCode: (state, action) => {
      state.text_part_main = action.payload;
    },
  },
});

export const {
  addCompareProduct,
  addCompareProductForGuide,
  removeCompareProductForGuide,
  resetGuideCompareProduct,
  updateCompareProduct,
  deleteCompareProduct,
  storeTextPartShortCode
} = compareProSlice.actions;

export default compareProSlice.reducer;
