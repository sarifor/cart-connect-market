import axios from 'axios';
import { call, put, takeEvery, all, fork } from 'redux-saga/effects';

import { 
  INCREMENT_ASYNC_REQUEST, incrementAsyncSuccess, incrementAsyncFailure,
  DECREMENT_ASYNC_REQUEST, decrementAsyncSuccess, decrementAsyncFailure,
} from '@/reducers/counter';

// Q. Unsupported protocol localhost
// A. http:// 꼭 붙이기!
// Q. Access to XMLHttpRequest at 'http://localhost:4000/cart' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
// A. 백엔드에 cors 적용
// Q. POST http://localhost:4000/cart 404 (Not Found)
// A. 백엔드에는 GET /cart에 대한 처리만 있어서, Not Found이 나온 것. axios.get~으로 고치면 해결됨 
function getTestDataAPI () {
  const result = axios.get('http://localhost:4000/cart');
  return result;
}

// Q. yield call을 써야 하는 이유는?
// A. axios가 리턴하는 값은 Promise 객체. 그래서 yield call을 사용해야 정상적으로 axios.get()의 결과를 받을 수 있음
function* incrementAsync() {
  try {
    const result = yield call(getTestDataAPI);
    console.log(result.data[0]);

    yield put(incrementAsyncSuccess());
  } catch (err) {
    yield put(incrementAsyncFailure());
  }
}

function* watchIncrementAsync() {
  yield takeEvery(INCREMENT_ASYNC_REQUEST, incrementAsync)
}

function* decrementAsync() {
  try {
    yield put(decrementAsyncSuccess());
  } catch (err) {
    yield put(decrementAsyncFailure());
  }
}

function* watchDecrementAsync() {
  yield takeEvery(DECREMENT_ASYNC_REQUEST, decrementAsync)
}

export default function* counterSaga() {
  yield all([
    fork(watchIncrementAsync),
    fork(watchDecrementAsync),
  ]);
}