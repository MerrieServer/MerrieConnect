import { DataAPI } from './data';

DataAPI.reloadData();

let injected = false;

const merrie_inject = function () {
    const name = "__MERRIE_NAME__";
    /* make sure to not send these stupid option requests */

    (function (setRequestHeader) {
        const allowedHeaders = [
            "accept",
            "accept-language",
            "content-language",
            "dpr",
            "downlink",
            "save-data",
            "viewport-width",
            "width"
        ];

        const allowedContentTypes = [
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain",
        ];

        XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
            if (header.toLowerCase() === "content-type") {
                if (allowedContentTypes.indexOf(value) === -1) {
                    if (process.env.NODE_ENV === 'development')
                        console.log("[Merrie] Illegal header " + header + " with value " + value);

                    return;
                }
            }

            if (allowedHeaders.indexOf(header.toLowerCase()) === -1) {
                if (process.env.NODE_ENV === 'development')
                    console.log("[Merrie] Illegal header " + header + " with value " + value);

                return;
            }

            setRequestHeader.call(this, header, value);
        };
    })(XMLHttpRequest.prototype.setRequestHeader);

    /* TODO TEMP NAME SET */
    if (!getCookie("user_id")) {
        setCookie("user_id", Math.round(Math.random() * 1000000), 0);
        window.location.reload();
    }

    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            const index = url.indexOf("?");
            if (index !== -1) {
                const params = new URLSearchParams(url.substring(index));
                if (params.get("t") === "init" && params.get("initlvl") === "1") {
                    url += "&merrie_name=" + escape(name);
                }
            }

            open.call(this, method, url, async, user, password);
        };
    })(XMLHttpRequest.prototype.open);
};

DataAPI.addListener((oldData, newData) => {
    // Inject our modification
    if (!injected) {
        if (newData.isConnected) {
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.innerText += "(";
            script.innerText += merrie_inject.toString().replace("__MERRIE_NAME__", newData.name);
            script.innerText += ")();";
            document.getElementsByTagName("body")[0].appendChild(script);
        }

        injected = true;
        return;
    }

    // reload page if necessary
    if (oldData == null)
        return;

    if (oldData.isConnected !== newData.isConnected || oldData.ip !== newData.ip)
        window.location.reload();
});
