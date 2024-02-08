import { createSlice } from "@reduxjs/toolkit";

export const deleteTrashItems = createSlice({
  name: "deleteTrashItems",
  initialState: {
    status: "NA",
    success: "NA",
    msg: "",
    pass: 0,
    fail: 0,
    total: 0,
  },
});

export default deleteTrashItems.reducer;
