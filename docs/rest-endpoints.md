# REST Endpoints

The wolves.technology api has a number of easy to user RESTful endpoints that will return JSON data for you to use. A few of these are [authenticated](/docs/authentication) but most are not.

**Contents:**

* [Howls](#howls)
  * [GET /howls](#howls-index) - list all the howls
  * [GET /howls/{howl\_id}](#howls-show) - list all the howls
  * [POST /howls](#howls-create) - create howl for a user
* [Wolves](#wolves)
  * [GET /wolves](#wolves) - list all the wolves
  * [GET /wolves/me](#wolves-me) - get the currently logged in wolf by access token)
  * [GET /wolves/{username}](#wolves-get) - list all the wolves
  * [GET /wolves/{username}/howls](#wolves-username-howls) - get howls for a specific user
  * [GET /wolves/{username}/marks](#wolves-username-marks) - get marks (howls which mention a user) for a specific user


<a name="howls"></a>
## Howls

<a name="howls-index"></a>
### GET http://wolves.technology/howls

Retrieve the current timeline as a JSON array

* Authentication: optional
* Live example: [http://wolves.technology/howls](http://wolves.technology/howls)
* Curl example:
    ```
    curl -H "Content-Type: application/json" http://wolves.technology/howls
    ```

* Example response:

    ```
    [
        {
            id: "46096355-4ff0-4a6f-bfb5-84f4232a7bc9",
            content: "Hello world! @philip @luke @henrik",
            createdAt: "1408966148324",
            user: {
                id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
                username: "philip"
            }
        },
        {
            id: "4eb84072-7b35-4dfd-b76d-24e0ae603a8f",
            content: "Hello world! @philip @luke @henrik",
            createdAt: "1408966138758",
            user: {
                id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
                username: "philip"
            }
        },
        {
            id: "bc8b9733-32a3-4746-b241-b8823ceab703",
            content: "Hello world!",
            createdAt: "1408966032855",
            user: {
                id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
                username: "philip"
            }
        }
    ]
    ```

<a name="howls-show"></a>
### GET http://wolves.technology/howls/{howl_id}

Retrieve a specific howl as a JSON object.

* Authentication: optional
* Live example: [http://wolves.technology/howls/46096355-4ff0-4a6f-bfb5-84f4232a7bc9](http://wolves.technology/howls/46096355-4ff0-4a6f-bfb5-84f4232a7bc9)
* Curl example: `curl
    ```
    curl -H "Content-Type: application/json" http://wolves.technology/howls/46096355-4ff0-4a6f-bfb5-84f4232a7bc9
    ```
* Example response:

    ```
    {
        id: "46096355-4ff0-4a6f-bfb5-84f4232a7bc9",
        content: "Hello world! @philip @luke @henrik",
        createdAt: "1408966148324",
        user: {
            id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
            username: "philip"
        }
    }
    ```

<a name="howls-create"></a>
### POST http://wolves.technology/howls

Create a new howl for the current user.

* Authentication: required, access-token
* Payload: The json payload for creating a howl has a single property:
    * content: "String of the howl content"

* Curl example: `curl
    ```
    curl -H "Content-Type: application/json" \
         -H "Auth-Token: <insert-access-token>" \
         -d '{ "content": "Hello, world!" }' \
         http://wolves.technology/howls
    ```

* Example response:

    ```
    {
        id: "8b5b9429-f305-4354-a576-b5f5108c1cc8",
        content:"Hello @luke and @henrik",
        createdAt:"1408972906870",
        user: {
            id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
            username: "philip"
        }
    }
    ```


<a name="wolves"></a>
## Wolves

<a name="wolves-index"></a>
### GET http://wolves.technology/wolves

Retrieve the current list of users as a JSON array

* Authentication: optional
* Live example: [http://wolves.technology/wolves](http://wolves.technology/wolves)
* Curl example:
    ```
    curl -H "Content-Type: application/json" http://wolves.technology/wolves
    ```
* Example response:
    ```
    [
        {
            id: "07d32317-8123-434d-9d6f-65aa730f9ff5",
            username: "whobubble"
        },
        {
            id: "25ec0505-1a8f-4fa3-a435-260a057183a8",
            username: "UndercoverWolf"
        },
        {
            id: "2d32a96b-8b75-4b44-9ede-d35a19abb004",
            username: "daniel"
        }
    ]
    ```

<a name="wolves-me"></a>
### GET http://wolves.technology/wolves/me

Retrieve the currently authenticated user (based on their access token). If the access token is missing or invalid, an error and status code of 500 will be returned.

* Authentication: required, access-token
* Curl example:
    ```
    curl -H "Auth-Token: <insert-access-token>" http://wolves.technology/wolves/me
    ```
* Example response:
    ```
    {
        "id":"a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
        "username":"philip"
    }
    ```

<a name="wolves-show"></a>
### GET http://wolves.technology/wolves/{username}

Get a wolves' information by username

* Authentication: optional
* Live example: [http://wolves.technology/wolves/philip](http://wolves.technology/wolves/philip)
* Curl example:
    ```
    curl http://wolves.technology/wolves/philip
    ```
* Example response:
    ```
    {
        "id":"a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
        "username":"philip"
    }
    ```

<a name="wolves-username-howls"></a>
### GET /wolves/{username}/howls

Retrieve the list of howls by a given user.

* Authentication: optional
* Live example: [http://wolves.technology/wolves/philip/howls](http://wolves.technology/wolves/philip/howls)
* Curl example:
    ```
    curl http://wolves.technology/wolves/philip/howls
    ```
* Example response: 
    ```
    [
        {
            id: "8b5b9429-f305-4354-a576-b5f5108c1cc8",
            content: "Hello world! @philip @luke @henrik",
            createdAt: "1408972906870",
            user: {
                id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
                username: "philip"
            }
        },
        {
            id: "7bb34033-368e-4b1c-ab1c-25b14ae4d200",
            content: "Hello world! @philip @luke @henrik",
            createdAt: "1408972834759",
            user: {
                id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
                username: "philip"
            }
        },
        {
            id: "46096355-4ff0-4a6f-bfb5-84f4232a7bc9",
            content: "Hello world! @philip @luke @henrik",
            createdAt: "1408966148324",
            user: {
                id: "a609a5ea-81dc-46c3-9aa0-c98fffd1d3c4",
                username: "philip"
            }
        }
    ]
    ```

<a name="wolves-username-marks"></a>
### GET /wolves/{username}/marks

Retrieve the list of howls that mention a given user.

* Authentication: optional
* Live example: [http://wolves.technology/wolves/philip/marks](http://wolves.technology/wolves/philip/marks)
* Curl example:
    ```
    curl http://wolves.technology/wolves/philip/marks
    ```
* Example response: 
    ```
    [
        {
            id: "3c6753a1-33c4-4e53-8f49-19cd1feb5295",
            content: "howling is the best @philip",
            createdAt: "1405888420516",
            user: {
            id: "c6b100f3-4126-4a97-a0b8-7e4239915960",
            username: "luke"
        },
            {
            id: "47377f74-cc0e-46cd-8020-83579648584d",
            content: "I feel like this should be our theme song: https://www.youtube.com/watch?v=CmBgxP56R1I @luke @philip",
            createdAt: "1405888420516",
            user: {
                id: "68afc9e1-cb03-4fed-a91f-5521ebb4afc9",
                username: "ike"
            }
        },
            {
            id: "4ed90b22-fd75-4c7a-88e6-87f8928bf9c7",
            content: "aaaawwwwwwwoooooooooooooooooooo @philip",
            createdAt: "1405888420516",
            user: {
                id: "c6b100f3-4126-4a97-a0b8-7e4239915960",
                username: "luke"
            }
        }
    ]
    ```
