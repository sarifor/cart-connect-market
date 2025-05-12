import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loadOrdersRequest,
  loadOrdersSuccess,
  loadOrdersFailure,
} from '@/reducers/order';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

function loadOrdersAPI() {
  const orders = axios.get(`${backURL}/order`, { withCredentials: true });

  return orders;
}

function* loadOrders() {
  try {
    yield delay(1000);

    const orders = yield call(loadOrdersAPI);

    if (orders.data.length === 0 || orders.data.length > 0 ) {
      yield put(loadOrdersSuccess(orders.data));
    }

    // throw new Error("주문 이력 가져오기에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(loadOrdersFailure(
      (error.response?.data && Object.keys(error.response.data).length > 0)
      ? error.response.data
      : error.message      
    ));
  }
}

function* watchLoadOrders() {
  yield takeEvery(loadOrdersRequest.type, loadOrders);
}

export default function* orderSaga() {
  yield all([
    fork(watchLoadOrders),
  ]);
}