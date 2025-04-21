import { combineReducers } from "redux";
import memberReducer from "./member";
import productReducer from "./product";
import cartReducer from "./cart";

const rootReducer = combineReducers({
  member: memberReducer,
  product: productReducer,
  cart: cartReducer,
});

export default rootReducer;