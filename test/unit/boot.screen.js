(function(){

module("Boot Screen Detection");

test("Environment", function(){
    ok( window.Boot );
});

//  test("Screen update event", function(){
//      Boot.subscribe("boot.screen-update", function(data){
//          ok( data.screens );
//          ok( data.width );
//      });
//  });

test("Screen class names", function(){
    equal( document.documentElement.className.indexOf("gt-320") > -1, true );
});

})();
