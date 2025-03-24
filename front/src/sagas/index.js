import { all, fork } from 'redux-saga/effects';

import memberSaga from './member';

export default function* rootSaga() {
  yield all([
    fork(memberSaga),
  ]);
}