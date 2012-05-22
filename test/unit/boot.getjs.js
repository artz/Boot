/*global document, window, setTimeout, clearTimeout, module, test, asyncTest, ok, equal, start, Boot*/
(function () {

    "use strict";

    module("Boot.getJS");

    test("Environment", function () {

        var isGecko = "MozAppearance" in document.documentElement.style,
            isScriptAsync = isGecko || window.opera || document.createElement("script").async;

        ok(window.Boot, 'Boot is defined.');
        ok(window.Boot.getJS, 'Boot.getJS is defined.');
        ok(true, 'isScriptAsync = ' + !!isScriptAsync);
    });

    asyncTest("Load a single script.", function () {
        Boot.getJS("js/boot.getjs/js1.js");
        setTimeout(function () {
            ok(window.BOOTGETJSTEST);
            ok(window.BOOTGETJSTEST.js1);
            equal(window.BOOTGETJSTEST.currentScript, 1);
            equal(window.BOOTGETJSTEST.scriptCounter, 1);
            start();
        }, 200);
    });

    asyncTest("Execute a function.", function () {
        Boot.getJS(function () {
            ok(true, "Function executed!");
            start();
        });
    });

    asyncTest("Load a script with a callback.", function () {
        Boot.getJS("js/boot.getjs/js2.js", function () {
            ok(window.BOOTGETJSTEST.js2);
            equal(window.BOOTGETJSTEST.currentScript, 2);
            equal(window.BOOTGETJSTEST.scriptCounter, 2);
            start();
        });
    });

    asyncTest("Load a script using object method.", function () {
        Boot.getJS({
            src: "js/boot.getjs/js3.js",
            callback: function () {
                ok(window.BOOTGETJSTEST.js3);
                equal(window.BOOTGETJSTEST.currentScript, 3);
                equal(window.BOOTGETJSTEST.scriptCounter, 3);
                start();
            }
        });
    });

    asyncTest("Load five scripts with an intermediate and final callback.", function () {
        Boot.getJS("js/boot.getjs/js4.js", "js/boot.getjs/js5.js", function () {
            ok(window.BOOTGETJSTEST.js4);
            ok(window.BOOTGETJSTEST.js5);
            equal(window.BOOTGETJSTEST.currentScript, 5);
            equal(window.BOOTGETJSTEST.scriptCounter, 5);
        }, "js/boot.getjs/js6.js", "js/boot.getjs/js7.js", "js/boot.getjs/js8.js", function () {
            ok(window.BOOTGETJSTEST.js6);
            ok(window.BOOTGETJSTEST.js7);
            ok(window.BOOTGETJSTEST.js8);
            equal(window.BOOTGETJSTEST.currentScript, 8);
            equal(window.BOOTGETJSTEST.scriptCounter, 8);
            start();
        });
    });
}());
