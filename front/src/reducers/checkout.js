import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadShippingAddressesLoading: false,
  loadShippingAddressesDone: false,
  loadShippingAddressesError: null,
  checkoutLoading: false,
  checkoutDone: false,
  checkoutError: null,
  shippingAddresses: [],
  selectedDeliveryDate: null,
  selectedDeliveryTime: null,
  selectedPayment: null,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    loadShippingAddressesRequest: (state) => {
      state.loadShippingAddressesLoading = true;
      state.loadShippingAddressesDone = false;
      state.loadShippingAddressesError = null;
    },
    loadShippingAddressesSuccess: (state, action) => {
      state.loadShippingAddressesLoading = false;
      state.loadShippingAddressesDone = true;
      state.loadShippingAddressesError = null;
      state.shippingAddresses = action.payload;
    },
    loadShippingAddressesFailure: (state, action) => {
      state.loadShippingAddressesLoading = false;
      state.loadShippingAddressesDone = true;
      state.loadShippingAddressesError = action.payload;
    },
    checkoutRequest: (state) => {
      state.checkoutLoading = true;
      state.checkoutDone = false;
      state.checkoutError = null;
    },
    checkoutSuccess: (state) => {
      state.checkoutLoading = false;
      state.checkoutDone = true;
      state.checkoutError = null;
    },
    checkoutFailure: (state, action) => {
      state.checkoutLoading = false;
      state.checkoutDone = false;
      state.checkoutError = action.payload;
    },
    setSelectedDeliveryDate: (state, action) => {
      state.selectedDeliveryDate = action.payload;
    },
    setSelectedDeliveryTime: (state, action) => {
      state.selectedDeliveryTime = action.payload;
    },
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },
    resetCheckoutState: () => {
      return initialState;
    }
  },
});

export const {
  loadShippingAddressesRequest,
  loadShippingAddressesSuccess,
  loadShippingAddressesFailure,
  checkoutRequest,
  checkoutSuccess,
  checkoutFailure,
  setSelectedDeliveryDate,
  setSelectedDeliveryTime,
  setSelectedPayment,
  resetCheckoutState,
} = checkoutSlice.actions;

const checkoutReducer = checkoutSlice.reducer;

export default checkoutReducer;