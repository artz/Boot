module("Boot.require");

test("Environment", function(){
	ok( window.Boot, 'Boot is defined.' );
	ok( window.Boot.require, 'Boot.require is defined.' );
	ok( window.Boot.define, 'Boot.define is defined.' );
});

test("Define Module by Object Literal", function(){
	Boot.define( "my.module1", { success: true } );
  Boot.require( "my.module1", function( myModule ) {
		ok( myModule, "Module Object was passed." );
		ok( myModule.success, "Correct Module Object was passed." );
	});
});

test("Define Module by Function", function(){
	Boot.define( "my.module2", function(){ return { success: true } } );
	Boot.require( "my.module2", function( myModule ) {
		ok( myModule, "Module Object was passed." );
		ok( myModule.success, "Correct Module Object was passed." );
	});
});

asyncTest("Require Relative JavaScript Resource", function(){
	Boot.require("js/somelib.js", function(){
		ok( window.SomeLib, "Resolve a relative JavaScript resource." );
		start();
	});
});

asyncTest("Require Absolute JavaScript Resource", function(){

	Boot.require("http://www.artzstudio.com/files/Boot/src/boot.js", function(){
		ok( window.Boot, "Resolve an external JavaScript resource." );
    start();
	});
	
//setTimeout(function(){
//	start();
//}, 500);
	
});

test("Set Options", function(){
  // Yeah this needs work bro.
	// Change global default for require & define functions.
  // Boot.options( "require", { "basePath": "js/" } );
//  Boot.require.option("basePath", "js/");
//  Boot.option("require.basePath", "js/");
  // This should be: Boot.require.option("basePath", "js/"), yes yes?	
//	strictEqual( Boot.require.option("basePath"), "js/", "basePath set correctly." );
	
});
/*
asyncTest("Require Single Defined Module", function(){
	
	$.require("jquery.alpha", function( jQuery ){
		var $testDiv = $("<div></div>");
		same( arguments.length, 1, "One argument passed.");
		same( jQuery({}).jquery, "1.6.4", "jQuery object passed." );
		same( $testDiv.alpha().html(), "Alpha", "jQuery plugin loaded successfully." );
		start();
	});

});

asyncTest("Require a Previously Defined Module", function(){
	
	$.require("jquery.alpha", function( jQuery ){
		var $testDiv = $("<div></div>");
		same( arguments.length, 1, "One argument passed.");
		same( jQuery({}).jquery, "1.6.4", "Queued jQuery object passed." );
		same( $testDiv.alpha().html(), "Alpha", "Queued require works." );
		start();
	});
	
});

asyncTest("Require Multiple Defined Modules", function(){
	
	$.require(["jquery.gamma", "jquery.delta"], function( jQuery ){
		var $testDiv = $("<div></div>");
		same( arguments.length, 2, "Two arguments passed." );
		same( jQuery({}).jquery, "1.6.4", "jQuery object passed." );
		same( $testDiv.delta().html(), "Delta", "Delta plugin loaded successfully." );
		same( $testDiv.gamma().html(), "Gamma", "Gamma plugin loaded successfully." );
		start();
	});

});

asyncTest("Require Defined Module With Dependency", function(){
	
	$.require({ basePath: "js/" }, "jquery.beta", function( jQuery ){
		var $testDiv = $("<div></div>");
		same( arguments.length, 1, "One argument passed." );
		same( jQuery({}).jquery, "1.6.4", "jQuery object passed." );
		same( $testDiv.beta().html().toLowerCase(), "Beta <b>Epsilon</b>".toLowerCase(), "Beta plugin loaded successfully." );
		same( $testDiv.epsilon().html(), "Epsilon", "Epsilon plugin dependency loaded successfully." );
		start();
	});

});

asyncTest("Require Multiple Defined Modules With Multiple Dependencies", function(){
	
	$.require({ basePath: "js/" }, ["jquery.beta", "jquery.zeta"], function( jQuery ){
		var $testDiv = $("<div></div>");
		same( arguments.length, 2, "Two arguments passed." );
		same( jQuery({}).jquery, "1.6.4", "jQuery object passed." );
		same( $testDiv.beta().html().toLowerCase(), "Beta <b>Epsilon</b>".toLowerCase(), "Beta plugin loaded successfully." );
		same( $testDiv.epsilon().html(), "Epsilon", "Epsilon plugin dependency loaded successfully." );
		same( $testDiv.zeta().html().toLowerCase(), "Zeta <b>Theta <i>Lambda</i></b>".toLowerCase(), "Zeta, Theta and Lambda plugins loaded successfully." );
		start();
	});

});

asyncTest("Require Classic jQuery Plugin", function(){
	
	$.require({ basePath: "js/" }, "jquery.classic", function(){
		var $testDiv = $("<div></div>");
		same( arguments.length, 1, "One argument passed." );
		same( jQuery({}).jquery, "1.6.4", "jQuery object passed." );
		same( $testDiv.classic().html(), "Classic", "Classic plugin loaded successfully." );
		start();
	});
	
});

asyncTest("Require Single AMD Library", function(){
	
	$.require("yourlib/bar", function( yourLibBar ) {
		same( yourLibBar.bar && yourLibBar.bar(), true, "Module passed successfully." );
		start();
	});
	
});

asyncTest("Require Single AMD Library With Multiple Dependencies", function(){
	
	$.require(["yourlib/foo"], function( yourLibFoo ) {
		same( yourLibFoo.foo, true, "Foo module loaded." );
		same( yourLibFoo.bar && yourLibFoo.bar(), true, "Bar module dependency loaded." );
		same( yourLibFoo.baz, true, "Baz module dependency loaded." );
		start();
	});

});

asyncTest("Require Multiple Pre-defined AMD Libraries", function(){
	
	$.require(["yourlib/foo", "mylib/foo"], function( yourLibFoo, myLibFoo ) {
		same( myLibFoo.foo, true, "MyLib Foo module passed.");
		same( yourLibFoo.foo, true, "YourLib Foo module passed.");
		same( yourLibFoo.bar(), true, "YourLib Bar module passed.");
		same( yourLibFoo.baz, true, "YourLib Baz module passed.");
		start();
	});
	
});

asyncTest("Customized Filename", function(){
	
	$.require({ basePath: "js/", filename: function(name){ return name.replace("/", "."); }, suffix: ".js" }, "custom/name", function( custom ){
		same( custom.custom, true, "Customized filename works!");
		start();
	});
	
});
*/
