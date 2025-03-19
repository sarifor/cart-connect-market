import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loginRequest, loginSuccess, logoutSuccess,
  logoutRequest, loginFailure, logoutFailure,
} from '@/reducers/user';

// Q. API에 데이터를 보내려면?
// A. HTTP 메서드 POST 쓰기
function loginAPI(data) {
  const user = axios.post('http://localhost:4000/user/login', data);
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

    console.log("saga login 함수:", user);

    yield put(loginSuccess());
    // throw new Error("로그인에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    console.log("catch 블럭 안의 에러: ", error);
    yield put(loginFailure(error.message));
  }
}

// Q. POST http://localhost:4000/user/logout 404 (Not Found) 이유?
// A. 백엔드에 userRouter.get('/logout', logout);라고 되어 있으니 GET 요청을 보내야 함!
function logoutAPI() {
  const result = axios.get('http://localhost:4000/user/logout');
  return result;
}
function* logout() {
  try {
    const result = yield call(logoutAPI);
    console.log(result);

    yield put(logoutSuccess());
  } catch (error) {
    // yield put(logoutFailure(error));
    yield put(logoutFailure());
  }
}

function* watchLogin() {
  yield takeEvery(loginRequest.type, login);
}

function* watchLogout() {
  // yield takeEvery(logoutRequest.type, logout);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
  ]);
}