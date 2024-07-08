import { createSlice } from "@reduxjs/toolkit";

const avatarSlice = createSlice({
  name: "avatarSlice",
  initialState: {
    initials: "",
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
  },
  reducers: {
    setFirstName: (state, actions) => {
      state.firstName = actions.payload;
    },
    setLastName: (state, actions) => {
      state.lastName = actions.payload;
    },
    setFullName: (state, actions) => {
      state.fullName = actions.payload;
    },
    setInitial: (state, actions) => {
      state.initial = actions.payload;
    },
    setEmail: (state, actions) => {
      state.email = actions.payload;
    },
  },
});

export const { setFirstName, setLastName, setInitial, setFullName, setEmail } =
  avatarSlice.actions;

export default avatarSlice.reducer;
