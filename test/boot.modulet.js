
(function(B, document, defaultOptions, undefined){
	
	var modules = document.getElementsByTagName("section"),
		
		// Localize Boot library functions (compression).
		attr = B.attr,
		each = B.each,
		extend = B.extend,
		
		// Poll the DOM to see if there are more scripts
		// since the last time we checked.
		pollModules = setInterval( checkModules, 100 ),
		
		modulePointer = 0,
		moduleLength = 0;
	
/*
	Boot.module

	Loads in a module JS and CSS dependencies on the fly 
	and initializes the library when complete.
	
	Parameters:
	
	options - One more more objects containing config parameters.
		elem - Optional element to initialize library.
		js - String of JS files to load in on the fly.
		css - String of CSS files separated by commas to load in on the fly.
		lib - Optional library override to initialize the name.
		name - Optional name of function to initialize.
		init - false (don't initialize) or the name of the function to call to initialize.  Default is ".init( options )"
		options - Optional configuration object to pass into the function when initializing.
		merge - true or false, merges JS and CSS into a single request.
	
	Notes:
	
	You can merge JS files across multiple modules together by using 
	Boot.module( options, options, options ) and ensuring merge is set
	to true in all modules.  This can be enabled globally using the 
	configuration object at the bottom of Boot.module or by calling
	Boot.module.init().
*/
	function module() {
	
		var args = arguments,
			jsFiles = [],
			cssFiles = [];
		
		each( args, function(i){
			

/*			
			var customOptions = args[i],
				elem = customOptions.elem,
				js = customOptions.js,
				css = customOptions.css,
				lib = customOptions.lib,
				name = customOptions.name,
				init = customOptions.init,
				moduleOptions = customOptions.options;
	*/			
			var customOptions = args[i],
				elem = customOptions.elem,
				js = customOptions.js,
				css = customOptions.css,
				lib = customOptions.lib || defaultOptions.lib,
				name = customOptions.name || defaultOptions.name,
				
				options = extend( defaultOptions, customOptions );
			
			console.log( options );
			
			
/*
CDN: "../examples/", //"http://o.aolcdn.com/os/",
	mergeCDN: "", // "http://o.aolcdn.com/os_merge/",
	mergeDelim: "&file=", //"&file=",
	jsPath: "cdn/",
	cssPath: "cdn/",
	library: "Boot",
	initFunction: "init",
	classPrefix: "module",
	loadingClass: "loading",
	doneClass: "done",
	moduleTag: "section"
});
			*/
		});
		
		return B;
	}
	B.module = module;
	
	function registerModule( moduleElem ) {
		
		var moduleName = attr( moduleElem, "data-name" ),
			moduleJS,
			moduleOptions,
			moduleLibrary,
			moduleLibraryName;
		
		if ( moduleName ) {
			
			B.log("boot.modulet.js (registerModule): Registering module: " + moduleName );
			
			moduleJS = attr( moduleElem, "data-js" );
			moduleOptions = B.parseJSON( attr( moduleElem, "data-options" ) );
			moduleLibrary = attr( moduleElem, "data-library" );
			moduleLibraryName = moduleName.charAt(0).toUpperCase() + moduleName.substr(1); // Capitalize the module name.

			moduleElem.className += defaultOptions.prefixClass + "-" + defaultOptions.loadingClass;
			
			module({
				elem: moduleElem,
				js: moduleJS,
				options: moduleOptions				
			});
		}
	}
	
	function checkModules() {
		
		B.log("Checking modules.");
		if ( modules.length !== moduleLength ) {
			
			// Set the new length.
			moduleLength = modules.length;
			B.log("Registering modules.");
			// Loop through the new scripts and add to getJS.
			for (; modulePointer < moduleLength; modulePointer++ ) {
				registerModule( modules[ modulePointer ] );
			}
		}
	}
	
	// Start checking scripts.
	checkModules();
	
	// Once the DOM is ready we no longer need to check scripts.
	B.ready(function(){
		clearInterval( pollModules );
		B.log("<b>DOM Ready Hook:</b> Checking modules one last time.");
		checkModules();
	});
	
})(Boot, document, {
	CDN: "../examples/", //"http://o.aolcdn.com/os/",
	mergeCDN: "", // "http://o.aolcdn.com/os_merge/",
	mergeDelim: "&file=", //"&file=",
	jsPath: "cdn/",
	cssPath: "cdn/",
	library: "Boot",
	initFunction: "init",
	prefixClass: "module",
	loadingClass: "loading",
	doneClass: "done",
	moduleTag: "section"
});

Boot.log("ModuleT loaded.");