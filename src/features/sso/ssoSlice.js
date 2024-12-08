import { createSlice } from "@reduxjs/toolkit";

const ssoSlice = createSlice({
  name: "ssoSlice",
  initialState: {
    idpIssuer: "",
    idpCert: "",
    entryPoint: "",
  },
  reducers: {
    setSSOConfig: (state, actions) => {
      return { ...state, ...actions.payload };
    },
  },
});

export const { setSSOConfig } = ssoSlice.actions;
export default ssoSlice.reducer;
