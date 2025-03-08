import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { INCREMENT_ASYNC_REQUEST, DECREMENT_ASYNC_REQUEST } from '../reducers/counter';

// Q. 이벤트 핸들러 이름을 handle~로 변경? 예: handleIncrement
export const Counter = () => {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();

  const onIncrement = () => {
    console.log("Test printing environment variable in browser console: ", process.env.NEXT_PUBLIC_GEMINI_API_KEY);

    return dispatch({
      type: INCREMENT_ASYNC_REQUEST,
    });
  };

  const onDecrement = () => {
    return dispatch({
      type: DECREMENT_ASYNC_REQUEST,
    });
  };

  return (
    <div>
      <button onClick={onIncrement}>Increment</button>
      <span>{count}</span>
      <button onClick={onDecrement}>Decrement</button>
    </div>
  )
};