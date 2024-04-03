import { createSlice } from "@reduxjs/toolkit";

export const timelineSlice = createSlice({
  name: "timelineSlice",
  initialState: {
    renderSize: 103,
    itemSize: 103,
    timeline: "days",
    items: "photos",
    tagHeight: 30,
  },
  reducers: {
    setItemSize: (state, action) => {
      state.itemSize = action.payload;
    },
    setRenderSize: (state, action) => {
      state.renderSize = action.payload;
    },
    setTimeline: (state, action) => {
      state.timeline = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItemSize, setRenderSize, setTimeline, setItems } =
  timelineSlice.actions;

export default timelineSlice.reducer;
