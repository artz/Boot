(function(){

test("Environment", function(){
    ok( Boot );
    ok( Boot.getFont );
});

test( "Set Font Options (Path)", function(){
  Boot.getFont.option({ path: "../../test/fonts/{f}/{f}-webfont", timeout: 1000 });
  equal( Boot.getFont.option("path"), "../../test/fonts/{f}/{f}-webfont" );
});

asyncTest("Get Fonts", function(){
    function go(){
        ok("All fonts loaded.");
        start();
    }
    var count = 0;
    Boot.getFont("Chewy", "SpecialElite", "NotThere", function(){
        if ( ++count === 3 ) {
            go();
        }
    });
});

})();
