import { all, fork } from 'redux-saga/effects';

import memberSaga from './member';
import productSaga from './product';
import cartSaga from './cart';
import checkoutSaga from './checkout';
import orderSaga from './order';

export default function* rootSaga() {
  yield all([
    fork(memberSaga),
    fork(productSaga),
    fork(cartSaga),
    fork(checkoutSaga),
    fork(orderSaga),
  ]);
}