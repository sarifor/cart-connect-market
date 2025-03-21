import { createSlice } from '@reduxjs/toolkit';

// Q. state에 변화가 없는데 이해를 위해 일부러 명시해둔 부분이 있어. 이래도 돼? (예: 로그인 성공 시 state.loginError = null;)
// A. 값이 변하지 않아도, 코드가 더 이해하기 쉬워지면 그대로 두는 게 좋아! 주석 없이도 한눈에 알아볼 수 있도록 정리하는 게 최선이야. (ChatGPT)
// Q. 화면이나 saga에서 쓸 type은 어디서 얻을 수 있지?
// A. 예: loginRequest.type
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginLoading: false,
    loginDone: false,
    loginError: null,
    logoutLoading: false,
    logoutDone: false,
    logoutError: null,
    me: null,
  },
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
} = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;