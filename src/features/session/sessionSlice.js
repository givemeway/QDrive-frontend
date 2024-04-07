import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "sessionSlice",
  initialState: {
    isLoggedIn: false,
    isLoggedOut: false,
  },
  reducers: {
    setSession: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setSession } = sessionSlice.actions;

export default sessionSlice.reducer;
