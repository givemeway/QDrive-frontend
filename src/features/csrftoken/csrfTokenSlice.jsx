import { createSlice } from "@reduxjs/toolkit";

export const csrfTokenSlice = createSlice({
  name: "csrfToken",
  initialState: {
    CSRFToken: "",
  },
  reducers: {
    setCSRFToken: (state, action) => {
      state.CSRFToken = action.payload;
    },
  },
});

export const { setCSRFToken } = csrfTokenSlice.actions;
export default csrfTokenSlice.reducer;
