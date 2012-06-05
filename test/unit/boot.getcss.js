/*global document, window, setTimeout, clearTimeout, module, test, asyncTest, ok, equal, start, Boot*/
(function () {

    "use strict";

    module("Boot.getCSS");

    test("Environment", function () {
        ok(window.Boot, 'Boot is defined.');
        ok(window.Boot.getCSS, 'Boot.getCSS is defined.');
    });

    asyncTest("Load a single stylesheet.", function () {
        Boot.getCSS("css/css1.css");
        ok(true);
        start();
    });

    asyncTest("Load a stylesheet and execute callback.", function () {
        Boot.getCSS("css/css2.css", function () {
            ok(true);
            start();
        });
    });

    asyncTest("Load the same stylesheet and only execute callback.", function () {
        Boot.getCSS("css/css2.css", function () {
            ok(true);
            start();
        });
    });
}());
