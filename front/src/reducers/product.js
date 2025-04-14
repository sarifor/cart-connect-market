import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadCategoriesLoading: false,
  loadCategoriesDone: false,
  loadCategoriesError: null,
  loadProductsLoading: false,
  loadProductsDone: false,
  loadProductsError: null,
  loadProductDetailLoading: false,
  loadProductDetailDone: false,
  loadProductDetailError: null,
  categories: null,
  products: null,
  productDetail: null,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    loadCategoriesRequest: (state) => {
      state.loadCategoriesLoading = true;
    },
    loadCategoriesSuccess: (state, action) => {
      state.loadCategoriesLoading = false;
      state.loadCategoriesDone = true;
      state.categories = action.payload;
    },
    loadCategoriesFailure: (state, action) => {
      state.loadCategoriesLoading = false;
      state.loadCategoriesError = action.payload;      
    },
    loadProductsRequest: (state) => {
      state.loadProductsLoading = true;
    },
    loadProductsSuccess: (state, action) => {
      state.loadProductsLoading = false;
      state.loadProductsDone = true;
      state.products = action.payload;
    },
    loadProductsFailure: (state, action) => {
      state.loadProductsLoading = false;
      state.loadProductsError = action.payload;      
    },
    loadProductDetailRequest: (state) => {
      state.loadProductDetailLoading = true;
    },
    loadProductDetailSuccess: (state, action) => {
      state.loadProductDetailLoading = false;
      state.loadProductDetailDone = true;
      state.productDetail = action.payload;
    },
    loadProductDetailFailure: (state, action) => {
      state.loadProductDetailLoading = false;
      state.loadProductDetailError = action.payload;      
    },
    resetState: () => {
      return initialState;
    }
  },
});

export const {
  loadCategoriesRequest,
  loadCategoriesSuccess,
  loadCategoriesFailure,
  loadProductsRequest,
  loadProductsSuccess,
  loadProductsFailure,
  loadProductDetailRequest,
  loadProductDetailSuccess,
  loadProductDetailFailure,  
  resetState,
} = productSlice.actions;

const productReducer = productSlice.reducer;

export default productReducer;