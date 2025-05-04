import { combineReducers } from "redux";
import memberReducer from "./member";
import productReducer from "./product";
import cartReducer from "./cart";
import checkoutReducer from "./checkout";

const rootReducer = combineReducers({
  member: memberReducer,
  product: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
});

export default rootReducer;