(function(){
  
module("Boot.inlineCSS");

test( "Environment", function(){
  ok( Boot.inlineCSS, "Boot.inlineCSS exists." );
});

test( "Inline &lt;style&gt; block inserted.", function(){
  Boot.inlineCSS(".inlinecss { width: 1px }");
  ok( true );
});

var testDiv = document.createElement("div"),
    headElem = document.getElementsByTagName("head")[0],
    computedStyle;

testDiv.className = "inlinecss";

headElem.appendChild( testDiv );

// Computed style
if ( typeof testDiv.currentStyle !== "undefined" ) {
  computedStyle = testDiv.currentStyle;
} else {
  computedStyle = document.defaultView.getComputedStyle( testDiv, null );
}

test("Style applied successfully.", function(){
  equal( computedStyle[ "width" ], "1px" );
});

// Clean up testDiv
setTimeout(function(){
  headElem.removeChild( testDiv );
}, 1000);

})();
