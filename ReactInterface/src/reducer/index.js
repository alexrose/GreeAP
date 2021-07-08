import {combineReducers} from 'redux';
import defaultsReducer from './defaultsReducer';
import paramsReducer from "./paramsReducer";

const rootReducer = combineReducers({
    defaultsData: defaultsReducer,
    paramsData: paramsReducer
})


export default rootReducer