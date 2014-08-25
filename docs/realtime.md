# Realtime

## Introduction

The wolves.technology has a simple realtime websocket endpoint to allow you to build realtime applications against the api. Currently, not all the information in the api is available as realtime, but the following data is available:

* New howls that appear on the main timeline, e.g. new howls available at `http://wolves.technology/howls`
* New howls by specific wolves, e.g. at `http://wolves.technology/wolves/philip/howls`
* New holws that mention wolves, e.g. at http://wolves.technology/wolves/philip/marks`

All of this data comes through a single websocket endpoint at `ws://wolves.technology`.

The data sent via the websocket api is not the full howl, but a hint about new data. Your application can then hit the typical rest API to retrieve the data for that item if your application is interested in it.

Each new howl may create multiple messages on the endpoint. For example, a message by user **philip** with content: "Hi @luke and @henrik", which created the howl with id "123abc", would create the following messages:

* One message for the new howl on the main timeline:
    * `{ action: "update", channel: "http://wolves.technology/howls", url: "http://wolves.technology/howls/123abc", id: "123abc" }`
* One message on **philip**'s list of howls as he was the creator:
    * `{ action: "update", channel: "http://wolves.technology/wolves/philip/howls", url: "http://wolves.technology/howls/123abc", id: "123abc" }`
* One messages for each of **luke** and **henrik**'s mentions (marks) lists
    * `{ action: "update", channel: "http://wolves.technology/wolves/luke/marks", url: "http://wolves.technology/howls/123abc", id: "123abc" }`
    * `{ action: "update", channel: "http://wolves.technology/wolves/henrik/marks", url: "http://wolves.technology/howls/123abc", id: "123abc" }`

Now, these four messages all point to the same howl, but the different channels allow your application to only listen for the specific updates it cares about.

## Messages

The messages on the endpoint look like this:

```javascript
{
    action: "update", // currently only update is supported, which is equivalent to create
    channel: "",      // The url of the endpoint the howl would have appeared on, e.g. http://wolves.technology/howls
    url: "",          // The url you can use to retrieve the specific item modified
    id: ""           // Just the id of the item
}
```

All of these messages will come through the websocket as stringified JSON, which you can parse with `JSON.parse`

The various messages will therefore look like this:

### New howl on main timeline

```
{
    action: "update",
    channel: "http://wolves.technology/howls",
    url: "http://wolves.technology/howls/46096355-4ff0-4a6f-bfb5-84f4232a7bc9",
    id: "46096355-4ff0-4a6f-bfb5-84f4232a7bc9"
}
```

### New howl by specific user

```
{
    action: "update",
    channel: "http://wolves.technology/wolves/philip/howls",
    url: "http://wolves.technology/howls/46096355-4ff0-4a6f-bfb5-84f4232a7bc9",
    id: "46096355-4ff0-4a6f-bfb5-84f4232a7bc9"
}
```

### New howl mentioning specific user

```
{
    action: "update",
    channel: "http://wolves.technology/wolves/luke/marks",
    url: "http://wolves.technology/howls/46096355-4ff0-4a6f-bfb5-84f4232a7bc9",
    id: "46096355-4ff0-4a6f-bfb5-84f4232a7bc9"
}
```

## Example

The simplest possible realtime app would look something like this. It can be seen in action at http://wolves.technology/client.

```javascript
//Create a websocket connection to the endpoint
var events = new WebSocket('ws://http://wolves.technology');

//when messages appear on the endpoint
events.onmessage = function (event) {

    //Grab the message data (at event.data) and parse it into data
    var data = JSON.parse(event.data);

    //log it to the console
    console.log(data);
};
```
