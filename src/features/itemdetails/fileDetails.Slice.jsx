import { createSlice } from "@reduxjs/toolkit";

export const fileDetailSlice = createSlice({
  name: "fileDetailSlice",
  initialState: {
    open: false,
    file: {},
  },
  reducers: {
    setFileDetails: (state, actions) => {
      return { ...state, ...actions.payload };
    },
  },
});

export const { setFileDetails } = fileDetailSlice.actions;
export default fileDetailSlice.reducer;
