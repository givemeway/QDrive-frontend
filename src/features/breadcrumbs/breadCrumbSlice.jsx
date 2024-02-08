import { createSlice } from "@reduxjs/toolkit";

export const breadCrumbSlice = createSlice({
  name: "breadCrumbSlice",
  initialState: ["/"],
  reducers: {
    setBreadCrumb: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { setBreadCrumb } = breadCrumbSlice.actions;
export default breadCrumbSlice.reducer;
