(function(){
  
module("Boot.setup");

function BootSetupTestMethod () {
  return true;
}

test( "Create test method for unit test.", function(){
  equal( BootSetupTestMethod(), true, "BootSetupTestMethod() returned correct value." );
});

test( "Run the Boot.setup method with a default option.", function(){
  deepEqual( Boot.setup( BootSetupTestMethod, { foo: true } ), Boot, "Setup applied successfully." ); 
});

test( "Retrieve option.", function(){
  equal( BootSetupTestMethod.option("foo"), true );
});

test( "Set new option.", function(){
  BootSetupTestMethod.option("bar", true);
  equal( BootSetupTestMethod.option("bar"), true );
});

test( "Update an option.", function(){
  BootSetupTestMethod.option("bar", false);
  strictEqual( BootSetupTestMethod.option("bar"), false );
});

test( "Extend all options.", function(){
  BootSetupTestMethod.option({ "baz": true, "bar": true });
  strictEqual( BootSetupTestMethod.option("baz"), true );
  strictEqual( BootSetupTestMethod.option("bar"), true );
});

})();
