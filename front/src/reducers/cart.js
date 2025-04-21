import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadCartItemsLoading: false,
  loadCartItemsDone: false,
  loadCartItemsError: null,
  addToCartLoading: false,
  addToCartDone: false,
  addToCartError: null,
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
    },
    addToCartSuccess: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartDone = true;
      state.cartItems = action.payload;
    },
    addToCartFailure: (state, action) => {
      state.addToCartLoading = false;
      state.addToCartError = action.payload;
    },
    resetState: () => {
      return initialState;
    }
  },
});

export const {
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  loadCartItemsRequest,
  loadCartItemsSuccess,
  loadCartItemsFailure,  
  resetState,
} = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;