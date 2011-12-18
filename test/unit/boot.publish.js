(function(){

module("Boot.publish");

test("Environment", function(){
    ok( window.Boot );
    ok( Boot.publish );
    ok( Boot.subscribe );
});

test("Subscribe", function(){
    Boot.subscribe("test-event", function( data ) {
        equal( data.foo, 1 );
        equal( this.bar, 2 );
    });
    Boot.publish("test-event", { foo: 1, bar: 2 });
});

test("Element Subscription", function(){
    var div = document.createElement("div");
    div.className = "observe";
    Boot.subscribe(div, "test-element-event", function( data ) {
        equal( this.className, "observe" );
        equal( data.foo, 3 );
    });
    Boot.publish(div, "test-element-event", { foo: 3 });
});
})();
