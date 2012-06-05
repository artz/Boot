/*global window, Boot, test, ok, equal */
/*jslint windows: true*/
(function () {

    "use strict";

    module("Boot.cookie");

    test("Environment", function () {
        ok(window.Boot);
        ok(window.Boot.cookie);
    });

    test("Set a cookie.", function () {
        ok(Boot.cookie("BOOTCOOKIETEST1", "CREATE"));
    });

    test("Retrieve a cookie.", function () {
        Boot.cookie("BOOTCOOKIETEST2", "CREATE");
        equal(Boot.cookie("BOOTCOOKIETEST2"), "CREATE");
    });

    test("Update a cookie.", function () {
        ok(Boot.cookie("BOOTCOOKIETEST3", "CREATE"));
        equal(Boot.cookie("BOOTCOOKIETEST3"), "CREATE");
        ok(Boot.cookie("BOOTCOOKIETEST3", "UPDATE"));
        equal(Boot.cookie("BOOTCOOKIETEST3"), "UPDATE");
    });

    test("Delete cookies.", function () {
        ok(Boot.cookie("BOOTCOOKIETEST4", "CREATE"));
        equal(Boot.cookie("BOOTCOOKIETEST4"), "CREATE");
        ok(Boot.cookie("BOOTCOOKIETEST4", null));
        equal(Boot.cookie("BOOTCOOKIETEST4"), null);
        ok(Boot.cookie("BOOTCOOKIETEST5", "CREATE"));
        equal(Boot.cookie("BOOTCOOKIETEST5"), "CREATE");
        ok(Boot.cookie("BOOTCOOKIETEST5", ""));
        equal(Boot.cookie("BOOTCOOKIETEST5"), null);
    });

    test("Cookie dump object.", function () {
        ok(Boot.cookie("BOOTCOOKIETEST6", "CREATE"));
        equal(Boot.cookie("BOOTCOOKIETEST6"), "CREATE");
        var dump = Boot.cookie();
        equal(dump.BOOTCOOKIETEST6, "CREATE");
    });
}());
