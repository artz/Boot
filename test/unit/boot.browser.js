/*jslint browser: true */
/*global Boot, test, ok, equal */
(function () {

    "use strict";

    test("Environment", function () {
        ok(window.Boot);
        ok(window.Boot.browser, Boot.param(Boot.browser));
        ok(document.documentElement.className, document.documentElement.className);
    });

}());
