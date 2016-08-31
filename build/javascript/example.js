// =======================================================
// Registering events
// =======================================================
/**
 * Register an event with no parameters.
 */
publisher.register("A");
publisher.register("a");
/**
 * Register an event where the handler takes in two parameters.
 * e.g. function(x: number, y: number) { ... };
 */
publisher.register("B", [
    {
        name: "x",
        type: "number",
    },
    {
        name: "y",
        type: "number",
    },
]);
/**
 * Register an event where the handler takes in one parameter.
 * The event has a description, and the event has a registrant.
 */
publisher.register("C", [
    {
        description: "This is a description of the text parameter.",
        name: "text",
        optional: true,
        type: "string",
    },
], "This is a description of event C.", this);
// -------------------------------------------------------
// =======================================================
// Deregister an event.
// =======================================================
publisher.deregister("a");
// -------------------------------------------------------
// =======================================================
// Subscribing to events
// =======================================================
/**
 * Subscribing to an event.
 */
publisher.subscribe("A", function () {
    console.log("Event A: Event Handler 1.");
});
publisher.subscribe("A", function () {
    console.log("Event A: Event Handler 2.");
});
publisher.subscribe("A", function () {
    console.log("Event A: Event Handler 3.");
});
/**
 * Passing parameters.
 */
publisher.subscribe("B", function (x, y) {
    console.log("Event B: x=" + x + "; y=" + y + "; x*y=" + x * y + ";");
});
publisher.subscribe("C", function (text) {
    console.log("Event C: " + text);
});
/**
 * Storing the event handler in a variable.
 */
var eventAHandler4 = publisher.subscribe("A", function () {
    console.log("Event A: Event Handler 4.");
});
var eventAHandler5 = publisher.subscribe("A", function () {
    console.log("Event A: Event Handler 5.");
});
// -------------------------------------------------------
// =======================================================
// Publishing events - see the console for the output.
// =======================================================
/**
 * Publishing an event.
 * This executes handlers 1, 2, 3, 4 and 5.
 */
publisher.publish("A");
/**
 * Publishing an event with parameters.
 */
publisher.publish("B", 5, 2);
/**
 * Remove a specific handler from an event.
 */
publisher.unsubscribe("A", eventAHandler4);
/**
 * Publishing an event after handler 4 has been removed.
 * This executes handlers 1, 2, 3 and 5.
 */
publisher.publish("A");
/**
 * Delete event (i.e. removes all event handlers from an event).
 */
publisher.unsubscribe("A");
/**
 * Publishing an event after it has been deleted.
 * This results in nothing being executed since nothing is subscribed to event A.
 */
publisher.publish("A");
/**
 * Publishing an event after 1000 milliseconds.
 */
setTimeout(function () {
    publisher.publish("C", "This event was published after 1000 milliseconds!");
}, 1000);
// -------------------------------------------------------
// =======================================================
// Getting events details
// =======================================================
/**
 * Getting all registered events.
 * This includes events with no handlers.
 */
console.log(publisher.getAllEvents());
/**
 * Getting a specific event.
 */
console.log(publisher.getEvent("C"));
/**
 * Getting a specific events parameters.
 */
console.log(publisher.getEventParameters("C"));
/**
 * Getting a specific events handlers.
 */
console.log(publisher.getEventHandlers("C"));
/**
 * Getting a specific events description.
 */
console.log(publisher.getEventDescription("C"));
/**
 * Getting a specific events registrant.
 */
console.log(publisher.getEventRegistrant("C"));
// -------------------------------------------------------
