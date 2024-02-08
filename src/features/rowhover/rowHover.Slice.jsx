import { createSlice } from "@reduxjs/toolkit";

export const rowHoverSlice = createSlice({
  name: "rowHoeverSlice",
  initialState: {
    rowId: null,
    isHover: null,
  },
  reducers: {
    setRowHover: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setRowHover } = rowHoverSlice.actions;
export default rowHoverSlice.reducer;
