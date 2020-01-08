export const ACTION_UPDATE_CONNECT_OTHER = 'UPDATE_CONNECT_OTHER';
export const ACTION_UPDATE_IGNORE = 'UPDATE_IGNORE';

export const ignoreUpdate = () => ({type: ACTION_UPDATE_IGNORE});
export const updateConnectOther = (value) => ({type: ACTION_UPDATE_CONNECT_OTHER, value: value});