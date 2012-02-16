(function(){

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

  Boot.require("http://o.aolcdn.com/os/aol/jquery-1.6.2.min.js", function(){
        ok( window.jQuery, "Resolve an external JavaScript resource." );
    clearTimeout(timer);
    start();
    });

  var timer = setTimeout(function(){
      start();
  }, 500);

});

test("Set Options", function(){
    // Change global default for require & define functions.
  Boot.require.option("basePath", "js/");
  // This should be: Boot.require.option("basePath", "js/"), yes yes?
    equal( Boot.require.option("basePath"), "js/", "basePath set correctly." );
});

asyncTest("Require Single Defined Module (Object Literal)", function(){

    Boot.require("mylib/foo", function( myLibFoo ){
        equal( myLibFoo.foo, true );
    start();
    });

});

asyncTest("Require Single Defined Module (Function)", function(){

    Boot.require("mylib/bar", function( myLibBar ){
        equal( myLibBar.bar(), true );
    start();
    });

});

asyncTest("Require a Previously Defined Module", function(){

    Boot.require("mylib/foo", function( myLibFoo ){
        equal( myLibFoo.foo, true );
    start();
    });

});

asyncTest("Require Multiple Defined Modules", function(){

  Boot.require(["mylib/foo", "mylib/bar"], function( myLibFoo, myLibBar ) {
      equal( myLibFoo.foo, true );
    equal( myLibBar.bar(), true );
    start();
  });

});

asyncTest("Require Defined Module With Dependency", function(){

    Boot.require( "mylib/baz", function( myLibBaz ){
    equal( myLibBaz.baz, true );
        start();
    });

});

asyncTest("Require Multiple Defined Modules With Multiple Dependencies", function(){

  Boot.require(["mylib/foo", "yourlib/foo"], function( myLibFoo, yourLibFoo ) {
    equal( myLibFoo.foo, true );
    equal( yourLibFoo.foo, true );
    equal( yourLibFoo.bar, true );
    equal( yourLibFoo.baz, true );
    start();
  });

});


asyncTest("Customized Filename", function(){

    Boot.require({ filename: function(name){ return name.replace("/", "."); }, suffix: ".js" }, "custom/name", function( custom ){
        equal( custom.custom, true, "Customized filename works!");
        start();
    });

});

asyncTest("Merged JS require.", function(){

  Boot.require({ merge: true }, ["merge/foo", "merge/bar"], function( mergeFoo, mergeBar ) {
    equal( mergeFoo.foo, true );
    equal( mergeBar.bar, true );
    start();
  });

});


})();
