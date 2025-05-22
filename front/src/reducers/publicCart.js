import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadPublicCartsLoading: false,
  loadPublicCartsDone: false,
  loadPublicCartsError: null,
  loadPublicCartsNetworkLoading: false,
  loadPublicCartsNetworkDone: false,
  loadPublicCartsNetworkError: null,
  publicCarts: [],
  publicCartsNetwork: [],
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
  resetPublicCartState,
} = publicCartSlice.actions;

const publicCartReducer = publicCartSlice.reducer;

export default publicCartReducer;