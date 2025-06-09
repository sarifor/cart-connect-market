import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadOrdersLoading: false, 
  loadOrdersDone: false, 
  loadOrdersError: null,
  loadOrderDetailLoading: false, 
  loadOrderDetailDone: false, 
  loadOrderDetailError: null,  
  loadOrdersForPublicCartLoading: false,
  loadOrdersForPublicCartDone: false,
  loadOrdersForPublicCartError: null,
  orders: [],
  orderDetail: [],
  ordersForPublicCart: [],
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
    loadOrderDetailRequest: (state) => {
      state.loadOrderDetailLoading = true;
      state.loadOrderDetailDone = false;
      state.loadOrderDetailError = null;
      state.orderDetail = [];
    },
    loadOrderDetailSuccess: (state, action) => {
      state.loadOrderDetailLoading = false;
      state.loadOrderDetailDone = true;
      state.loadOrderDetailError = null;
      state.orderDetail = action.payload;
    },
    loadOrderDetailFailure: (state, action) => {
      state.loadOrderDetailLoading = false;
      state.loadOrderDetailDone = false;
      state.loadOrderDetailError = action.payload;
      state.orderDetail = [];
    },
    loadOrdersForPublicCartRequest: (state) => {
      state.loadOrdersForPublicCartLoading = true;
      state.loadOrdersForPublicCartDone = false;
      state.loadOrdersForPublicCartError = null;
      state.ordersForPublicCart = [];
    },
    loadOrdersForPublicCartSuccess: (state, action) => {
      state.loadOrdersForPublicCartLoading = false;
      state.loadOrdersForPublicCartDone = true;
      state.loadOrdersForPublicCartError = null;
      state.ordersForPublicCart = action.payload;
    },
    loadOrdersForPublicCartFailure: (state, action) => {
      state.loadOrdersForPublicCartLoading = false;
      state.loadOrdersForPublicCartDone = false;
      state.loadOrdersForPublicCartError = action.payload;
      state.ordersForPublicCart = [];
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
  loadOrderDetailRequest,
  loadOrderDetailSuccess,
  loadOrderDetailFailure,  
  loadOrdersForPublicCartRequest,
  loadOrdersForPublicCartSuccess,
  loadOrdersForPublicCartFailure,
  resetOrderState,
} = orderSlice.actions;

const orderReducer = orderSlice.reducer;

export default orderReducer;