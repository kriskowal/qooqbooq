
# Central Dispatch

Q-Connection can be used to create a bidirectional communication channel
between third parties. Consider this scenario. There is a central
server, Alice, that receives connections from third parties Bob and
Charlie.   Bob would like to communicate with Charlie, and Alice must
intermediate this connection.

Bob and Charlie will both connect to Alice and establish a connection.

Bob:

```javascript
var bob = {};
var alicePort = new WebSocket(aliceAddress);
var charliePromise = Connection(alicePort, bob);
```

Charlie:

```javascript
var charlie = {};
var alicePort = new WebSocket(aliceAddress);
var bobPromise = Connection(bob, charlie);
```

Alice will receive their connections and bridge them.  For the
simplicity of this example, we will assume the first connection is Bob,
the second is Charlie.  This should be fine since the clients are
symmetric, but not ideal since Bob and Charlie might need to reestablish
their connection, or there might be other pairs.  We will create a more
advanced protocol in a subsequent example.

```javascript
var bobPromise;
var charliePromise;
var charlieDeferred;
server.on("connection", function (port) {
    if (!bobPromise) { // Bob calling
        charlieDeferred = Q.defer();
        charliePromise = charlieDeferred.promise;
        bobPromise = Connection(port, charliePromise);
    } else { // Charlie calling
        charliePromise = Connection(port, bobPromise);
        charlieDeferred.resolve(charliePromise);
    }
});
```

This is very similar to the pattern for swapping two variables through a
temporary variable.

```javascript
var temp;
var bob = 10;
var charlie = 20;
temp = bob;
bob = charlie;
charlie = temp;
```

We use a deferred promise as a temporary place holder for the opposite
side of the connection.

## A more rigorous protocol

For a more rigorous protocol, we will need an alice object to serve as
an intermediary.  Each client will declare itself and its intended
interlocutor.

```javascript
var alice = Connection(alicePort);
var bob = {};
var charlie = alice.invoke("connect", "Bob", "Charlie", bob);
```

Alice will track connections by name and bridge as requested.

```javascript
var LruMap = require("collections/lru-map");
var Connection = require("q-connection");
var connections = LruMap(100);

var alice = {
    connect: function (source, target, remote) {
        if (connections.has(source)) {
            connection.get(source).resolve(remote);
            // forget, so we can reconnect
            connections.delete(source);
        }

        if (!connections.has(target)) {
            connection.set(target, Q.defer());
        }
        return connections.get(target).promise;
    }
};

server.on("connection", function (port) {
    Connection(port, alice);
});
```

