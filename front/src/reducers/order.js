import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadOrdersLoading: false, 
  loadOrdersDone: false, 
  loadOrdersError: null,
  orders: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    loadOrdersRequest: (state) => {
      state.loadOrdersLoading = true;
      state.loadOrdersDone = false;
      state.loadOrdersError = null;
      state.orders = [];
    },
    loadOrdersSuccess: (state, action) => {
      state.loadOrdersLoading = false;
      state.loadOrdersDone = true;
      state.loadOrdersError = null;
      state.orders = action.payload;      
    },
    loadOrdersFailure: (state, action) => {
      state.loadOrdersLoading = false;
      state.loadOrdersDone = false;
      state.loadOrdersError = action.payload;
      state.orders = [];
    },
    resetOrderState: () => {
      return initialState;
    }
  },
});

export const {
  loadOrdersRequest,
  loadOrdersSuccess,
  loadOrdersFailure,
  resetOrderState,
} = orderSlice.actions;

const orderReducer = orderSlice.reducer;

export default orderReducer;