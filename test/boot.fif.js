/*
Friendly IFrame
authors: Dave Artz, Will Alexander
Boot.fif( url, width, height, parent )

    Parameters:
        url -- a javascript url which will load the ad, e.g. doubleclick url
        width -- the width of the ad in pixels
        height -- the height of the ad in pixels
        parent -- the parent element or id (string) to which the iframe element will be appended
        callback -- the function to execute once iframe has loaded

    Returns:
        The IFRAME element added to the DOM in the parent element.

    Description:
        Will create a dynamic iframe which loads the script specified by *url*
        When the iframe completes loading its resources, it will call the
        parent function adLoadHandler, passing it the iframe element
*/

(function(global, window, document, undefined){

    // HTML template used inside the <iframe>.
    // Note: Code optimized for shortest length possible while maintaining
    //       a valid HTML5 document compatable across browsers.
    var htmlTemplate = [
            "<!DOCTYPE html><html>",
            "<script>inDapIF=!0</script>", // This lets ads know they are inside a friendly <iframe>.
            document.domain !== location.hostname ? // Make the <iframe> friendly.
                "<script>try{document.domain=\"" + document.domain + "\"}catch(e){}</script>" : "",
            "<script src=\"",
            undefined, // Index 4
            "\"></script>" ];

    function fif( adUrl, width, height, parent, callback ) {

        var iframe = document.createElement("iframe"),
            iframeStyle = iframe.style,
            parentElem = typeof parent === "string" ? document.getElementById(parent) : parent,
            html = htmlTemplate.slice(0); // Return a copy of the template array.

        // Set to specified width and height.
        iframe.height = height;
        iframe.width = width;

        // Ensure <iframe> has no surrounding space or internal margins.
        iframe.frameBorder = 0;
        iframe.vSpace = 0;
        iframe.hSpace = 0;
        iframe.marginHeight = 0;
        iframe.marginWidth = 0;
        iframe.scrolling = "no";
        iframeStyle.display = "block";
        iframeStyle.border = 0;
        iframeStyle.margin = 0;
        iframeStyle.padding = 0;

        // Update template ad script source.
        html[4] = adUrl;

        // Append iframe to parent container.
        parentElem.appendChild( iframe );

        // Set the <iframe> contents to the HTML Template using the JavaScript protocol.
        // Note: IE has a character limit of 2048; ensure ad URL is under limit.
        // http://dev.w3.org/html5/spec/Overview.html#javascript-protocol
        // More info: ,
        //     http://bit.ly/yJSaCb
        //     http://javascript.info/tutorial/frames-and-iframes
        // Something to watch out for:
        //     http://bit.ly/AphK3M
        iframe.src = "javascript:'" + html.join("") + "';";

        // If a callback was specified, add event listener.
        if ( callback ) {
            iframe.onload = iframe.onreadystatechange = function(){

                var iframe = this;

                if ( ! iframe.readyState || /loaded|complete/.test( iframe.readyState ) ) {
                    iframe.onload = iframe.onreadystatechange = null;
                    callback( iframe );
                }
            };
        }

        return iframe;
    }

    if ( ! window[ global ] ) {
        window[ global ] = {};
    }
    window[ global ].fif = fif;

})("Boot", this, document);
