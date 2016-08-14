# Storage & data objects

- object = simple class, with few special properties and methods :

  - **_url** = `ObjectUrl` (canonical url)
  - **_ds** = attached datastore
  - **save**, **refresh**, **update** ... methods (calling datastore methods)
  - **populate()** : from raw existing fields, create or update linked / computed fields
  
- datastore = 

  - params : objectUrl / listUrl
  
  
  - _store (object cache) --> registered baseUrl + params
  - _request (database connector)
  - _urls (urls builder) : object -> url, list -> url
  - get / create / update / replace / destroy
  - getList
  
