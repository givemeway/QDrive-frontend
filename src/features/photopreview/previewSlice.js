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
    photos: [],
    subpath: "",
    isPhotoPreview: false,
  },
  reducers: {
    setPosition: (state, action) => {
      return { ...state, ...action.payload };
    },
    setPreview: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setPosition, setPreview } = previewSlice.actions;
export default previewSlice.reducer;
