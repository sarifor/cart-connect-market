import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadPublicCartsLoading: false,
  loadPublicCartsDone: false,
  loadPublicCartsError: null,
  loadPublicCartsNetworkLoading: false,
  loadPublicCartsNetworkDone: false,
  loadPublicCartsNetworkError: null,
  loadPublicCartDetailLoading: false,
  loadPublicCartDetailDone: false,
  loadPublicCartDetailError: null,
  publicCarts: [],
  publicCartsNetwork: [],
  publicCartDetail: [],
};

export const publicCartSlice = createSlice({
  name: 'publicCart',
  initialState,
  reducers: {
    loadPublicCartsRequest: (state) => {
      state.loadPublicCartsLoading = true;
      state.loadPublicCartsDone = false;
      state.loadPublicCartsError = null;
      state.publicCarts = [];      
    },
    loadPublicCartsSuccess: (state, action) => {
      state.loadPublicCartsLoading = false;
      state.loadPublicCartsDone = true;
      state.loadPublicCartsError = null;
      state.publicCarts = action.payload;
    },
    loadPublicCartsFailure: (state, action) => {
      state.loadPublicCartsLoading = false;
      state.loadPublicCartsDone = false;
      state.loadPublicCartsError = action.payload;
      state.publicCarts = [];
    },
    loadPublicCartsNetworkRequest: (state) => {
      state.loadPublicCartsNetworkLoading = true;
      state.loadPublicCartsNetworkDone = false;
      state.loadPublicCartsNetworkError = null;
      state.publicCartsNetwork = [];
    },
    loadPublicCartsNetworkSuccess: (state, action) => {
      state.loadPublicCartsNetworkLoading = false;
      state.loadPublicCartsNetworkDone = true;
      state.loadPublicCartsNetworkError = null;
      state.publicCartsNetwork = action.payload;
    },
    loadPublicCartsNetworkFailure: (state, action) => {
      state.loadPublicCartsNetworkLoading = false;
      state.loadPublicCartsNetworkDone = false;
      state.loadPublicCartsNetworkError = action.payload;
      state.publicCartsNetwork = [];
    },
    loadPublicCartDetailRequest: (state) => {
      state.loadPublicCartDetailLoading = true;
      state.loadPublicCartDetailDone = false;
      state.loadPublicCartDetailError = null;
      state.publicCartDetail = [];
    },
    loadPublicCartDetailSuccess: (state, action) => {
      state.loadPublicCartDetailLoading = false;
      state.loadPublicCartDetailDone = true;
      state.loadPublicCartDetailError = null;
      state.publicCartDetail = action.payload;
    },
    loadPublicCartDetailFailure: (state, action) => {
      state.loadPublicCartDetailLoading = false;
      state.loadPublicCartDetailDone = false;
      state.loadPublicCartDetailError = action.payload;
      state.publicCartDetail = [];
    },    
    resetPublicCartState: () => {
      return initialState;
    }
  },
});

export const {
  loadPublicCartsRequest,
  loadPublicCartsSuccess,
  loadPublicCartsFailure,
  loadPublicCartsNetworkRequest,
  loadPublicCartsNetworkSuccess,
  loadPublicCartsNetworkFailure,  
  loadPublicCartDetailRequest,
  loadPublicCartDetailSuccess,
  loadPublicCartDetailFailure,
  resetPublicCartState,
} = publicCartSlice.actions;

const publicCartReducer = publicCartSlice.reducer;

export default publicCartReducer;