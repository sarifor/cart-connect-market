import { createSlice } from '@reduxjs/toolkit';

// Q. addToCart~로 시작하는 함수와 상태 이름을 incrementCart~로 모두 수정할까?
const initialState = {
  loadCartItemsLoading: false,
  loadCartItemsDone: false,
  loadCartItemsError: null,
  addToCartLoading: false,
  addToCartDone: false,
  addToCartError: null,
  decrementCartLoading: false,
  decrementCartDone: false,
  decrementCartError: null,
  deleteCartLoading: false,
  deleteCartDone: false,
  deleteCartError: null,
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCartItemsRequest: (state) => {
      state.loadCartItemsLoading = true;
    },
    loadCartItemsSuccess: (state, action) => {
      state.loadCartItemsLoading = false;
      state.loadCartItemsDone = true;
      state.cartItems = action.payload;
    },
    loadCartItemsFailure: (state, action) => {
      state.loadCartItemsLoading = false;
      state.loadCartItemsError = action.payload;      
    },    
    addToCartRequest: (state) => {
      state.addToCartLoading = true;
      state.addToCartDone = false;
      state.addToCartError = null;
      state.decrementCartLoading = false;
      state.decrementCartDone = false;
      state.decrementCartError = null;
      state.deleteCartLoading = false;
      state.deleteCartDone = false;
      state.deleteCartError = null;
    },
    addToCartSuccess: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartDone = true;
      state.addToCartError = null;
      state.decrementCartLoading = false;
      state.decrementCartDone = false;
      state.decrementCartError = null;
      state.deleteCartLoading = false;
      state.deleteCartDone = false;
      state.deleteCartError = null;
      state.cartItems = action.payload;
    },
    addToCartFailure: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartDone = false;      
      state.addToCartError = action.payload;
      state.decrementCartLoading = false;
      state.decrementCartDone = false;
      state.decrementCartError = null;
      state.deleteCartLoading = false;
      state.deleteCartDone = false;
      state.deleteCartError = null;      
    },
    decrementCartRequest: (state) => {
      state.addToCartLoading = false;
      state.addToCartDone = false;
      state.addToCartError = null;      
      state.decrementCartLoading = true;
      state.decrementCartDone = false;
      state.decrementCartError = null;
      state.deleteCartLoading = false;
      state.deleteCartDone = false;
      state.deleteCartError = null;
    },
    decrementCartSuccess: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartDone = false;
      state.addToCartError = null;      
      state.decrementCartLoading = false;
      state.decrementCartDone = true;
      state.decrementCartError = null;
      state.deleteCartLoading = false;
      state.deleteCartDone = false;
      state.deleteCartError = null;
      state.cartItems = action.payload;
    },
    decrementCartFailure: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartDone = false;
      state.addToCartError = null;      
      state.decrementCartLoading = false;
      state.decrementCartDone = false;      
      state.decrementCartError = action.payload;
      state.deleteCartLoading = false;
      state.deleteCartDone = false;
      state.deleteCartError = null;
    },
    deleteCartRequest: (state) => {
      state.addToCartLoading = false;
      state.addToCartDone = false;
      state.addToCartError = null;      
      state.decrementCartLoading = false;
      state.decrementCartDone = false;      
      state.decrementCartError = null;
      state.deleteCartLoading = true;
      state.deleteCartDone = false;
      state.deleteCartError = null;
    },
    deleteCartSuccess: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartDone = false;
      state.addToCartError = null;      
      state.decrementCartLoading = false;
      state.decrementCartDone = false;      
      state.decrementCartError = null;
      state.deleteCartLoading = false;
      state.deleteCartDone = true;
      state.deleteCartError = null;
      state.cartItems = action.payload;
    },
    deleteCartFailure: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartDone = false;
      state.addToCartError = null;      
      state.decrementCartLoading = false;
      state.decrementCartDone = false;      
      state.decrementCartError = null;
      state.deleteCartLoading = false;
      state.deleteCartDone = false;
      state.deleteCartError = action.payload;
    },
    resetCartState: () => {
      return initialState;
    }
  },
});

export const {
  loadCartItemsRequest,
  loadCartItemsSuccess,
  loadCartItemsFailure,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  decrementCartRequest,
  decrementCartSuccess,
  decrementCartFailure,
  deleteCartRequest,
  deleteCartSuccess,
  deleteCartFailure,  
  resetCartState,
} = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;