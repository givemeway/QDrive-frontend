import { createSlice } from "@reduxjs/toolkit";

export const sharedTableSlice = createSlice({
  name: "sharedTableSlice",
  initialState: {
    rowSelection: {},
    rowClicked: { id: "", type: "", CSRFToken: "" },
  },
  reducers: {
    setSelectedRow: (state, action) => {
      state.rowSelection = action.payload;
    },
    setRowClicked: (state, action) => {
      state.rowClicked = action.payload;
    },
  },
});

export const { setSelectedRow, setRowClicked } = sharedTableSlice.actions;
export default sharedTableSlice.reducer;
