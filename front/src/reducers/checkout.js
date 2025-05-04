import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadShippingAddressesLoading: false,
  loadShippingAddressesDone: false,
  loadShippingAddressesError: null,
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
    setSelectedDeliveryDate: (state, action) => {
      state.selectedDeliveryDate = action.payload;
    },
    setSelectedDeliveryTime: (state, action) => {
      state.selectedDeliveryTime = action.payload;
    },
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },
    resetState: () => {
      return initialState;
    }
  },
});

export const {
  loadShippingAddressesRequest,
  loadShippingAddressesSuccess,
  loadShippingAddressesFailure,
  setSelectedDeliveryDate,
  setSelectedDeliveryTime,
  setSelectedPayment,
  resetState,
} = checkoutSlice.actions;

const checkoutReducer = checkoutSlice.reducer;

export default checkoutReducer;