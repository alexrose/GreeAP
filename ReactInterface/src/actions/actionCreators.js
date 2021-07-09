import {toast} from 'react-toastify';
import {
    GET_DEFAULTS,
    UPDATE_DEFAULTS,
    SET_PARAMS_ON,
    UPDATE_PARAMS,
    SET_PARAMS_OFF,
    HANDLE_REQUEST
} from "../constants";

/** Default stats **/
export function getDefaults() {
    return {type: GET_DEFAULTS}
}

export function updateDefaults(data) {
    return {type: UPDATE_DEFAULTS, payload: data};
}

/** Params **/
export function setParamsOn(param) {
    return {type: SET_PARAMS_ON, param}
}

export function setParamsOff() {
    return {type: SET_PARAMS_OFF}
}

export function updateParams(data) {
    if (data.status === 'success') {
        if (data.state === "on") {
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    } else {
        toast.warn(data.message);
    }

    return {type: UPDATE_PARAMS, payload: data};
}


/** Handle request **/
export function startRequest() {
    return {type: HANDLE_REQUEST, payload: {counterRequest: +1}};
}

export function stopRequest() {
    return {type: HANDLE_REQUEST, payload: {counterRequest: -1}};
}