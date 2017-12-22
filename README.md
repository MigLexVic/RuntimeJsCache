# Storage-cache

> Easily use the storage or session cache from at client browser, to use in you javascript app
   
   - Choose bettwen localStorage and sessionStorage
   - Define when value expires
   - Stores info & data in separate items
   - Define Custom unique keys for the storage variables

# Install

````
npm install --save storage-cache
````

# How to use
````
import CACHE from 'storage-cache
````

##### Defining Cache to use
The plugin uses the localStorage object as default, if you wish to change to sessionStorage execute the following code
 
 ````
 CACHE.Config('storage', sessionStorage)
 ````

### Insert in cache
To insert a item into cache, call the set method
 - token  | required | string - unique string to identify your cache contents
 - data   | required | string - the contents to save
 - expire | optional | integer - miliseconds to expire (default as 600000ms (10 minutes))

````
token   = 'My Unique string' ||  HashModule('My Unique string')
data    = 'My String' || JSON.stringify({name: 'myObject', 'type': object})
expires = (1200 * 1000) || 1200000  // 20 minutes
````
````
CACHE.set( token, JSON.stringify({name: 'itemName'}), (120 * 1000) )
````

### Get from cache
To recover a item from the cache, ask for the token, if the item did expire, will return false and delete it

````
CACHE.get(token)
````

### Force a cache content to reset
You may want to forget the cache of a item at the moment, or in the next time that item will be requested,
for that call the following code

`````
token    = The unique token
contents = The content to override, if null on next request will return false and delete it
`````

`````
CACHE.forceReset(token, contents)
`````

#### Delete from cache
To remove a item from cache, call the clear method
`````
CACHE.clear(token)
`````

# Example of integration
Let's integrate this package with a javascript api connection
> not ready for use, just an example

````
function postToApi (endpoint, params, options) {

  return new Promise((resolve, reject) => {
    // Get the token
    let token = MD5('endpoint' + 'params' + ...)
    
    // Option is to set to you behavior default?
    if (options.cache.level === 'DEFAULT') {
      let content = CACHE.get(token)
      if (content) resolve(content)
    }
    
    // Without cache content or this call will not use cache
    [YourHttpClient].post()
    .then((response) => {
    
      // Do you want to record the response on the cache
      if (options.cache.level === 'DEFAULT' || options.cache.level === 'GET_AND_REPLACE') {
        CACHE.set(token, response, options.cache.expires)
      }
      
      // resolve the response to the code
      resolve(response)
      
    }).catch((error) => { reject(error) })
  })
}

````

And to call this method

````
 MY_API_MODULE.postToApi('my/unique/endpoint', {name: 'Jonh', surname: 'Doe'}, {
   cache: {
     level = 'DEFAULT', // get from cache, otherwise, do request and save it on cache
     expires = 1200000  // 20 minutes
   }
 })
````