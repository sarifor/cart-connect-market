import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loginRequest, loginSuccess, logoutSuccess,
  logoutRequest, loginFailure, logoutFailure,
  signupRequest, signupSuccess, signupFailure,
  resetMemberState,
} from '@/reducers/member';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

// Q. 브라우저가 서버로부터 받은 쿠키를 저장하지 못해 (개발자 도구 -> Application -> Cookies -> 저장된 값 없음)
// A. CORS 환경에서는 기본적으로 브라우저가 쿠키를 차단함. withCredentials: true를 설정해야 브라우저가 쿠키를 저장할 수 있음 (ChatGPT)
function loginAPI(data) {
  const member = axios.post(`${backURL}/member/login`, data, { withCredentials: true });
  return member;
}

// Q. resetMemberState()를 delay(3000) 직전이 아닌 loginSuccess 직전으로 옮긴 이유?
// A. delay(3000) 직전에 실행하면 loginLoading이 false로 바뀐 상태가 3초 동안 유지되어 UX가 어색해지기 때문 (ChatGPT)
function* login(action) {
  try {
    yield delay(3000);

    const member = yield call(loginAPI, action.data);

    yield put(resetMemberState());
    yield put(loginSuccess(member.data));

    // throw new Error("로그인에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(loginFailure(error.response?.data || error.message));
  }
}

// Q. 로그아웃 요청인데 쿠키를 전송할 필요가 있는 이유는?
// A. 로그아웃 요청에서 쿠키(connect.sid)가 백엔드로 전달되지 않으면, req.session.destroy()가 동작하지 않아. 즉, 서버는 어떤 사용자의 세션을 삭제해야 하는지 알 수 없게 됨 (ChatGPT)
function logoutAPI() {
  const result = axios.post(`${backURL}/member/logout`, {}, { withCredentials: true });
  return result;
}

function* logout() {
  try {
    yield delay(3000);

    const res = yield call(logoutAPI);
    
    if (res.status === 200) {
      yield put(logoutSuccess());
      yield put(resetMemberState());
    }

    // throw new Error("로그아웃에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(logoutFailure(error.response?.data || error.message));
  }
}

// Q. Saga 쪽 에러로 인해 회원 가입 실패 시, 서버의 쿠키 삭제, 서버 데이터베이스의 회원 정보 삭제, 그 밖에 할 일?
// Q. 회원 가입 때 쿠키 전송이 필요한가?
// A. 회원 가입(signup) API 자체는 쿠키가 꼭 필요하지 않아. 하지만 회원 가입 후 곧바로 로그인 시 세션을 생성한다면, withCredentials: true는 반드시 필요해 (ChatGPT)
function signupAPI(data) {
  const result = axios.post(`${backURL}/member/signup`, data, { withCredentials: true });
  return result;
}

function* signup(action) {
  try {
    yield delay(3000);

    const member = yield call(signupAPI, action.data);

    if (member.status = 201) {
      yield put(resetMemberState());
      yield put(signupSuccess(member.data));
    }

    // throw new Error("테스트 중이에요~!");
  } catch (error) {
    yield put(signupFailure(error.response?.data || error.message));
  }
}

function* watchLogin() {
  yield takeEvery(loginRequest.type, login);
}

function* watchLogout() {
  yield takeEvery(logoutRequest.type, logout);
}

function* watchSignup() {
  yield takeEvery(signupRequest.type, signup);
}

export default function* memberSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSignup),
  ]);
}