import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// Q. 프로덕션 모드에서 바꿀 부분?
// A. 프로덕션 모드에서는 devTools: false로 설정하고, getDefaultMiddleware의 불변성/직렬성 검사를 비활성화하면 성능이 개선되고, 민감한 내부 상태가 노출되는 위험도 줄일 수 있습니다 (ChatGPT) -> 배포 상태에서도 상태 추적을 위해 변경하지 않고 놔둠
const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
    devTools: true,
  });

  sagaMiddleware.run(rootSaga);

  return store;
}

const wrapper = createWrapper(makeStore);

export default wrapper;