import { combineReducers } from "redux";
import memberReducer from "./member";
import productReducer from "./product";
import cartReducer from "./cart";
import checkoutReducer from "./checkout";
import orderReducer from "./order";
import publicCartReducer from "./publicCart";

const rootReducer = combineReducers({
  member: memberReducer,
  product: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  order: orderReducer,
  publicCart: publicCartReducer,
});

export default rootReducer;