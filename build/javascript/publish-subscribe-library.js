var PublisherEvent = (function () {
    function PublisherEvent(eventName, parameters, description, registrant) {
        this.name = eventName;
        this.parameters = parameters;
        this.description = description;
        this.registrant = registrant;
    }
    return PublisherEvent;
}());
/**
 * Publish–subscribe library
 * Uses the publish–subscribe pattern @see https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
 */
var Publisher = (function () {
    function Publisher() {
        /**
         * Holds key-value pairs of events and the associated handlers.
         * Key: The event name
         * Value: An array of handlers subscribed to that event.
         * e.g. subscriptions = {
         *     `event1`: [
         *         function () {},
         *         function () {}
         *     ],
         *     `event2`: [
         *         function () {}
         *     ]
         * }
         */
        this.subscriptions = {};
        /**
         * A registry of all the events.
         */
        this.registeredEvents = [];
    }
    /**
     * Gets the index of an event in registeredEvents.
     *
     * @param eventName The name of the event.
     * @return The index of the event in registeredEvents, if the event isn't registered, return -1.
     */
    Publisher.prototype.eventIndex = function (eventName) {
        // tslint:disable-next-line
        for (var i = 0, event_1; event_1 = this.registeredEvents[i]; i = i + 1) {
            if (event_1.name === eventName) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Gets an event.
     *
     * @param eventName The name of the event.
     * @return The event.
     */
    Publisher.prototype.getEvent = function (eventName) {
        if (!eventName) {
            throw new Error("Expected an event name.");
        }
        var eventIndex = this.eventIndex(eventName);
        // Check if the event is registered.
        if (eventIndex > -1) {
            var event_2 = this.registeredEvents[eventIndex];
            return {
                description: event_2.description,
                handlers: this.subscriptions[eventName],
                name: event_2.name,
                parameters: event_2.parameters,
                registrant: event_2.registrant,
            };
        }
        else {
            throw new Error("Event " + eventName + " is unregistered.");
        }
    };
    /**
     * Gets all the registered events.
     *
     * @return All registered events.
     */
    Publisher.prototype.getAllEvents = function () {
        var events = [];
        for (var _i = 0, _a = this.registeredEvents; _i < _a.length; _i++) {
            var event_3 = _a[_i];
            events.push(this.getEvent(event_3.name));
        }
        return events;
    };
    /**
     * Gets the description of an event.
     *
     * @param eventName The name of the event.
     * @return The description of an event.
     */
    Publisher.prototype.getEventDescription = function (eventName) {
        return this.getEvent(eventName).description;
    };
    /**
     * Gets the handlers of an event.
     *
     * @param eventName The name of the event.
     * @return The handlers of an event.
     */
    Publisher.prototype.getEventHandlers = function (eventName) {
        return this.getEvent(eventName).handlers;
    };
    /**
     * Gets the parameters of an event.
     *
     * @param eventName The name of the event.
     * @return The parameters of an event.
     */
    Publisher.prototype.getEventParameters = function (eventName) {
        return this.getEvent(eventName).parameters;
    };
    /**
     * Gets the registrant of an event.
     *
     * @param eventName The name of the event.
     * @return The registrant of an event.
     */
    Publisher.prototype.getEventRegistrant = function (eventName) {
        return this.getEvent(eventName).registrant;
    };
    /**
     * Checks if an event is registered.
     *
     * @param eventName The name of the event.
     * @return True if the event is registered, false if not.
     */
    Publisher.prototype.isRegistered = function (eventName) {
        if (this.eventIndex(eventName) > -1) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Registers an event and defines the parameters its handler takes.
     *
     * @param eventName The name of the event.
     * @param parameters The parameters passed through to the event handlers.
     * @param description A description of the event.
     * @param registrant The object that registered the event.
     */
    Publisher.prototype.register = function (eventName, parameters, description, registrant) {
        // Check the correct parameters were given.
        if (!eventName || !parameters) {
            throw new Error("Expected at least an event name and array of parameters in order to register an event.");
        }
        // Check if the event is already registered
        if (this.isRegistered(eventName)) {
            throw new Error("Event " + eventName + " is already registered.");
        }
        var newEvent = {
            description: description,
            name: eventName,
            parameters: parameters,
            registrant: registrant,
        };
        this.registeredEvents.push(newEvent);
    };
    /**
     * Deregisters an event.
     *
     * @param eventName The name of the event to deregister.
     */
    Publisher.prototype.deregister = function (eventName) {
        if (!eventName) {
            throw new Error("Expected an event name to deregister.");
        }
        var eventIndex = this.eventIndex(eventName);
        // Check if the event is registered.
        if (eventIndex > -1) {
            // Delete the event (i.e. remove all event handlers from an event).
            this.unsubscribe(eventName);
            // Remove the event from this.registeredEvents.
            this.registeredEvents.splice(eventIndex, 1);
        }
        else {
            throw new Error("Event " + eventName + " is unregistered.");
        }
    };
    /**
     * Deregisters all events.
     */
    Publisher.prototype.deregisterAll = function () {
        this.subscriptions = {};
        this.registeredEvents = [];
    };
    /**
     * Adds a handler to an event in events.
     *
     * @param eventName The name of the event.
     * @param handler The function to run when the event occurs.
     */
    Publisher.prototype.subscribe = function (eventName, handler) {
        // First check the event exists
        if (!eventName) {
            throw new Error("Expected an event name to subscribe.");
        }
        if (!this.isRegistered(eventName)) {
            throw new Error("Event " + eventName + " is unregistered.");
        }
        if (!handler) {
            throw new Error("Expected an event handler.");
        }
        // If the event doesn't exist, create an array for the events
        if (!this.subscriptions.hasOwnProperty(eventName)) {
            this.subscriptions[eventName] = [];
        }
        // @NB Add this reference to the handler so it's easy to unsubscribe
        // handler.eventName = eventName;
        // Add the event handler to that event
        this.subscriptions[eventName].push(handler);
        return handler;
    };
    Publisher.prototype.unsubscribe = function (eventName, handler) {
        // First check the event exists
        if (!eventName) {
            throw new Error("Expected an event name to unsubscribe.");
        }
        if (!this.isRegistered(eventName)) {
            throw new Error("Event " + eventName + " is unregistered.");
        }
        // If the event doesn't exist, return
        if (!this.subscriptions.hasOwnProperty(eventName)) {
            return false;
        }
        // If the handler isn't defined, remove all handlers listening for that event
        if (!handler) {
            delete this.subscriptions[eventName];
        }
        else {
            // Else if the handler is defined, remove that specific handler
            var index = this.subscriptions[eventName].indexOf(handler);
            if (index > -1) {
                this.subscriptions[eventName].splice(index, 1);
                // If there are no more event handlers, remove that event (i.e. remove the empty array)
                if (this.subscriptions[eventName].length <= 0) {
                    delete this.subscriptions[eventName];
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
     * @param eventName The name of the event.
     * @param args The arguments to be passed through to the events handler(s).
     * @return True if successfully published, false if not.
     */
    Publisher.prototype.publish = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!eventName) {
            throw new Error("Expected an event name to publish.");
        }
        // If the event doesn't exist, return false
        // The property wouldn't exist if the array was empty
        if (!this.subscriptions.hasOwnProperty(eventName)) {
            return false;
        }
        var eventHandlers = this.subscriptions[eventName];
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
