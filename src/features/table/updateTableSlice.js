import { createSlice } from "@reduxjs/toolkit";

export const updateTableSlice = createSlice({
  name: "updateTableSlice",
  initialState: {
    toggle: false,
    refresh: false,
  },
  reducers: {
    setRefresh: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setRefresh } = updateTableSlice.actions;
export default updateTableSlice.reducer;
