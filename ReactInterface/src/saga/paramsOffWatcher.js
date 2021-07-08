import axios from 'axios';
import {updateParams} from '../actions/actionCreators'
import {takeLatest, call, put} from 'redux-saga/effects';
import {SET_PARAMS_OFF, updateUrl} from "../constants";

/** Returns an axios call */
function getParamsRequest(data) {
    axios.post(updateUrl, {
        command: '0,0,0,0,0,0,0,0,0,0'
    }).then((response) => {
        put(updateParams({'status': response.data, 'message': 'AC turned off.'}));
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga() {
    try {
        yield call(getParamsRequest);
    } catch (e) {
        console.log('[Critical]', e);
    }
}

/** Saga watcher triggered when dispatching action of type 'SET_PARAMS_OFF */
export function* getParamsOffWatcher() {
    yield takeLatest(SET_PARAMS_OFF, loginEffectSaga);
}