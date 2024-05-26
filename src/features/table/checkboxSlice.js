import { createSlice } from "@reduxjs/toolkit";

export const checkBoxSlice = createSlice({
  name: "checkBoxSlice",

  initialState: {
    showAllCheckBoxes: false,
    showContext: false,
    dims: {},
    cord: {
      left: 0,
      top: 0,
    },
  },
  reducers: {
    setShowAllCheckBoxes: (state, action) => {
      state.showAllCheckBoxes = action.payload;
    },
    setCord: (state, action) => {
      state.cord = action.payload;
    },
    setShowContextMenu: (state, action) => {
      state.showContext = action.payload;
    },
    setDims: (state, action) => {
      state.dims = action.payload;
    },
  },
});

export const { setShowAllCheckBoxes, setDims, setCord, setShowContextMenu } =
  checkBoxSlice.actions;
export default checkBoxSlice.reducer;
