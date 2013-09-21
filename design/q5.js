
var isPromise = function (value) {
    return value && typeof value.then === "function";
};

var defer = function () {
    var pending = [], value;
    return {
        resolve: function (_value) {
            if (pending) {
                value = cast(_value);
                for (var i = 0, ii = pending.length; i < ii; i++) {
                    // apply the pending arguments to "then"
                    value.then.apply(value, pending[i]);
                }
                pending = undefined;
            }
        },
        promise: {
            then: function (_callback, _errback) {
                var result = defer();
                var callback = function (value) {
                    result.resolve(_callback(value));
                };
                var errback = function (reason) {
                    result.resolve(_errback(reason));
                };
                if (pending) {
                    pending.push([callback, errback]);
                } else {
                    value.then(callback, errback);
                }
                return result.promise;
            }
        }
    };
};

var cast = function (value) {
    if (value && typeof value.then === "function")
        return value;
    return {
        then: function (callback) {
            return cast(callback(value));
        }
    };
};

var reject = function (reason) {
    return {
        then: function (callback, errback) {
            return cast(errback(reason));
        }
    };
};

