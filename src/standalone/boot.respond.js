/*
    Boot.respond
    Utility for simplifying conditional logic for responsive design websites.

    Great reading:
        http://www.quirksmode.org/mobile/viewports.html
        http://www.quirksmode.org/mobile/viewports2.html

    Sweet reference for planning responsive layouts:
        http://www.metaltoad.com/blog/simple-device-diagram-responsive-design-planning

    TODO: Deprecate Boot.screen stuff?

    Usage:

    Execute code that falls within a given max and min.

        Boot.respond({ max: 599 }, function (results) {
          console.log("Screen is less than 600px.", results);
        });
        Boot.respond({ min: 600, max: 1000 }, function (results) {
          console.log("Screen is greater than 599 and less than 1001px.", results);
        });
        Boot.respond({ min: 1001 }, function (results) {
          console.log("Screen is greater than 1000px.", results);
        });

    Set up media queries for predefined responsive layouts.

        // Smartphone
        @media only screen and (max-width: 599px) {
          html {
            content: "smartphone";
          }
        }
        // Tablet
        @media only screen and (min-width: 600px) and (max-width: 1000px) {
          html {
            content: "tablet";
          }
        }
        // Desktop
        @media only screen and (min-width: 1001px) {
          html {
            content: "desktop";
          }
        }

    Now layout can be specified and execute code that meets layout.

        Boot.respond("smartphone", function (width) {
          console.log("Smartphone callback.", width);
        });
        Boot.respond("tablet", function (width) {
          console.log("Tablet callback.", width);
        });
        Boot.respond("desktop", function (width) {
          console.log("Desktop callback.", width);
        });

        // Respond to multiple layouts.
        Boot.respond("desktop tablet", function (width) {
          console.log("Desktop or tablet callback.", width);
        });

    Additionally this layout gets published when user resizes/re-orients client.

    Here's how to subscribe:

        // Subscribe before setting up breakpoints
        // to execute on init.
        Boot.subscribe("boot.respond", function (layout) {
          switch(layout) {
            case "smartphone":
              console.log("Respond event: ", layout);
              break;
            case "tablet":
              console.log("Respond event: ", layout);
              break;
            case "desktop":
              console.log("Respond event: ", layout);
              break;
          }
        });

        // Force publish of respond event immediately.
        Boot.respond();
*/
(function (namespace, window, undefined) {

    "use strict";

    // Initialize the library's namespace.
    // This is controlled via arguments injected
    // into the closure at the bottom of this script.
    if (!window[namespace]) {
        window[namespace] = {};
    }

    var global = window[namespace],
        eventNamespace = namespace.toLowerCase() + ".";


/*
    Function: Boot.contains

    Determines if the given string contains given text.

    Parameters:

        haystack - The string to search inside.
        needle - The string to find.

    Returns:

    Boolean

    Usage:
    if ( contains( "a", "abcde" ) ) {
        // true
        Do something knowing this value contains it.
    }
*/
    function contains(haystack, needle) {
        return haystack && haystack.indexOf(needle) !== -1;
    }
    global.contains = contains;


    // String optimizations.
    function is(str, type) {
        return typeof str === type;
    }

    function isObject(obj) {
        return obj !== null && is(obj, "object");
    }
    global.isObject = isObject;

    function isString(obj) {
        return is(obj, "string");
    }
    global.isString = isString;

    function isFunction(obj) {
        return is(obj, "function");
    }
    global.isFunction = isFunction;


/*
    Function: Boot.each

    Simple function for iterating through an array.

    One day do this?: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach

    Parameters:

        array - The array to iterate over.
        callback - The callback to apply to each item in the array.

    Returns:

    Boot
*/
    function each(array, callback) {
    // Anything break if I comment this out?  Dummy protection needed?
    //    if ( array && array.length ) {
        var i, l;
        for (i = 0, l = array.length; i < l; i += 1) {
            callback(array[i], i, array);
        }
    //    }

    }
    global.each = each;


    // Internal function used to implement throttle() and debounce()
    function limit(func, wait, debounce) {

        var timeout;

        return function () {

            function throttler() {
                timeout = undefined;
                func.call(this);
            }

            if (debounce) {
                clearTimeout(timeout);
            }

            if (debounce || !timeout) {
                timeout = setTimeout(throttler, wait);
            }
        };
    }

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    function throttle(func, wait) {
        return limit(func, wait, false);
    }
    global.throttle = throttle;


/*
    Function: Boot.bind

    Cross browser method for binding events.

    Parameters:

        object - The object to bind the method to.
        event - The event to bind the method to.
        callback - The method to fire on the event.

    Returns:

    Boot
*/
    // Patch function to normalize IE events to standard.
    function patchIEEvent(event) {

        event.preventDefault = function () {
            event.returnValue = false;
        };

        if (!event.target) {
            event.target = event.srcElement;
        }

        return event;
    }

    function bind(object, event, callback) {

        if (object.attachEvent) {
            object.attachEvent("on" + event, function () { callback(patchIEEvent(window.event)); });
        } else if (object.addEventListener) {
            object.addEventListener(event, callback, false);
        }
    }
    global.bind = bind;


/*
    Function: Boot.subscribe

    Subscribes to an event, fires a callback once it is emitted.
    http://en.wikipedia.org/wiki/Publish/subscribe

    * Consider adding support for synchronous subscriptions,
      i.e. if an event already fired, execute callback now.

    Parameters:

    event
    callback
*/
    var events = {};
    function subscribe(object, event, callback) {

        if (isString(object)) {
            callback = event;
            event = object;
            object = undefined;
        }

        if (!events[event]) {
            events[event] = [];
        }

        events[event].push([object, callback]);

    }
    global.subscribe = subscribe;


/*
    Function: Boot.publish

    Publishes an event, passing an optional object of data.
    Triggers any events attached to the event.
    http://en.wikipedia.org/wiki/Publish/subscribe

    Parameters:
        - event
        - data

    Returns:

    Boot

*/
    function publish(object, event, data) {

        // Support for associating events with DOM nodes.
        if (isString(object)) {
            data = event;
            event = object;
            object = undefined;
        }

        var eventQueue = events[event];

        if (eventQueue) {

            each(eventQueue, function (on) {

                var onObject = on[0],
                    onCallback = on[1];

                if (object) {

                    // Only execute the callback if this is
                    // the object emitting the event or
                    // the handler doesn't require an object.
                    if (object === onObject || onObject === undefined) {

                        onCallback.call(object, data);

                        // Break the each loop, no sense wasting cycles.
                        // Worried this could have adverse effects.
                        // Commenting out for now.
                        // return false;
                    }
                } else {
                    onCallback.call(data, data);
                }

            });
        }
    }
    global.publish = publish;


/*
    Function: Boot.getStyle

    Cross-browser method for getting the computed styles of elements

    Parameters:

        element - The element to find the computed style for.
        property - The property we're asking for.

    Returns:

        The computed style value

    Usage:

        var height = Boot.getStyle( myDiv, "height" );

    // TODO: Consider refactoring to something simpler:
    function currentStyle(elem, property) {
        var style;
        if (window.getComputedStyle) {
            style = window.getComputedStyle(elem);
        } else {
            style = elem.currentStyle;
        }
        return style[property];
    }

*/
    // Largely taken from the example at
    // http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/
    function getStyle(element, property) {
        var value;

        if (document.defaultView && document.defaultView.getComputedStyle) {
            // The lovely way of retrieving computed style
            value = document.defaultView.getComputedStyle(element, "").getPropertyValue(property);
        } else {
            // The... other (read: Microsoft) way
            property = property.replace(/\-(\w)/g, function (match, prop) {
                // TODO: match var is unused - this ok?
                return prop.toUpperCase();
            });

            value = element.currentStyle[property];
        }

        return value;
    }


//    global.getStyle = getStyle;


    var docElem = document.documentElement,
        currentLayout;

    function respondEvent() {
        var layout = getStyle(docElem, 'content');
        if (layout !== currentLayout) {
            currentLayout = layout;
            publish(eventNamespace + 'respond', layout);
        }
    }

    function respond(layout, callback) {

        var max,
            min,
            width = docElem.clientWidth,
            load = true,
            style,
            content;

        if (isString(layout) && isFunction(callback)) {

            // Look in HTML content property for layout.
            // Note: Firefox implements quotes around the property,
            // so we strip them if they are present.
            content = getStyle(docElem, 'content').replace(/^"/, '').replace(/"$/, '');

            if (contains(' ' + layout + ' ', ' ' + content + ' ')) {
                callback({ width: width, layout: content });
            }

        } else if (isObject(layout) && isFunction(callback)) {

            min = layout.min;
            max = layout.max;

            // If current client width is in range, execute callback.
            if ((max && width > max) || (min && width < min)) {
                load = false;
            }

            if (load) {
                callback({ width: width, min: min, max: max });
            }

        } else {
            respondEvent();
        }
    }

    // Bind respond event.
    // TODO: Add support for unsubscribe.
    bind(window, "resize", throttle(respondEvent, 100));

    // Bind to orientation changes as well.
    // http://stackoverflow.com/questions/5284878/how-do-i-correctly-detect-orientation-change-using-javascript-and-phonegap-in-io
    window.onorientationchange = respondEvent;

    global.respond = respond;
}("Boot", this));
