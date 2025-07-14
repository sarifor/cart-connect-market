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
  postPublicCartLoading: false,
  postPublicCartDone: false,
  postPublicCartError: null,
  updatePublicCartLoading: false,
  updatePublicCartDone: false,
  updatePublicCartError: null,  
  updateLikeLoading: false,
  updateLikeDone: false,
  updateLikeError: null,
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
    postPublicCartRequest: (state) => {
      state.postPublicCartLoading = true;
      state.postPublicCartDone = false;
      state.postPublicCartError = null;
    },
    postPublicCartSuccess: (state) => {
      state.postPublicCartLoading = false;
      state.postPublicCartDone = true;
      state.postPublicCartError = null;
    },
    postPublicCartFailure: (state, action) => {
      state.postPublicCartLoading = false;
      state.postPublicCartDone = false;
      state.postPublicCartError = action.payload;
    },    
    updatePublicCartRequest: (state) => {
      state.updatePublicCartLoading = true;
      state.updatePublicCartDone = false;
      state.updatePublicCartError = null;
    },
    updatePublicCartSuccess: (state) => {
      state.updatePublicCartLoading = false;
      state.updatePublicCartDone = true;
      state.updatePublicCartError = null;
    },
    updatePublicCartFailure: (state, action) => {
      state.updatePublicCartLoading = false;
      state.updatePublicCartDone = false;
      state.updatePublicCartError = action.payload;
    },    
    updateLikeRequest: (state) => {
      state.updateLikeLoading = true;
      state.updateLikeDone = false;
      state.updateLikeError = null;
    },
    updateLikeSuccess: (state, action) => {
      state.updateLikeLoading = false;
      state.updateLikeDone = true;
      state.updateLikeError = null;
      if (state.publicCartDetail.Order?.OrderDetails?.length > 0) {
        state.publicCartDetail.likedMemberIds = action.payload;
        state.publicCartDetail.likeCount = action.payload.length;
      } else {
        state.publicCartDetail.likedMemberIds = [];
      }
    },
    updateLikeFailure: (state, action) => {
      state.updateLikeLoading = false;
      state.updateLikeDone = false;
      state.updateLikeError = action.payload;
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
  postPublicCartRequest,
  postPublicCartSuccess,
  postPublicCartFailure,
  updatePublicCartRequest,
  updatePublicCartSuccess,
  updatePublicCartFailure,  
  updateLikeRequest,
  updateLikeSuccess,
  updateLikeFailure,
  resetPublicCartState,
} = publicCartSlice.actions;

const publicCartReducer = publicCartSlice.reducer;

export default publicCartReducer;