<?php

/**
 *  Parse query string for requested merge files
 */
$files = explode('&', $_SERVER['QUERY_STRING']);

/**
 * Extract file paths
 */
foreach ($files as $index => $file) {
	$filename = explode('=', $file);	
	$filename = preg_replace('{/techcrunch/(js|css)}','',$filename[1]);
	
	$prefix = $path = $filepath = '';
	switch (pathinfo($filename, PATHINFO_EXTENSION)) {
		case 'js':
			header('Content-Type: application/x-javascript');
			$prefix = 'js';
			break;
		case 'css':
			header('Content-Type: text/css');
			$prefix = 'styles';
			break;
		default:
			break;
	}

	$filepath = $prefix . $filename;
	if (!file_exists($filepath)) {		
		echo "/** $filename not found **/\n";
		continue;
	}	
	
	$output = @file_get_contents($filepath);
	echo  "/** $filename start **/\n$output\n/** $filename end **/\n";
}