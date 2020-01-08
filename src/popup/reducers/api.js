import {
    Mode,
    ACTION_UPDATE_API,
} from '../actions/api';

const initialState = {
    mode: Mode.WAITING,
    data: {
        latestVersion: "",
        servers: []
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_UPDATE_API:
            if (state.mode !== Mode.WAITING)
                throw "unexpected mode change";

            return {...state, mode: action.mode, data: action.data};
        default:
            return state;
    }
}
