import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loginRequest, loginSuccess, logoutSuccess,
  logoutRequest, loginFailure, logoutFailure,
} from '@/reducers/user';

// Q. API에 데이터를 보내려면?
// A. HTTP 메서드 POST 쓰기
// Q. 브라우저가 서버로부터 받은 쿠키를 저장하지 못해 (개발자 도구 -> Application -> Cookies -> 저장된 값 없음)
// A. CORS 환경에서는 기본적으로 브라우저가 쿠키를 차단함. withCredentials: true를 설정해야 브라우저가 쿠키를 저장할 수 있음 (ChatGPT)
function loginAPI(data) {
  const user = axios.post('http://localhost:4000/user/login', data, { withCredentials: true });
  return user;
}

// Q. 그냥 (loginSuccess)라고만 해야 하는 건지 헷갈려
// A. 함수 자체가 아니라, 함수를 실행해서 반환된 액션 객체를 넘겨야 Redux가 올바르게 처리할 수 있어. 따라서 (loginSuccess)가 아니라 (loginSuccess())를 사용해야 해! (ChatGPT)
// Q. loginFailure()를 테스트하기 위해, try 블럭 안쪽에 error를 일부러 발생시키려면?
// A. throw new Error; (ChatGPT)
// Q. TypeError: (0 , _reducers_user__WEBPACK_IMPORTED_MODULE_1__.logoutFailure) is not a function -> logoutFailure 함수는 문제가 없어 보이는데 왜 이런 에러?
// A. reducers/user.js에서 logoutFailure가 제대로 export되지 않음 (ChatGPT)
// Q. 로그인하면 로그인 중..." 메시지를 3초간 유지하고 싶어
// A. 1안) login.js의 useEffect에서 setTimeout 사용  2안) delay(3000)을 사용하여 loginSuccess 또는 loginFailure가 실행되기 전에 3초 동안 대기하도록 변경 (ChatGPT)
function* login(action) {
  try {
    yield delay(3000);

    const user = yield call(loginAPI, action.data);

    yield put(loginSuccess(user.data));

    // throw new Error("로그인에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

// Q. POST http://localhost:4000/user/logout 404 (Not Found) 이유?
// A. 백엔드에 userRouter.get('/logout', logout);라고 되어 있으니 GET 요청을 보내야 함!
// Q. 로그아웃 요청인데 쿠키를 전송할 필요가 있는 이유는?
// A. 로그아웃 요청에서 쿠키(connect.sid)가 백엔드로 전달되지 않으면, req.session.destroy()가 동작하지 않아. 즉, 서버는 어떤 사용자의 세션을 삭제해야 하는지 알 수 없게 됨 (ChatGPT)
function logoutAPI() {
  const result = axios.post('http://localhost:4000/user/logout', {}, { withCredentials: true });
  return result;
}
function* logout() {
  try {
    yield delay(3000);

    const result = yield call(logoutAPI);
    
    console.log(result);

    yield put(logoutSuccess());

    // throw new Error("로그아웃에 실패하였습니다. 다시 시도해 주세요.");

  } catch (error) {
    yield put(logoutFailure(error.message));
  }
}

function* watchLogin() {
  yield takeEvery(loginRequest.type, login);
}

function* watchLogout() {
  yield takeEvery(logoutRequest.type, logout);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
  ]);
}