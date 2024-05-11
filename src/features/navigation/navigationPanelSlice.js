import { createSlice } from "@reduxjs/toolkit";

export const navigationSlice = createSlice({
  name: "navigationSlice",
  initialState: {
    open: false,
  },
  reducers: {
    setPanel: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setPanel } = navigationSlice.actions;
export default navigationSlice.reducer;
