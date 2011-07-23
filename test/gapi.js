window.___jsl = window.___jsl || {};
window.___jsl.h = window.___jsl.h || 'r;gc\/22431124-0a127465';
window.__GOOGLEAPIS = window.__GOOGLEAPIS || {};
window.__GOOGLEAPIS.gwidget = window.__GOOGLEAPIS.gwidget || {};
window.__GOOGLEAPIS.gwidget.superbatch = false;
window.__GOOGLEAPIS.iframes = window.__GOOGLEAPIS.iframes || {};
window.__GOOGLEAPIS.iframes.plusone = window.__GOOGLEAPIS.iframes.plusone_m = window.__GOOGLEAPIS.iframes.plusone || {
    url: ':socialhost:/u/:session_index:/_/+1/fastbutton',
    params: {
        count: '',
        size: '',
        url: ''
    }
};
window.___gpq = [];
window.gapi = window.gapi || {};
window.gapi.plusone = window.gapi.plusone || (function () {
    function f(n) {
        return function () {
            window.___gpq.push(n, arguments)
        }
    }
    return {
        go: f('go'),
        render: f('render')
    }
})();

function __bsld() {
    var p = window.gapi.plusone = window.googleapisv0.plusone;
    var f;
    while (f = window.___gpq.shift()) {
        p[f] && p[f].apply(p, window.___gpq.shift())
    }
    if (gadgets.config.get("gwidget")["parsetags"] !== "explicit") {
        gapi.plusone.go();
    }
}
window['___jsl'] = window['___jsl'] || {};
window['___jsl']['u'] = 'https:\/\/apis.google.com\/js\/plusone.js';
window['___jsl']['f'] = ['googleapis.client', 'plusone'];
window['___lcfg'] = {
    "gwidget": {
        "parsetags": "onload",
        "superbatch": false
    },
    "iframes": {
        ":socialhost:": "https://apis.google.com",
        "profilecard": {
            "params": {
                "style": "#",
                "m": "&"
            },
            "url": ":socialhost:/u/:session_index:/_/hovercard/appcard"
        },
        "plusone_m": {
            "url": ":socialhost:/u/:session_index:/_/+1/fastbutton",
            "params": {
                "count": "",
                "size": "",
                "url": ""
            }
        },
        "plusone": {
            "url": ":socialhost:/u/:session_index:/_/+1/fastbutton",
            "params": {
                "count": "",
                "size": "",
                "url": ""
            }
        }
    },
    "googleapis.config": {
        "requestCache": {
            "enabled": true
        },
        "methods": {
            "chili.people.list": true,
            "pos.plusones.list": true,
            "chili.entities.starred.insert": {
                "cache": {
                    "invalidates": ["chili.entities.starred", "chili.entitiesDefaultAcl"]
                }
            },
            "chili.people.get": true,
            "chili.entities.get": true,
            "pos.plusones.delete": true,
            "chili.entities.starred.delete": true,
            "chili.entities.list": true,
            "pos.plusones.get": true,
            "chili.groups.list": true,
            "pos.plusones.getDefaultAcl": {
                "cache": {
                    "enabled": true
                }
            },
            "chili.entities.starred.get": true,
            "pos.plusones.insert": true,
            "chili.activities.list": true,
            "chili.entitiesDefaultAcl.get": true,
            "chili.entities.starred.list": true,
            "chili.activities.get": true,
            "chili.activities.search": true,
            "pos.plusones.getSignupState": true
        },
        "versions": {
            "chili": "v1",
            "pos": "v1"
        },
        "rpc": "/rpc",
        "transport": {
            "isProxyShared": true
        },
        "sessionCache": {
            "enabled": true
        },
        "proxy": "https://clients6.google.com/static/proxy.html",
        "developerKey": "AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ",
        "jsh": "r;gc/22431124-0a127465",
        "auth": {
            "useInterimAuth": false
        }
    }
};
var jsloader = window.jsloader || {};
var gapi = window.gapi || {};
(function () {
    function l() {
        return window.___jsl = window.___jsl || {}
    }
    function n(b, e, c, a) {
        c = p(c).join(b);
        a && a.length > 0 && (c += e + p(a).join(b));
        return c
    }
    function s(b) {
        for (var e = {}, c = 0, a; a = b[c]; c++) e[a] = 1;
        return e
    }
    function p(b) {
        var e = [],
            c;
        for (c in s(b)) e.push(c);
        return e.sort()
    }
    function x(b) {
        if (t() != "loading") return !1;
        if (typeof window.___gapisync != "undefined") return window.___gapisync;
        b = b ? b.sync : void 0;
        if (typeof b != "undefined") return b;
        for (var b = !1, e = document.getElementsByTagName("meta"), c = 0, a; a = !b && e[c]; ++c)"generator" == a.getAttribute("name") && "blogger" == a.getAttribute("content") && (b = !0);
        return b
    }
    function y() {
        var b;
        if ((b = q.match(z)) || (b = q.match(A))) try {
            return decodeURIComponent(b[2])
        } catch (e) {
            return null
        } else return l().h
    }
    function u(b, e) {
        m = f = "";
        r = {};
        j = [];
        h = window.console || window.opera && window.opera.postError;
        q = b;
        t = e;
        var c = y();
        if (c) {
            c = c.split(";");
            f = c.shift();
            var a = f !== "s" && f !== "r";
            m = a ? c.shift() : "https://ssl.gstatic.com/webclient/js";
            o = (a = f !== "s" && f !== "i") && c.shift();
            v = (a = f === "d") && (c.shift() || "gcjs-3p");
            w = a && c.shift() || "";
            if (a = f === "s" || f === "i") for (var a = 0, d; d = c[a]; a++) {
                d = d.split("@");
                var g = r,
                    k, i = d[0].split("!");
                k = i[0].split(":");
                i = i[1] && i[1].split(":");
                k = n(":", "!", k, i);
                g[k] = d[1]
            }
        }
    }
    var z = /\?([^&#]*&)*jsh=([^&#]*)/,
        A = /#([^&]*&)*jsh=([^&]*)/,
        B = /^https:\/\/ssl.gstatic.com\/webclient\/js(\/[a-zA-Z0-9_\-]+)*\/[a-zA-Z0-9_\-\.:!]+\.js$/,
        C = /^(https?:)?\/\/([^/:@]*)(:[0-9]+)?\//,
        f, m, v, w, o, r, j, h, q, t;
    u(document.location.href, function () {
        return document.readyState
    });
    jsloader.load = function (b, e, c) {
        var a;
        if (!b || b.length == 0) h && h.warn("Cannot load empty features.");
        else {
            var d;
            d = s(j);
            for (var g = !0, k = 0, i; i = g && b[k]; k++) g = g && d[i];
            (d = g) ? (d = "Cannot load loaded features [" + b.join(",") + "].", h && h.warn(d)) : f === "s" || f === "i" ? (a = n(":", "!", b, j), (d = r[a]) ? a = m + "/" + d + ".js" : (h && h.warn("Cannot find features [" + a + "]."), a = void 0)) : f === "d" ? (a = m + "/" + n(":", "!", b, j), a += ".js?container=" + v + "&c=2&jsload=0", o && (a += "&r=" + o), w == "d" && (a += "&debug=1")) : f === "r" || f === "f" ? a = m + "/" + o + "/" + n("__", "--", b, j) + ".js" : (d = "Cannot respond for features [" + b.join(",") + "].", h && h.warn(d))
        }
        d = e;
        e = c;
        if (a) {
            if (c = d) {
                if (l().c) throw "Cannot continue until a pending callback completes.";
                l().c = c;
                l().o = 1
            }
            a = c = a;
            f === "s" || f === "r" ? a = a.match(B) : (d = a.match(C), (a = l().m) && d ? (d = d[2], g = d.lastIndexOf(a), a = (g == 0 || a.charAt(0) == "." || d.charAt(g - 1) == ".") && d.length - a.length == g) : a = !1);
            if (!a) throw "Cannot load url " + c + ".";
            x(e) ? document.write('<script src="' + c + '"><\/script>') : (e = document.createElement("script"), e.setAttribute("src", c), document.getElementsByTagName("head")[0].appendChild(e));
            j = p(j.concat(b))
        } else d && d()
    };
    jsloader.reinitialize_ = function (b, e) {
        u(b, e)
    }
})();
gapi.load = function (a, b) {
    jsloader.load(a.split(":"), b)
};
gapi.load('googleapis.client:plusone', window['__bsld'], null);