import { combineReducers } from "redux";
import memberReducer from "./member";
import productReducer from "./product";
import cartReducer from "./cart";
import checkoutReducer from "./checkout";
import orderReducer from "./order";

const rootReducer = combineReducers({
  member: memberReducer,
  product: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  order: orderReducer,
});

export default rootReducer;