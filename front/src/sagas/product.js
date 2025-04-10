import axios from 'axios';
import { delay, call, put, takeEvery, all, fork } from 'redux-saga/effects';

import {
  loadCategoriesRequest,
  loadCategoriesSuccess,
  loadCategoriesFailure,
  loadProductsRequest,
  loadProductsSuccess,
  loadProductsFailure,
  resetState,
} from '@/reducers/product';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

function loadProductsAPI(data) {
  const products = axios.get(`${backURL}/product/category/${data.categoryId}`, {}, { withCredentials: true });
  return products;
}

function* loadProducts(action) {
  try {
    yield delay(3000);

    const products = yield call(loadProductsAPI, action.data);

    if (products.data.length === 0 || products.data.length > 0) {
      // yield put(resetState());
      yield put(loadProductsSuccess(products.data));
    }

    // throw new Error("상품 가져오기에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(loadProductsFailure(error.response?.data || error.message));
  }
}

function loadCategoriesAPI() {
  const categories = axios.get(`${backURL}/product/category`);
  return categories;
}

function* loadCategories() {
  try {
    yield delay(3000);

    const categories = yield call(loadCategoriesAPI);

    // yield put(resetState());
    yield put(loadCategoriesSuccess(categories.data));

    // throw new Error("카테고리 가져오기에 실패하였습니다. 다시 시도해 주세요.");
  } catch (error) {
    yield put(loadCategoriesFailure(error.response?.data || error.message));
  }
}

function* watchLoadProducts() {
  yield takeEvery(loadProductsRequest.type, loadProducts);
}

function* watchLoadCategories() {
  yield takeEvery(loadCategoriesRequest.type, loadCategories);
}

export default function* productSaga() {
  yield all([
    fork(watchLoadCategories),
    fork(watchLoadProducts),
  ]);
}