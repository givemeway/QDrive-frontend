import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const closeOperation = createAsyncThunk(
  "operation/close",
  async (type, { dispatch, getState }) => {
    const operation = operationState(getState());
    dispatch(setOperation({ ...operation, open: false, type }));
  }
);

export const operationSlice = createSlice({
  name: "operation",
  initialState: {
    type: "",
    status: "idle",
    isSuccess: false,
    isError: false,
    isLoading: false,
    data: [],
    open: false,
  },
  reducers: {
    setOperation: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setOperation } = operationSlice.actions;
export default operationSlice.reducer;
export const operationState = (state) => state.operation;
