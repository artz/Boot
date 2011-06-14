
(function(B, document, undefined){
	
	var scripts = document.getElementsByTagName("script"),
		
		// Localize library functions (compression).
		attr = B.attr,
		contains = B.contains,
		
		// Poll the DOM to see if there are more scripts
		// since the last time we checked.
		pollScripts = setInterval( checkScripts, 100 ),
		
		scriptPointer = 0,
		scriptLength = 0;
	
	function registerScript( script ) {

		var scriptType = script.type,
			scriptSrc,
			scriptText,
			scriptObject;
			
		// If this script is using an Easync type.
		if ( contains( scriptType, "async" ) || contains( scriptType, "cache" ) ) {
			
			scriptSrc = attr(script, "data-src");
			scriptText = script.innerHTML;
			scriptObject = {
				src: scriptSrc,
				defer: attr(script, "data-defer"),
				type: scriptType,
				text: scriptText,
				delay: attr(script, "data-delay")
			};
					
			// This is an inline script and needs 
			// to be handled differently.
			if ( ! scriptSrc && scriptText ) {
				
				// Reset the script text.
				scriptObject.text = undefined;
				
				// Add a custom callback.
				scriptObject.callback = function(){
					// Globally evaluate the contents of the inline script.
					B.globalEval( scriptText );						
				}	
			}
			
			B.getJS( scriptObject );
		}
		
	}
	
	function checkScripts() {
		
		if ( scripts.length !== scriptLength ) {
			
			// Set the new length.
			scriptLength = scripts.length;
			
			// Loop through the new scripts and add to getJS.
		//	B.log("Checking scripts.");
			for (; scriptPointer < scriptLength; scriptPointer++ ) {
				registerScript( scripts[ scriptPointer ] );
			}
		}
	}
	
	// Start checking scripts.
	checkScripts();
	
	// Once the DOM is ready we no longer need to check scripts.
	B.ready(function(){
		clearInterval( pollScripts );
	//	B.log("<b>DOM Ready Hook:</b> Checking scripts");
		checkScripts();
	});
	
})(Boot, document);

// Boot.log("Easync library loaded.");