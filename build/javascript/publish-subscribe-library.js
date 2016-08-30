var Publisher = (function () {
    function Publisher() {
        this.events = {};
    }
    Publisher.prototype.subscribe = function (event, handler) {
        if (handler === undefined) {
            throw new Error("Expected an event handler");
        }
        if (!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }
        this.events[event].push(handler);
        return handler;
    };
    Publisher.prototype.unsubscribe = function (event, handler) {
        if (event === undefined) {
            throw new Error("Expected an event to unsubscribe");
        }
        if (!this.events.hasOwnProperty(event)) {
            return false;
        }
        if (handler === undefined) {
            delete this.events[event];
        }
        else {
            var index = this.events[event].indexOf(handler);
            if (index > -1) {
                this.events[event].splice(index, 1);
                if (this.events[event].length <= 0) {
                    delete this.events[event];
                }
            }
        }
        return true;
    };
    Publisher.prototype.publish = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (event === undefined) {
            throw new Error("Expected an event to publish");
        }
        if (!this.events.hasOwnProperty(event)) {
            return false;
        }
        var eventHandlers = this.events[event];
        for (var i = 0, handler = void 0; handler = eventHandlers[i]; i = i + 1) {
            handler.apply(void 0, args);
        }
        return true;
    };
    return Publisher;
}());
var publisher = new Publisher();
