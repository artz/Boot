(function(global, window, document){

/*
    Function: Boot.now

    Gets a current timestamp.

    Returns:

    Timestamp
*/
    function now() {
        return new Date().getTime();
    }
//    global.now = now;


/*
    Function: Boot.trim

    Trims whitespace before and after a string.

    Parameters

        str - The string to trim leading whitespace.

    Returns

    String - The trimmed string.
*/
    function trim( str ) {
        return str.replace(/^\s+/, "").replace(/\s+$/, "");
    }
//   global.trim = trim;

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
    function contains( haystack, needle ){
        return haystack && haystack.indexOf( needle ) !== -1;
    }
//    global.contains = contains;


    var strString = "string",
        strObject = "object",
        strSpace = " ",

        head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

    function is( str, type ) {
        return typeof str === type;
    }
    function isArray( obj ) {
        return obj && contains( obj.constructor.toString(), "rray" );
    }
    function isObject( obj ) {
        return obj !== null && is( obj, strObject );
    }
    function isString( obj ) {
        return is( obj, strString );
    }
    function isFunction( obj ) {
        return is( obj, "function" );
    }
    function isElement( obj ) {
        return isObject( obj ) && obj.nodeType;
    }


/*
    Boot.extend

    Merge the contents of two or more objects together into the first object.

    Boot.extend( target, [object1], [objectN] )

    Parameters

        target -  An object that will receive the new properties if additional
                  objects are passed in [or that will extend the Boot namespace
                  if it is the sole argument].
        object1 - An object containing additional properties to merge in.
        objectN - Additional objects containing properties to merge in.

*/
    function extend() {

        var args = arguments,
            target = args[0],
            name,
            source,
            i = 1, // Source pointer.
            l = args.length;

        // Feature to consider:
        // If it's a string, we should grab the
        // object from our modules.
//        if ( isString( target ) ) {
//            target = modules[ target ];
//        }

    /*
        // If the length is 1, extend Boot, and
        // set the source to thefirst argument.
        //
        // Artz: Removing this, think this is not
        // worth the bytes and/or non-intuitive.

        if ( l === i ) {
            target = global;
            i = 0;
        }
    */

        for (; i < l; i++ ) {
            source = args[i];
            for ( name in source ) {
                if ( source.hasOwnProperty(name) ) {
                    // If an object or array and NOT a DOM node, we need to deep copy.
                    // Artz: Should isObject weed out elements, maybe?
                    if ( isObject( source[name] ) && ! isElement( source[name] ) ) {
                        target[name] = extend( isArray( source[name] ) ? [] : {}, target[name], source[name] );
                    } else {
                        target[name] = source[name];
                    }
                }
            }
        }
        return target;
    }
//    global.extend = extend;


/*
    Boot.setup

    A function that appends a new "option" method
    on a method to allow developers to override
    default options.
*/
    function setup( method, defaultOptions ) {

        defaultOptions = defaultOptions || {};

        // Create an option method on the method.
        method.option = function( key, value ) {
            if ( isString( key ) ) {
                // Retrieve an option using the key.
                if ( value === undefined ) {
                    return defaultOptions[ key ];
                // Set an option using a key.
                } else {
                    defaultOptions[ key ] = value;
                }
                // Extend the default options.
            } else if ( isObject( key ) ) {
                extend( defaultOptions, key );
                // Return a copy of the current options.
            } else {
                return extend( {}, defaultOptions );
            }
        };
//      return global;
    }
//  global.setup = setup;


/*
    Boot.poll

    Function useful for checking/polling something
    and then executing a callback once it's true.
*/
    var timers = {},
        timerId = 0;

    function poll( check, callback, pollDelay, timeout ){

        var name = timerId++,
            start = now(),
            time,
            isTimeout = false;

        // Internet Explorer needs at least a 1 for setInterval.
        pollDelay = pollDelay || 1;

        timers[ name ] = setInterval(function(){

            time = now() - start;

            if ( check() || ( timeout && ( isTimeout = time > timeout )) ) {
                callback.call( window, isTimeout, time );
                clearInterval( timers[ name ] );
            }

        }, pollDelay );

    }
//    global.poll = poll;


/*
    Simple add/remove classname functions.
    Valuable as Boot.removeClass / Boot.addClass or jQuery's job?
    Supports multiple class additions.
*/
    function addClass( elem, classNames ) {
        // Adding the class name greedily won't
        // hurt and keeps things small.
        classNames = classNames.split( strSpace );

        var elemClassName = elem.className,
            className,
            l = classNames.length,
            reg;

        while ( l-- ) {
            className = classNames[l];
            reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
            if ( ! reg.test( elem.className ) ) {
                elemClassName += strSpace + className;
            }
        }

        elem.className = elemClassName;
    }

    // Supports multiple class removals.
    function removeClass( elem, classNames ) {

        classNames = classNames.split( strSpace );

        var elemClassName = elem.className,
            className,
            l = classNames.length,
            reg;

        while ( l-- ) {
            className = classNames[l];
            reg = new RegExp("(\\s|^)" + className + "(\\s|$)", "g");
            elemClassName = elemClassName.replace( reg, strSpace );
        }

        elem.className = trim( elemClassName );
    }


/*
    Boot.inlineCSS

    Thanks Stoyan!
    http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
*/
    function inlineCSS( css ){

        var style = document.createElement("style"),
            textNode;

        // Stoyan says this is "absolutely required",
        // but so far has passed all our unit tests.
//        style.setAttribute("type", "text/css");

        // This must happen before setting CSS for IE.
        head.insertBefore( style, head.firstChild );

        // IE
        if ( style.styleSheet ) {
            style.styleSheet.cssText = css;
        // The World
        } else {
            textNode = document.createTextNode( css );
            style.appendChild( textNode );
        }

    }
//    global.inlineCSS = inlineCSS;


/*
    Boot.createHTML

    Research: http://domscripting.com/blog/display/99
*/
    function createHTML( html ) {
        var div = document.createElement("c");
        div.innerHTML = html;
        return div.firstChild;
    }
//    global.createHTML = createHTML;


/*
    Boot.getFont
*/
    var fontTestDiv, // Keep it empty until invoked the first time.
        fontTestDivStatus,

        strLoading = "-loading",
        strActive = "-active",
        strInactive = "-inactive",

        docElem = document.documentElement;

    function getFont() {

        var args = arguments,
            arg,
            options = getFont.option(),
            pollDelay = options.pollDelay,
            callback = options.callback,
            fontTemplate = /\{f\}/g,
            fontPathTemplate = /\{p\}/g,
            fontDiv,
            fontDivParent = docElem,
            fontName,
            namespacedFontName,
            fontPath,
            fontFace,
            fontfaceCSS = [],
            i = 0,
            l = args.length;

        // Create the test <div> on demand so as not to impact performance up front.
        if ( ! fontTestDiv ) {
            // Removed these (from webfontloader):
            // height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;
            fontTestDiv = createHTML("<div style=\"position:absolute;top:-999em;left:-999em;width:auto;font-size:300px;font-family:serif\">BESs</div>" );
        }

        function fontReady( fontDiv, namespacedFontName ) {


            function fontReadyTest() {
                // Insert the <div> with font to be tested.
                fontDivParent.insertBefore( fontDiv, fontDivParent.firstChild );

                // Poll the DOM every interval to see if width changes.
                poll(function(){
//                    alert( namespacedFontName + ": " + fontTestDiv.offsetWidth + "!==" + fontDiv.offsetWidth );
                    return fontTestDiv.offsetWidth !== fontDiv.offsetWidth;
                }, function( isTimeout ){
                    if ( isTimeout ) {

                        removeClass( docElem, namespacedFontName + strLoading );
                        addClass( docElem, namespacedFontName + strInactive );
//                      publish( eventNamespace + namespacedFontName + strInactive );
                    } else {
                        removeClass( docElem, namespacedFontName + strLoading );
                        addClass( docElem, namespacedFontName + strActive );
//                      publish( eventNamespace + namespacedFontName + strActive );
                    }
                    if ( callback ) {
                        callback( namespacedFontName, isTimeout );
                    }
                }, pollDelay, options.timeout );
            }

            if ( fontTestDivStatus === 2 ) {
                fontReadyTest();
            } else {
                // IE 6/7 is not ready yet, wait until it is.
                poll(function(){
                    return fontTestDivStatus === 2;
                }, fontReadyTest, pollDelay);
            }
        }

        // Artz: Not proud of this code but IE6/7 need to queue up
        // font requests and wait until a <body> element exists.
        // Lots of polling and waiting going on here.  Good news
        // is that all other browsers zip on through this mess.
        if ( ! fontTestDivStatus ) {

            // Indicate we already inserted the font test <div>.
            docElem.insertBefore( fontTestDiv, docElem.firstChild );
            fontTestDivStatus = 1;

            // We detect if our <div> has a 0 width, something that
            // only happens in IE6/7.  Internet Explorer appears to
            // need a test element inside the <body> to apply CSS.
            if ( fontTestDiv.offsetWidth === 0 ) {

                // Poll until we have a body.  When we do, update
                // our status so anyone watching knows.
                poll(function(){
                    return document.body;
                }, function(){
                    fontDivParent = document.body;
                    fontDivParent.insertBefore( fontTestDiv, fontDivParent.firstChild );
                    fontTestDivStatus = 2;
                }, pollDelay);
            } else {
                fontTestDivStatus = 2;
            }
        }

        // Boot.each might be a cleaner approach, revisit someday (maybe).
        for (; i < l; i++ ) {

            arg = args[i];

            if ( isString(arg) ) {

                fontName = arg.toLowerCase();

                fontPath = options.path.replace( fontTemplate, fontName );

                fontFace = options.fontface.replace( fontTemplate, fontName ).replace( fontPathTemplate, fontPath );

                fontfaceCSS.push( fontFace );

                fontDiv = fontTestDiv.cloneNode( true );

                fontDiv.style.fontFamily = "'" + fontName + "',serif";

                namespacedFontName = options.namespace + fontName;

                // Add the "loading" class for this font.
                addClass( docElem, namespacedFontName + strLoading );

                fontReady( fontDiv, namespacedFontName );

            // If we have an object, extend our current options.
            } else if ( isObject(arg) ) {
                extend( options, arg );
            // If a function is present, add it as a callback to options.
            } else if ( isFunction(arg) ) {
                callback = arg;
            }
        }

        // Inject the @fontface rules into the head.
        inlineCSS( fontfaceCSS.join("") );

    }

    setup( getFont, {
        namespace: "wf-",
        path: "fonts/{f}/{f}-webfont",
        pollDelay: 100,
        timeout: 10000,
        fontface: "@font-face { font-family: '{f}'; src: url('{p}.eot'); src: url('{p}.eot?#iefix') format('embedded-opentype'), url('{p}.woff') format('woff'), url('{p}.ttf') format('truetype'), url('{p}.svg#{f}') format('svg'); font-weight: normal; font-style: normal; }"
    });

    if ( window[ global ] ) {
        window[ global ].getFont = getFont;
    } else {
        window[ global ] = {
            getFont: getFont
        };
    }

}("Boot", this, document));
