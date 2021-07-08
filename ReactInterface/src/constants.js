// backend api url
export const defaultsUrl = 'http://192.168.1.112/get-ac';
export const updateUrl = 'http://192.168.1.112/post-ac';

// actions
export const GET_DEFAULTS = 'GET_DEFAULTS';
export const UPDATE_DEFAULTS = 'UPDATE_DEFAULTS';

export const SET_PARAMS_ON = 'SET_PARAMS_ON';
export const SET_PARAMS_OFF = 'SET_PARAMS_OFF';
export const UPDATE_PARAMS = 'UPDATE_PARAMS';

// inputs
export const AC_MODE = [
    {value: 0, label: 'Auto'},
    {value: 1, label: 'Cool'},
    {value: 2, label: 'Dry'},
    {value: 3, label: 'Fan'},
    {value: 4, label: 'Heat'}
];

export const AC_DIRECTION = [
    {value: 1, label: 'Auto'},
    {value: 7, label: 'Low auto'},
    {value: 9, label: 'Middle auto'},
    {value: 11, label: 'High auto'},
    {value: 2, label: 'Highest'},
    {value: 3, label: 'High'},
    {value: 4, label: 'Middle'},
    {value: 5, label: 'Low'},
    {value: 6, label: 'Lowest'}
];

export const AC_FAN_SPEED = [
    {value: 0, label: 'Auto'},
    {value: 1, label: 'Slow'},
    {value: 2, label: 'Middle'},
    {value: 3, label: 'Maxim'},
];