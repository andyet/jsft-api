# Authentication

The wolves.technology api uses the OAuth 2.0 protocol (ish) for simple authentication and authorization. Since this is a demo application the implementation is somewhat simplified.

## Making authenticated requests

Some endpoints don't require any authentication. e.g. [http://wolves.technology/howls](http://wolves.technology/howls) will just return you json data whether authenticated or not.

Various endpoints do require authentication however, for example `POST: http://wolves.technology/howls` creates a new howl for the currently authenticated user. This clearly requires authentication.

The wolves.technology api uses a access tokens for authentication. Once you have an [access token](#receiving-an-access-token) for a given user, making authenticated requests as that user is easy. Just add a `"Auth-Token: {access_token}"` header to the request. For example, with curl this would look like:

```
curl \
    -H "Content-Type: application/json" \
    -H "Auth-Token: 123456" \
    -d '{"content": "Hello world!"}' \
    http://wolves.technology/howls
```


<a name='receiving-an-access-token'></a>
## Receiving an access token

For developing clientside applications, we use the oauth "implicit flow" to retrieve an access token for a user. The process is the following:

1. Direct the user to our authorization url, with a `redirect_uri` specified in the query parameters.
    * The user will be asked to log in to authorize your app to access their wolves.technology data.

2. The wolves.technology server will redirect the user back to your application at the `redirect_uri` with the access token specified as a fragment (#) in the url. Your clientside application can then retrieve the access token from the url, and use it in subsequent requests.


## Full example of Client-Side (Implicit) Authentication

### Step one: Direct your user to our authorization URL

```
http://wolves.technology/authorize?redirect_uri=REDIRECT-URI
```

_If_ you were serving your application at `http://localhost:3000` and had a clientside route at `/auth/callback` configured to handle the callback, this might look something like this in javascript.

```javascript
var redirect_uri = encodeURIComponent('http://localhost:3000/auth/callback');
window.location = 'http://wolves.technology/authorize?redirect_uri=' + redirect_uri;
```

### Step Two: User logs in to their account to authorize your application

The user will login to their account on the wolves.technology/authorize page. This will generate an access token for their account in the system.

### Step Three: User will be redirected to your redirect\_uri

The user will now be redirected back to your app with the access token in the fragment:

```
{http://redirect_uri}#access_token={access_token}
```

So for this example it would be something like: `http://localhost:3000/auth/callback#access_token=1234567`


### Step Four: Retrieve the access token from the url

Your application can now grab the access token out of the url. A naive example of this in JavaScript would look something like:

```javascript
var fragment = window.location.hash
var access_token = fragment.split('=')[1];
```

### Step Five: Make authenticated requests by adding the access token to the header

Now that you have the access token, you can add it to the headers of http requests to authenticate them. The header should look like:

```
"Auth-Token: {access_token}"
```

So if you were using jQuery for example, in your application it might look something like:

```javascript
$.ajax({
    url: 'http://wolves.technology/wolves/me',
    headers: { "Auth-Token": access_token }, //access_token will be 123456 as shown in steps 3/4
    dataType: 'json',
    success: function (me) {
        console.log("Current logged in user is: ", me);

        //Do something with the me object
    },
    error: function (xhr, textStatus, errorThrown) {
        console.log("There was an error", textStatus, errorThrown);
    }
});
```
