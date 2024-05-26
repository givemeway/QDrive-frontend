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
    ref: null,
    cellEdit: null,
    layout: "",
    urlPath: "",
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
    setRef: (state, action) => {
      state.ref = action.payload;
    },

    setCellEdit: (state, action) => {
      state.cellEdit = action.payload;
    },
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
    setUrlPath: (state, action) => {
      state.urlPath = action.payload;
    },
  },
});

export const {
  setBrowseItems,
  setSelectedToEdit,
  setRowSelected,
  setRef,
  setCellEdit,
  setLayout,
  setUrlPath,
} = browseSlice.actions;
export default browseSlice.reducer;
