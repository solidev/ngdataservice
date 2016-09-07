# Persistence / cache service

Persistence service provides local cache of database items.

Persistence service is injectable.

It provides save/retrieve/destroy/list/clear.

Storage can be of "OBJ" type : they store full object references 
(= memory), or "JSON" type : they store JSON image of objects.

Problems for now :
- JSON circular references
- localstorage store identification
- performance problems with lots of JSON.stringify / JSON.parse