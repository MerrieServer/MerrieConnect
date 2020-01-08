export const Mode = Object.freeze({
    WAITING: "waiting",
    ERROR: "error",
    OK: "ok"
});

export const ACTION_UPDATE_API = 'UPDATE_API';

export const updateNotification = (mode, data) => ({type: ACTION_UPDATE_API, mode: mode, data: data});
