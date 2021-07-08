import { all } from 'redux-saga/effects';
import {getDefaultsWatcher} from "./defaultsWatcher";
import {getParamsOnWatcher} from "./paramsOnWatcher";
import {getParamsOffWatcher} from "./paramsOffWatcher";


/** Import watchers */
export default function* rootSaga() {
    yield all([
        getDefaultsWatcher(),
        getParamsOnWatcher(),
        getParamsOffWatcher()
    ]);
}