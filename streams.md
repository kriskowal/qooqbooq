
Promises and streams are distinct concepts. We could not live with one but without the other. The concepts need no coupling, but both streams and promises benefit from a cohesive design.

I have a draft implementation of promise streams in a branch of [Q][]. This is an implementation of streams using infinite promise queues that I did not and will not land in Q. It will be integrated into [Q-IO][].  The best place to start understanding this concept is with the documentation, then read the code to see how it works.

[Q]: https://github.com/kriskowal/q
[Q-IO]: https://github.com/kriskowal/q-io

- [Documentation](https://github.com/kriskowal/q/blob/streams/README.md#primer-on-iterators-and-generators)
- [Implementation](https://github.com/kriskowal/q/blob/streams/q.js#L2078-L2297)
- [Tests](https://github.com/kriskowal/q/blob/0e5d134e07a787e486f4d1174c93e5bf23779de6/spec/q-spec.js#L1238-L1493)

But, before you delve into those resources, here’s some background…

A promise is like an event emitter in the sense that it, at least conceptually, emits "fulfilled", "rejected", and "progress" events.  A stream is like an event emitter in the sense that it, at least conceptually, emits "data" and "closed" events.  A promise is special because it will only emit "fulfilled" or "rejected" once, and if any user registers a handler for this event  after the event has occurred, it will replay that event just for that handler.  A stream is special because, in the simple case, it has only one consumer, guarantees that the consumer will receive every event, every event once, and every event in order, and will provide a signal back to the producer to moderate the rate of flow based on the size of its internal buffer.  An event emitter is special because it does not wait for anyone, dispatches to anyone who listens, and may entrain a responder chain with capturing and bubbling.  The publisher/subscriber pattern combines parts of streams and event emitters.

One area where promises and streams might collides is the `closed` state. It is better to model the “closed” state as a promise than an event emitter because the subscriber might become interested in whether the stream has closed, after the stream has already closed.

Promises lend themselves toward designs where we adapt existing synchronous interfaces to asynchronous counterparts, allowing us to reuse designs by promoting all return values from the domain of values to the domain of promises for the same types of values.  A stream is asynchronous, but its synchronous cousin is an array.  A stream that is designed in the presence of arrays has the interface of an array, but returns and receives promises.

A stream would have a `stream.forEach(callback)` method, just like an array.  The `forEach` of an array returns `undefined`, but implicitly, it only returns `undefined` after it has called `callback` for every value in the array.  A stream’s `forEach` method would instead return a promise for `undefined`, and would resolve only after it has called `callback` for every value from the input.  Also, an array’s `forEach` calls the `callback` with each of the entries in the array, guaranteeing that they will be called in order.  Implied in this that the callback 1 must return `undefined` before callback 2 will be called.  A promise stream would extend this by waiting for the promise returned by the callback (treating a value as a promise for that value, albeit `undefined`).

The asynchronous analogues of `map` and `reduce` would be very similar, but there is an opportunity to relax the constraint that the callbacks must be called in order.  The map/reduce pattern falls naturally out of the promise stream pattern.

Returning promises from the callbacks in all of these cases provides an opportunity for the stream to manage scheduling, by capping the number of outstanding promises and informing the producer of the rate of consumption through some signal, direct or indirect.

[This][Reader] is an existing `Reader` implementation in Q-IO that provides promise-themed streaming using `closed` and `forEach`, but needs to be refactored for a couple reasons.  For one, it was written before Node.js fixed streams, so back pressure is supported by the API for forward compatibility, but ignored by the underlying system.  It is also too coupled to Node.js—new Q-IO streams will have a superset of the interface (adding more of the `Array` interface) and work with multiple underlying engines.

[Reader]: https://github.com/kriskowal/q-io/blob/master/reader.js

Another interesting facet of promises and streams is the concept of “progress”.  In the concept of progress, a promise is most like an event emitter.  It does not buffer progress events, and broadcasts to all listeners.  However, capturing the progress events from a promise and modeling the resolution of that promise as a “closed” event, it would be straightforward to construct a stream from a promise.  This is particularly relevant for the `Q.all` method, which emits progress events with the form `{value, index}`.

