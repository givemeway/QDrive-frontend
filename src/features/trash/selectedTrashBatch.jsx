import { createSlice } from "@reduxjs/toolkit";

export const selectedTrashSlice = createSlice({
  name: "selectedTrashSlice",
  initialState: {
    name: "",
    path: "",
    begin: "",
    items: undefined,
    end: "",
    item: "",
    id: "",
    limit: { begin: 0, end: 0 },
    isTrashBatchOpen: false,
    isTrashBulkBatchDeleteOpen: false,
    isTrashBulkBatchRestoreOpen: false,
    selectedTrashItems: [],
  },
  reducers: {
    setSelectedTrashBatch: (state, action) => {
      return { ...state, ...action.payload };
    },
    setBatchTrashOpen: (state, action) => {
      state.isTrashBatchOpen = action.payload;
    },
    setTrashBulkBatchDeleteOpen: (state, action) => {
      state.isTrashBulkBatchDeleteOpen = action.payload;
    },
    setTrashBulkBatchRestoreOpen: (state, action) => {
      state.isTrashBulkBatchRestoreOpen = action.payload;
    },
    setSelectedTrashItems: (state, action) => {
      state.selectedTrashItems = action.payload;
    },
  },
});

export const {
  setSelectedTrashBatch,
  setBatchTrashOpen,
  setTrashBulkBatchDeleteOpen,
  setTrashBulkBatchRestoreOpen,
  setSelectedTrashItems,
} = selectedTrashSlice.actions;
export default selectedTrashSlice.reducer;
