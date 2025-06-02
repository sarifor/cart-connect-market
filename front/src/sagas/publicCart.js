import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loadPublicCartsRequest,
  loadPublicCartsSuccess,
  loadPublicCartsFailure,
  loadPublicCartsNetworkRequest,
  loadPublicCartsNetworkSuccess,
  loadPublicCartsNetworkFailure,
  loadPublicCartDetailRequest,
  loadPublicCartDetailSuccess,
  loadPublicCartDetailFailure,
} from '@/reducers/publicCart';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

function loadPublicCartsAPI() {
  const publicCarts = axios.get(`${backURL}/public-cart`);

  return publicCarts;
}

function* loadPublicCarts() {
  try {
    yield delay(1000);

    const publicCarts = yield call(loadPublicCartsAPI);

    if (publicCarts.data.length === 0 || publicCarts.data.length > 0 ) {
      yield put(loadPublicCartsSuccess(publicCarts.data));

      return;
    }

  } catch (error) {
    yield put(loadPublicCartsFailure(
      (error.response?.data && Object.keys(error.response.data).length > 0)
      ? error.response.data
      : error.message      
    ));
  }
}

function loadPublicCartsNetworkAPI() {
  const publicCartsNetwork = axios.get(`${backURL}/public-cart/network`, { withCredentials: true });

  return publicCartsNetwork;
}

function* loadPublicCartsNetwork() {
  try {
    yield delay(1000);

    const publicCartsNetwork = yield call(loadPublicCartsNetworkAPI);

    if (publicCartsNetwork.data.nodes?.length === 0 || publicCartsNetwork.data.nodes?.length > 0 ) {
      yield put(loadPublicCartsNetworkSuccess(publicCartsNetwork.data));

      return;
    }

  } catch (error) {
    yield put(loadPublicCartsNetworkFailure(
      (error.response?.data && Object.keys(error.response.data).length > 0)
      ? error.response.data
      : error.message      
    ));
  }
}

function loadPublicCartDetailAPI(data) {
  const publicCartDetail = axios.get(`${backURL}/public-cart/${data.publicCartId}`);

  return publicCartDetail;
}

function* loadPublicCartDetail(action) {
  try {
    yield delay(1000);

    const publicCartDetail = yield call(loadPublicCartDetailAPI, action.data);
    
    if (publicCartDetail.data.Order.OrderDetails.length === 0 || publicCartDetail.data.Order.OrderDetails.length > 0 ) {
      yield put(loadPublicCartDetailSuccess(publicCartDetail.data));

      return;
    } else {
      throw new Error("OrderDetails is not an array");
    }

  } catch (error) {
    yield put(loadPublicCartDetailFailure(
      (error.response?.data && Object.keys(error.response.data).length > 0)
      ? error.response.data
      : error.message      
    ));
  }
}

function* watchLoadPublicCarts() {
  yield takeEvery(loadPublicCartsRequest.type, loadPublicCarts);
}

function* watchLoadPublicCartsNetwork() {
  yield takeEvery(loadPublicCartsNetworkRequest.type, loadPublicCartsNetwork);
}

function* watchLoadPublicCartDetail() {
  yield takeEvery(loadPublicCartDetailRequest.type, loadPublicCartDetail);
}

export default function* publicCartSaga() {
  yield all([
    fork(watchLoadPublicCarts),
    fork(watchLoadPublicCartsNetwork),
    fork(watchLoadPublicCartDetail),
  ]);
}