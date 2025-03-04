import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../reducers/counter';

// Q. 이벤트 핸들러 이름을 handle~로 변경? 예: handleIncrement
export const Counter = () => {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();

  const onIncrement = () => {
    return dispatch(increment());
  };

  const onDecrement = () => {
    return dispatch(decrement());
  };

  return (
    <div>
      <button onClick={onIncrement}>Increment</button>
      <span>{count}</span>
      <button onClick={onDecrement}>Decrement</button>
    </div>
  )
};