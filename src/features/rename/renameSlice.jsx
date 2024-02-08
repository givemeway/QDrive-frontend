import { createSlice } from "@reduxjs/toolkit";

export const renameSlice = createSlice({
  name: "rename",
  initialState: {
    mode: "idle",
    editStart: undefined,
    editStop: undefined,
    edited: undefined,
    editing: undefined,
    val: "",
  },
  reducers: {
    setEdit: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setEdit } = renameSlice.actions;
export default renameSlice.reducer;
