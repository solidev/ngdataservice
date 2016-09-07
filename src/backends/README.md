# Backend services

## Description


Backend service provides operations between collections and databases :

- retrieve
- list
- create
- update
- destroy


BackendService are injectable using `XXXX_BACKEND_CONFIG` parameters.

## Provided backends

### REST Backend

REST Backend provide communication with a REST api endpoint. They use

- an `Http` service
- a **parser** (to translate endpoint answer to js object); by default
  it uses a json parser : `DSJsonParser`
- a **renderer** (to prepare payload to api endpoint); by default,
  it uses a json renderer : `DSJsonRenderer`
- a `REST_BACKEND_CONFIG` to get endpoint config

API methods (retrieve, list, ..) use a 
`RestIdentifier: {path, query, headers}` to locate endpoint, and are
mapped to classical Http methods :

- retrieve = **GET**
- list = **GET**
- create = **POST**
- update = **PUT** ( TODO: PATCH depending on *partial* flag) 
- destroy = **DELETE**




