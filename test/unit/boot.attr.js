(function(){

module("Boot.attr");

test("Environment", function(){
    ok( window.Boot );
    ok( Boot.attr );
});

var div = document.createElement("div");

test("Get Attribute", function(){
    div.id = "test";
    equal( Boot.attr( div, "id" ), "test" );
});

test("Set Attribute", function(){
    Boot.attr( div, "id", "test-attr" );
    equal( Boot.attr( div, "id" ), "test-attr" );
});

test("Set Style Attribute", function(){
    Boot.attr( div, "style", "border: red 1px solid" );
    equal( div.style.border, "red 1px solid" );
});

})();
