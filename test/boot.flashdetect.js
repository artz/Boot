(function(global, navigator, undefined){

if ( ! window[global] ) {
    window[global] = {}
}

var navigatorPlugins = navigator.plugins,
    playerVersion,
    flash,
    flashDesc,
    flashMimeType = "application/x-shockwave-flash",
    ParseInt = parseInt; // Compiler optimization.

window[global].flashDetect = function( minVersion ) {

    if ( ! playerVersion ) {

        playerVersion = [];

        if ( navigatorPlugins && (flash = navigatorPlugins[ "Shockwave Flash" ]) ) {

            flashDesc = flash.description;

            // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin
            // indicates whether plug-ins are enabled or disabled in Safari 3+
            if ( flashDesc &&
                ( navigator.mimeTypes &&
                    navigator.mimeTypes[ flashMimeType ] &&
                    navigator.mimeTypes[ flashMimeType ].enabledPlugin ) ) {

                flashDesc = flashDesc.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                playerVersion = [
                    ParseInt(flashDesc.replace(/^(.*)\..*$/, "$1"), 10),
                    ParseInt(flashDesc.replace(/^.*\.(.*)\s.*$/, "$1"), 10),
                    /[a-zA-Z]/.test(flashDesc) ?
                        ParseInt(flashDesc.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
                ]
            }

        } else if ( window.ActiveXObject ) {
            try {
                flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                if ( flash ) {
                    flashDesc = flash.GetVariable("$version");
                    if (flashDesc) {
                        flashDesc = flashDesc.split(" ")[1].split(",");
                        playerVersion = [
                            ParseInt( flashDesc[0], 10 ),
                            ParseInt( flashDesc[1], 10 ),
                            ParseInt( flashDesc[2], 10 )
                        ];
                    }
                }
            } catch(e) {};
        }
    }

    return playerVersion;
}

})("Boot", navigator);
