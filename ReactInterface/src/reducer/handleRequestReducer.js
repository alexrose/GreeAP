import {HANDLE_REQUEST} from "../constants";

const handleRequestReducer = (state = {counterRequest: 0}, action) => {
    switch (action.type) {
        case HANDLE_REQUEST:
            return {
                ...state,
                counterRequest: state.counterRequest + action.payload.counterRequest
            }
        default:
            return state;
    }
};

export default handleRequestReducer;