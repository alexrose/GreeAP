import {toast} from 'react-toastify';
import {GET_DEFAULTS, UPDATE_DEFAULTS, SET_PARAMS_ON, UPDATE_PARAMS, SET_PARAMS_OFF} from "../constants";

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
        toast.success(data.message);
    } else {
        toast.warn(data.message);
    }


    return {type: UPDATE_PARAMS, payload: data};
}
