import { combineReducers } from 'redux';
import api from './api';
import data from './data';
import gui from './gui';

const rootReducer = combineReducers({
    api,
    data,
    gui
});

export default rootReducer;