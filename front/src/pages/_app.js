import React from 'react';
import { Provider } from 'react-redux';
import Head from 'next/head';
import wrapper from '../store/configureStore';

const App = ({ Component, ...rest }) => {
  const { store } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <title>Cart Connect Market</title>
      </Head>
      <Component />
    </Provider>
  );
};

export default App;
