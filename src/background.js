import { DataAPI } from './data';
import { BaseUrl, RedirectEndpoints } from './config';

DataAPI.reloadData();

let lastHandledRequestId = 0;

// Listener for outgoing redirects
chrome.webRequest.onBeforeRequest.addListener(request => {
    const data = DataAPI.getData();
    if (!data.isConnected) {
        return;
    }

    // if it is a request that we already handled
    if (lastHandledRequestId === request.requestId) {
        return;
    }

    // default is no value
    let returnValue = undefined;

    RedirectEndpoints.forEach(redirect => {
        const fullRedirect = BaseUrl + redirect;
        if (!request.url.startsWith(fullRedirect)) {
            return;
        }

        // update last handled
        lastHandledRequestId = request.requestId;

        // get the request with the real game url
        const requestRemaining = request.url.substr(fullRedirect.length);

        // if the request matches one of the RedirectEndpoints, send a redirect
        returnValue = {
            "redirectUrl": data.ip + redirect + requestRemaining
        };
    });

    return returnValue;
}, {urls: [BaseUrl + "/*"]}, ["blocking"]);