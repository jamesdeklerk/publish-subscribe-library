/**
 * Publish–subscribe library
 * Uses the publish–subscribe pattern @see https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
 */
var Publisher = (function () {
    function Publisher() {
        /**
         * Holds key-value pairs of events and the associated handlers.
         * Key: The events name
         * Value: An array of handlers subscribed to that event.
         * e.g. events = {
         *     `event1`: [
         *         function () {},
         *         function () {}
         *     ],
         *     `event2`: [
         *         function () {}
         *     ]
         * }
         */
        this.events = {};
    }
    /**
     * Adds a handler to an event in events.
     *
     * @param event The name of the event.
     * @param handler The function to run when the event occurs.
     */
    Publisher.prototype.subscribe = function (event, handler) {
        if (handler === undefined) {
            throw new Error("Expected an event handler");
        }
        // If the event doesn't exist, create an array for the events
        if (!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }
        // @NB Add this reference to the handler so it's easy to unsubscribe
        // handler.event = event;
        // Add the event handler to that event
        this.events[event].push(handler);
        return handler;
    };
    Publisher.prototype.unsubscribe = function (event, handler) {
        // First check the event exists
        if (event === undefined) {
            throw new Error("Expected an event to unsubscribe");
        }
        // If the event doesn't exist, return
        if (!this.events.hasOwnProperty(event)) {
            return false;
        }
        // If the handler isn't defined, remove all handlers listening for that event
        if (handler === undefined) {
            delete this.events[event];
        }
        else {
            // Else if the handler is defined, remove that specific handler
            var index = this.events[event].indexOf(handler);
            if (index > -1) {
                this.events[event].splice(index, 1);
                // If there are no more event handlers, remove that event (i.e. remove the empty array)
                if (this.events[event].length <= 0) {
                    delete this.events[event];
                }
            }
        }
        return true;
    };
    /**
     * Executes each of the relevant event handlers.
     * It passes through the appropriate arguments using rest parameters
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
     *
     * @param event The name of the event.
     * @param args The arguments to be passed through to the events handler(s).
     * @return True if successfully published, false if not.
     */
    Publisher.prototype.publish = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (event === undefined) {
            throw new Error("Expected an event to publish");
        }
        // If the event doesn't exist, return false
        // The property wouldn't exist if the array was empty
        if (!this.events.hasOwnProperty(event)) {
            return false;
        }
        var eventHandlers = this.events[event];
        // Execute each of the relevant event handlers
        // tslint:disable-next-line
        for (var i = 0, handler = void 0; handler = eventHandlers[i]; i = i + 1) {
            handler.apply(void 0, args);
        }
        return true;
    };
    return Publisher;
}());
/**
 * Globally accessible publisher object.
 */
// tslint:disable-next-line
var publisher = new Publisher();
