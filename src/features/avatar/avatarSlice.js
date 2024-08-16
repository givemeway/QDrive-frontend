import { createSlice } from "@reduxjs/toolkit";

const avatarSlice = createSlice({
  name: "avatarSlice",
  initialState: {
    initials: "",
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    has_avatar: false,
    avatar_url: "",
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
      state.initials = actions.payload;
    },
    setEmail: (state, actions) => {
      state.email = actions.payload;
    },
    setUserData: (state, actions) => {
      return { ...state, ...actions.payload };
    },
    setHasAvatar: (state, actions) => {
      state.has_avatar = actions.payload;
    },
    setAvatarURL: (state, actions) => {
      state.avatar_url = actions.payload;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setInitial,
  setFullName,
  setEmail,
  setUserData,
  setHasAvatar,
  setAvatarURL,
} = avatarSlice.actions;

export default avatarSlice.reducer;
