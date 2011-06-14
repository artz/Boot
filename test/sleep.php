<?php
$sleep = 1;
if ( isset($_GET['sleep']) ) {
	$sleep = $_GET['sleep'];
}
sleep($sleep);