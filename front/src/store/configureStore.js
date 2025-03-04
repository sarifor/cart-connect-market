import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import counterReducer from '../reducers/counter';

const makeStore = () => {
  const store = configureStore({
    reducer: {
      counter: counterReducer,
    },
    // middleware: null,
    // devTools: null,
  });

  return store;
}

const wrapper = createWrapper(makeStore);

export default wrapper;