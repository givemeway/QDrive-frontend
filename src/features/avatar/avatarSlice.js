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
    is2FA: false,
    isSMS: false,
    isTOTP: false,
    isEmail: false,
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
    setIs2FA: (state, actions) => {
      state.is2FA = actions.payload;
    },
    setIsSMS: (state, actions) => {
      state.isSMS = actions.payload;
    },
    setIsTOTP: (state, actions) => {
      state.isTOTP = actions.payload;
    },
    setIsEmail: (state, actions) => {
      state.isEmail = actions.payload;
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
  setIs2FA,
  setIsEmail,
  setIsTOTP,
  setIsSMS,
} = avatarSlice.actions;

export default avatarSlice.reducer;
