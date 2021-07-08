import {UPDATE_PARAMS} from "../constants";

const paramsReducer = (state = {params: []}, action) => {
    switch (action.type) {
        case UPDATE_PARAMS:
            return Object.assign({}, state, {
                params: action.payload
            })
        default:
            return state;
    }
};

export default paramsReducer;