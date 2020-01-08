import {
    ACTION_UPDATE_DATA,
} from '../actions/data';

import { Data, DataAPI } from '../../data';

const initialState = new Data();

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_UPDATE_DATA:
            DataAPI.updateData(action.data);
            return {...state, ...action.data};
        default:
            return state;
    }
}
