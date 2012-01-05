(function(){

test("Environment", function(){
    ok("getFont");
});

test( "Set Font Options (Path)", function(){
  getFont.option({ path: "../../test/fonts/{f}/{f}-webfont", timeout: 1000 });
  equal( getFont.option("path"), "../../test/fonts/{f}/{f}-webfont" );
});

test("Get Fonts", function(){
    getFont("Chewy", "SpecialElite", "NotThere");
});

})();
