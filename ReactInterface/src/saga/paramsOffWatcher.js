import axios from 'axios';
import {startRequest, stopRequest, updateParams} from '../actions/actionCreators'
import {takeLatest, call, put} from 'redux-saga/effects';
import {SET_PARAMS_OFF, updateUrl} from "../constants";

/** Returns an axios call */
function getParamsRequest() {
    return axios.request({
        method: 'post',
        url: updateUrl,
        data: `command=0,0,0,0,0,0,0,0,0,0`
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga() {
    try {
        yield put(startRequest());
        let {data} = yield call(getParamsRequest);
        yield put(stopRequest());
        yield put(updateParams({'status': data, 'state': 'off', 'message': 'AC turned off.'}));
    } catch (e) {
        yield put(stopRequest());
        console.log('[Critical]', e);
    }
}

/** Saga watcher triggered when dispatching action of type 'SET_PARAMS_OFF */
export function* getParamsOffWatcher() {
    yield takeLatest(SET_PARAMS_OFF, loginEffectSaga);
}