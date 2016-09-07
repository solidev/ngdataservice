# Authentication providers

## Description

Authentication plugins provide authentication data to backends.

Authentication data is provided to authentication plugin via
`authenticate(...args)` method. Back to anonymous mode is triggered using
`anonymous()` method.

Authentication data depends on authentication mode

## Provided authentication plugins

### Token Auth plugin (for RESTBackend)

It provides a header (by default: "X-Token") containing provided token.
Content is not changed.

```
let auth = new DSTokenAuthentication();
auth.authenticate("xxxxx", "X-Auth");
let authheaders = auth.setAuthHeaders(headers);
expect(authheaders.get("x-auth")).to.equal("xxxxx");
expect(auth.setAuthContent(anycontent)).to.equal(anycontent);
```

Back to anonymous mode is set using `anonymous()` :

```
auth.anonymous()
let authheaders = auth.setAuthHeaders(headers);
expect(authheaders.get("x-auth")).to.be.null;
expect(auth.setAuthContent(anycontent)).to.equal(anycontent);
```

