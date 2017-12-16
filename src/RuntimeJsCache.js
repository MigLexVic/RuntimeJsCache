function insertInCache (key, value) {
    CONFIG.storage.setItem( 'RJC_info_' + key, JSON.stringify({created: date.now(), expires: (date.now() + CONFIG.expires), forceUpdate: false}))
    CONFIG.storage.setItem( 'RJC_data_' + key, JSON.stringify(value) )
}

function getFromCache (key) {
    var info = JSON.parse(CONFIG.storage.getItem('RJC_info_' + key))
    if(info === null || info === undefined || info.expires >= date.now()){
        CONFIG.storage.removeItem('RJC_info_' + key)
        CONFIG.storage.removeItem('RJC_data_' + key)
        return 'Cache Expired'
    }

    var data = JSON.parse(CONFIG.storage.getItem('RJC_data_' + key))
    if(data === null || data === undefined) return 'Invalid Content'

    return data
}

function clearFromCache (key) {
    // if(key === null) console.log('will clear all the cache items, then return')
    CONFIG.storage.removeItem('RJC_info_' + key)
    CONFIG.storage.removeItem('RJC_data_' + key)
}
function forceUpdateCache (key) {
    console.log('Force Cache element update', key)
}

var CONFIG = {
    storage: localStorage,
    expires: 60000
}

var setInstance = function () {
    return {
        Config: function (prop, val) { CONFIG[prop] = val},
        set: insertInCache,
        get: getFromCache,
        clear: clearFromCache,
        forceReset: forceUpdateCache
    }
}

var RJC = setInstance()

module.exports = RJC;
module.exports.default = RJC;
