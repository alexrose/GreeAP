import axios from 'axios';
import {updateParams} from '../actions/actionCreators'
import {takeLatest, call, put} from 'redux-saga/effects';
import {SET_PARAMS_ON, updateUrl} from "../constants";

/** Returns an axios call */
function getParamsRequest(data) {
    console.log(data);
    axios.post(updateUrl,
        `command=${data.mode},${data.temperature},${data.fanSpeed},${data.directionAuto},${data.direction},${data.light},${data.turbo},${data.xFan},${data.sleep},1`
        , {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
        put(updateParams({'status': response.data, 'message': 'AC turned on.'}));
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga(payload) {
    try {
        yield call(getParamsRequest, payload.param);
    } catch (e) {
        console.log('[Critical]', e);
    }
}

/** Saga watcher triggered when dispatching action of type 'SET_PARAMS_ON */
export function* getParamsOnWatcher() {
    yield takeLatest(SET_PARAMS_ON, loginEffectSaga);
}