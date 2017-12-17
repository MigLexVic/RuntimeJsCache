var CONFIG = {
    info_prefix: 'RJC_info_',
    data_prefix: 'RJC_data_',
    storage: localStorage,
    expires: 60000
}

/**
 * Defines an intance and register the methods into the object
 */
var setInstance = function () {
    return {
        Config: function (prop, val) { CONFIG[prop] = val},
        set: insertInCache,
        get: getFromCache,
        clear: clearFromCache,
        forceReset: forceUpdateCache
    }
}

/**
 * Insert new content in the cache
 * @param key
 * @param value
 */
function insertInCache (key, value, expires = CONFIG.expires) {
    CONFIG.storage.setItem( CONFIG.info_prefix + key, JSON.stringify({created: Date.now(), expires: (Date.now() + expires), forceUpdate: false}))
    CONFIG.storage.setItem( CONFIG.data_prefix + key, JSON.stringify(value) )
}

/**
 * Looks in the designed storage for the data, if null or expired return false, return object or false
 * @param key
 * @returns {object} || {boolean}
 */
function getFromCache (key) {
    try {
        // Get cache information, if do not exists or its already expired, delete it and return false
        var info = JSON.parse(CONFIG.storage.getItem(CONFIG.info_prefix + key))

        // Do the item exists
        if (info == null) return false
        // Did the item expired
        if(Date.now() > info.expires){ CONFIG.storage.removeItem(CONFIG.info_prefix + key); CONFIG.storage.removeItem(CONFIG.data_prefix + key); return false}

        //Returns the data or false
        var data = JSON.parse(CONFIG.storage.getItem(CONFIG.data_prefix + key))
        return (data) ? data : false
    } catch (Exception) {
        console.error('Error returning cached contents')
        return false
    }

}

/**
 * Removes a item from cache
 * @param key
 */
function clearFromCache (key) {
    // if(key === null) console.log('will clear all the cache items, then return')
    CONFIG.storage.removeItem(CONFIG.info_prefix + key)
    CONFIG.storage.removeItem(CONFIG.data_prefix + key)
}

/**
 * Forces a cache item to update, now or on next time requested
 * @param key
 * @param content
 */
function forceUpdateCache (key, content = null) {
    // Gets the current contents
    var info = JSON.parse(CONFIG.storage.getItem(CONFIG.storage.getItem(CONFIG.info_prefix + key)))
    var data = JSON.parse(CONFIG.storage.getItem(CONFIG.storage.getItem(CONFIG.data_prefix + key)))

    // If recive contents, override them, other wise mark the item to return false next time that will be called
    if (contents !== null) {
        info = {created: Date.now(), expires: (Date.now() + CONFIG.expires), forceUpdate: false}
        data = content
    } else info.updated = Date.now(); info.forceUpdate = true

    // Saves new contents in the object
    CONFIG.storage.setItem( CONFIG.info_prefix + key, JSON.stringify(info))
    CONFIG.storage.setItem( CONFIG.data_prefix + key, JSON.stringify(data))
}

var RJC = setInstance()

module.exports = RJC;
module.exports.default = RJC;
