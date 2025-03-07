import { createSlice } from '@reduxjs/toolkit';

export const INCREMENT_ASYNC_REQUEST = 'INCREMENT_ASYNC_REQUEST';
export const DECREMENT_ASYNC_REQUEST = 'DECREMENT_ASYNC_REQUEST';

export const counterSlice = createSlice({
  name: `counter`,
  initialState: {
    value: 0,
  },
  reducers: {
    incrementAsyncSuccess: (state) => {
      state.value += 1
    },
    incrementAsyncFailure: () => {
      console.log("Increment failed!");
    },
    decrementAsyncSuccess: (state) => {
      state.value -= 1
    },
    decrementAsyncFailure: () => {
      console.log("Decrement Failed!");
    },
  },
});

export const { 
  incrementAsyncSuccess,
  incrementAsyncFailure,
  decrementAsyncSuccess,
  decrementAsyncFailure,  
} = counterSlice.actions;

const counterReducer = counterSlice.reducer

export default counterReducer;