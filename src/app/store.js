import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice.js";
import csrfTokenReduer from "../features/csrftoken/csrfTokenSlice.jsx";
import setOperationReducer from "../features/operation/operationSlice.jsx";
import setEditReducer from "../features/rename/renameSlice.jsx";
import selectedTrashBatchReducer from "../features/trash/selectedTrashBatch.jsx";
import breadcrumbs from "../features/breadcrumbs/breadCrumbSlice.jsx";
import fileDetails from "../features/itemdetails/fileDetails.Slice.jsx";
import uploadState from "../features/filesupload/uploadingFiles.slice.jsx";
import rowHover from "../features/rowhover/rowHover.Slice.jsx";
import setBrowseReducer from "../features/browseItems/browseItemsSlice.js";
import timeline from "../features/timeline/timeLineSlice.js";
import updateTable from "../features/table/updateTableSlice.js";
import photoNav from "../features/photopreview/previewSlice.js";
import selected from "../features/selectedRows/selectedRowsSlice.js";
import session from "../features/session/sessionSlice.js";
import navigatePanel from "../features/navigation/navigationPanelSlice.js";
import sharedTable from "../features/sharedTable/sharedTableSlice.js";
import checkbox from "../features/table/checkboxSlice.js";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    csrfToken: csrfTokenReduer,
    operation: setOperationReducer,
    rename: setEditReducer,
    selectedTrashBatch: selectedTrashBatchReducer,
    breadCrumbs: breadcrumbs,
    fileDetails: fileDetails,
    overAllProgress: uploadState,
    rowHover: rowHover,
    browseItems: setBrowseReducer,
    timeline: timeline,
    updateTable: updateTable,
    photoNav: photoNav,
    selected: selected,
    session: session,
    navigatePanel: navigatePanel,
    sharedTable: sharedTable,
    checkbox: checkbox,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(apiSlice.middleware),
});
