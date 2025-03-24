import { combineReducers } from "redux";
import memberReducer from "./member";


const rootReducer = combineReducers({
  member: memberReducer,
});

export default rootReducer;