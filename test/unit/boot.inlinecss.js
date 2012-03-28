(function(){

module("Boot.inlineCSS");

test( "Environment", function(){
    ok( Boot.inlineCSS, "Boot.inlineCSS exists." );
});

test( "Inline &lt;style&gt; block inserted.", function(){
    Boot.inlineCSS(".inlinecss { width: 1px }");
    ok( true );
});

test("Style applied successfully.", function(){

    var testDiv = document.createElement("div"),
        computedStyle;

    Boot.inlineCSS(".inlinecss { width: 1px }");

    document.body.appendChild( testDiv );
    testDiv.className = "inlinecss";

    // Computed style
    if ( typeof testDiv.currentStyle !== "undefined" ) {
        computedStyle = testDiv.currentStyle;
    } else {
        computedStyle = document.defaultView.getComputedStyle( testDiv, null );
    }

    equal( computedStyle[ "width" ], "1px" );
});

})();
