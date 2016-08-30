// =======================================================
// Registering events
// =======================================================
publisher.register("A", [], "Just a plain event.", this);
publisher.register("B", [
    {
        description: "",
        name: "x",
        type: "number",
    },
    {
        description: "",
        name: "y",
        type: "number",
    },
], "An event with two parameters.", this);
publisher.register("C", [
    {
        description: "",
        name: "text",
        type: "string",
    },
], "An event with one parameter.", this);
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
