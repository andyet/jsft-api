# jsft-api - The wolves.technology api

## REST API

* users
    * [GET /users](#get-users-index)
    * [GET /users/{username}](#get-users-show)
* tweets
    * [GET /tweets](#get-tweets-index)
    * [GET /users/{username}/tweets](#get-users-show-tweets-index)
    * [GET /users/{username}/mentions](#get-users-show-mentions-index)

### Users

<a name='get-users-index'></a>
#### GET http://wolves.technology/users

```
[
  {
    id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
    username: "philip"
  },
  {
    id: "c6b100f3-4126-4a97-a0b8-7e4239915960",
    username: "luke"
  }
]
```

<a name='get-users-show'></a>
#### GET http://wolves.technology/users/{username}

```
  {
    id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
    username: "philip"
  }
```


### Tweets

<a name='get-tweets-index'></a>
#### GET http://wolves.technology/tweets

```
[
  {
    id: "1e28f7f6-89a5-427d-a92f-9b4742af731e",
    content: "Hey @luke",
    user: {
      id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
      username: "philip"
    }
  },
  {
    id: "245a6471-4fc1-46da-8dd1-28e7ba36c8e6",
    content: "aaaawwwwwwwooooooooooooooooooo",
    user: {
        id: "c6b100f3-4126-4a97-a0b8-7e4239915960",
        username: "luke"
    }
  },
  {
    id: "3c6753a1-33c4-4e53-8f49-19cd1feb5295",
    content: "howling is the best @philip",
    user: {
      id: "c6b100f3-4126-4a97-a0b8-7e4239915960",
      username: "luke"
    }
  }
]
```


<a name='get-users-show-tweets-index'></a>
#### GET http://wolves.technology/users/{username}/tweets

```json
[
  {
    id: "245a6471-4fc1-46da-8dd1-28e7ba36c8e6",
    content: "aaaawwwwwwwooooooooooooooooooo",
    user: {
        id: "c6b100f3-4126-4a97-a0b8-7e4239915960",
        username: "luke"
    }
  },
  {
    id: "3c6753a1-33c4-4e53-8f49-19cd1feb5295",
    content: "howling is the best @philip",
    user: {
      id: "c6b100f3-4126-4a97-a0b8-7e4239915960",
      username: "luke"
    }
  }
]
```

<a name='get-users-show-mentions-index'></a>
#### GET http://wolves.technology/users/{username}/mentions

```json
[
  {
    id: "1e28f7f6-89a5-427d-a92f-9b4742af731e",
    content: "Hey @luke",
    user: {
      id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
      username: "philip"
    }
  },
]
```
