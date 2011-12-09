(function(){
  
module("Boot.getFont");

test( "Environment", function(){
  ok( Boot.getFont, "Boot.getFont exists." );
});

test( "Set Font Options (Path)", function(){
  Boot.getFont.option({ path: "../test/fonts/{f}/{f}-webfont", timeout: 1000 });
  equal( Boot.getFont.option("path"), "../test/fonts/{f}/{f}-webfont" );
});

asyncTest( "Both font active events published.", function(){
  
  var count = 0;
  Boot.subscribe( "boot.wf-chewy-active", function(){
    count++;
    if ( count === 2 ) {
      ok( true );
      start();
    }
  });

  Boot.subscribe( "boot.wf-specialelite-active", function(){
    count++;
    if ( count === 2 ) {
      ok( true );
      start();
    }
  });

  Boot.getFont("Chewy", "SpecialElite", "NotThere");

});

asyncTest( "getFont inactive event published.", function(){

  Boot.subscribe( "boot.wf-notthere-inactive", function(){
    ok( true, "Font #3 (inactive) callback executed after timeout." );
    start();
  });
  
});

})();
