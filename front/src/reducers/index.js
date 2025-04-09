import { combineReducers } from "redux";
import memberReducer from "./member";
import productReducer from "./product";

const rootReducer = combineReducers({
  member: memberReducer,
  product: productReducer,
});

export default rootReducer;