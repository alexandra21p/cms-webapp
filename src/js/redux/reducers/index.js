import { combineReducers } from "redux";
import user from "./userReducer";
import messages from "./messageReducer";
import templates from "./templateReducer";
import canvas from "./canvasReducer";
import customComponents from "./customComponentsReducer";

const rootReducer = combineReducers( {
    user,
    messages,
    templates,
    canvas,
	  customComponents,
} );

export default rootReducer;
