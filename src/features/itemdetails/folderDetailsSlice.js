import { createSlice } from "@reduxjs/toolkit";

export const folderDetailsSlice = createSlice({
  name: "folderDetailsSlice",
  initialState: {
    open: false,
    name: "",
    directory: "",
    device: "",
  },
  reducers: {
    setFolderDetails: (state, actions) => {
      return { ...state, ...actions.payload };
    },
  },
});

export const { setFolderDetails } = folderDetailsSlice.actions;
export default folderDetailsSlice.reducer;
