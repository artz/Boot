// This file loads a couple other JS files.
Boot.log("Loading 2 scripts!");
getScript("javascript.php?num=2", function(){ Boot.log("Loaded synchronicity script #2"); });
getScript("javascript.php?num=3", function(){ Boot.log("Loaded synchronicity script #3"); });