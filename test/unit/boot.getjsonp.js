/*global window, Boot, test, asyncTest module, ok, equal */
/*jslint windows: true*/
(function () {

    "use strict";

    module("Boot.getJSONP");

    test("Environment", function () {
        ok(window.Boot);
        ok(window.Boot.getJSONP);
    });

    test("Correct URL is returned.", function () {

        equal(Boot.getJSONP("http://myjsonpurl/"),
            "http://myjsonpurl/");
        equal(Boot.getJSONP("http://myjsonpurl/?callback=?"),
            "http://myjsonpurl/?callback=Boot._JSONP_1");
        equal(Boot.getJSONP("http://myjsonpurl/?meme=youyou&customcallback=?"),
            "http://myjsonpurl/?meme=youyou&customcallback=Boot._JSONP_2");
        equal(Boot.getJSONP("http://myjsonpurl/?callback=bar"),
            "http://myjsonpurl/?callback=bar");
        equal(Boot.getJSONP("http://myjsonpurl/?blah=coolaid&callback=foo"),
            "http://myjsonpurl/?blah=coolaid&callback=foo");

    });

    asyncTest("Dynamically generated callback executes.", function () {
        Boot.getJSONP("js/jsonp.php?callback=?", function (data){
            equal(data.foo, "bar");
            start();
        });
    });

    asyncTest("Static callback executes.", function () {

        Boot._FooBar = function (data) {
            equal(data.foo, "bar");
            start();
        }

        Boot.getJSONP("js/jsonp.php?callback=Boot._FooBar");
    });

}());
