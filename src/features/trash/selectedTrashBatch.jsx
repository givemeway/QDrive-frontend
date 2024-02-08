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
  },
  reducers: {
    setSelectedTrashBatch: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setSelectedTrashBatch } = selectedTrashSlice.actions;
export default selectedTrashSlice.reducer;
