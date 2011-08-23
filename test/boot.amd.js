/*
	Figuring out how small we can make an AMD loader.
*/
!function( namespace, window, undefined ) {
	
	var global = window[ namespace ] || ( window[ namespace ] = {} ),
	
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
		strComplete = "complete";

/*
	Function: Boot.now
	
	Gets a current timestamp.
	
	Returns:
	
	Timestamp
*/
	function now() {
		return new Date().getTime();
	}


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
	Function: Boot.isArray
	
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
	
	function isObject( obj ) {
		return is( obj, strObject );
	}
	global.isObject = isObject;
	
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
					if ( isObject( source[name] ) && ! source[name].nodeType ) {
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
	Boot.options
*/
	var bootOptions = {};
	function options( customOptions, value ) {
		if ( isString( customOptions ) ) {
			extend( bootOptions[ customOptions ], value );
		} else {
			extend( bootOptions, customOptions );
		}
	}
	global.options = options;

/*
	Function: Boot.log
	
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
	Loads a script node into the DOM. Note this is different than Boot.getJS, which
	has full functionality for dealing with script dependencies and preserving
	execution order across browsers.
	
	Parameters:
	
		src - The script to load.
		callback - The function to invoke after the script has loaded.
 
*/
		
	var // Script collection on the page.
		scripts = document.getElementsByTagName( strScript ),

		// The first script on the page.
		firstScript = scripts[0],
		firstScriptParent = firstScript.parentNode;

	function getScript ( src, callback ) { 
	
		var	script = document.createElement( strScript ),
			done = 0;
	
		// Set the source of the script.
		script.src = src;
		
		// This makes good browsers behave like 
		// bad browsers, for consistency.
		script.async = true;
		
		// Attach handlers for all browsers
		script[ strOnLoad ] = script[ strOnReadyStateChange ] = function(){
	
			if ( !done && (!script[ strReadyState ] || 
					script[ strReadyState ] === "loaded" || script[ strReadyState ] === strComplete) ) {

				done = 1;
				
				// Emit an event indicating this script has finished.
			//	emit( src );
			//	setTimeout(function(){
				callback && callback( src ); 
			//	}, 0 );
				
				// Handle memory leak in IE
				script[ strOnLoad ] = script[ strOnReadyStateChange ] = null;
			
				// Removed for weight reasons.  Uncomment if this 
				// causes undue harm to the DOM.
			//	firstScriptParent.removeChild( script );

			}
		};
		
		// This is the safest insertion point to assume.
		// We use a setTimeout to ensure non-blocking behavior.

		firstScriptParent.insertBefore( script, firstScript );

	}
	global.getScript = getScript;
	


/*
	Function: Boot.on
	
	Subscribes to an event, fires a callback once it is emitted.
	http://en.wikipedia.org/wiki/Publish/subscribe
	
	Parameters:
	
	event
	callback
*/
	var events = {};
	function on( object, event, callback ){
	
		if ( isString( object ) ) {
			callback = event;
			event = object;
			object = undefined;
		}
		
		var eventQueue = events[ event ] || ( events[ event ] = [] );

		eventQueue.push( [ object, callback ] );
		
	}
	global.on = on;

/*
	Function: Boot.emit
	
	Publishes an event, passing an optional object of data.
	Triggers any events attached to the event.
	http://en.wikipedia.org/wiki/Publish/subscribe
	
	Parameters:
		- event
		- data
		
	Returns:
	
	Boot

*/
	function emit( object, event, data ){
		
		// Support for associating events with DOM nodes.
		if ( isString( object ) ) {
			data = event;			
			event = object;
			object = undefined;
		}
		
		var eventQueue = events[ event ];
		
		if ( eventQueue ) {
			
			each( eventQueue, function( on, i ){
				
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
	global.emit = emit;

/*
	Boot.resolve
	Utility for resolving URL addresses.
	TBD on how we want this API to work if 
	we expose it externally and further internally.
	possibly make resolveJS, resolveCSS, resolveFont?
*/
	bootOptions.resolve = {
		basePath: "",
		filename: function(str){ return str.toLowerCase(); },
		suffix: ".min.js"
	};
	
	function resolve( customOptions, module ) {
		var options = extend( {}, bootOptions.resolve, customOptions || {} );
		return options.basePath + options.filename( module ) + options.suffix;
	}

/*
	Boot.define
	Define a module, based on the Asynchronous Module Definition (AMD)
	http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
*/
	var modules = {},
		moduleDefinitions = {},
		definedModules = [];
	
	function define( moduleName, moduleDependencies, moduleDefinition ) {
		
//		Boot.log("Defining a module!");
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

//			Boot.log("Loading module dependencies for <b>" + "?" + "</b>: " + moduleDependencies.join(", "));

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

/*
	Boot.use
	Based on YUI's use() function and RequireJS.
*/	
	// Resolves an object.
	function getLibrary( moduleName ) {
		// i.e. "jQuery.alpha", "MyLib.foo.bar"
		var obj = window;

		each( moduleName.split("."), function( name ) {
			if ( obj.hasOwnProperty( name ) ) {
				obj = obj[ name ];
			}
		});
	
		return obj;
	}
	
	bootOptions.use = {};
	function use( customOptions, moduleNames, callback ) {
		
		// Normalize parameters.
		if ( isArray( customOptions ) || isString( customOptions ) ) {
			callback = moduleNames;
			moduleNames = customOptions;
		}
		
		// Make moduleNames an array.
		moduleNames = isString( moduleNames ) ? [ moduleNames ] : moduleNames;
		
		var options = extend( {}, bootOptions.use, customOptions || {} ),
			callbackArgs = [],
			moduleCount = 0;
			
		function moduleReady( i, moduleName, module ) {
			
			if ( module ) {
				modules[ moduleName ] = module;
			}
			
			callbackArgs[i] = modules[ moduleName ];
			
//			Boot.log("<b>" + moduleName + "</b> ready! " + ( i + 1 ) + " of " + moduleNames.length);
			if ( ++moduleCount === moduleNames.length ) {

//				Boot.log("All clear! Time to fire callback.");
				callback.apply( callbackArgs, callbackArgs );
			}
			
			if ( module ) {
				emit( moduleName );
			}
		}

		each( moduleNames, function( moduleName, i ) {

			var module,
				moduleDependencies,
				moduleDefinition;

//			Boot.log( "Inside use, using " + moduleName );

			// If this module has already been defined, use it.
			if ( moduleName in modules ) {
				
				// Check for the object.
				if ( modules[ moduleName ] ){
//					Boot.log("Module <b>" + moduleName + "</b> is already defined.");
					moduleReady( i, moduleName ); // callbackArgs[i] = module;
				// It's undefined, so wait a little bit.
				} else {
//					Boot.log("Module <b>" + moduleName + "</b> is in the process of being defined. Queue time!");
					on( moduleName, function(){
//						Boot.log("Module <b>" + moduleName + "</b> is now defined! Assigning to callback argument.");
						moduleReady( i, moduleName );
					});
				}
				
			// Otherwise we'll need to load and define on the fly,
			// all the whilest managing dependencies.	
			} else {
				
				// Temporarily give this guy something so incoming 
				// module requests wait until the event is emmitted.
				modules[ moduleName ] = undefined;
//				Boot.log("Calling getScript: " + moduleName );
				getScript( resolve( options, moduleName ), function( src ) {

//					Boot.log("Done loading script for <b>" + moduleName + "</b>.");
					// Boot.log( "Defined modules: " + definedModules.length );
					// If a module was defined after our download.
//					Boot.log( "Finished: " + src );

					var module,
						moduleDependencies,
						moduleDefinition;
					
					// If a module was defined after our download.
					if ( moduleDefinition = moduleDefinitions[ moduleName ] || definedModules.shift() ) {
					
						if ( moduleDependencies = moduleDefinition.d ) {

//							Boot.log("<b>" + moduleName + "</b> has a dependency: " + moduleDefinition.d.join(", ") );

							use( moduleDependencies, function(){
//								Boot.log( "Dependencies loaded (" + moduleDefinition.d.join(", ") + "). <b>" + moduleName + "</b> is ready." );
								module = isFunction( moduleDefinition ) ? moduleDefinition.apply( global, arguments ) : moduleDefinition;
								moduleReady( i, moduleName, module );
							});

						} else {
							
							module = isFunction( moduleDefinition ) ? moduleDefinition() : moduleDefinition;
							moduleReady( i, moduleName, module );

//							Boot.log("<b>" + moduleName + "</b> loaded! " + !!module);
						}

					// Otherwise see if we can snag the module by name (old skool).	
					} else {
						moduleReady( i, moduleName, getLibrary( moduleName )  );
					}
					
				});
			}
			
		});
		
	}
	global.use = use;
	
}("Boot", this);