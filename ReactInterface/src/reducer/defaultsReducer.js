import {UPDATE_DEFAULTS} from "../constants";

const defaultsReducer = (state = {defaults: []}, action) => {
    switch (action.type) {
        case UPDATE_DEFAULTS:
            return Object.assign({}, state, {
                defaults: action.payload
            })
        default:
            return state;
    }
};

export default defaultsReducer;