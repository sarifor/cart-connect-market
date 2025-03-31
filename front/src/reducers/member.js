import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginLoading: false,
  loginDone: false,
  loginError: null,
  logoutLoading: false,
  logoutDone: false,
  logoutError: null,
  signupLoading: false,
  signupDone: false,
  signupError: null,
  me: null,
};

// Q. 화면이나 saga에서 쓸 type은 어디서 얻을 수 있지?
// A. 예: loginRequest.type
export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loginLoading = true;
      state.loginDone = false;
      state.loginError = null;
      state.me = null;
    },
    loginSuccess: (state, action) => {
      state.loginLoading = false;
      state.loginDone = true;
      state.loginError = null;
      state.me = action.payload;
    },
    loginFailure: (state, action) => {
      state.loginLoading = false;
      state.loginDone = false;
      state.loginError = action.payload;
      state.me = null;
    },
    logoutRequest: (state) => {
      state.logoutLoading = true;
      state.logoutDone = false;
      state.logoutError = null;
      state.me = state.me;
    },
    logoutSuccess: (state) => {
      state.logoutLoading = false;
      state.logoutDone = true;
      state.logoutError = null;
      state.loginDone = false;
      state.me = null;
    },
    logoutFailure: (state, action) => {
      state.logoutLoading = false;
      state.logoutDone = false;
      state.logoutError = action.payload;
      state.me = state.me;
    },
    signupRequest: (state) => {
      state.signupLoading = true;
    },
    signupSuccess: (state, action) => {
      state.signupLoading = false;
      state.signupDone = true;
      state.loginDone = true;
      state.logoutDone = false;
      state.me = action.payload;
    },
    signupFailure: (state, action) => {
      state.signupLoading = false;
      state.signupError = action.payload;
    },
    resetState: () => {
      return initialState;
    }
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  resetState,
} = memberSlice.actions;

const memberReducer = memberSlice.reducer;

export default memberReducer;