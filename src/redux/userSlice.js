import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: { id: null, name: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storeUserDetails: (state, action) => {
      let update = {
        id: action.payload.id,
        name: action.payload.name,
      };
      state.userData = update;
    },
    resetUserDetails: (state) => {
      state.userData = { id: null, name: null };
    },
  },
});

export const { storeUserDetails, resetUserDetails } = userSlice.actions;

export default userSlice.reducer;
