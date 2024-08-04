import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState: {
    show: false,
    msg: "",
    severity: null,
  },
  reducers: {
    setNotify: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});
export const { setNotify } = notificationSlice.actions;
export default notificationSlice.reducer;
