import { createSlice } from "@reduxjs/toolkit";

export const previewSlice = createSlice({
  name: "previewSlice",
  initialState: {
    pos: 0,
    total: 0,
    name: "",
    ext: "",
    path: "",
    src: "",
    srcSet: "",
    imgLoaded: false,
    loading: false,
    error: false,
  },
  reducers: {
    setPosition: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setPosition } = previewSlice.actions;
export default previewSlice.reducer;
