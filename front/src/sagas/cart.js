import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loadCartItemsRequest,
  loadCartItemsSuccess,
  loadCartItemsFailure,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  decrementCartRequest,
  decrementCartSuccess,
  decrementCartFailure,
  deleteCartRequest,
  deleteCartSuccess,
  deleteCartFailure,  
} from '@/reducers/cart';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

function loadCartItemsAPI() {
  const cartItems = axios.get(`${backURL}/cart`, { withCredentials: true });
  return cartItems;
}

function* loadCartItems() {
  try {
    yield delay(4000);

    const cartItems = yield call(loadCartItemsAPI);

    yield put(loadCartItemsSuccess(cartItems.data));

    // throw new Error("장바구니 가져오기에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(loadCartItemsFailure(
      (error.response?.data && Object.keys(error.response.data).length > 0)
      ? error.response.data
      : error.message      
    ));
  }
}

function addToCartAPI(data) {
  const cartItems = axios.post(`${backURL}/cart/add`, data, { withCredentials: true });
  return cartItems;
}

function* addToCart(action) {
  try {
    yield delay(2000);

    const cartItems = yield call(addToCartAPI, action.data);

    yield put(addToCartSuccess(cartItems.data));

    // throw new Error("장바구니 추가하기에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(addToCartFailure(error.response?.data?.message || error.message));
  }
}

function decrementCartAPI(data) {
  const cartItems = axios.patch(`${backURL}/cart/decrement`, data, { withCredentials: true });
  return cartItems;
}

function* decrementCart(action) {
  try {
    yield delay(2000);

    const cartItems = yield call(decrementCartAPI, action.data);

    yield put(decrementCartSuccess(cartItems.data));

    // throw new Error("장바구니에서 제외시키기에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(decrementCartFailure(error.response?.data?.message || error.message));
  }
}

function deleteCartAPI(data) {
  const cartItems = axios.delete(`${backURL}/cart/delete`, { data: data, withCredentials: true });
  return cartItems;
}

function* deleteCart(action) {
  try {
    yield delay(2000);

    const cartItems = yield call(deleteCartAPI, action.data);

    yield put(deleteCartSuccess(cartItems.data));

    // throw new Error("장바구니 상품 삭제를 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(deleteCartFailure(error.response?.data?.message || error.message));
  }
}

function* watchLoadCartItems() {
  yield takeEvery(loadCartItemsRequest.type, loadCartItems);
}

function* watchAddToCart() {
  yield takeEvery(addToCartRequest.type, addToCart);
}

function* watchDecrementCart() {
  yield takeEvery(decrementCartRequest.type, decrementCart);
}

function* watchDeleteCart() {
  yield takeEvery(deleteCartRequest.type, deleteCart);
}

export default function* cartSaga() {
  yield all([
    fork(watchLoadCartItems),
    fork(watchAddToCart),
    fork(watchDecrementCart),
    fork(watchDeleteCart),
  ]);
}