import { createSlice } from "@reduxjs/toolkit";

export const browseSlice = createSlice({
  name: "browseSlice",
  initialState: {
    reLoad: false,
    page: 1,
    pageSize: 50,
    rowSelection: {},
    selectedToEdit: "",
    query: false,
    type: "",
    total: 0,
    refresh: false,
  },
  reducers: {
    setBrowseItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    setSelectedToEdit: (state, action) => {
      state.selectedToEdit = action.payload;
    },
    setRowSelected: (state, action) => {
      state.rowSelection = action.payload;
    },
  },
});

export const { setBrowseItems, setSelectedToEdit, setRowSelected } =
  browseSlice.actions;
export default browseSlice.reducer;
