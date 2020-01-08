import { ACTION_UPDATE_CONNECT_OTHER, ACTION_UPDATE_IGNORE } from '../actions/gui';

const initialState = {
    connectOther: false,
    updateIgnored: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_UPDATE_CONNECT_OTHER:
            return {...state, connectOther: action.value};
        case ACTION_UPDATE_IGNORE:
            return {...state, updateIgnored: true};
        default:
            return state;
    }
}
