import { BaseUrl } from './config';

/**
 * Data stored in the local store.
 */
export class Data {
    /**
     * Are we connected to a server right now?
     *
     * @type {boolean}
     */
    isConnected = false;

    /*
    * Name of the server that we are connected to
    * @type {string}
    */
    serverName = "";

    /**
     * Ip of the server that we are connected to
     * @type {string}
     */
    ip = "";

    /**
     * Preferred name of our user account.
     * TODO TEMP
     * @type {string}
     */
    name = "";
}

export class DataManager {
    constructor() {
        if (chrome !== undefined && chrome.runtime !== undefined && chrome.runtime.onMessage !== undefined) {
            chrome.runtime.onMessage.addListener(request => {
                if (request.type !== "update_data") {
                    return;
                }

                this.reloadData();
            });
        }
    }

    /**
     * Returns data that is cached
     * @returns {Data}
     */
    getData() {
        return this.__cachedData;
    }

    /**
     * Reloads the data from the local store
     */
    reloadData(callback) {
        this.__previousData = {...this.__cachedData};

        const dataProperties = Object.keys(this.__cachedData);

        if (chrome === undefined || chrome.storage === undefined || chrome.storage.local === undefined) {
            dataProperties.forEach(key => {
                this.__cachedData[key] = localStorage[key] === undefined ? this.__cachedData[key] : localStorage[key];
            });

            this.__cachedData.isConnected = Boolean(this.__cachedData.isConnected);
            this.callUpdateData();

            if(callback)
                callback();
        } else {
            chrome.storage.local.get(dataProperties, result => {
                dataProperties.forEach(key => {
                    this.__cachedData[key] = result[key];
                });

                this.__cachedData.isConnected = Boolean(this.__cachedData.isConnected);
                this.callUpdateData();

                if(callback)
                    callback();
            });
        }
    }

    /**
     * Updates the date and notifies about the c1hange globally.
     *
     * @param {Data} newData
     */
    updateData(newData) {
        this.__previousData = this.__cachedData;
        this.__cachedData = newData;

        // ignore if they are the saem
        if (this.__previousData != null && JSON.stringify(this.__previousData) === JSON.stringify(this.__cachedData)) {
            return;
        }

        // update
        if (chrome === undefined || chrome.storage === undefined || chrome.storage.local === undefined) {
            Object.keys(this.__cachedData).forEach(key => {
                localStorage[key] = this.__cachedData[key];
            });
        } else {
            chrome.storage.local.set(newData);
            // send notify message
            const message = {
                type: "update_data"
            };

            chrome.runtime.sendMessage(message);

            chrome.tabs.query({url: BaseUrl + "/**"}, tabs => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, message);
                });
            });
        }

        // notify listeners
        this.callUpdateData();
    }

    /**
     * Calls all listeners listening to data changes
     */
    callUpdateData() {
        this.__dataChangedListeners.forEach(listener => listener(this.__previousData, this.__cachedData));
    }

    /**
     *
     * @param {function(Data, Data)} listener listener to register
     */
    addListener(listener) {
        this.__dataChangedListeners.push(listener);
    }

    /**
     * The previous data value
     * @type {Data}
     * @private
     */
    __previousData = null;

    /**
     * Data value that is cached
     * @type {Data}
     * @private
     */
    __cachedData = new Data();


    /**
     * Listeners that listen for data changes
     * @type {[function(Data, Data)]}
     * @private
     */
    __dataChangedListeners = [];
}

/**
 * API for data management
 *
 * @type {DataManager}
 */
export let DataAPI = new DataManager();