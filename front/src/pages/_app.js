import React from 'react';
import { Provider } from 'react-redux';
import Head from 'next/head';
import wrapper from '../store/configureStore';
import SessionChecker from '../components/SessionChecker';

// Q. Error: could not find react-redux context value; please ensure the component is wrapped in a <Provider>
// A. useDispatch()를 Provider 내부에서 실행하도록 변경(SessionChecker.js로 분리) (ChatGPT)
const App = ({ Component, ...rest }) => {
  const { store } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <SessionChecker />
      <Head>
        <meta charSet="utf-8" />
        <title>Cart Connect Market</title>
      </Head>
      <Component />
    </Provider>
  );
};

export default App;
