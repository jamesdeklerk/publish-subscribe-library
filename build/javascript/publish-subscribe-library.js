var ParameterDefinition = (function () {
    /**
     * Creates a new instance of ParameterDefinition.
     * It also makes sure it's a valid ParameterDefinition.
     *
     * @param name The name of the parameter.
     * @param type The type of the parameter. It must be a valid JavaScript data type @see validTypes.
     * @param optional Specifies if the parameter is optional. If optional is not defined it defaults to false.
     * @param description A description of the parameter.
     */
    function ParameterDefinition(name, type, optional, description) {
        /**
         * An array of the valid JavaScript data types.
         */
        this.validTypes = ["boolean", "number", "string", "symbol", "function", "object"];
        this.name = name;
        this.type = type;
        if (optional) {
            this.optional = true;
        }
        else {
            this.optional = false;
        }
        this.description = description || "";
        // Make sure this is a valid parameter definition.
        this.performValidParameterDefinitionCheck(this);
    }
    /**
     * Checks is a given type is a valid type.
     *
     * @param type The type to check.
     * @return True if the type is valid, false if not.
     */
    ParameterDefinition.prototype.validType = function (type) {
        for (var _i = 0, _a = this.validTypes; _i < _a.length; _i++) {
            var validType = _a[_i];
            if (type === validType) {
                return true;
            }
        }
        return false;
    };
    /**
     * Checks is a given parameter definition is valid.
     */
    ParameterDefinition.prototype.performValidParameterDefinitionCheck = function (parameter) {
        // Check that name is a string and it has at least 1 character.
        if (typeof parameter.name !== "string" || parameter.name.length <= 0) {
            throw new Error("Expected the parameter name to be a string with at least 1 character.");
        }
        // Check that optional is a boolean.
        if (typeof parameter.optional !== "boolean") {
            throw new Error("Expected optional of parameter " + parameter.name + " to be a boolean.");
        }
        // Check the parameter type is valid.
        if (!this.validType(parameter.type)) {
            throw new Error(("The type \"" + parameter.type + "\" of parameter " + parameter.name + " is not ") +
                "a valid JavaScript type. Expected type to be \"boolean\" or \"number\" or \"string\" etc.\n" +
                "Note: Arrays and instantiations of custom classes have type \"object\", " +
                "and classes have type \"function\".");
        }
        // Check that description is a string.
        if (typeof parameter.description !== "string") {
            throw new Error("Expected description of parameter " + parameter.name + " to be a string.");
        }
    };
    return ParameterDefinition;
}());
var PublisherEvent = (function () {
    /**
     * Creates a new instance of PublisherEvent.
     *
     * @param eventName The name of the event.
     * @param parameters An array of ParameterDefinition objects. This defines each
     * of the parameters passed through when an event handler is fired.
     * e.g.
     * // If an event handler looks like this:
     * function handler(firstName: string, surnameName: string) {
     *     console.log(`Hello ${firstName} ${surnameName}!`);
     * }
     * // The event handlers parameters should be defined as follows:
     * [
     *     {
     *         description: "The person's first name.",
     *         name: "firstName",
     *         type: "string",
     *         optional: false
     *     },
     *     {
     *         description: "The person's surname name.",
     *         name: "surnameName",
     *         type: "string",
     *         optional: true
     *     }
     * ]
     * @param description A description of the event.
     * @param registrant The object that registered the event.
     */
    function PublisherEvent(eventName, parameters, description, registrant) {
        /**
         * An array of the event handlers associated with this event.
         */
        this.handlers = [];
        this.name = eventName;
        this.description = description || "";
        this.registrant = registrant;
        this.parameters = parameters || [];
        // If this.parameters is not a ParameterDefinition array, try convert it to one.
        if (!this.validParameterDefinitionArray(parameters)) {
            this.parameters = this.convertToParameterDefinitionArray(this.parameters);
        }
        // Make sure this is a valid publisher event.
        this.performValidPublisherEventCheck(this);
    }
    /**
     * Converts parameters to a ParameterDefinition array.
     *
     * @param parameters The ParameterDefinition array to check.
     * @return A ParameterDefinition array, else false.
     */
    PublisherEvent.prototype.convertToParameterDefinitionArray = function (parameters) {
        // Check that parameters is an array.
        if (parameters instanceof Array) {
            // If it is an array, try convert each item into a ParameterDefinition
            // tslint:disable-next-line
            for (var i = 0, parameter = void 0; parameter = parameters[i]; i = i + 1) {
                // Check that parameter is an object of some kind.
                if (typeof parameter !== "object") {
                    throw new Error("Unexpected parameter definition.");
                }
                parameters[i] = new ParameterDefinition(parameter.name, parameter.type, parameter.optional, parameter.description);
            }
        }
        else {
            throw new Error("Expected parameters to be an array of parameter definitions (the array can be empty).");
        }
        return parameters;
    };
    /**
     * Checks is the given parameters are in a valid order.
     * A required parameter cannot follow an optional parameter.
     *
     * @param parameters The ParameterDefinition array to check.
     * @return True if it is a valid parameter order, else false.
     */
    PublisherEvent.prototype.validParameterOrder = function (parameters) {
        var optionalParameterFound = false;
        for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
            var parameter = parameters_1[_i];
            if (parameter.optional) {
                optionalParameterFound = true;
            }
            // If an optional parameter was found and a required parameter 
            // was found after the optional parameter was found,
            // then it is not a valid parameter order.
            if (optionalParameterFound && !parameter.optional) {
                return false;
            }
        }
        // If it gets here, no required parameters were found following an optional parameter.
        // Hence, it is a valid parameter order.
        return true;
    };
    /**
     * Checks if parameters is a ParameterDefinition array.
     *
     * @param parameters The ParameterDefinition array to check.
     * @return True if it is a valid ParameterDefinition array, else false.
     */
    PublisherEvent.prototype.validParameterDefinitionArray = function (parameters) {
        // Check that parameters is an array.
        if (parameters instanceof Array) {
            // Then make sure each item in the array is a ParameterDefinition.
            for (var _i = 0, parameters_2 = parameters; _i < parameters_2.length; _i++) {
                var parameter = parameters_2[_i];
                if (!(parameter instanceof ParameterDefinition)) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        return true;
    };
    /**
     * Checks is a given event is valid.
     *
     * @param event The PublisherEvent to check.
     */
    PublisherEvent.prototype.performValidPublisherEventCheck = function (event) {
        // Check that name is a string and it has at least 1 character.
        if (typeof event.name !== "string" || event.name.length <= 0) {
            throw new Error("Expected the event name to be a string with at least 1 character.");
        }
        // Don't need to check that parameters is a ParameterDefinition array.
        // This was done in the constructor.
        // Check the parameters are in a valid order.
        if (!this.validParameterOrder(event.parameters)) {
            throw new Error("A required parameter cannot follow an optional parameter.");
        }
        // Check that description is a string.
        if (typeof event.description !== "string") {
            throw new Error("Expected description of event " + event.name + " to be a string.");
        }
    };
    /**
     * Checks if the given handlers arguments match those defined for this event.
     *
     * @param args The arguments to check.
     */
    PublisherEvent.prototype.checkHandlersArgumentsMatchGiven = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        // For each parameter defined
        // tslint:disable-next-line
        for (var i = 0, parameter = void 0; parameter = this.parameters[i]; i = i + 1) {
            if (typeof args[i] !== parameter.type) {
                throw new Error(("The handler parameters given don't match those defined for event " + this.name + ". ") +
                    ("Expected argument " + i + " to be of type \"" + parameter.type + "\" but found type \"" + typeof args[i] + "\"."));
            }
        }
    };
    return PublisherEvent;
}());
/**
 * Publish–subscribe library
 * Uses the publish–subscribe pattern @see https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
 */
var Publisher = (function () {
    /**
     * Creates a new instance of Publisher.
     *
     * @param checkHandlerParametersOnPublish Specifies whether or not to check an event handlers
     * parameters when publishing an event.
     * Suggestion:
     * checkHandlerParametersOnPublish = true for development.
     * checkHandlerParametersOnPublish = false for production.
     */
    function Publisher(checkHandlerParametersOnPublish) {
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
        if (checkHandlerParametersOnPublish) {
            this.checkHandlerParametersOnPublish = true;
        }
        else {
            this.checkHandlerParametersOnPublish = false;
        }
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
            // Set the current handlers.
            event_2.handlers = this.subscriptions[eventName] || [];
            return event_2;
        }
        else {
            throw new Error("Event " + eventName + " is not registered. Cannot get an event that isn't registered.");
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
        if (!eventName || eventName.length <= 0) {
            throw new Error("Expected an event name with at least 1 character in order to register an event.");
        }
        // Check if the event is already registered
        if (this.isRegistered(eventName)) {
            throw new Error("Event " + eventName + " is already registered.");
        }
        var newEvent = new PublisherEvent(eventName, parameters, description, registrant);
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
            throw new Error("Event " + eventName + " is not registered. Cannot deregister and event that isn't registered.");
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
            throw new Error(("Event " + eventName + " is not registered. ") +
                "Cannot subscribe to an event that isn't registered.");
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
            throw new Error(("Event " + eventName + " is not registered. ") +
                "Cannot unsubscribe from an event that isn't registered.");
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
        // Determine if the handlers parameters should be checked
        if (this.checkHandlerParametersOnPublish) {
            // Get the event.
            var event_4 = this.getEvent(eventName);
            // Check if each of the relevant event handlers arguments are valid.
            // tslint:disable-next-line
            for (var i = 0, handler = void 0; handler = eventHandlers[i]; i = i + 1) {
                event_4.checkHandlersArgumentsMatchGiven.apply(event_4, args);
            }
        }
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
var publisher = new Publisher(true);
