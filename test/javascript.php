<?php

$expires_offset = 31536000;

// Had to comment these out to ensure IE caches the script.
// header('Content-Type: application/x-javascript; charset=UTF-8');
// header('Vary: Accept-Encoding'); // Handle proxies
header('Expires: ' . gmdate( "D, d M Y H:i:s", time() + $expires_offset ) . ' GMT');
header("Cache-Control: public, max-age=$expires_offset");

$sleep = 1;
if ( isset($_GET['sleep']) ) {
	$sleep = $_GET['sleep'];
}
sleep($sleep);
?>
window.console && console.log("Executed Script #" + <?=$_GET['num']?>);
window.Boot && Boot.log("Executed Script #" + <?=$_GET['num']?>);
window.Module<?=$_GET['num']?> = {};