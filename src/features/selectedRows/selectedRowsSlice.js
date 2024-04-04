import { createSlice } from "@reduxjs/toolkit";

export const selectedSlice = createSlice({
  name: "selectedSlice",
  initialState: {
    fileIds: [],
    directories: [],
  },
  reducers: {
    setFilesSelected: (state, action) => {
      state.fileIds = action.payload;
    },
    setFoldersSelected: (state, action) => {
      state.directories = action.payload;
    },
  },
});

export const { setFilesSelected, setFoldersSelected } = selectedSlice.actions;
export default selectedSlice.reducer;
