/*
	BOOT UTILITY LIBRARY
	Version 0.2
*/
(function( namespace, window, undefined ) {

	// Return if global is already defined. (Optional behavior) 
//	if ( window[ namespace ] ) {
//		return;
//	}
	
		// Initialize the library's namespace.
		// This is controlled via arguments injected
		// into the closure at the bottom of this script.
//		global = window[ namespace ] = {},
	var global = window[ namespace ] || ( window[ namespace ] = {} ),

		// Localize global objects and functions for better compression.
		document = window.document,
		JSON = window.JSON,
		SetTimeout = setTimeout,
		
		slice = Array.prototype.slice,
	
		// String compression optimizations for the library.
		strLoad = "load",
		strString = "string",
		strFunction = "function",
		strObject = "object",
		strNumber = "number",
		strBoolean = "boolean",
		
		strScript = "script",
		strReadyState = "readyState",
		strOnReadyStateChange = "onreadystatechange",
		strOnLoad = "onload",
		strComplete = "complete",
		
		strSpace = " ",
		strDot = ".",
		
		// Used only by getFont at this point, I believe.
		eventNamespace = namespace.toLowerCase() + strDot;


/*
	Function: Boot.now
	
	Gets a current timestamp.
	
	Returns:
	
	Timestamp
*/
	function now() {
		return new Date().getTime();
	}
	global.now = now;


/*
	Function: global.log
	
	Simple method for keeping a log and outputting to the screen.
	
	Parameters:
	
		message - String of the message to log.
	
	Returns:
	
	Boot
*/
	var logList,
		body,
		logItems = [],
		startTime = now(),
		logEnabled = 0;
		
	function log( msg, ul ) {
		
		body || (body = document.body);
		
		logItems.push( (now() - startTime) + "ms: " + msg );
		
		if ( logEnabled ) {	
			if ( logList || 
			   ( logList = ul ) || 
			   ( body && ( logList = document.createElement("div")) && body.insertBefore( logList, body.firstChild) ) ) {
				logList.innerHTML = ["<ul><li>", logItems.join("</li><li>"), "</li></ul>"].join('');
			}
		}
	}
	
	log.init = function( options ) {
		logEnabled = 1;
		logList = options.elem;
	};
	
	global.log = log;


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
	global.contains = contains;


/*
	Function: Boot.is...
	
	Determines if the given object is an array.
	
	Parameters:
	
		obj - The object to test.
	 
	Returns:
	
	Boolean
*/
	// String optimizations.
	function is( str, type ) {
		return typeof str === type;
	}

	function isArray( obj ) {
		return obj && contains( obj.constructor.toString(), "rray" );
	}
	global.isArray = isArray;

//	Artz: Should isObject weed out elements, maybe?
	function isObject( obj ) {
		return obj !== null && is( obj, strObject );
	}
	global.isObject = isObject;

	function isElement( obj ) {
		return isObject( obj ) && obj.nodeType;
	}
	global.isElement = isElement;
	
	function isString( obj ) {
		return is( obj, strString );
	}
	global.isString = isString;
	
	function isBoolean( obj ) {
		return is( obj, strBoolean );
	}
	global.isBoolean = isBoolean;
	
	function isFunction( obj ) {
		return is( obj, strFunction );
	}
	global.isFunction = isFunction;
	
	function isNumber( obj ) {
		return is( obj, strNumber );
	}
	global.isNumber = isNumber;


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
	function each( array, callback ) {
	// Anything break if I comment this out?  Dummy protection needed?
	//	if ( array && array.length ) {  
		var i = 0, l = array.length;
		for (; i < l; i++ ) {
			callback( array[i], i, array );
		}
	//	}
		
	}
	global.each = each;


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
//		if ( isString( target ) ) {
//			target = modules[ target ];
//		}
		
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
	global.extend = extend;


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
      if ( isString(key) ) {
        // Retrieve an option using the key.
        if ( value === undefined ) {
          return defaultOptions[ key ];
        // Set an option using a key.
        } else {
          defaultOptions[ key ] = value;
        }
      // Extend the default options.
      } else if ( isObject(key) ) {
        extend( defaultOptions, key );
      // Return a copy of the current options.
      } else {
        return extend( {}, defaultOptions );
      }
    };

    return global;
  }
  global.setup = setup;


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
		
		timers[ name ] = setInterval(function(){
			
			time = now() - start;
			
			if ( check() || ( timeout && ( isTimeout = time > timeout )) ) {
				callback.call( window, isTimeout, time );
				clearInterval( timers[ name ] );
			}
			
		}, pollDelay );
		 
	}
	global.poll = poll;


/*
	Function: Boot.ready
	
	Cross-browser DOMContentLoaded event binder.
	
	Parameters:
	
		callback - The function to execute after the document is ready.
	
	Returns:
	
	Boot
	
	See Also:
	
	<Boot.load>

	Usage:
	
	Boot.ready( function(){ ... } );
	
	Research:
	
	* http://dean.edwards.name/web// log/2005/09/busted/
	  Probably the first experiment; cannot use because of document.write.
	
	* http://www.thefutureoftheweb.com/b// log/adddomloadevent
	  Uses our approach but for some reason didn't make Safari's 
	  detection the same as IE.  My testing showed readyState to 
	  be reliable acrosss IE browsers.
	  /test/readyState.php
	
	* http://javascript.nwbox.com/IEContentLoaded/
	  This one is included in jQuery. The doScroll event is 
	  much less efficient than checking readyState. 
	  /test/regex-vs-indexof.html
	
	* http://www.dustindiaz.com/smallest-domready-ever
	  This was interesting but upon closer inspection, doesn't work.
*/
	var isReady = 0,
		isReadyBound = 0,
		readyQueue = [],
		
		checkReady = function(){
			// Browsers go through 3 readyStates:
			// 1 - loading
			// 2 - loaded (Safari) or interactive (everyone else)
			// 3 - complete
			// This check looks for #2, the equivalent of DOM ready.
			// Needs to be "interactive" or "loaded" (Safari) or "complete" (catch all)
			// "e" fits the bill nicely.
			// indexOf is much faster than regex or doScroll hack in Safari and IE (see /test/regex-vs-indexof.html)
			return contains( document.readyState, "e" );
		},
/*
	Replaced this with Boot.poll. So far so good!
		pollReadyState = function(){
			if ( checkReady() ) {
				execReady();
			} else {
				SetTimeout( pollReadyState, 50 );
			}
		},
*/
		execReady = function(){
			
			isReady = 1;
			
			each( readyQueue, function( callback ){
				defer( callback );
			});

			// Clear the queue.
			readyQueue = [];
		},
		
		// Internal reference.
		ready = function( callback ){
		
			if ( isReady ) {
				
				// Execute callback immediately in the next UI thread.	
			//	console.log("Executing in the next cycle.");
				defer( callback );	
						
			} else {
	
				if ( isReadyBound ) {
				//	log("Pushing ready callback.");
					// Push function into the queue.
					readyQueue.push( callback );
					
				} else {
				//	log("Binding ready.");
					isReadyBound = 1;
					
					// Add this callback to our queue to
					// be executed when ready.
					readyQueue = [ callback ];
					
					if ( checkReady() ) {
					//	log("Already ready.");
						// It is ready right now, execute ready.
						execReady();
					} else {	
						// Good browsers.
						if ( document.addEventListener ) {
				//			console.log("Binding DOMContentLoaded.");
							document.addEventListener( "DOMContentLoaded", execReady, false ); 
						// IE.
						} else {
							poll( checkReady, execReady, 50 );
						}
					}
				}
			}
			
			
		};
	
	// Public reference.
	global.ready = ready;


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
	function patchIEEvent( event ) {
		
		event.preventDefault = function(){
			event.returnValue = false;
		};
		event.target = event.srcElement;
		
		return event;
	}
	
	function bind( object, event, callback ) {
		
		if (object.attachEvent) {
			object.attachEvent("on" + event, function(){ callback( patchIEEvent( window.event ) ); } );
		} else if (object.addEventListener) {
			object.addEventListener(event, callback, false);
		}
	}
	global.bind = bind;


/*
	Boot.delegate
*/
	function delegate( elem, selector, event, callback ) {
		bind( elem, event, function( evt ){

			var target = evt.target,
				id = target.id || "",
				className = target.className || "",
				tag = target.nodeName,
				token = tag + ( id && "#" + id ) + ( className && "." + className );
			
			// console.log( selector, ":", token, ":", contains( token.toLowerCase(), selector.toLowerCase() ) );
			if ( contains( token.toLowerCase(), selector.toLowerCase() ) ) {
				callback( evt );
			}

		});
	}
//	global.delegate = delegate;


/*
	Function: Boot.load
	
	Cross-browser window load event binder.
	Includes a convenient check for if 
	the window has already loaded and 
	executes the function immediately if it is.
	Also ensures any events bound to ready fire 
	first, which can be a problem in normal event bindings.
	
	Parameters:
	
		callback - The function to execute after the window has loaded.
	
	Returns:
	
	Boot
	
	See Also:
	
	<Boot.load>
*/
	var isLoaded = 0;
	function load( callback ) {

		// When loaded, set the internal flag and do the callback.
		function loaded(){
			
			// Ensure we process our ready queue before stuff 
			// bound to window.load.
			execReady();
			
			isLoaded = 1;
			
			defer( callback );
		}
		
		// Browsers go through 3 readyStates:
		// 1 - loading
		// 2 - loaded (Safari) or interactive (everyone else)
		// 3 - complete
		// This check looks for #3, the equivalent of window.onload.
		// "m" fits the bill nicely.
		// indexOf is much faster than regex in Safari and IE (see /test/regex-vs-indexof-vs-doscroll.html)
		if ( contains( document.readyState, "m" ) ) {
			loaded();
		} else {
			bind( window, strLoad, loaded );
		}
		
	}
	global.load = load;


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
	function subscribe( object, event, callback ){
	
		if ( isString( object ) ) {
			callback = event;
			event = object;
			object = undefined;
		}
		
		var eventQueue = events[ event ] || ( events[ event ] = [] );

		eventQueue.push( [ object, callback ] );
		
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
	function publish( object, event, data ){
		
		// Support for associating events with DOM nodes.
		if ( isString( object ) ) {
			data = event;			
			event = object;
			object = undefined;
		}
		
		var eventQueue = events[ event ];
		
		if ( eventQueue ) {
			
			each( eventQueue, function( on ){
				
				var onObject = on[0],
					onCallback = on[1];
	
				if ( object ) {
	
					// Only execute the callback if this is
					// the object emitting the event or 
					// the handler doesn't require an object.
					if ( object === onObject || onObject === undefined ) {
						
						onCallback.call( object, data );
						
						// Break the each loop, no sense wasting cycles.
						// Worried this could have adverse effects.
						// Commenting out for now.
						// return false;
					} 
				} else {
					onCallback.call( data, data );
				}
				
			});
		}
	}
	global.publish = publish;


/*
	Function: Boot.getCSS
	
	Fetches a CSS file and appends it to the DOM.
*/
	var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
		cssLoading = {};

	function getCSS( src ) {
		defer(function(){
			if ( ! cssLoading[ src ] ) {
				cssLoading[ src ] = 1;
				var styleSheet = document.createElement("link");
				styleSheet.rel = "stylesheet";
				styleSheet.href = src;
				head.insertBefore( styleSheet, head.firstChild );
			}
		});
	}
	global.getCSS = getCSS;


/*
	Function: Boot.cacheScript
	
	Asynchronous JavaScript cacher.
	
	Parameters:
	
		src - The script resource to cache.
	 
	Returns:
	
	Boot	
	
	Notes:
	
	Consider making this a generic cacheResource function that can cache CSS too?
	Or we can simply do cacheCSS = cacheScript (or cacheJS?)
*/
	function cacheScript( src, cacheDelay ){
		
		// log( "Boot.getJS (cacheScript): Caching script (" + src + ")" );
		var elem;
		
		body || (body = document.body);
		
		if ( cacheDelay ) {
			// Convert cacheDelay to seconds.
			cacheDelay = cacheDelay * 1000;
		}
		
		// Body element is required for this to work.
		if ( body ) {
			
			// Cache the script after the optional cacheDelay.
			SetTimeout(function(){
				// Gecko gets an object, everyone else gets an image.
				// See /test/boot.cachescript.html
				elem = document.createElement( isGecko ? strObject : "img" );
	
				// Set the src (image) and data (object).
				elem.src = elem.data = src;
				
				// Hide element from view.
				elem.alt = ""; // So screen readers don't hit it.
				elem.width = elem.height = 0;
				elem.style.position = "absolute"; // Probably overkill, but fully ensures layout is unharmed.
	
				// Using setTimeout here will cause Firefox to 
				// hang perpetually, making users sad. :(
				body.appendChild( elem );
				
			}, cacheDelay || 0 );

		}
		
	}
	global.cacheScript = cacheScript;


/*
	Function: Boot.getScript
	
	Loads a script node into the DOM. Note this is different than Boot.getJS, which
	has full functionality for dealing with script dependencies and preserving
	execution order across browsers.
	
	Parameters:
	
		src - The script to load.
		callback - The function to invoke after the script has loaded.
		options - Options for the script element:
			type - The script type, useful for caching scripts.
			text - The text to load into the node.
			async - Value of the async param, default is false.

*/
	function getScript ( src, callback, options ) { // type, text ) {
	
		var	script = document.createElement( strScript ),
			done = 0;
		
		// Ensure our arguments are what they proclaim to be.
		options = options || callback || {};
		callback = isFunction( callback ) ? callback : 0;
	
		// Set the source of the script.
		script.src = src;
		
		// Set the type.
		// Controlling this is useful for caching scripts.
		script.type = options.type || "";  // Using "" assumes text/javascript.
		
		// Sometimes nodes need to have text inside (rare).
		// Deleting, this doesn't work across browsers (cough, IE).
		// Tried: script.innerHTML, script.text, document.createTextNode...
		// options.text && (script.innerHTML = options.text);
		
		// This is for Firefox 4
		// https://developer.mozilla.org/En/HTML/Element/Script
		// We basically make it synchronously like in FF3.
		// Not ideal, but we found <object> to be MUCH slower
		// DOM nodes in Firefox.
		// Check out /test/benchmarks/speed-test-* (need to update files)
		script.async = options.async || false;
		
		// Attach handlers for all browsers
		script[ strOnLoad ] = script[ strOnReadyStateChange ] = function(){
	
			if ( ! done && ! script[ strReadyState ] || /loaded|complete/.test( script[ strReadyState ] ) ) {
						
				// log( "Boot.getJS (getScript): Done loading <b>" + src + "</b>." );	
				
				// Tell global scripts object this script has loaded.
				// Set scriptDone to prevent this function from being called twice.
				done = 1;
				
				// Emit an event indicating this script has just executed.
			//	if ( ! script.type ) {
			//		publish( eventNamespace + "js-done", { src: src } );
				//	console.log( "Script executed: " + src );
			//	}
				// Handle memory leak in IE
				script[ strOnLoad ] = script[ strOnReadyStateChange ] = null;
				
				// Remove this script in the next available UI thread.
				// * Removing this to reduce KB.  If people really care, we will add back.
	//			SetTimeout(function(){
	//				firstScriptParent.removeChild( script );
	//			}, 0);
				
				if ( callback ) {
			//	global.log( options.test );
					callback( src ); 
				}
			}
		};
		
		// This is the safest insertion point to assume.
		// We use a setTimeout to ensure non-blocking behavior.
		defer(function(){
			head.insertBefore( script, head.firstChild );
		});
	}
	global.getScript = getScript;

/*
	Function: Boot.getJS
	
	Asynchronous JavaScript loader.
	
	Parameters:
	
		url
		callback
		options
		 
	Returns:
	
	Boot
	
	To Do:
	* Consider adding document.write prevention.
*/
	var isScriptLoading = {},
		isScriptDone = {},
		isScriptExecuted = {},
		
		execScriptQueue = [],
		readyScriptQueue = [],
		loadScriptQueue = [],
		
		nextScriptIndex = 0,

//		scriptDoneEvent = "js-done",

		docElem = document.documentElement,
		isGecko = "MozAppearance" in docElem.style,

		// If the browser supports asynchronous executing scripts. (Firefox 3.6, Opera, Chrome 12)
		isScriptAsync = isGecko || window.opera || document.createElement( strScript ).async, /* === true */
		
		scriptType = isScriptAsync ? "" : "c";

	// log( "Boot.getJS: Script <b>is " + (isScriptAsync ? "" : "not") + "</b> asynchronous." );	
/*	
	function emitScript( scriptObject ) {
		if ( scriptObject.src ) {
			if ( isScriptAsync ) {
				publish( eventNamespace + scriptDoneEvent, scriptObject );
			} else {
				defer(function(){
					publish( eventNamespace + scriptDoneEvent, scriptObject );
				});
			}
		}
	}
*/
/*
 * We are eliminating this function due to a 
  recursive loop issue with nested getJS calls.
 	function shiftScripts() {
//		emitScript(execScriptQueue[0]);
		nextScriptIndex++;
	//	console.log( "Shifting to index: " + nextScriptIndex );
		execScripts();
		
	}
*/

	global.exec = execScriptQueue;

	function execScripts( src ){

			// Get the first script object in the queue.
		var nextScriptObject = execScriptQueue[ nextScriptIndex ] || {},
			
			// Look if next script object is a script or callback.
			nextScript = nextScriptObject.src || nextScriptObject;

		// Remember the script we were passed is loaded.
		isScriptDone[ src ] = 1;
		// global.log("execScripts(" + src + ")");
		if ( isScriptDone[ nextScript ] && ! isScriptExecuted[ nextScript ] ) {
			
// global.log( "Executing Scripts: [" + nextScriptIndex + "] " + nextScript );
// publish( nextScript );
						
			isScriptExecuted[ nextScript ] = 1;
			
			// Advance the pointer to the next script index.
			nextScriptIndex++;
			
			// We are moving this to getScript, which emits immediately
			// after execution.
			// publish( eventNamespace + "js-done", { src: lastScript, test: lastTest } );
			
			// If browser supports asynch execution, continue.
			if ( isScriptAsync ) {
				execScripts();
			// Otherwise fetch this script and shift it out when executed.
			} else {
				getScript( nextScript, execScripts );
			}
			 
		} else if ( isFunction( nextScript ) ) {
// global.log( "Executing Function: " + nextScript );
			// Advance to the next script now, otherwise if there are
			// nested getJS calls this goes into a recursive nightmare.
			nextScriptIndex++;
			
			// We handle things differently for async browsers, since
			// we want to be sure to execute the callback immediately
			// after the script downloads.
			if ( isScriptAsync ) {
				nextScript( nextScript.t );
				execScripts();
			} else {
				// For other browsers, we continue to manage things
				// manually using paced SetTimeouts.  IE likes it.
				// global.log("Deferring callback. [" + nextScriptIndex + "]");
				defer(function(){
					// global.log("Executing callback. [" + nextScriptIndex + "]");
					nextScript( nextScript.t );
					execScripts();
				});
			}
			
		}// else {
			// global.log( "Doing nothing for now. " + nextScript );	
	//	}
	}
	
	function dispatchScriptQueue( queue ) {
		
		// Call getJS on each item in the queue.
		while ( queue[0] ) {
			getJS( queue[0] );			
			queue.shift();
		}
	}
	
	function getJS ( /* url, callback, or options */ ) {
		
		var args = arguments;
		
		if ( isArray( args[0] ) ) {
			args = args[0];
		}
		// global.log("getJS(" + args[0] + ");");
		each( args, function( arg ) {

			var options = {},
				deferScript,
				src,
				callback;
			
			// Convert the string or function
			// into the object.
			if ( isString( arg ) ) {
				options.src = arg;
			} else if ( isFunction( arg ) ) {
				options.callback = arg;
			} else if ( isObject( arg ) ) {
				
				options = arg;
				
				// Remember deferScript setting.
				deferScript = options.defer;
				
				// Should we have a callback.
				callback = options.callback;
				
				// Reset it so it loads normally next time.
				options.defer = undefined; 
			}

			// Defer these options until document is ready.
			if ( deferScript === "ready" ) {
				// Push options into queue for later processing.
				readyScriptQueue.push( options );

			//	log( "Boot.getJS: Pushing script to ready event." );
				// On the ready event, dispatch the ready queue.
				ready(function(){
					dispatchScriptQueue( readyScriptQueue );
				});
				
			// Defer these options until document is complete.
			} else if ( deferScript === strLoad ) {

				// Push options into queue for later processing.
				loadScriptQueue.push( options );
				
			//	log( "Boot.getJS: Pushing script to load event." );
				// On the load event, dispatch the load queue.
				load(function(){
					dispatchScriptQueue( loadScriptQueue );
				});
			
			// Proceed as normal.
			} else {

				// Localize the source.
				src = options.src;

				// Simple yepnope-ish implementation.
				// For the real deal look here: http://yepnopejs.com/
				if ( ! src && options.nay ) {
					
					if ( options.test ) {
						src = options.yay;
					} else {
						src = options.nay;
					}
					// options.src = src;

					// Grab the alternates if they exist,
					// and reset the source.
					getJS( src );
					src = undefined;
				}

				// Localize the callback.
				callback = options.callback;
				
				// We don't need the callback, we will handle
				// this manually via the execution queue.
				options.callback = undefined;
				
				// If the type is set to cache, do so immediately.
				// Artz: Why isn't this inside our src check (next)?
				if ( contains( options.type, "cache" ) ) {
					
					// If this is a script and it hasn't been 
					// loaded yet, fetch it now.
					if ( src && ! isScriptLoading[ src ] ) {
						
						// Remember we already loaded this script.
						isScriptLoading[ src ] = 1;
						
					//	log( "Boot.getJS: Caching script: " + src);
						cacheScript( src, options.delay );
					}
					
				// Otherwise proceed through our queue system.	
				} else if ( src && ! isScriptLoading[ src ] ) {
				//	global.log("getJS( " + src + " );");
					// Remember we already loaded this script.
					isScriptLoading[ src ] = 1;
					// Push the script options into our execution queue.
					execScriptQueue.push( options );
// global.log("Pushing script. [" + (execScriptQueue.length - 1) + "] " + src );					
					// If this is a script, and it hasn't 
					// been loaded yet, fetch it now.
				
					// log( "Boot.getJS: Loading script: " + src);
					// Look into letting getScript accept an options {}.
					getScript( src, execScripts, { type: scriptType /* , text: options.text*/ } ); // Removing text support, IE problems.
					
				}
				
				// Push the callback into the queue if we had one.
				if ( callback ) {
					
					// Remember the script object associated
					// with this callback.
					callback.t = options.test;
				//	global.log("getJS( function(){} );");
					// log( "Boot.getJS: Pushing callback function into queue.");
					execScriptQueue.push( callback );
// global.log("Pushing callback. [" + (execScriptQueue.length - 1) + "]");					
				}
			}
			
			// Execute any scripts in our queue.
			execScripts();

		});
		
	}
	global.getJS = getJS;


/*
	Boot.resolve
	Utility for resolving URL addresses.
	TBD on how we want this API to work if 
	we expose it externally and further internally.
	possibly make resolveJS, resolveCSS, resolveFont?
*/
	function resolve( customOptions, module ) {

		var options = extend( resolve.option(), customOptions || {} ),
      basePath = options.basePath,
      filename = options.filename( module ),
      suffix = options.suffix;

    // If the module name ends with .js
    if ( /\.js$/.test( module ) ) {
      // Use the module as the filename instead.
      filename = module;
      suffix = "";

      // If the module name starts with "http://" or "https://"
      if ( /^http[s]*:\/\//.test( module ) ) {
        // Remove the basePath
        basePath = "";
      }
    }
    return basePath + filename + suffix;
	}

	setup( resolve, {
		basePath: "",
		filename: function(str){ return str.toLowerCase(); },
		suffix: ".min.js"
	});
	

/*
	Boot.define
	Define a module, based on the Asynchronous Module Definition (AMD)
	http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
*/
	var modules = {},
		moduleDefinitions = {},
		definedModules = [];

	function define( moduleName, moduleDependencies, moduleDefinition ) {
		
		if ( ! isString( moduleName ) ) {
			moduleDefinition = moduleDependencies;
			moduleDependencies = moduleName;
			moduleName = undefined;				
		}

		if ( ! isArray( moduleDependencies ) ) {
			moduleDefinition = moduleDependencies;
			moduleDependencies = undefined;
		}

		// Load in any dependencies, and pass them into the use callback.
		if ( moduleDependencies ) {

			// Remember that this guy has a dependency, and which one it is.
			moduleDefinition.d = moduleDependencies;
		}

		if ( moduleName ) {
			moduleDefinitions[ moduleName ] = moduleDefinition;
		} else {
			definedModules.push( moduleDefinition );
		}	
	}
	
	// We conform to the AMD spec.
	// https://github.com/amdjs/amdjs-api/wiki/AMD
	define.amd = {};
	
	global.define = define;
	
	// Expose modules externally.
	// global.modules = modules;

/*
	Boot.require
	Based on YUI's use() function and RequireJS.
*/	
	// Resolves an object.
	function getLibrary( moduleName ) {
		// i.e. "jQuery.alpha", "MyLib.foo.bar"
		var obj = window;

		each( moduleName.split("."), function( name ) {
//			if ( obj && isObject(obj) && obj.hasOwnProperty( name ) ) {
//			Cross this bridge when it comes to us.
			if ( obj.hasOwnProperty( name ) ) {
				obj = obj[ name ];
			}
		});
	
		return obj;
	}
	
	function require( customOptions, moduleNames, callback ) {
		
		// Normalize parameters.
		if ( isArray( customOptions ) || isString( customOptions ) ) {
			callback = moduleNames;
			moduleNames = customOptions;
      customOptions = {};
		}
		
		// Make moduleNames an array.
		moduleNames = isString( moduleNames ) ? [ moduleNames ] : moduleNames;
		
		var options = extend( require.option(), customOptions ), // See how Boot.setup works.
			callbackArgs = [],
			moduleCount = 0;

		function moduleReady( i, moduleName, module ) {
			
			if ( module ) {
				modules[ moduleName ] = module;
			}
			
			callbackArgs[i] = modules[ moduleName ];
			
			// All dependencies loaded, fire callback.
			if ( ++moduleCount === moduleNames.length ) {
				callback.apply( global, callbackArgs );
			}
			
			if ( module ) {
				publish( moduleName );
			}
		}

		each( moduleNames, function( moduleName, i ) {

			function defineModule(){
				
				var module,
					moduleDependencies,
					moduleDefinition = moduleDefinitions[ moduleName ] || definedModules.shift();

				if ( moduleDefinition ) {

					if ( moduleDependencies = moduleDefinition.d ) {

						require( customOptions, moduleDependencies, function(){
							module = isFunction( moduleDefinition ) ? moduleDefinition.apply( global, arguments ) : moduleDefinition;
							moduleReady( i, moduleName, module );
						});

					} else {

						module = isFunction( moduleDefinition ) ? moduleDefinition() : moduleDefinition;
						moduleReady( i, moduleName, module );

					}

				// Otherwise see if we can snag the module by name (old skool).	
				} else {
					moduleReady( i, moduleName, getLibrary( moduleName )  );
				}
				
			}	
			
			// If this module has already been defined, use it.
			if ( moduleName in modules ) {
				// Check for the object.
				if ( modules[ moduleName ] ){
					moduleReady( i, moduleName );
				// It's undefined, so wait a little bit.
				} else {
					subscribe( moduleName, function(){
						moduleReady( i, moduleName );
					});
				}
				
			// Otherwise we'll need to load and define on the fly,
			// all the whilest managing dependencies.	
			} else {
				
				// Temporarily give this guy something so incoming 
				// module requests wait until the event is emmitted.
				modules[ moduleName ] = undefined;

				// If the module was defined by some other script
				if ( moduleDefinitions[ moduleName ] ) {
					defineModule();
				// Otherwise fetch the script based on the module name
				} else {
//        if ( options.merge ) {
//          // TODO: Implement merge.
//          mergeScript( moduleName, defineModule, i );
//        } else {
				  	getScript( resolve( options, moduleName ), defineModule );
//        }
        }
			}
			
		});

    // EXPERIMENTAL MERGE FUNCTIONALITY
//  var scripts = [],
//      total = moduleNames.length - 1;

//  function mergeScript( moduleName, defineModule, i ) {
//    scripts.push( arguments );
//    if ( i === total ) {
//      // Fire the merged script, and execute all callbacks.
//    }
//  }

	}
  
  setup( require );
	
  global.require = require;


/*
	Boot.widget
	
	The Widget factory is a wrapper function that 
	binds an element to a module using a defined
	object specification.
	
	Note: This is a work in progress!
*/
	function widget( widgetName, elem, options ) {

		var source = modules[ widgetName ],
			instance,
			ui;

		if ( elem.widget && elem.widget[ widgetName ] ) {

			instance = elem.widget[ widgetName ];
	
		} else {

			instance = extend( {}, source, {
				element: elem,
				name: widgetName.replace(strDot, "-"),
				namespace: widgetName,
				option: function( key, value ) {
					
				},
				ui: {},
				options: options || {}
			});
			
			ui = extend( instance.ui, instance.options.ui );
			
			// Convert UI selectors to elements.
			if ( ui ) {
				for ( var x in ui ) {
					if ( ui.hasOwnProperty( x ) ) {
						ui[x] = query(ui[x], elem);
					}
				}
			}
			
			addClass( elem, instance.name );
	
			// Initialize the widget.
			instance._create();
			
			// Save the instance on the element for later access.
			if ( ! elem.widget ) {
				elem.widget = {};
			}
			elem.widget[ widgetName ] = instance;

		}

		return instance;

	}
	global.widget = widget;


/*
	Function: Boot.query
	
	Intended to be the world's smallest selector engine.
	
	Parameters:
		selector
		context - can be an element, element collection (nodeList) or array of elements
	
	Usage:
	
	Supports simple id, class and tag selectors:
		- #someid
		- .someclass
		- img
		
	Supports descendant selectors:
		- #someid .someclass img
	
	Thanks:
		John Resig - http://ejohn.org/blog/thoughts-on-queryselectorall/
*/
	function listToArray ( collection ) { 
		var array = [],
			l = collection.length;
		while ( l-- ) {
			array[l] = collection[l];
		}
		return array;
	}

	var getElementsByClassName = document.getElementsByClassName ? // Runtime feature detect.
			function( selector, element ) {
				return listToArray( element.getElementsByClassName( selector ) );
			} : function( selector, element ) {
				
				var elements = element.getElementsByTagName("*"),
					className,
					matches = [];

				for ( var i = 0, l = elements.length; i < l; i++ ) {
					className = elements[i].className;
					if ( className && (new RegExp("(\\s|^)" + className + "(\\s|$)").test( selector ) ) ) {
						matches.push( elements[i] );
					}
				}
				return matches;
			};

	// Our simple selector engine.
	var querySelectorAll = document.querySelectorAll ? // Runtime feature detect.
			function( selector, element ) {
				
				element = element || document;
				
				// Helps ensure that if we were given a descendant
				// selector we only take the first segment.
				selector = selector.split( strSpace )[0];

				return listToArray( element.querySelectorAll( selector ) );  
				
			} : function( selector, element ) {
				
				element = element || document;
				
				// Helps ensure that if we were given a descendant
				// selector we only take the first segment.
				selector = selector.split( strSpace )[0];
				
				// Grabs the first character, which informs our selector engine.
				var firstChar = selector.charAt(0),
					nodes;
				
				if ( firstChar === "#" ) {
					nodes = [ element.getElementById( selector.replace(firstChar, "") ) ];
				} else if ( firstChar === strDot ) {
					nodes = getElementsByClassName( selector.replace(firstChar, ""), element );
				} else {
					nodes = listToArray( element.getElementsByTagName( selector ) );
				}

				return nodes;
			};
	
	// Special wrapper function that allows
	// multiple context elements to narrow down
	// the set.
	function query( selector, context ) {
		
		// Prepare selector.
		selector = selector.split( strSpace );
		
		// Prepare context.
		// It could be "document", [ ul, ul ]
		if ( context ) {
			// Detects if we received an element
			// and turns it into an array.
			if ( isElement( context ) ) {
				context = [ context ];
			}
		} else {
			context = [ document ];
		}

			// Result set.
		var elems = context;
		
		// Loop through each selector segment and 
		// find elements matching inside context.
		for ( var x = 0, y = selector.length; x < y; x++ ) {
			
			context = elems;
			elems = [];
			
			// Loop through each item in context
			// and find elements.
			for ( var i = 0, l = context.length; i < l; i++ ) {
				
				// Look for items matching the first 
				// segement of the selector and add 
				// them to our result set.
				elems = elems.concat( querySelectorAll( selector[x], context[i] ) );
				
			}
		}

		return elems;
	}
//	global.query = query;


/*
	Function: Boot.attr
	
	Shorthand for setting and retrieving an attribute from an element.
	Note this is not currently used by Boot, but used by Easync and ModuleT
	
	Parameters:
	
		elem - The object with the attribute to fetch.
		attribute - The attribute to fetch.
		value - The value to set.
	
	Returns:
	
	Attribute value (getting) or Boot (setting)
*/
	var styleNode = document.createElement("style");

	function attr( elem, attribute, value ){

		if ( value !== undefined ) {
			if ( value === null ) {
				elem.removeAttribute( attribute );
			} else {
				if ( attribute === "style" ) {
					// For IE.
					elem.style.cssText = value;
				}
				elem.setAttribute( attribute, value );
			}
		} else {
			return elem.getAttribute( attribute );
		}
		
	}
	global.attr = attr;


/*
	Boot.data
	
	Function for extracting data attributes and storing 
	arbitrary data on elements.
*/
	function data( elem, key, value ) {
		// Return an object of all data attributes.
		var strData = "data-",
		
			attribute,
			attributeName,
			attributes = elem.attributes,
			attributesLength = attributes.length,
			attributesObject = {},
			
			ret;
			
		if ( value !== undefined ) {
			attr( elem, strData + key, value );
		} else if ( key !== undefined ) {
			ret = attr( elem, strData + key );
		} else {
			while( attributesLength-- ) {
				attribute = attributes[ attributesLength ];
				attributeName = attribute.nodeName;
				if ( contains( attributeName, strData ) ) {
					attributesObject[ attributeName.replace( strData, "" ) ] = attribute.nodeValue;
				}
			}
			ret = attributesObject;
		}
		return ret;
	}
	global.data = data;


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
	global.addClass = addClass;

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
	global.removeClass = removeClass;


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

*/
	// Largely taken from the example at
	// http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/
	function getStyle( element, property ) {
		var value;

		if ( document.defaultView && document.defaultView.getComputedStyle ) {
			// The lovely way of retrieving computed style
			value = document.defaultView.getComputedStyle( element, "" ).getPropertyValue( property );
		} else {
			// The... other (read: Microsoft) way
			property = property.replace(/\-(\w)/g, function( match, prop ) { // Artz: match var is unused
				return prop.toUpperCase();
			});

			value = element.currentStyle[property];
		}

		return value;
	}

//    global.getStyle = getStyle;


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
//		style.setAttribute("type", "text/css");

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
	global.inlineCSS = inlineCSS;


/*
	Boot.createHTML
	
	Research: http://domscripting.com/blog/display/99
*/
	function createHTML( html ) {	
		var div = document.createElement("c");
		div.innerHTML = html;
		return div.firstChild;
	}
	global.createHTML = createHTML;


/*
	Boot.getFont
*/
	var	fontTestDiv, // Keep it empty until invoked the first time.
		strLoading = "-loading",
		strActive = "-active",
		strInactive = "-inactive";

	function getFont() {
		
		var args = arguments,
			options = getFont.option(),
			fontTemplate = /\{f\}/g,
			fontPathTemplate = /\{p\}/g,
			fontDiv,
			fontName,
			namespacedFontName,
			fontPath,
			fontFace,
			fontfaceCSS = [],
      pollDelay = options.pollDelay,
      timeout = options.timeout,
			i = 0, 
			l = args.length;
	
		if ( ! fontTestDiv ) {
			// Shouldn't need these: height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;
			fontTestDiv = createHTML("<div style=\"position:absolute;top:-999px;left:-999px;width:auto;font-size:300px;font-family:serif\">BESs</div>" ); 

			poll( function(){ return document.body }, function(){
        body = document.body;
        body.appendChild( fontTestDiv );
      }, pollDelay, timeout );

		}
		
		function pollFontDiv( fontDiv, namespacedFontName ) {
			poll( function( time ){
//					global.log( "Test width: " + fontTestDiv.offsetWidth + ", " + fontName + ": " + fontDiv.offsetWidth );
				return fontTestDiv.offsetWidth !== fontDiv.offsetWidth;
			}, function( isTimeout, time){ 
//					global.log("Different widths detected in " + time + "ms. Timeout? " + isTimeout); 
				if ( isTimeout ) {
					
					removeClass( docElem, namespacedFontName + strLoading );
					addClass( docElem, namespacedFontName + strInactive );

					publish( eventNamespace + namespacedFontName + strInactive );
//					window.console && console.log( "Font timeout: " + namespacedFontName );
				} else {
				
					removeClass( docElem, namespacedFontName + strLoading );
					addClass( docElem, namespacedFontName + strActive );
					
					publish( eventNamespace + namespacedFontName + strActive );

				}
//					fontDiv.parentNode.removeChild( fontDiv ); // Unnecessary expense?
			}, options.pollDelay, options.timeout ); // Make this configurable via Boot.options.
		}
		
		// Boot.each might be a cleaner approach, revisit someday maybe.
		for (; i < l; i++ ) {
			
			fontName = args[i].toLowerCase();
			
//			global.log( "Getting font: <b>" + fontName + "</b>" );
			
			fontPath = options.path.replace( fontTemplate, fontName );
			
//			global.log( "Setting font URL: <b>" + fontPath + "</b>" );
			
			fontFace = options.fontface.replace( fontTemplate, fontName ).replace( fontPathTemplate, fontPath );
			
//			global.log( "Generating @fontface: <b>" + fontFace + "</b>");
			
			fontfaceCSS.push( fontFace );
			
			fontDiv = fontTestDiv.cloneNode( true );
			
			fontDiv.style.fontFamily = "'" + fontName + "',serif";
			
      poll( function(){ return document.body }, function(){
        body = document.body;
        body.appendChild( fontDiv );
      }, pollDelay, timeout );	
						
			namespacedFontName = options.namespace + fontName;
			
			publish( eventNamespace + namespacedFontName + strLoading );
						
			addClass( docElem, namespacedFontName + strLoading );
			
			// Had to use a closure inside the loop because of the callback.
			// Consider switching to Boot.each() for brevity.
			pollFontDiv( fontDiv, namespacedFontName );
			
		}
		
		inlineCSS( fontfaceCSS.join("") );
		
	}

	global.getFont = getFont;

	setup( getFont, {
			namespace: "wf-",
			path: "fonts/{f}/{f}-webfont",
      pollDelay: 100,
      timeout: 10000,
			fontface: "@font-face { font-family: '{f}'; src: url('{p}.eot'); src: url('{p}.eot?#iefix') format('embedded-opentype'), url('{p}.woff') format('woff'), url('{p}.ttf') format('truetype'), url('{p}.svg#{f}') format('svg'); font-weight: normal; font-style: normal; }"
		});

/*
	Screen Size Detection
	Includes a throttler and size update check for better performance (doesn't crash IE).
	Interesting reads:
		http://www.webpagemistakes.ca/most-common-screen-resolution/
	
	Consider ditching this, ef IE and yay media queries?
*/
/*
	var screens = [ 320, 640, 800, 1024, 1152, 1280, 1366, 1440, 1600, 1680, 1920 ],
		screensLength = screens.length,
		screenWidth,
		screenClasses = "";
	
    function screenSize() {
		
		// We did not use window.outerWidth to have the same property across browsers. 
		// http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
        var currentWidth = docElem.clientWidth,
			currentClasses = [],
			width,
			i;
		
		// Only update stuff if things actually change.
		// This is needed for IE 6/7 support, where the 
		// resize event is fired whenever any element 
		// on the page resizes (retarded).
		if ( currentWidth !== screenWidth ) {
				
			// Don't think we need this (headjs feature to set the width as a class).
			//	currentClasses.push( "w-" + Math.floor( currentWidth / 50) * 50 );
			for ( i = 0; i < screensLength; i++ ) {
				width = screens[i];
				currentClasses.push( (currentWidth <= width ? "lt-" : "gt-") + width ); 
			}

//			each( screens, function(i, width) {
//				if ( currentWidth < width ) { 
//					currentClasses.push( "lt-" + width ); 
//				}
//			});

			screenWidth = currentWidth;
			
			currentClasses = currentClasses.join( strSpace );
			
			if ( currentClasses !== screenClasses ) {
				removeClass( docElem, screenClasses );
				addClass( docElem, currentClasses );
				screenClasses = currentClasses;
				publish( eventNamespace + "screen-update", { screens: screenClasses, width: currentWidth });
			}
		}
    }

    screenSize();
	
	// Throttling seemed to be more desirable than debouncing.
    bind( window, "resize", throttle( screenSize, 100 ) );
*/

/*
	Boot.browser + CSS browser class targeting
	Code based on head.js - http://headjs.com 
	Thanks Tero Piirainen!
	addressed IE bug where browserVersion was a number and needed to be a string (tell Tero).
	
	Code too bloaty for what you get?  Do we really want to advocate pixel-perfect targeting?
*/
    var userAgent = navigator.userAgent.toLowerCase(),
		browser,
		browserName,
		browserVersion,
		browserClasses = [];

	userAgent = /(firefox)[ \/]([\w.]+)/.exec( userAgent ) ||
		/(chrome)[ \/]([\w.]+)/.exec( userAgent ) ||
		(contains( userAgent, "safari" ) && /(version)[ \/]([\w.]+)/.exec( userAgent )) || 
		/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( userAgent ) ||
		/(msie) ([\w.]+)/.exec( userAgent ) ||
		/(webkit)[ \/]([\w.]+)/.exec( userAgent ) || [];
	
	browserName = userAgent[1];
	browserVersion = userAgent[2];
	
	if ( browserName === "msie" ) {
		browserName = "ie";
		browserVersion = document.documentMode || browserVersion;
	}
	
	if ( browserName === "version" ) {
		browserName = "safari";	
	}
	
	browserClasses.push( browserName );
	browserClasses.push( browserName + parseInt( browserVersion, 10 ) ); // Major version
	browserClasses.push( browserName + browserVersion.toString().replace(strDot, "-").replace(/\..*/, "" ) ); // Minor version
	
	// Add classes all at once for performance reasons.
	addClass( docElem, browserClasses.join( strSpace ) );
	
	// Open up Boot.browser
	browser = { version: browserVersion };
	browser[ browserName ] = true;
	
	global.browser = browser;
	
/*
	HTML 5 Support for IE
	http://html5doctor.com/how-to-get-html5-working-in-ie-and-firefox-2/
	Research need for print protection: http://www.iecss.com/print-protector/
*/
	if ( browser.ie ) {
		// HTML5 support for IE
		each( "abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split( strSpace ), function( elem ) {
			document.createElement( elem );
		});
	}

/*
	Boot.feature
	Based on API by head.js
*/
	var features = {};
	function feature( key, test ) {
		
		var result = false,
			i;
		
		if ( isFunction( test ) || isBoolean( test ) ) {
			if ( test === true || test() ) {
				result = true;
				addClass( docElem, key );
			} else {
				result = false;
				addClass( docElem, "no-" + key );
			}
			features[ key ] = result;
		} else if ( isObject( key ) ) {
			for ( i in key ) {
				if ( key.hasOwnProperty( i ) ) {
					feature( i, key[ i ] );
				}
			}
		} else {
			result = features[ key ];	
		}

		return result;
	}
	global.feature = feature;


/*
    Function: Boot.disableTextSelect

    Cross-browser method for disabling text selection - particularly an issue on ui elements that
    may be clicked quickly enough to trigger the default action of selecting text.

    Parameters:
    
        element - The element to disable text selection on.

    Returns:
        
        The element

    Usage:

        Boot.disableTextSelect( myElement );
*/

    // The actual cross-browserness of this has NOT been tested
    // This is an initial pass based on a stackoverflow example
    // http://stackoverflow.com/questions/826782/css-rule-to-disable-text-selection-highlighting
    function disableTextSelect( element ) {
        if ( getStyle( element, "-khtml-user-select" ) ) {
            // Set style for older webkit
            element.style["-khtml-user-select"] = "none";
        } else if ( getStyle( element, "-webkit-user-select" ) ) {
            // Set style for webkit
            element.style["-webkit-user-select"] = "none";
        } else if ( getStyle( element, "-moz-user-select" ) ) {
            // Set style for mozilla
            element.style["-moz-user-select"] = "-moz-none";
        } else if ( getStyle( element, "user-select" ) ) {
            // Set style for mozilla
            element.style["user-select"] = "none";
        } else {
            // Set property for IE & Opera
            element.unselectable = true;
        }

        return element;
    }

    global.disableTextSelect = disableTextSelect;


/*
	UNDERSCORE UTILITIES
	Helper utilities based on Underscore Library.
	http://documentcloud.github.com/underscore/underscore.js
*/
  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
/*	function map( obj, iterator, context ) {
		var results = [];
		each( obj, function( value, index, list ) {
			results.push( iterator.call( context, value, index, list ) );
		});
		return results;
	}*/
//	global.map = map;
  
	// Delays a function for the given number of milliseconds, and then calls
	// it with the arguments supplied.
	function delay( func, wait ) {
		var args = slice.call( arguments, 2 );
		return SetTimeout( function(){ return func.apply(func, args); }, wait );
	}
	
	// Defers a function, scheduling it to run after the current call stack has
	// cleared.
	function defer( func ) {
		return delay.apply({}, [func, 1].concat( slice.call(arguments, 1) ));
		// setTimeout( func, 0 );
	}
	global.defer = defer;
	
	// Internal function used to implement throttle() and debounce()
	function limit( func, wait, debounce ) {
		
		var timeout;
		
		return function() {
			
			function throttler() {
				timeout = undefined;
				func.call( this );
			}
				
			if ( debounce ) {
				clearTimeout( timeout );
			}
			
			if ( debounce || ! timeout ) {
				timeout = SetTimeout( throttler, wait );
			}
		};
	}
	
	// Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time.
	function throttle( func, wait ) {
		return limit( func, wait, false );
	}
	global.throttle = throttle;
	
	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds.
	function debounce( func, wait ) {
		return limit( func, wait, true );
	}
	global.debounce = debounce;


/*
    Returns a new function with "this" (ie, the scope) set to a specified argument 

    Parameters

        scope - Sets "this" in the function to the object passed as scope
        fn - The function to set scope for
        args - an optional array of arguments
*/
	function proxy( scope, fn, args ) {
        return (function() {
            ( args ) ? fn.apply( scope, args ) : fn.call( scope );
        });
	}
	global.proxy = proxy;


/*
	Function: Boot.globalEval
	
	Evaluates code in the global scope.
	
	Parameters:
	
		src - The source code to execute.
	 
	Returns:
	
	Boot
	
	Research:
	http://web// logs.java.net/b// log/driscoll/archive/2009/09/08/eval-javascript-global-context
*/
	function globalEval( data ) {
		( window.execScript || function( data ) {
			window[ "eval" ].call( window, data );
		} )( data );
	}
	global.globalEval = globalEval;


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
	global.trim = trim;


/*
	Function: Boot.toQueryString
*/
	function toQueryString( obj, param ) {
		var str = [],
			name,
			encode = encodeURIComponent;

		param = param || "&";

		for ( name in obj ) {
			if ( obj.hasOwnProperty( name ) ) {
				str.push( encode( name ) + "=" + encode( obj[ name ] ) );
			}
		}
		return str.length ? param + str.join("&") : "";
	}
//	global.toQueryString = toQueryString;


/* 
	Function: Boot.parseJSON
	
	Parses a valid JSON string into a JavaScript object. Thanks, jQuery!
	
	Parameters
	
		data - The string of data to parse.
	 
	Returns:
	
	Object - Parsed JSON object.
*/
/*
	Removing because it's too heavy and developers need to be smart.
	var rvalidchars = /^[\],:{}\s]*$/,
		rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
		rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
		rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
*/
	function parseJSON( data ) {
		try {
			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = trim( data );
					
			// Attempt to parse using the native JSON parser first
			if ( JSON && JSON.parse ) {
				return JSON.parse( data );
			}
	
			// Make sure the incoming data is actual JSON
			// // logic borrowed from http://json.org/json2.js
			// *Removing this to decrease weight of the library.
		//	if ( rvalidchars.test( 
		//			data.replace( rvalidescape, "@" )
		//				.replace( rvalidtokens, "]" )
		//				.replace( rvalidbraces, "") ) ) {
		
			return (new Function( "return " + data ))();
	
		//	}
		} catch (e) {
			// This function may raise eyebrows so be sure to 
			// inform developers why it failed.
			if ( window.console ) {
				console.log( "Bad JSON: " + data );
			}
		}
	}
	global.parseJSON = parseJSON;


/*
	Boot.getJSONP
	Simple function for returning JSONP data.
*/	
	var jsonpId = 0;
	function getJSONP( url, callback ) {
		
		var callbackId = "JSONP_" + jsonpId++;
		
		url += "&callback=" + namespace + "." + callbackId;

		global[ callbackId ] = function( data ) {

			// Pass data to the callback.
			callback && callback.call( window, data );
			
			// Cleanup function reference.
			delete global[ callbackId ];
		};
		
		getScript( url );
		
	}
	global.getJSONP = getJSONP;


	// AMD to the MAX
	// Expose our internal utilities through a module definition.
/*	define( namespace.toLowerCase() + ".core", {
		
		now: now,
		log: log,
		
		contains: contains,
		
		is: is,
		isArray: isArray,
		isObject: isObject,
		isElement: isElement,
		isString: isString,
		isBoolean: isBoolean,
		isFunction: isFunction,
		isNumber: isNumber,
		
		each: each,
		extend: extend,
		
	//	options: options, // Meh?

		poll: poll,
		
		ready: ready,
		bind: bind,
		delegate: delegate,
		load: load,

		events: events,
		subscribe: subscribe,
		publish: publish,

		getCSS: getCSS,
		cacheScript: cacheScript,
		getScript: getScript,
		getJS: getJS,
		
		getScript: getScript,
		
		modules: modules,
		define: define,
		require: require,
		widget: widget,
		
		query: query,
		
		attr: attr,
		data: data,
		
		addClass: addClass,
		removeClass: removeClass,
		getStyle: getStyle,
		inlineCSS: inlineCSS,
		
		createHTML: createHTML,
		
		getFont: getFont,
		
		feature: feature,
		
		disableTextSelect: disableTextSelect,
		
//		map: map,
		delay: delay,
		defer: defer,
		limit: limit,
		throttle: throttle,
		debounce: debounce,
		proxy: proxy,
		
		globalEval: globalEval,
		
		trim: trim,
		toQueryString: toQueryString,
		
		parseJSON: parseJSON,
		getJSONP: getJSONP
		
	});
*/
/*
	To Do
	? getJS merge support
	? Remove getJS from Boot library, go AMD pro.
	? Boot.once - Do a callback once only (immediately unbind event).
	? Boot.unbind - Unbind function?
	? Boot.off / Boot.removeEvent - Remove custom event.
	? What should Boot(); do? Extend Boot, or set default params, etc.
	? Add element/string specific event binds.
	? Add event triggers when scripts load, possibly labels? i.e. label: jquery, or autonlabel like "jquery-1-6-2"
*/
	
}("Boot", this));
