import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loadShippingAddressesRequest,
  loadShippingAddressesSuccess,
  loadShippingAddressesFailure,
  checkoutRequest,
  checkoutSuccess,
  checkoutFailure,
  // resetState,
} from '@/reducers/checkout';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

function loadShippingAddressesAPI() {
  const shippingAddresses = axios.get(`${backURL}/checkout/shipping-address`, { withCredentials: true });

  return shippingAddresses;
}

function* loadShippingAddresses() {
  try {
    yield delay(1000);

    const shippingAddresses = yield call(loadShippingAddressesAPI);

    if (shippingAddresses.data.length === 0 || shippingAddresses.data.length > 0 ) {
      // yield put(resetState());
      yield put(loadShippingAddressesSuccess(shippingAddresses.data));
    }

    // throw new Error("배송 주소 가져오기에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(loadShippingAddressesFailure(
      (error.response?.data && Object.keys(error.response.data).length > 0)
      ? error.response.data
      : error.message      
    ));
  }
}

function checkoutAPI(data) {
  const response = axios.post(`${backURL}/checkout`, data, { withCredentials: true });

  return response;
}

function* checkout(action) {
  try {
    yield delay(1000);

    const response = yield call(checkoutAPI, action.data);

    if (response.status === 201) {
      yield put(checkoutSuccess());
    }

    // throw new Error("주문 생성에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(checkoutFailure(
      (error.response?.data && Object.keys(error.response.data).length > 0)
      ? error.response.data
      : error.message      
    ));
  }
}

function* watchLoadShippingAddresses() {
  yield takeEvery(loadShippingAddressesRequest.type, loadShippingAddresses);
}

function* watchCheckout() {
  yield takeEvery(checkoutRequest.type, checkout);
}

export default function* checkoutSaga() {
  yield all([
    fork(watchLoadShippingAddresses),
    fork(watchCheckout),
  ]);
}