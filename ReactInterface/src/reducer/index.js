import {combineReducers} from 'redux';
import defaultsReducer from './defaultsReducer';
import paramsReducer from "./paramsReducer";
import handleRequestReducer from "./handleRequestReducer";

const rootReducer = combineReducers({
    paramsData: paramsReducer,
    defaultsData: defaultsReducer,
    handleRequestData: handleRequestReducer
})

export default rootReducer