import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';

import App from './components/app';
import reducer from './reducers';
import initFontAwesome from './font-awesome';
import { MasterServerUrl, ExtensionVersion } from '../config';
import { Mode, updateNotification } from './actions/api';
import { DataAPI } from './../data';
import { updateData } from './actions/data';
import { ignoreUpdate } from './actions/gui';

initFontAwesome();

// create store
const composeEnhancers = process.env.NODE_ENV === 'development' ?
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) :
    compose;

const middleware = [];
middleware.push(createLogger());

const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)));

// load app
window.onload = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById('app')
    );
};

// check for updates
let apiCall = new XMLHttpRequest();
apiCall.open("GET", MasterServerUrl + "/api");
apiCall.onload = () => {
    if (apiCall.readyState !== XMLHttpRequest.DONE)
        return;

    if (apiCall.status !== 200) {
        store.dispatch(updateNotification(Mode.ERROR, {error: "Code: " + apiCall.status}));
    }

    let data;
    try {
         data = JSON.parse(apiCall.responseText.trim());
    } catch (e) {
        store.dispatch(updateNotification(Mode.ERROR, {error: "JSON syntax: " + e.message}));
        return;
    }

    store.dispatch(updateNotification(Mode.OK, data));

    if (data.latest === ExtensionVersion)
        store.dispatch(ignoreUpdate());
};
apiCall.onerror = () => {
    store.dispatch(updateNotification(Mode.ERROR, {error: "???"}));
};

apiCall.send();

DataAPI.reloadData(() => {
    store.dispatch(updateData(DataAPI.getData()));
});