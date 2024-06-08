import { createSlice, combineReducers } from "@reduxjs/toolkit";

// export const overAllProgressSlice = createSlice({
//   name: "overAllProgressSlice",
//   initialState: {
//     processed: 0,
//     startTime: 0,
//     total: 0,
//     eta: Infinity,
//     totalSize: 0,
//     uploaded: 0,
//   },
//   reducers: {
//     setOverAllProgress: (state, action) => {
//       return { ...state, ...action.payload };
//     },
//   },
// });

export const allFilesStatus = createSlice({
  name: "allFilesStatus",
  initialState: {
    filesUploading: [],
  },
  reducers: {
    setAllFilesStatus: (state, action) => {
      state.filesUploading = action.payload;
    },
  },
});

// export const filesProgressSlice = createSlice({
//   name: "filesProgressSlice",
//   initialState: {},
//   reducers: {
//     setFilesProgress: (state, action) => {
//       return { ...state, ...action.payload };
//     },
//   },
// });

// export const uploadWindowStateSlice = createSlice({
//   name: "uploadWindowSlice",
//   initialState: {
//     open: false,
//     expanded: false,
//   },
//   reducers: {
//     setUploadWindowState: (state, action) => {
//       return { ...state, ...action.payload };
//     },
//   },
// });

// export const filesToUploadSlice = createSlice({
//   name: "filesToUploadSlice",
//   initialState: {},
//   reducers: {
//     setFilesToBeUploaded: (state, action) => {
//       return { ...state, ...action.payload };
//     },
//   },
// });

// export const filesMetaDataSlice = createSlice({
//   name: "filesMetaDataSlice",
//   initialState: {},
//   reducers: {
//     setFilesMetaData: (state, actions) => {
//       return { ...state, ...actions.payload };
//     },
//   },
// });

// export const { setOverAllProgress } = overAllProgressSlice.actions;
// export const { setFilesProgress } = filesProgressSlice.actions;
// export const { setUploadWindowState } = uploadWindowStateSlice.actions;
// export const { setFilesToBeUploaded } = filesToUploadSlice.actions;
// export const { setFilesMetaData } = filesMetaDataSlice.actions;
export const { setAllFilesStatus } = allFilesStatus.actions;
export default allFilesStatus.reducer;

// export default combineReducers({
//   overAllProgress: overAllProgressSlice.reducer,
//   filesProgress: filesProgressSlice.reducer,
//   uploadWindowState: uploadWindowStateSlice.reducer,
//   filesToUpload: filesToUploadSlice.reducer,
//   filesMetaData: filesMetaDataSlice.reducer,
//   allFilesStatus: allFilesStatus.reducer,
// });
