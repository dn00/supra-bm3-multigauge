var $jscomp = {
    scope: {}
};
$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, a, d) {
    if (d.get || d.set) throw new TypeError("ES3 does not support getters and setters.");
    b != Array.prototype && b != Object.prototype && (b[a] = d.value)
};
$jscomp.getGlobal = function(b) {
    return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(b) {
    return $jscomp.SYMBOL_PREFIX + (b || "") + $jscomp.symbolCounter_++
};
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var b = $jscomp.global.Symbol.iterator;
    b || (b = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[b] && $jscomp.defineProperty(Array.prototype, b, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.arrayIterator(this)
        }
    });
    $jscomp.initSymbolIterator = function() {}
};
$jscomp.arrayIterator = function(b) {
    var a = 0;
    return $jscomp.iteratorPrototype(function() {
        return a < b.length ? {
            done: !1,
            value: b[a++]
        } : {
            done: !0
        }
    })
};
$jscomp.iteratorPrototype = function(b) {
    $jscomp.initSymbolIterator();
    b = {
        next: b
    };
    b[$jscomp.global.Symbol.iterator] = function() {
        return this
    };
    return b
};
$jscomp.makeIterator = function(b) {
    $jscomp.initSymbolIterator();
    var a = b[Symbol.iterator];
    return a ? a.call(b) : $jscomp.arrayIterator(b)
};
var userAgent = navigator.userAgent.toLowerCase(); - 1 < userAgent.indexOf("electron/") ? window.electron = !0 : window.electron = !1;
window.electron || -1 === document.URL.indexOf("http://") && -1 === document.URL.indexOf("https://") ? (WS_BASE_URL = "https://www.bootmod3.net", webApp = !1) : (WS_BASE_URL = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : ""), webApp = !0);
WS_URL = WS_BASE_URL + "/ws";
if ("localhost" !== location.hostname && "sources" !== location.hostname && "target" !== location.hostname) {
    DBG = !1;
    window.console || (window.console = {});
    for (var methods = ["log", "debug", "warn", "info"], i$3 = 0; i$3 < methods.length; i$3++) console[methods[i$3]] = function() {}
} else DBG = !0;

function base64ArrayBuffer(b) {
    var a = "";
    b = new Uint8Array(b);
    for (var d = b.byteLength, c = d % 3, d = d - c, k, g, l, h, e = 0; e < d; e += 3) h = b[e] << 16 | b[e + 1] << 8 | b[e + 2], k = (h & 16515072) >> 18, g = (h & 258048) >> 12, l = (h & 4032) >> 6, h &= 63, a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [k] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [g] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [l] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [h];
    1 === c ? (h = b[d], a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(h &
        252) >> 2] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(h & 3) << 4] + "\x3d\x3d") : 2 === c && (h = b[d] << 8 | b[d + 1], a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(h & 64512) >> 10] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(h & 1008) >> 4] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(h & 15) << 2] + "\x3d");
    return a
}
"use strict";
angular.module("oitozero.ngSweetAlert", []).factory("SweetAlert", ["$rootScope", function(b) {
    var a = window.swal;
    return {
        swal: function(d, c, k) {
            b.$evalAsync(function() {
                "function" === typeof c ? a(d, function(a) {
                    b.$evalAsync(function() {
                        c(a)
                    })
                }, k) : a(d, c, k)
            })
        },
        success: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "success")
            })
        },
        error: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "error")
            })
        },
        warning: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "warning")
            })
        },
        info: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "info")
            })
        }
    }
}]);
angular.module("ngStomp", []).service("$stomp", ["$rootScope", "$q", function(b, a) {
    this.url = WS_URL;
    this.stomp = this.sock = null;
    this.setToken = function(a) {
        this.sock = new SockJS(this.url, null, {
            headers: {
                jwt: a
            }
        });
        this.stomp = Stomp.over(this.sock);
        this.stomp.reconnect_delay = 1E3;
        this.stomp.heartbeat.outgoing = 1E4
    };
    this.connect = function(d) {
        if (!b.offlineMode) {
            d = d || {};
            var c = a.defer();
            this.stomp.connect(d, function(a) {
                c.resolve(a)
            }, function(a) {
                c.reject(a)
            });
            return c.promise
        }
    };
    this.disconnect = function() {
        var b = a.defer();
        this.stomp.disconnect(b.resolve);
        return b.promise
    };
    this.subscribe = this.on = function(a, c, k) {
        if (!b.offlineMode) return k = k || {}, this.stomp.subscribe(a, function(a) {
            var b = null;
            try {
                b = JSON.parse(a.body)
            } finally {
                c && c(b, a.headers, a)
            }
        }, k)
    };
    this.unsubscribe = this.off = function(a) {
        !b.offlineMode && a && a.unsubscribe()
    };
    this.send = function(d, c, k) {
        if (!b.offlineMode) {
            var g = a.defer();
            try {
                var l = JSON.stringify(c);
                k = k || {};
                this.stomp.send(d, k, l);
                g.resolve()
            } catch (h) {
                console.error(h), g.reject(h)
            }
            return g.promise
        }
    }
}]);
angular.module("bmDevice", []).service("$bmd", ["$rootScope", "$q", function(b, a) {
    this.stomp = this.sock = this.url = null;
    this.connected = !1;
    this.setConnectUrl = function() {
        this.sock = new SockJS(BMD_URL);
        this.stomp = Stomp.over(this.sock);
        this.stomp.reconnect_delay = 1E3;
        this.stomp.debug = !1;
        this.stomp.heartbeat.outgoing = 1E4
    };
    this.connect = function(b) {
        if (this.stomp) {
            b = b || {};
            var c = a.defer();
            this.stomp.connect(b, function(a) {
                this.connected = !0;
                c.resolve(a)
            }, function(a) {
                this.connected = !1;
                c.reject(a)
            });
            return c.promise
        }
    };
    this.disconnect = function() {
        this.connected = !1;
        if (this.stomp) {
            var b = a.defer();
            this.stomp.disconnect(b.resolve);
            return b.promise
        }
    };
    this.subscribe = this.on = function(a, b, k) {
        if (this.stomp) {
            k = k || {};
            try {
                return this.stomp.subscribe(a, function(a) {
                    var c = null;
                    try {
                        c = JSON.parse(a.body)
                    } catch (h) {
                        c = a.body
                    }
                    b && b(c, a.headers, a)
                }, k)
            } catch (g) {
                console.error(g)
            }
        }
    };
    this.unsubscribe = this.off = function(a) {
        a && this.connected && a.unsubscribe()
    };
    this.send = function(b, c, k) {
        if (!this.stomp && this.connected) this.connected = !1;
        else if (this.stomp) {
            var d =
                a.defer();
            try {
                var l = JSON.stringify(c);
                k = k || {};
                this.stomp.send(b, k, l);
                d.resolve()
            } catch (h) {
                d.reject(h)
            }
            return d.promise
        }
    }
}]);

function isCordova() {
    return window.cordova
}

function leftPad(b) {
    b = "" + b;
    return "00".substring(0, 2 - b.length) + b
}
for (var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", lookup = new Uint8Array(256), i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;
window.encode = function(b) {
    b = new Uint8Array(b);
    var a, d = b.length,
        c = "";
    for (a = 0; a < d; a += 3) c += chars[b[a] >> 2], c += chars[(b[a] & 3) << 4 | b[a + 1] >> 4], c += chars[(b[a + 1] & 15) << 2 | b[a + 2] >> 6], c += chars[b[a + 2] & 63];
    2 === d % 3 ? c = c.substring(0, c.length - 1) + "\x3d" : 1 === d % 3 && (c = c.substring(0, c.length - 2) + "\x3d\x3d");
    return c
};

function errorHandler(b) {}
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

function saveMapInternal(b, a, d, c) {
    JWT ? removeMapInternal(b, function() {
        window.requestFileSystem(TEMPORARY, 10485760, function(k) {
            k.root.getDirectory(getDirPath(), {
                create: !0
            }, function(g) {
                g.getFile(getMapPath(b), {
                    create: !0
                }, function(b) {
                    b.createWriter(function(b) {
                        b.onwriteend = function(a) {
                            d && d()
                        };
                        b.onerror = function(a) {
                            console.error(a);
                            c && c()
                        };
                        var e = new Blob([a], {
                            type: "octet/stream"
                        });
                        b.write(e)
                    }, function(a) {
                        c && c()
                    })
                }, function(a) {
                    c && c()
                })
            }, function(a) {
                c && c()
            })
        }, function(a) {
            c && c()
        })
    }) : c()
}

function removeMapInternal(b, a) {
    JWT ? window.requestFileSystem(TEMPORARY, 10485760, function(d) {
        d.root.getDirectory(getDirPath(), {
            create: !1
        }, function(c) {
            c.getFile(getMapPath(b), {
                create: !1
            }, function(b) {
                b.remove(function(b) {
                    a && a()
                }, function(b) {
                    console.error("error occurred: " + b.code);
                    a && a()
                }, function() {
                    a && a()
                })
            }, function(b) {
                a && a()
            })
        }, function(b) {
            a && a()
        })
    }, function(b) {
        a && a()
    }) : a && a()
}

function storeClear(b) {
    JWT ? window.requestFileSystem(TEMPORARY, 10485760, function(a) {
        a.root.getDirectory(getDirPath(), {
            create: !1
        }, function(a) {
            a.removeRecursively(function(a) {
                b && b()
            }, function(a) {
                console.error("error occurred: " + a.code);
                b && b()
            })
        }, function(a) {
            b && b()
        })
    }) : b && b()
}

function saveMap(b, a, d, c) {
    if (JWT) try {
        navigator.webkitTemporaryStorage.requestQuota(209715200, function(k) {
            saveMapInternal(b, a, d, c)
        }, function(k) {
            saveMapInternal(b, a, d, c)
        })
    } catch (k) {
        saveMapInternal(b, a, d, c)
    } else c()
}

function readMap(b, a, d) {
    if (JWT) try {
        window.requestFileSystem(TEMPORARY, 0, function(c) {
            c.root.getDirectory(getDirPath(), {
                create: !1
            }, function(c) {
                c.getFile(getMapPath(b), {
                    create: !1
                }, function(b) {
                    b.file(function(b) {
                        var c = new FileReader;
                        c.onloadend = function(b) {
                            a(this.result)
                        };
                        c.readAsArrayBuffer(b)
                    }, function() {
                        d && d()
                    })
                }, function() {
                    d && d()
                })
            }, function() {
                d && d()
            }, function() {
                d && d()
            })
        })
    } catch (c) {
        d && d()
    } else d()
}

function getMap(b, a, d) {
    if (JWT) try {
        window.requestFileSystem(TEMPORARY, 0, function(c) {
            c.root.getDirectory(getDirPath(), {
                create: !1
            }, function(c) {
                c.getFile(getMapPath(b), {
                    create: !1
                }, function(c) {
                    c.file(function(b) {
                        a(!0, toMap(b))
                    }, function() {
                        a(!1, b)
                    })
                }, function() {
                    a(!1, b)
                })
            }, function() {
                a(!1, b)
            })
        }, function() {
            a(!1, b)
        })
    } catch (c) {
        d && d()
    } else d()
}

function listMaps(b, a) {
    if (JWT) {
        var d = [];
        try {
            window.requestFileSystem(TEMPORARY, 0, function(c) {
                c.root.getDirectory(getDirPath(), {
                    create: !1
                }, function(c) {
                    c.createReader().readEntries(function(a) {
                        a.forEach(function(a) {
                            d.push(toMap(a))
                        });
                        b(d)
                    }, a)
                }, function() {
                    b(d)
                })
            }, function() {
                b(d)
            })
        } catch (c) {
            a && a()
        }
    } else a()
}

function listOfflineMapsForMap(b, a, d) {
    if (JWT) try {
        var c = [];
        window.requestFileSystem(TEMPORARY, 0, function(k) {
            k.root.getDirectory(getDirPath(), {
                create: !1
            }, function(g) {
                g.createReader().readEntries(function(d) {
                    d.forEach(function(a) {
                        a = toMap(a);
                        a.id === b.id && c.push(a)
                    });
                    a(c)
                }, d)
            }, function() {
                a(c)
            })
        }, function() {
            a(c)
        })
    } catch (k) {
        d && d()
    } else d()
}

function removeOfflineMapsForMap(b, a, d) {
    if (JWT) try {
        window.requestFileSystem(TEMPORARY, 0, function(c) {
            c.root.getDirectory(getDirPath(), {
                create: !1
            }, function(c) {
                c.createReader().readEntries(function(c) {
                    c.forEach(function(a) {
                        var c = toMap(a);
                        c.id === b.id && (b.saveId !== c.saveId || b.updateTs > c.updateTs) && a.remove(function() {}, d)
                    });
                    a()
                }, d)
            }, function() {
                a()
            })
        }, function() {
            a()
        })
    } catch (c) {
        d && d()
    } else d()
}

function getDirPath() {
    return JWT.substring(0, 10)
}

function getMapPath(b) {
    return b.id + "__uts__" + b.updateTs + "__v__" + b.version + "__n__" + b.name + "__sid__" + b.saveId
}

function toMap(b) {
    return {
        id: b.name.substring(0, b.name.indexOf("_")),
        name: b.name.substring(b.name.indexOf("__n__") + 5, b.name.indexOf("__sid__")),
        version: b.name.substring(b.name.indexOf("__v__") + 5, b.name.indexOf("__n__")),
        updateTs: b.name.substring(b.name.indexOf("__uts__") + 7, b.name.indexOf("__v__")),
        saveId: b.name.substring(b.name.indexOf("__sid__") + 7)
    }
}

function main() {
    window.handleOpenURL = function(b) {
        console.log("auth0cordova url " + b);
        Auth0Cordova.onRedirectUri(b)
    };
    document.addEventListener("online", onOnline, !1);
    document.addEventListener("offline", onOffline, !1)
}

function htmlToPlaintext(b) {
    return b ? String(b).replace(/<[^>]+>/gm, "") : ""
}

function onOnline() {
    NO_INTERNET = !1
}

function onOffline() {
    NO_INTERNET = !0
}
document.addEventListener("deviceready", main);

function hostReachable() {
    if (!navigator.onLine) return !1;
    var b = new(window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP");
    b.open("HEAD", WS_BASE_URL + "/www/index.html?rand\x3d" + Math.floor(65536 * (1 + Math.random())), !1);
    try {
        return b.send(), 200 <= b.status && (300 > b.status || 304 === b.status || 0 === b.status)
    } catch (a) {
        return !1
    }
}
angular.module("app", "ionic ngCordova app.login app.dash app.logs app.help app.tcu app.tunereqs app.tuners app.maps app.devices app.devicereg app.devicestatus app.dash2 app.dash3 app.dash4 app.addmap app.codes app.diag app.otsmaps app.logconfig app.dashconfig app.agent app.mapedit app.version app.mapswitch app.about app.logout app.routes app.services app.directives app.filters auth0.lock ui.grid ui.grid.selection ui.grid.cellNav ui.grid.resizeColumns angular-storage angular-jwt ngRoute ngStomp bmDevice jett.ionic.filter.bar ngProgress ngCookies ngMaterial ngMessages chips cfp.hotkeys".split(" ")).config(["$routeProvider", "lockProvider",
    "$httpProvider", "$locationProvider", "jwtInterceptorProvider", "$mdGestureProvider", "$mdThemingProvider", "hotkeysProvider", "$compileProvider", "$qProvider",
    function(b, a, d, c, k, g, l, h, e, q) {
        e.debugInfoEnabled(DBG);
        q.errorOnUnhandledRejections(DBG);
        e.commentDirectivesEnabled(DBG);
        e.cssClassDirectivesEnabled(DBG);
        l.theme("default").dark().primaryPalette("red").accentPalette("blue");
        g.skipClickHijack();
        h.templateTitle = "bootmod3 Editor Keyboard Shortcuts";
        c.hashPrefix("");
        a.init({
            clientID: "jFCsF2RJexibT5RhbTCnQsD1E7htS9GT",
            domain: "bootmod3.auth0.com",
            options: {
                autoclose: !0,
                auth: {
                    responseType: "token id_token",
                    audience: "https://bootmod3.auth0.com/userinfo",
                    params: {
                        scope: "openid profile email"
                    },
                    redirect: !1,
                    sso: !1
                },
                redirect: !1,
                popupOptions: {
                    width: 300,
                    height: 400,
                    left: 200,
                    top: 300
                },
                rememberLastLogin: !0,
                theme: {
                    logo: "img/bm3-logo-300-color.png"
                },
                languageDictionary: {
                    emailInputPlaceholder: "something@youremail.com",
                    title: "Log me in"
                }
            }
        });
        k.tokenGetter = function(a, b, c) {
            var d = a.get("id_token");
            a = a.get("access_token");
            return null ===
                d || null === a || b.isTokenExpired(d) ? null : (c.defaults.headers.common.jwt = a, d)
        };
        k.tokenGetter.$inject = ["store", "jwtHelper", "$http"];
        d.interceptors.push("myHttpInterceptor");
        d.interceptors.push("jwtInterceptor");
        window.dragMoveListener = function(a) {
            a.preventDefault();
            var b = a.target,
                c = (parseFloat(b.getAttribute("data-x")) || 0) + a.dx;
            a = (parseFloat(b.getAttribute("data-y")) || 0) + a.dy;
            b.style.webkitTransform = b.style.transform = "translate(" + c + "px, " + a + "px)";
            b.setAttribute("data-x", c);
            b.setAttribute("data-y", a)
        }
    }
]).run(["$ionicPlatform",
    "$rootScope", "jwtHelper", "$location", "$ionicHistory", "SweetAlert", "store", "$timeout", "$bmd", "authService", "UI", "$interval", "$state", "$mdToast", "$mdDialog", "$http", "ngProgressFactory", "$window",
    function(b, a, d, c, k, g, l, h, e, q, n, v, r, x, t, p, C, y) {
        b.ready(function() {
            function c(a) {
                a && a.hasPermission || g.swal({
                    title: "Android Permissions",
                    text: "bootmod3 requires access to device local storage. Android will ask for permissions to access your local phone's storage. Please select ALLOW, otherwise the app will not be able to upload maps or save datalogs to/from your device.",
                    type: "warning",
                    html: !0
                }, function() {
                    var a = function() {
                        console.warn("storage permission is not turned on")
                    };
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function(b) {
                        b && b.hasPermission || a()
                    }, a)
                })
            }
            a.reconnOBDInterval = v(a.reconnectOBDAgent, 1E3);
            q.handleAuthentication();
            window.cordova ? a.native = !0 : (a.native = !1, window.safari && (a.browser = "safari", g.swal({
                title: "Browser Support",
                text: "Due to our recent move to HTTPS, Safari browser is no longer supported. OBD Agent detection will not work on Safari. Google Chrome is recommended and should be used instead.",
                type: "warning",
                html: !0
            })));
            a.openLink = function(a, b) {
                window.cordova ? window.cordova.InAppBrowser.open(a, "_system", "location\x3dyes") : b ? window.location.href = a : window.open(a, "_blank", "location\x3dyes")
            };
            window.cordova && AppVersion && (a.appVersion = AppVersion.version, a.appBuild = AppVersion.build);
            a.reconnectSockets();
            p.defaults.headers.common.agentVersion = a.agentVersion;
            p.defaults.headers.common.agentBuildId = a.agentBuildId;
            p.defaults.headers.common.appVersion = a.appVersion;
            p.defaults.headers.common.appBuild =
                a.appBuild;
            b.registerBackButtonAction(function(a) {
                "Login" === k.backTitle() ? a.preventDefault() : k.goBack()
            }, 100);
            a.vinMsgShown = !1;
            window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard && (cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0), cordova.plugins.Keyboard.disableScroll(!0));
            window.StatusBar && ("iOS" === cordova.platform ? StatusBar.overlaysWebView(!1) : StatusBar.hide());
            if (window.cordova) {
                "iOS" == window.device.platform && (a.platform = "iOS");
                var d = cordova.plugins.permissions;
                d.hasPermission(d.WRITE_EXTERNAL_STORAGE,
                    c, null)
            }
        });
        a.clearAuth = function() {
            a.clientSession = null;
            a.authenticated = !1;
            a.remove("access_token");
            a.remove("refresh_token");
            a.remove("id_token");
            a.remove("token");
            a.remove("expires_in");
            a.remove("expires_at")
        };
        a.clearSettings = function() {
            var b;
            a.clientSession && a.clientSession.vin && (b = a.clientSession.vin);
            !b && a.VIN && (b = a.VIN);
            b && l.remove(b)
        };
        a.kick = function(b) {
            k.nextViewOptions({
                disableBack: !0
            });
            b ? (a.clearCache(!0), a.clearAuth(), k.clearCache(), location.href = "index.html") : c.path("/login")
        };
        a.isNull =
            function(a) {
                return null == a || "undefined" === typeof a
            };
        a.remove = function(b) {
            if (a.isGlobalVar(b)) l.remove(b);
            else {
                var c = a.VIN;
                !c && a.clientSession && (c = a.clientSession.vin);
                if (c) {
                    var d = l.get(c);
                    d || (d = {});
                    delete d[b];
                    l.set(c, d)
                } else l.remove(b)
            }
        };
        a.isGlobalVar = function(a) {
            return "token" === a || "AGENT_IP_ADDR" === a || "AGENT_PORT" === a || "offlineMode" === a || "access_token" === a || "refresh_token" === a || "id_token" === a || "expires_in" === a || "expires_at" === a || "editorIgnoreWarn" === a || "liveChartMaxPoints" === a || "pulldownRefreshTuneReqsShown" ===
                a || "pulldownRefreshLogsShown" === a || "pulldownRefreshMapsShown" === a || "autoShowLog" === a || "selectedLayout" === a || "autologThres" === a || "autologCutoffSecs" === a || "selectedUnits" === a || "selectedPressureSetting" === a || "whatsNewShownForVer" === a || "show3dTables" === a || "startlogmsg" === a || "stopdashreminders" === a || "userLevel" === a || "wrapTableNamesProp" === a || "sortModeProp" === a || "filter1d" === a || "filter2d" === a || "filter3d" === a || "filterChanged" === a || "lastDevice" === a || "pressureUnits" === a || "tempUnits" === a || "speedUnits" === a ||
                "torqueUnits" === a || "flowUnits" === a
        };
        a.set = function(b, c) {
            if (a.isGlobalVar(b)) "undefined" === c ? l.remove(b) : !1 === c ? l.set(b, !1) : l.set(b, c);
            else {
                var d = a.VIN;
                !d && a.clientSession && (d = a.clientSession.vin);
                d ? a.setForVin(b, c, d) : a.setForCurrentUser(b, c)
            }
        };
        a.get = function(b, c) {
            var d;
            if (a.isGlobalVar(b)) {
                d = l.get(b);
                if (a.isNull(d)) {
                    if (a.isNull(c)) return null;
                    a.set(b, c);
                    return c
                }
                return d
            }
            d = a.VIN;
            !d && a.clientSession && (d = a.clientSession.vin);
            return d ? a.getForVin(b, c, d) : a.getForCurrUser(b, c)
        };
        a.setForVin = function(b,
            c, d) {
            if (a.isGlobalVar(b)) "undefined" === c ? l.remove(b) : !1 === c ? l.set(b, !1) : l.set(b, c);
            else if (d) {
                var w = l.get(d);
                w || (w = {});
                "undefined" === c ? delete w[b] : w[b] = c ? c : !1;
                l.set(d, w)
            }
        };
        a.setForCurrentUser = function(b, c) {
            if (a.isGlobalVar(b)) "undefined" === c ? l.remove(b) : !1 === c ? l.set(b, !1) : l.set(b, c);
            else if (a.clientSession && a.clientSession.userId) {
                var d = a.clientSession.userId,
                    w = l.get(d);
                w || (w = {});
                "undefined" === c ? delete w[b] : w[b] = c ? c : !1;
                l.set(d, w)
            }
        };
        a.getForVin = function(b, c, d) {
            if (a.isGlobalVar(b)) {
                d = l.get(b);
                if (a.isNull(d)) {
                    if (a.isNull(c)) return null;
                    a.set(b, c);
                    return c
                }
                return d
            }
            d || (d = a.VIN);
            if (d) {
                if (d = l.get(d)) {
                    d = d[b];
                    if (a.isNull(d)) {
                        if (a.isNull(c)) return null;
                        a.set(b, c);
                        return c
                    }
                    return d
                }
                return c
            }
            return c ? c : null
        };
        a.getForCurrUser = function(b, c) {
            var d;
            if (a.isGlobalVar(b)) {
                d = l.get(b);
                if (a.isNull(d)) {
                    if (a.isNull(c)) return null;
                    a.set(b, c);
                    return c
                }
                return d
            }
            if (a.clientSession && a.clientSession.userId && (d = a.clientSession.userId)) {
                if (d = l.get(d)) {
                    d = d[b];
                    if (a.isNull(d)) {
                        if (a.isNull(c)) return null;
                        a.set(b, c);
                        return c
                    }
                    return d
                }
                return c
            }
            return c ? c : null
        };
        a.appVersion = "0.50.019";
        a.appBuild = "0.50.019";
        a.minAgentVersion = "0.50.019";
        NO_INTERNET = a.vehicleIdFailed = !1;
        AGENT_IP_ADDR = "localhost";
        REMOTE_IP_ADDR = null;
        AGENT_PORT = 8080;
        JWT = null;
        a.ips = [];
        a.burbleOverride = {
            enabled: !1,
            agg: 0,
            dur: 0
        };
        a.mapSlot = -1;
        a.flexOverride = {
            blendPercent: 0,
            enabled: !1
        };
        a.VIN = null;
        a.customROMConn = !1;
        a.sigValid = !1;
        a.ROM = null;
        a.userVIN = null;
        a.authInit = !1;
        a.progressbar = C.createInstance();
        a.progressbar.setHeight("8px");
        a.offlineMode = !1;
        a.authenticated = !1;
        a.devices = a.getForCurrUser("devices");
        if (a.devices)
            for (d = 0; d < a.devices.length; d++) a.devices[d].available = !1;
        a.pulldownRefreshTuneReqsShown = a.getForCurrUser("pulldownRefreshTuneReqsShown", !1);
        a.pulldownRefreshLogsShown = a.getForCurrUser("pulldownRefreshLogsShown", !1);
        a.pulldownRefreshMapsShown = a.getForCurrUser("pulldownRefreshMapsShown", !1);
        a.liveChartMaxPoints = a.getForCurrUser("liveChartMaxPoints", 300);
        a.autoShowLog = a.getForCurrUser("autoShowLog", !0);
        a.hasAdvancedChannels = !0;
        a.license = null;
        a.ap = null;
        a.bmdConnected = !1;
        a.autolog = !1;
        a.ips.push("localhost");
        a.ipsAttempted = [];
        a.flashStatusNeedsDismiss = !1;
        a.startupTime = new Date;
        a.agentOutdated = !1;
        a.dashData = [];
        a.detectingOBDAgent = !0;
        a.noDetectedOBDAgent = !1;
        a.detectedOBDAgent = !1;
        a.vinMsgShown = !1;
        a.noVinMsgShown = !1;
        a.udpData = !1;
        a.serverConnected = !0;
        a.channelDataLoaded = !1;
        a.vinSocketUdpId = null;
        a.lastAgentUpdate = null;
        a.bmdConnecting = !1;
        a.reconnectCount = 0;
        a.ignoreBenchUnlock = !1;
        a.flashFinishingUp = !1;
        a.gauges = [];
        a.lastUpdate = 0;
        a.onReceiveStarted = !1;
        a.drawerWatch = null;
        a.dashId = Date.now();
        a.liveChartRunning = !1;
        a.autolog = !1;
        a.autoCapturedLogs = 0;
        a.alarms = [];
        a.dashDataSeparator = "+";
        a.dashLive = !1;
        y.addEventListener("beforeunload", function(b) {
            a.pauseGauges()
        });
        a.$watch("VIN", function(b) {
            a.$broadcast("VIN", b);
            b ? a.updateOfflineModeAvailable() : a.offlineMode && g.swal({
                title: "Disconnected",
                text: "Connection to your vehicle is no longer available.",
                type: "info"
            }, function() {
                a.kick()
            })
        });
        a.isAuthorizedTuner = function() {
            return null != a.clientSession && a.clientSession.webTuner && "REGULAR" !== a.clientSession.webTuner.tunerLevel
        };
        a.isTuner = function() {
            return null != a.clientSession && a.clientSession.webTuner
        };
        a.isVinPresent = function() {
            return null != a.clientSession && a.clientSession.vin
        };
        a.isRegisteredDeviceConnected = function() {
            if (a.VIN) {
                var b = a.get("lastDevice");
                if (b && b.id === a.VIN) return !0
            }
            return !1
        };
        a.goLiveAdjust = function() {
            a.VIN ? a.customROMConn ? (k.nextViewOptions({
                disableBack: !0
            }), r.go("bootmod3.liveadjust")) : g.swal({
                title: "CustomROM Not Detected",
                text: "To use the LiveAdjust CustomROM feature the DME on your car needs to be connected and flashed with a CustomROM enabled map.",
                type: "error"
            }) : g.swal({
                title: "No connection",
                text: "Vehicle not connected. To use the LiveAdjust CustomROM feature the DME on your car needs to be connected and flashed with a CustomROM enabled map.",
                type: "error"
            })
        };
        a.goDash = function() {
            a.getCurrentLogChannels(function() {
                a.proceedToDash()
            }, function() {
                a.offlineMode && g.swal({
                    title: "Not Available",
                    text: "Dash is not available. You need to log in once to your account to initialize the data for your vehicle.",
                    type: "error"
                })
            })
        };
        a.proceedToDash = function() {
            k.nextViewOptions({
                disableBack: !0
            });
            var b = a.getForCurrUser("selectedLayout", {
                name: "Bar Graphs",
                id: "bargraphs"
            });
            b.name && "dials" !== b.id ? b.name && "bargraphs" !== b.id ? b.name && "livecharts" !== b.id ? r.go("bootmod3.dashboard2") : r.go("bootmod3.dashboard3") : r.go("bootmod3.dashboard2") : r.go("bootmod3.dashboard")
        };
        a.goEditor = function(b) {
            a.clientSession && (window.cordova ? g.swal({
                    title: "Mobile Device",
                    text: "Map editor is not optimized for mobile touch screen devices at this time. Please use a desktop or laptop browser.",
                    type: "info"
                }) : !a.isTuner() ||
                a.isTuner() && !a.isVinPresent() ? g.swal({
                    title: "Tuner Access",
                    text: "You need to configure your account in the Tuners screen before using the editor.\x3cbr\x3e\x3cbr\x3eIf you're a tuner shop looking to use bootmod3 for tuning please contact support@protuningfreaks.com for assistance.",
                    type: "info",
                    html: !0
                }) : a.getForCurrUser("editorIgnoreWarn") ? a.confirmEdit() : t.show({
                    controller: "DialogController",
                    templateUrl: "templates/mapEdit-confirm.tmpl.html",
                    parent: angular.element(document.body),
                    targetEvent: b,
                    clickOutsideToClose: !1,
                    scope: a,
                    preserveScope: !0,
                    fullscreen: !1
                }))
        };
        a.confirmEdit = function() {
            a.setForCurrentUser("editorIgnoreWarn", !0);
            k.clearCache().then(function() {
                k.nextViewOptions({
                    disableBack: !0
                });
                r.go("bootmod3.mapEdit", {}, {
                    reload: !0
                })
            })
        };
        a.online = function() {
            a.set("offlineMode", !1);
            a.offlineMode = !1;
            a.kick(!1)
        };
        a.offline = function(b) {
            a.detectedOBDAgent || g.swal({
                title: "Vehicle connection",
                text: "Offline Mode can only be used once OBD Agent is running.",
                type: "warning",
                confirmButtonClass: "btn-warning",
                showConfirmButton: !0,
                showCancelButton: !1,
                html: !0
            });
            JWT || (JWT = a.get("token"));
            a.userVIN = null;
            if (a.authenticated && (a.devices = a.getForCurrUser("devices"), a.devices))
                for (var c = 0; c < a.devices.length; c++) {
                    var d = a.devices[c];
                    d && d.activated && (a.userVIN = d.id, a.userId = d.userId)
                }
            a.set("offlineMode", !0);
            a.offlineMode = !0;
            a.clientSession = null;
            a.getForVin("logChannels") ? a.channelDataLoaded = !0 : g.swal({
                title: "Dashboard",
                text: "Dashboard configuration not initialized for Offline Mode usage. You need to log in at least once with vehicle connected to initialize dashboard configuration for Offline Mode.",
                type: "warning",
                confirmButtonClass: "btn-warning",
                showConfirmButton: !0,
                showCancelButton: !1,
                html: !0
            });
            b || h(function() {
                k.nextViewOptions({
                    disableBack: !0
                });
                r.go("bootmod3.devices")
            }, 10)
        };
        a.updateUnitsForDisplay = function(b) {
            a.getCurrentLogChannels(function(c) {
                if (c)
                    for (var d in c) a.configureUnitsForDisplay(c[d]);
                b && b(c)
            }, function() {
                n.toast("Failed updating units for display.")
            })
        };
        a.convertToSafeObject = function(a) {
            try {
                var b = [];
                return JSON.stringify(a, function(a, c) {
                    if (null != c && "object" == typeof c) {
                        if (0 <= b.indexOf(c)) return;
                        b.push(c)
                    }
                    return c
                })
            } catch (z) {
                return console.error(z), null
            }
        };
        a.updateChannelDetails = function(b, c, d) {
            a.getCurrentLogChannels(function(w) {
                var z = _.findWhere(w, {
                    pid: b.pid
                });
                if (z) {
                    if (z.selected = b.selected, z.showInDash = b.showInDash, z = a.convertToSafeObject(w)) a.set("logChannels", z), c && a.getCurrentLogChannels(c, d)
                } else a.getCurrentLogChannelsAll(function(z) {
                    if (z = _.findWhere(z, {
                            pid: b.pid
                        })) {
                        var f = _.findWhere(w, {
                            pid: z.pid
                        });
                        f || (f = z, w.push(f));
                        f.selected = z.selected;
                        f.showInDash = z.showInDash;
                        if (z = a.convertToSafeObject(w)) a.set("logChannels",
                            z), c && a.getCurrentLogChannels(c, d)
                    }
                }, function() {
                    n.toast("Failed updating channels list.");
                    d && d()
                })
            }, function() {
                n.toast("Failed updating channels list.");
                d && d()
            })
        };
        a.logConfig = function(b, c, d) {
            b && c.channels && (c = c.channels.slice(0), c = a.convertToSafeObject(c), a.setForVin("logChannels", c, b), d && a.$broadcast("logchannels"), a.updateUnitsForDisplay())
        };
        a.logConfigAll = function(b, c, d) {
            if (b && c.channels) {
                c = c.channels.slice(0);
                var w = 0,
                    z;
                for (z in c) !0 === c[z].ram && w++;
                a.hasAdvancedChannels = 0 < w;
                c = a.convertToSafeObject(c);
                a.setForVin("logChannelsAll", c, b);
                d && a.$broadcast("logchannels")
            }
        };
        a.updateTimer = function(b) {
            if (!a.timeinterval && b.executionTime) {
                b = b.executionTime;
                var c = new Date(b.plannedEndTime),
                    d = new Date(b.currentTime);
                g.swal({
                    title: "Flashing",
                    text: "\x3cb\x3e***WARNING:\x3c/b\x3e Using a battery charger is highly recommended! Turn headlights and climate control OFF and plug the driver's side seatbelt in. Do not open/close doors while flashing. If using a piggyback device make sure its off or in map 0. Time counter is only an estimate, actual time may vary.\x3cbr\x3e\x3cbr\x3eEstimated Remaining Time: \x3cdiv id\x3d'timeEst'\x3eCalculating..\x3c/div\x3e",
                    type: "warning",
                    confirmButtonClass: "btn-warning",
                    showConfirmButton: !1,
                    showCancelButton: !1,
                    html: !0
                });
                h(function() {
                    a.initializeClock(d, c)
                }, 100)
            }
        };
        a.initializeClock = function(b, c) {
            var d = document.getElementById("timeEst");
            if (d && !a.timeinterval) {
                b = c - b;
                var w = new Date((new Date).getTime() + b);
                a.timeinterval = setInterval(function() {
                    var b = a.getTimeRemaining(w);
                    d.innerHTML = b.minutes + "m " + b.seconds + "s";
                    2E3 >= b.total && (a.flashFinishingUp = !0, d.innerHTML = "Finishing up...", clearInterval(a.timeinterval), a.timeinterval =
                        null)
                }, 1E3)
            }
        };
        a.getTimeRemaining = function(a) {
            a = Math.abs(a.getTime() - (new Date).getTime());
            return {
                total: a,
                minutes: Math.abs(Math.floor(a / 1E3 / 60 % 60)),
                seconds: Math.abs(Math.floor(a / 1E3 % 60))
            }
        };
        a.$watch("flashing", function(b) {
            b || (a.flashFinishingUp = !1)
        });
        a.agentOff = function() {
            k.clearCache();
            a.bmdConnected = !1;
            a.detectedOBDAgent = !1;
            a.noDetectedOBDAgent = !0;
            a.detectingOBDAgent = !0;
            a.bmdConnecting = !1;
            a.vehicleIdFailed = !1;
            a.burbleOverride = {
                enabled: !1,
                agg: 0,
                dur: 0
            };
            a.mapSlot = -1;
            a.flexOverride = {
                blendPercent: 0,
                enabled: !1
            };
            a.attemptOBDAgentConnectFromIps();
            a.vinCheck && (console.log("Closing vin check interval"), v.cancel(a.vinCheck));
            a.bmdConnected = !1;
            a.detectedOBDAgent = !1;
            a.VIN = null;
            a.ROM = null;
            a.customROMConn = null;
            a.sigValid = null;
            a.unlockStatus = null;
            a.dmeMfrDate = null;
            a.ips = [];
            REMOTE_IP_ADDR && "localhost" !== REMOTE_IP_ADDR && 0 < REMOTE_IP_ADDR.trim().length && a.ips.push(REMOTE_IP_ADDR);
            REMOTE_IP_ADDR = null;
            a.ips.push("localhost");
            a.agentVersion = null;
            a.agentBuildId = null;
            a.agentEmbed = null;
            a.noDetectedOBDAgent = !1;
            a.detectingOBDAgent = !0;
            a.bmdConnecting = !1;
            a.startDashClosed = !1;
            a.currentVehicleIds = null;
            a.vehicleData = null;
            a.offlineLogs = [];
            a.dashData = null;
            a.ipsAttempted = [];
            a.flashing && (a.flashing = !1, a.progressbar.setColor("red"), a.progressbar.complete(), g.swal({
                title: "Disconnect",
                text: "Your OBD Agent disconnected from this screen. Your flash is still in progress. You can refresh the screen and wait for the flash to finish up. Let us know through Tech Support if this causes an issue.",
                type: "warning"
            }));
            a.isRegisteredDeviceConnected();
            a.$broadcast("agentoff");
            a.reconnOBDInterval && v.cancel(a.reconnOBDInterval);
            a.reconnOBDInterval = v(a.reconnectOBDAgent, 1E3)
        };
        a.$watch("VIN", function(b, c) {
            b && 17 === b.length && a.updateLogDashChannelData(b)
        });
        a.offlineModeAvailable = !1;
        a.updateOfflineModeAvailable = function() {
            if (a.VIN) {
                var b = a.getForVin("logChannels", null, a.VIN);
                if (b && 0 < b.length) {
                    a.offlineModeAvailable = a.isRegisteredDeviceConnected();
                    return
                }
            }
            a.offlineModeAvailable = !1
        };
        a.handleCodesResponse = function(b) {
            if (b && b.codes && "SUCCESS" === b.status) {
                var c =
                    Object.keys(b.codes);
                a.codes = c && 0 < c.length ? b.codes : [];
                g.close();
                r.go("bootmod3.codes")
            } else g.swal({
                title: "Failed",
                text: "Could not read codes at this time. Double check your connectivity with the car.",
                type: "error",
                showCancelButton: !1
            })
        };
        a.agentVersionCheck = function() {
            if (a.agentVersion) {
                var b = a.agentVersion.split("."),
                    b = parseInt(b[0] + b[1] + b[2]),
                    c = a.minAgentVersion.split("."),
                    c = parseInt(c[0] + c[1] + c[2]);
                !a.versionErrorMsgShown && b < c ? (a.agentOutdated = !0, a.showAgentOutdatedMsg()) : (a.agentOutdated = !1, a.versionErrorMsgShown = !1)
            }
        };
        a.showWhatsNew = function(b, c) {
            var d = a.getForCurrUser("whatsNewShownForVer", null);
            if (!d || d !== a.getForCurrUser("whatsNewShownForVer", null) || c) a.setForCurrentUser("whatsNewShownForVer", a.appVersion), t.show({
                controller: "DialogController",
                templateUrl: "templates/whatsnew.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: b,
                clickOutsideToClose: !0,
                fullscreen: !1
            })
        };
        a.showAgentOutdatedMsg = function() {
            a.versionErrorMsgShown = !0;
            window.cordova ? "1" === a.agentEmbed ? g.swal({
                    title: "Warning",
                    text: "OBD Agent in the current app seems to be outdated. Minimum version is " +
                        a.minAgentVersion + ". Please update your app before further usage with the vehicle. Contact Tech Support at support@protuningfreaks.com for any help if required.",
                    type: "warning",
                    showCancelButton: !1,
                    allowOutsideClick: !1,
                    clickOutsideToClose: !1,
                    html: !0
                }) : "iOS" === window.cordova.platform ? 0 === a.agentVersion.indexOf("0.10.") ? g.swal({
                    title: "Warning",
                    text: "WiFi connection on iOS devices no longer uses a hotspot connection. Update your WiFi agent's SD card and connect your phone to it using the BM3_NET WiFi network. You can also use a direct ENET cable connection to your iOS device. For any questions contact us at support@protuningfreaks.com.",
                    type: "warning",
                    showCancelButton: !1,
                    allowOutsideClick: !1,
                    clickOutsideToClose: !1,
                    html: !0
                }) : g.swal({
                    title: "Warning",
                    text: "OBD Agent in the current app seems to be outdated. Minimum version is " + a.minAgentVersion + ". Please update your app before further usage with the vehicle. You can also use a direct ENET cable connection to your iOS device. Contact Tech Support at support@protuningfreaks.com for any help if required.",
                    type: "warning",
                    showCancelButton: !1,
                    allowOutsideClick: !1,
                    clickOutsideToClose: !1,
                    html: !0
                }) :
                0 === a.agentVersion.indexOf("0.10.") ? g.swal({
                    title: "Warning",
                    text: "This update of the app requires an SD card update of the firmware on your hardware OBD Agent box. It is available for download on our support website. You can also use a direct ENET cable connection to your Android device. For any questions contact us at support@protuningfreaks.com.",
                    type: "warning",
                    showCancelButton: !1,
                    allowOutsideClick: !1,
                    clickOutsideToClose: !1,
                    html: !0
                }) : g.swal({
                    title: "Warning",
                    text: "This update of the app requires an update to the hardware OBD Agent. It is available for download on our support website. You can also use a direct ENET cable connection to your Android device. For any questions contact us at support@protuningfreaks.com.",
                    type: "warning",
                    showCancelButton: !1,
                    allowOutsideClick: !1,
                    clickOutsideToClose: !1,
                    html: !0
                }) : g.swal({
                    title: "Warning",
                    text: "Your OBD Agent is lower than minimum " + a.minAgentVersion + ". Please update it to latest before further usage with the vehicle. Contact Tech Support at support@protuningfreaks.com for any help if required.",
                    type: "warning",
                    showCancelButton: !1,
                    allowOutsideClick: !1,
                    clickOutsideToClose: !1,
                    html: !0
                })
        };
        a.handleDMERead = function(b, c) {
            "VEHICLE_NOT_CONNECTED" === b.status ? g.swal({
                title: "No connection",
                text: "Vehicle not connected.",
                type: "error",
                showCancelButton: !1
            }) : "READING" === b.status ? g.swal({
                title: "In progress",
                text: "This feature is in testing. DME read is in progress. Once the readout is complete it will show up as a map under My Maps.",
                type: "info",
                showCancelButton: !1
            }) : "CURRENT_MAP_NOT_STOCK" === b.status ? g.swal({
                title: "Error",
                text: "Current map is not a stock map.",
                type: "error",
                showCancelButton: !1
            }) : "ERROR" === b.status ? g.swal({
                title: "Error",
                text: "Error reading DME. Please try again and make sure your ignition is on and motor is off.",
                type: "error",
                showCancelButton: !1
            }) : (n.toast("DME read successfully, attempting upload.."), a.uploadDMERead(b, c))
        };
        a.reconnectSockets = function() {
            if (chrome.sockets) {
                a.socketsInterval || (a.socketsInterval = v(function() {
                    a.bmdConnecting || a.bmdConnected || a.detectedOBDAgent || a.lastAgentUpdate && !(a.lastAgentUpdate.getTime() + 1E4 < (new Date).getTime()) || a.reconnectSockets()
                }, 3E3));
                if (a.vinSocketUdpId) try {
                    chrome.sockets.udp.close(a.vinSocketUdpId), a.vinSocketUdpId = null
                } catch (A) {}
                chrome.sockets.udp.create({}, function(b) {
                    a.vinSocketUdpId =
                        b.socketId;
                    chrome.sockets.udp.setBroadcast(a.vinSocketUdpId, !0, function() {});
                    chrome.sockets.udp.bind(a.vinSocketUdpId, "0.0.0.0", 9876, function(a) {})
                });
                a.onReceiveStarted || (chrome.sockets.udp.onReceive.addListener(function(b) {
                    a.lastAgentUpdate = new Date;
                    var c = String(b.remoteAddress);
                    if ((!a.bmdConnected || !a.VIN) && 0 > c.indexOf(":"))
                        if (c !== AGENT_IP_ADDR) {
                            if (console.log("Agent IP picked up " + c + ", old " + AGENT_IP_ADDR), b = String.fromCharCode.apply(null, new Uint8Array(b.data)), -1 < b.indexOf("V:") && 17 === b.substring(2).trim().length) {
                                a.vinMsgShown ||
                                    (a.vinMsgShown = !0);
                                REMOTE_IP_ADDR = AGENT_IP_ADDR = c;
                                try {
                                    console.log("Disconnecting current ws connection"), e.disconnect()
                                } catch (z) {}
                            }
                        } else c = String.fromCharCode.apply(null, new Uint8Array(b.data)), -1 < c.indexOf("V:") ? (a.vinMsgShown || (a.vinMsgShown = !0), a.VIN = c.substring(2)) : "VIN_NOT_DETECTED" === c ? (a.noVinMsgShown || (a.noVinMsgShown = !0), a.VIN = null, a.customROMConn = null, a.sigValid = null, a.unlockStatus = null, a.ROM = null, a.devInfo = null, a.vehicleData = null, e.send("/app/id", {}, {
                            jwt: a.get("token")
                        })) : (a.udpData = !0,
                            a.dashData = c, a.lastDashUpdate = new Date, window.requestAnimationFrame(a.updateGauges))
                }), a.onReceiveStarted = !0)
            }
        };
        a.fetchVin = function() {
            e.send("/app/vin", {}, {
                jwt: a.get("token")
            })
        };
        a.fetchIdsNoDebounce = function() {
            e.send("/app/ids", {
                ecu: 18
            }, {
                jwt: a.get("token")
            })
        };
        a.fetchIds = _.debounce(a.fetchIdsNoDebounce, 1E3, !0);
        a.reconnectOBDAgent = function() {
            v.cancel(a.reconnOBDInterval);
            a.bmdConnecting || a.bmdConnected || a.detectedOBDAgent || (a.bmdConnecting = !0, a.vinMsgShown = !1, a.noVinMsgShown = !1, AGENT_IP_ADDR && (window.BMD_URL =
                "http://" + AGENT_IP_ADDR + ":" + AGENT_PORT + "/ws", e.setConnectUrl(), e.connect({
                    jwt: a.get("token"),
                    vin: a.VIN
                }).then(function(b) {
                    a.bmdConnected = !0;
                    e.sock.onclose = a.agentOff;
                    a.bmdConnecting = !1;
                    a.detectedOBDAgent = !0;
                    a.noDetectedOBDAgent = !1;
                    a.detectingOBDAgent = !1;
                    a.autolog = !1;
                    a.initDashSubscribers();
                    a.updateAgentAutoLogSettings();
                    a.readDMESub = e.subscribe("/user/queue/readdme", function(b) {
                        a.handleDMERead(b, !1)
                    });
                    a.mapSlotSub = e.subscribe("/user/queue/mapsw", function(b) {
                        a.mapSlot = b.slot
                    });
                    a.mapSlotSub = e.subscribe("/user/queue/antitheft",
                        function(b) {
                            a.antitheft = b.enable
                        });
                    a.readDMEFullSub = e.subscribe("/user/queue/readdmefull", function(b) {
                        a.handleDMERead(b, !0)
                    });
                    a.clearCodes = e.subscribe("/user/queue/clearcodes", function(b) {
                        a.handleCodesResponse(b)
                    }, {
                        jwt: a.get("token")
                    });
                    a.exFlap = e.subscribe("/user/queue/exhaustflap", function() {
                        g.swal({
                            title: "Success",
                            text: "Exhaust flap actuated successfully.",
                            type: "success",
                            showCancelButton: !1
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.resetecu = e.subscribe("/user/queue/resetecu", function() {
                        g.swal({
                            title: "Success",
                            text: "DME reset successfully.",
                            type: "success",
                            showCancelButton: !1
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.clearAdapts = e.subscribe("/user/queue/clearadaptations", function() {
                        g.swal({
                            title: "Success",
                            text: "All adaptations have been reset successfully.",
                            type: "success",
                            showCancelButton: !1
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.clearAdaptsSpecific = e.subscribe("/user/queue/clearadaptationsspecific", function() {
                        g.swal({
                            title: "Success",
                            text: "Selected adaptation value has been reset successfully.",
                            type: "success",
                            showCancelButton: !1
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.readCodes = e.subscribe("/user/queue/readcodes", function(b) {
                        a.handleCodesResponse(b)
                    }, {
                        jwt: a.get("token")
                    });
                    a.activesound = e.subscribe("/user/queue/activesound", function(a) {
                        g.swal({
                            title: "Success",
                            text: "Active sound settings changed successfully.",
                            type: "success",
                            showCancelButton: !1
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.flashProgressSub = e.subscribe("/queue/fp", function(b) {
                        var c = b.msg,
                            d = "Please wait..";
                        0 === b.percentDone ? d = "Please wait.." : 0 < b.percentDone && 100 > b.percentDone ? d = b.percentDone +
                            "% completed" : 100 === b.percentDone && (d = "Finishing up ..");
                        c && 0 < c.trim().length && (a.flashing = !0, g.swal({
                            title: d,
                            text: c,
                            type: "warning",
                            confirmButtonClass: "btn-warning",
                            showConfirmButton: !1,
                            showCancelButton: !1,
                            allowOutsideClick: !1,
                            clickOutsideToClose: !1,
                            html: !0
                        }), a.progressbar.set(b.percentDone))
                    }, {
                        jwt: a.get("token")
                    });
                    a.dmeReadSub = e.subscribe("/queue/drp", function(b) {
                        a.readingDME = !0;
                        g.swal({
                            title: 0 === b.percentDone ? "Please wait.." : 0 < b.percentDone && 100 > b.percentDone ? b.percentDone + "% completed" : 100 === b.percentDone ?
                                "Finishing up .." : "Please wait",
                            text: b.msg,
                            type: "warning",
                            confirmButtonClass: "btn-warning",
                            showConfirmButton: !1,
                            showCancelButton: !1,
                            allowOutsideClick: !1,
                            clickOutsideToClose: !1,
                            html: !0
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.logChannelsBmd = e.subscribe("/user/queue/ram", function(b) {
                        console.log(b);
                        a.hasAdvancedChannels = !1;
                        b && "SUCCESS" === b.status && b.channels && 0 < b.channels.length && a.getCurrentLogChannelsAll(function(c) {
                            if (0 < c.length) {
                                var d = _.where(c, {
                                    ram: !0
                                });
                                0 < d.length && (_.each(b.channels, function(a) {
                                    _.findWhere(d, {
                                        name: a.name
                                    }) || (_.findWhere(d, {
                                        pid: a.pid
                                    }) && (c = _.filter(c, function(b) {
                                        return b.pid !== a.pid
                                    })), c.push(a))
                                }), a.logConfigAll(a.VIN, {
                                    channels: c
                                }, !0))
                            }
                        }, function() {
                            n.toast("Failed to update current log channels listing.")
                        })
                    });
                    a.vinBmd = e.subscribe("/user/queue/vin", function(b) {
                        if (!b || !b.vin || b.vin !== a.VIN || b.rom !== a.ROM)
                            if (v.cancel(a.idGetterInterval), b && b.vin) {
                                a.VIN = b.vin;
                                a.ROM = b.rom;
                                a.getForVin("logChannels", null, a.VIN);
                                if (b = a.getForCurrUser("devices"))
                                    for (var c = 0; c < b.length; c++) {
                                        var d = b[c];
                                        d && d.id &&
                                            (d.id === a.VIN ? (d.available = !0, a.set("lastDevice", d)) : d.available = !1)
                                    }
                                a.updateOfflineModeAvailable();
                                a.$broadcast("devices");
                                a.$apply()
                            } else a.VIN = null, a.ROM = null, a.customROMConn = null, a.sigValid = null, a.unlockStatus = null, a.dmeMfrDate = null, a.devInfo = null, a.vehicleData = null, a.$broadcast("devices"), a.idGetterInterval = v(function() {
                                e.send("/app/id", {}, {
                                    jwt: a.get("token")
                                })
                            }, 3E3)
                    }, {
                        jwt: a.get("token")
                    });
                    a.burbleSub = e.subscribe("/user/queue/rburble", function(b) {
                        a.burbleOverride = b.enabled ? {
                            enabled: JSON.parse(b.enabled),
                            agg: JSON.parse(b.agg),
                            dur: 0
                        } : {
                            enabled: !1,
                            agg: 0,
                            dur: 0
                        }
                    }, {
                        jwt: a.get("token")
                    });
                    a.flexSub = e.subscribe("/user/queue/rflex", function(b) {
                        a.flexOverride = {
                            blendPercent: JSON.parse(b.blendPercent),
                            enabled: JSON.parse(b.enabled)
                        }
                    }, {
                        jwt: a.get("token")
                    });
                    a.removeLogSub = e.subscribe("/user/queue/clearlog", function(b) {
                        g.close();
                        e.send("/app/getlogs", {}, {
                            jwt: a.get("token")
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.getLogSub = e.subscribe("/user/queue/getlog", function(b) {
                        a.$broadcast("showlog", b)
                    }, {
                        jwt: a.get("token")
                    });
                    a.stopLoggingSub =
                        e.subscribe("/user/queue/stoplogging", function(b) {
                            g.close();
                            a.logging = !1;
                            a.$broadcast("logupload");
                            a.bmdConnected && e.send("/app/getlogs", {}, {
                                jwt: a.get("token")
                            })
                        }, {
                            jwt: a.get("token")
                        });
                    a.startLoggingSub = e.subscribe("/user/queue/startlogging", function(b) {
                        b.status && "STARTED" === b.status && (a.logging = !0);
                        g.close()
                    }, {
                        jwt: a.get("token")
                    });
                    a.removeAllLogsSub = e.subscribe("/user/queue/clearlogs", function(b) {
                        g.close();
                        e.send("/app/getlogs", {}, {
                            jwt: a.get("token")
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.currentVehicleIdsSub =
                        e.subscribe("/user/queue/ids", function(b) {
                            console.log("got ids");
                            console.log(b);
                            "SUCCESS" === b.status ? (console.log("Vehicle ids success"), a.vehicleIdFailed = !1, a.setLastFlashMapForVin(a.VIN, b.mapId), a.lastMapId = b.mapId, a.currentVehicleIds = b.vehicleData.vid) : (console.log("Vehicle ids failed"), a.vehicleIdFailed = !0, a.currentVehicleIds = null)
                        }, {
                            jwt: a.get("token")
                        });
                    a.logsSub = e.subscribe("/user/queue/getlogs", function(b) {
                        a.$broadcast("scroll.refreshComplete");
                        a.$broadcast("offlinelogs");
                        a.offlineLogs = b
                    }, {
                        jwt: a.get("token")
                    });
                    a.versionErrorMsgShown = !1;
                    a.vehicleIdSub = e.subscribe("/user/queue/id", function(b) {
                        console.log("got id");
                        console.log(b);
                        if ("SUCCESS" === b.status) {
                            console.log("Vehicle id success");
                            a.$broadcast("vehicledata");
                            a.vehicleIdFailed = !1;
                            a.VIN = b.vin;
                            a.ROM = b.rom;
                            a.sigValid = b.sigValid;
                            a.unlockStatus = b.unlockStatus;
                            a.dmeMfrDate = b.dmeMfrDate;
                            a.customROMConn = b.crom;
                            e.send("/app/ram", {}, {
                                jwt: a.get("token")
                            });
                            a.getForVin("logChannels", null, a.VIN);
                            var c = a.getForCurrUser("devices");
                            if (c)
                                for (var d =
                                        0; d < c.length; d++) {
                                    var w = c[d];
                                    w && w.id && (w.id === a.VIN ? (w.available = !0, a.set("lastDevice", w)) : w.available = !1)
                                }
                            a.agentVersion = b.agentVersion;
                            a.agentBuildId = b.agentBuildId;
                            a.agentEmbed = b.embed;
                            a.agentOS = b.agentOS;
                            a.pprt = b.pprt;
                            a.agentOSVersion = b.agentOSVersion;
                            p.defaults.headers.common.agentVersion = a.agentVersion;
                            p.defaults.headers.common.agentBuildId = a.agentBuildId;
                            p.defaults.headers.common.agentOS = a.agentOS;
                            p.defaults.headers.common.agentOSVersion = a.agentOSVersion;
                            p.defaults.headers.common.pprt = a.pprt;
                            a.devInfo = b.devInfo;
                            a.vehicleData = b.vehicleData;
                            a.currentVehicleIds = b.vehicleData.vid;
                            a.setLastFlashMapForVin(a.VIN, b.mapId);
                            a.lastMapId = b.mapId;
                            a.setForVin("vehicleData", b.vehicleData);
                            a.$broadcast("vehicleData", a.vehicleData);
                            a.$broadcast("devices");
                            v.cancel(a.idGetterInterval)
                        } else console.log("Vehicle id failed"), a.currentVehicleIds = null, a.vehicleIdFailed = !0, h(function() {
                            e.send("/app/id", {}, {
                                jwt: a.get("token")
                            })
                        }, 3E3)
                    }, {
                        jwt: a.get("token")
                    });
                    a.vinCheck && (console.log("Closing vin check interval"),
                        v.cancel(a.vinCheck));
                    a.vinCheck = v(function() {
                        a.fetchVin()
                    }, 3E3);
                    a.agentVerSub = e.subscribe("/user/queue/version", function(b) {
                        a.agentVersion = b.agentVersion;
                        a.agentBuildId = b.agentBuildId;
                        a.agentEmbed = b.embed;
                        a.agentOS = b.agentOS;
                        a.agentOSVersion = b.agentOSVersion;
                        a.pprt = b.pprt;
                        p.defaults.headers.common.agentVersion = a.agentVersion;
                        p.defaults.headers.common.agentBuildId = a.agentBuildId;
                        p.defaults.headers.common.agentEmbed = a.embed;
                        p.defaults.headers.common.agentOS = a.agentOS;
                        p.defaults.headers.common.agentOSVersion =
                            a.agentOSVersion;
                        p.defaults.headers.common.agentPport = a.agentPport;
                        a.agentVersionCheck()
                    }, {
                        jwt: a.get("token")
                    });
                    e.send("/app/id", {}, {
                        jwt: a.get("token")
                    });
                    e.send("/app/version", {}, {
                        jwt: a.get("token")
                    });
                    a.versionReqDt = (new Date).getTime();
                    a.notifySub = e.subscribe("/user/queue/notify", function(a) {
                        g.swal({
                            title: a.title,
                            text: a.msg,
                            type: a.level,
                            showConfirmButton: a.showOkButton,
                            confirmButtonText: a.okButtonText,
                            showCancelButton: a.showCancelButton,
                            cancelButtonText: a.cancelButtonText,
                            allowOutsideClick: !1,
                            clickOutsideToClose: !1,
                            html: !0
                        });
                        0 < a.autocloseDelaySecs && h(function() {
                            g.close()
                        })
                    });
                    a.flashOfflineSub = e.subscribe("/user/queue/flash", function(b) {
                        a.flashing = !1;
                        window.cordova && window.plugins.insomnia.allowSleepAgain();
                        var c = b.msg;
                        if ("SUCCESS" === b.status) {
                            "C" !== b.type && (a.lastMapId = b.id, a.setLastFlashMapForVin(a.VIN, b.id, new Date));
                            a.progressbar.setColor("green");
                            a.progressbar.complete();
                            a.getClientSession(function() {}, !0);
                            if (b.type)
                                if ("U" === b.type) c = "Flash completed successfully. Subsequent flashes for map switching will take noticeably shorter now that unlock is completed.";
                                else if ("L" === b.type || "LF" === b.type) c = "DME LOCK completed successfully. Vehicle is now on the Stock Tune and the DME is back to factory locked operation.";
                            b.recodeNeeded ? g.swal({
                                title: "DME Coding",
                                text: "Flash was successful but coding failed to apply. Try the 'FLASH FULL AND UNLOCK (Diag Only)' option to recover or the 'RECODE (Diag Only)' option. If still having issues contact Tech Support for assistance.",
                                type: "warning",
                                showCancelButton: !1,
                                allowOutsideClick: !1,
                                clickOutsideToClose: !1,
                                html: !0
                            }) : g.swal({
                                title: "Success",
                                text: c,
                                type: "success",
                                showCancelButton: !1,
                                allowOutsideClick: !1,
                                clickOutsideToClose: !1,
                                html: !0
                            })
                        } else "ERROR_BEFORE_START" === b.status ? (a.progressbar.setColor("yellow"), a.progressbar.complete(), g.swal({
                            title: "Error",
                            text: c,
                            type: "error",
                            showCancelButton: !1,
                            allowOutsideClick: !1,
                            clickOutsideToClose: !1,
                            html: !0
                        }), e.send("/app/maps", {}, {
                            jwt: a.get("token")
                        })) : "WARN_BEFORE_START" === b.status ? (a.progressbar.setColor("yellow"), a.progressbar.complete(), g.swal({
                            title: "Warning",
                            text: c,
                            type: "warning",
                            showCancelButton: !1,
                            allowOutsideClick: !1,
                            clickOutsideToClose: !1,
                            html: !0
                        })) : (a.progressbar.setColor("red"), a.progressbar.complete(), g.swal({
                            title: "Failed",
                            text: "Flash was not successful. To retry cycle the ignition by pressing the START button 3 times (on/off), plug in seatbelt and click the flash button again. Ensure any firewalls, anti-virus such as McAfee or Norton, Windows Defender or similar are all turned off. If error persists please try the Unlock (skip checks) flash option. If still unable to flash after 3-4 tries please contact Tech Support.",
                            type: "error",
                            showCancelButton: !1,
                            allowOutsideClick: !1,
                            clickOutsideToClose: !1,
                            html: !0
                        }));
                        e.send("/app/maps", {}, {
                            jwt: a.get("token")
                        });
                        e.send("/app/id", {}, {
                            jwt: a.get("token")
                        })
                    }, {
                        jwt: a.get("token")
                    });
                    a.$broadcast("agenton")
                }).catch(function(b) {
                    console.error(b);
                    a.bmdConnected || a.agentOff()
                })));
            v.cancel(a.reconnOBDInterval);
            a.reconnOBDInterval = v(a.reconnectOBDAgent, 1E3)
        };
        a.reconnectOBDAgent = _.debounce(a.reconnectOBDAgent, 300, !0);
        a.showDetails = function(b) {
            a.VIN ? a.currentVehicleIds ? t.show({
                controller: "vehicleDetailsCtrl",
                controllerAs: "ctrl",
                templateUrl: "templates/vehicledetails.html",
                parent: angular.element(document.body),
                targetEvent: b,
                preserveScope: !0,
                clickOutsideToClose: !0,
                scope: a,
                fullscreen: !1
            }) : g.swal({
                title: "Data Unavailable",
                text: "Could not obtain vehicle data. Click on the 'Help' button for information on how to connect with your vehicle's OBD port.",
                type: "error"
            }) : g.swal({
                title: "Connection",
                text: "No vehicle connection detected. Click on the 'Help' button for information on how to connect with your vehicle's OBD port.",
                type: "error"
            })
        };
        a.dashMonitorFn = function() {
            a.VIN && a.lastDashUpdate && a.lastDashUpdate.getTime() + 2E3 < new Date && (a.logging && (a.autolog = !1, a.stopLogging()), a.unpauseGauges())
        };
        a.pauseGauges = function() {
            a.bmdConnected && e.send("/app/stopdash", {}, {
                jwt: a.get("token")
            });
            a.dashLive = !1;
            a.logging = !1
        };
        a.initDashSubscribers = function() {
            a.dashDataSub && e.off(a.dashDataSub);
            a.dashStatusSub && e.off(a.dashStatusSub);
            a.dashDataSub = e.subscribe("/queue/dashdata", function(b) {
                a.lastDashUpdate = new Date;
                a.dashLive && (a.dashData =
                    b, "visible" === document.visibilityState && window.requestAnimationFrame(a.updateGauges), a.startDashClosed || (a.startDashClosed = !0))
            }, {
                jwt: a.get("token")
            });
            a.dashStatusSub = e.subscribe("/queue/dashstatus", function(b) {
                (a.dashStatus = b) && "RUNNING" === b ? a.logging = !1 : b && "LOGGING" === b ? a.logging = !0 : b && "LOG_STOPPED" === b && (a.logging = !1, n.toast("Datalog completed."))
            }, {
                jwt: a.get("token")
            })
        };
        a.unpauseGauges = function(b) {
            if (!a.bmdConnected || !a.isRegisteredDeviceConnected() && !a.isAuthorizedTuner()) return !1;
            a.initDashSubscribers();
            !b || _.isEmpty(b) ? a.getCurrentLogChannels(function(b) {
                _.isEmpty(b) ? n.toast("No datalog channels available.") : a.unpauseGauges(b)
            }, function() {
                n.toast("No datalog channels available.")
            }) : h(function() {
                b = a.prepChannelsForAgent(b);
                var c = {
                    diagRequestType: "STREAM",
                    requestId: a.dashId + "",
                    deviceId: a.VIN,
                    userId: a.VIN,
                    channelList: b,
                    autolog: a.autolog,
                    tadd: a.getForCurrUser("selectedEcu", {
                        name: "DME",
                        id: "12"
                    }).id,
                    units: a.getForCurrUser("selectedUnits", {
                        name: "IMPERIAL"
                    }).name,
                    pressurePreference: a.getForCurrUser("selectedPressureSetting", {
                        name: "RELATIVE"
                    }).name,
                    pressureUnits: a.getForCurrUser("pressureUnits", {
                        name: "DEFAULT"
                    }).name,
                    tempUnits: a.getForCurrUser("tempUnits", {
                        name: "DEFAULT"
                    }).name,
                    speedUnits: a.getForCurrUser("speedUnits", {
                        name: "DEFAULT"
                    }).name,
                    torqueUnits: a.getForCurrUser("torqueUnits", {
                        name: "METRIC"
                    }).name,
                    flowUnits: a.getForCurrUser("flowUnits", {
                        name: "METRIC"
                    }).name
                };
                e.send("/app/startdash", c, {
                    jwt: a.get("token")
                });
                a.dashLive = !0
            })
        };
        a.startLogging = function() {
            a.autolog ? n.toast("Auto-logging is enabled. It will automatically log when Accel. Pedal goes past " +
                a.autologThres + ". No need to manually trigger logging when it is enabled.") : a.getCurrentLogChannels(function(b) {
                b = a.prepChannelsForAgent(b);
                var c = a.getForVin("currentMapId"),
                    d = a.getForVin("currentMapName");
                !c && a.ap && (c = a.ap.currentMap);
                !d && a.ap && (d = a.ap.currentMapName);
                a.lastLogId = Date.now();
                b = {
                    diagRequestType: "LOG",
                    requestId: a.lastLogId + "",
                    deviceId: "offline",
                    userId: a.VIN,
                    autolog: !1,
                    mapId: c,
                    mapName: d,
                    channelList: b,
                    tadd: a.getForCurrUser("selectedEcu", {
                        name: "DME",
                        id: "12"
                    }).id,
                    units: a.getForCurrUser("selectedUnits", {
                        name: "IMPERIAL"
                    }).name,
                    pressurePreference: a.getForCurrUser("selectedPressureSetting", {
                        name: "RELATIVE"
                    }).name,
                    pressureUnits: a.getForCurrUser("pressureUnits", {
                        name: "DEFAULT"
                    }).name,
                    tempUnits: a.getForCurrUser("tempUnits", {
                        name: "DEFAULT"
                    }).name,
                    speedUnits: a.getForCurrUser("speedUnits", {
                        name: "DEFAULT"
                    }).name,
                    torqueUnits: a.getForCurrUser("torqueUnits", {
                        name: "METRIC"
                    }).name,
                    flowUnits: a.getForCurrUser("flowUnits", {
                        name: "METRIC"
                    }).name
                };
                e.send("/app/startlogging", b, {
                    jwt: a.get("token")
                })
            }, function() {
                n.toast("Failed to start log")
            })
        };
        a.startLogging = _.debounce(a.startLogging, 300, !0);
        a.stopLogging = function(b) {
            a.autolog ? n.toast("Auto-logging is enabled. It will automatically log when Accel. Pedal goes past " + a.autologThres + ". No need to manually start/stop logs when it is enabled.") : (a.logging = !1, e.send("/app/stoplogging", {}, {
                jwt: a.get("token")
            }))
        };
        a.stopLogging = _.debounce(a.stopLogging, 300, !0);
        a.setLastFlashMapForVin = function(b, c, d) {
            if (!a.lastMapId) {
                var z = a.getForVin("lastFlashDate", null, b);
                !z || d && d > new Date(z) ? (a.lastMapId = c, a.setForVin("currentMapId",
                    c, b), d || (d = new Date), a.setForVin("lastFlashDate", d, b)) : a.lastMapId = a.getForVin("currentMapId", null, b)
            }
        };
        a.uploadDMERead = function(b, c) {
            p({
                method: "POST",
                url: WS_BASE_URL + "/map",
                data: {
                    vin: a.VIN,
                    vid: b.vid,
                    type: c ? "fread" : "pread",
                    data: {
                        data: "base64," + b.data
                    }
                }
            }).then(function(a) {
                if (a = a.data)
                    if ("SUCCESS" === a.status) g.close(), n.toast("Your DME read has been uploaded successfully."), k.clearCache().then(function() {
                        k.nextViewOptions({
                            disableBack: !0
                        });
                        r.go("bootmod3.maps")
                    });
                    else {
                        var b = "Failed uploading map file.";
                        a && a.status && ("FAILED_INTERNAL_ERROR" === a.status ? b = "Failed uploading map file." : "FAILED_INVALID_FILE_DETECTED" === a.status ? b = "Failed uploading map file. It seems to be an invalid or corrupt file." : "FAILED_VEHICLE_TUNE_MISMATCH" === a.status ? b = "Failed uploading map file as it doesn't match your vehicle." : "FAILED_VEHICLE_NOT_DETECTED" === a.status && (b = "Failed uploading map file. Vehicle not connected or no activated devices found in your account. To upload new maps you need have one device fully registered and active in your account."));
                        g.swal({
                            title: "Upload Failed",
                            text: b,
                            type: "error",
                            showConfirmButton: !0,
                            showCancelButton: !1
                        })
                    }
            }, function() {
                g.swal({
                    title: "Map Upload Failed",
                    text: "Failed uploading map file.",
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            })
        };
        a.uploadDMERead = _.debounce(a.uploadDMERead, 300, !0);
        a.toggleChart = function() {
            a.liveChartRunning = !a.liveChartRunning;
            a.stockChart && a.stockChart.xAxis[0].setExtremes()
        };
        a.toggleAutoLog = function() {
            a.VIN ? a.isRegisteredDeviceConnected() || a.isAuthorizedTuner() ? (a.autolog = !a.autolog, !a.autolog && 0 < a.autoCapturedLogs && g.swal({
                title: "Logs Ready",
                text: "You've auto-logged " + a.autoCapturedLogs + " datalogs. Would you like to view them now?",
                html: !0,
                showConfirmButton: !0,
                showCancelButton: !0,
                type: "info"
            }, function(a) {
                a && (k.nextViewOptions({
                    disableBack: !0
                }), h(function() {
                    r.go("bootmod3.datalogs")
                }, 100))
            }), a.autoCapturedLogs = 0, a.updateAgentAutoLogSettings()) : g.swal({
                title: "Invalid VIN",
                text: "You're connected to a vehicle that doesn't match your account.",
                type: "error"
            }) : g.swal({
                title: "No vehicle",
                text: "Vehicle not connected.",
                type: "error"
            })
        };
        a.getCurrentLogChannels = function(b, c) {
            var d = null;
            a.VIN ? d = a.VIN : a.clientSession && a.clientSession.vin && (d = a.clientSession.vin);
            if (d) {
                var e = a.getForVin("logChannels", null, d);
                e && 0 < e.length ? (e = JSON.parse(e), b(e)) : a.getLogConfig(d, b, c)
            } else c && c()
        };
        a.getCurrentLogChannelsAll = function(b, c) {
            var d = null;
            a.VIN ? d = a.VIN : a.clientSession && a.clientSession.vin && (d = a.clientSession.vin);
            if (d) {
                var e = a.getForVin("logChannelsAll", null, d);
                e && 0 < e.length ? (e = JSON.parse(e), b(e)) :
                    a.getLogConfigAll(d, b, c)
            } else c && c()
        };
        a.prepChannelsForAgent = function(a) {
            for (var b = [], c = 0; c < a.length; c++) {
                var d = a[c];
                (d.showInDash || d.required || d.selected) && b.push(d)
            }
            b.sort(function(a, b) {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
            });
            return b
        };
        a.updateAgentAutoLogSettings = function() {
            a.bmdConnected && a.getCurrentLogChannels(function(b) {
                b = a.prepChannelsForAgent(b);
                b = {
                    diagRequestType: "AUTOLOG",
                    requestId: a.dashId + "",
                    deviceId: a.VIN,
                    userId: a.VIN,
                    channelList: b,
                    autolog: a.autolog,
                    units: a.get("selectedUnits", {
                        name: "IMPERIAL"
                    }).name,
                    pressurePreference: a.get("selectedPressureSetting", {
                        name: "RELATIVE"
                    }).name,
                    autologThres: a.get("autologThres", 70),
                    autologCutoffSecs: a.get("autologCutoffSecs", 3),
                    pressureUnits: a.getForCurrUser("pressureUnits", {
                        name: "DEFAULT"
                    }).name,
                    tempUnits: a.getForCurrUser("tempUnits", {
                        name: "DEFAULT"
                    }).name,
                    speedUnits: a.getForCurrUser("speedUnits", {
                        name: "DEFAULT"
                    }).name,
                    torqueUnits: a.getForCurrUser("torqueUnits", {
                        name: "METRIC"
                    }).name,
                    flowUnits: a.getForCurrUser("flowUnits", {
                        name: "METRIC"
                    }).name
                };
                e.send("/app/startdash", b, {
                    jwt: a.get("token")
                })
            }, function() {})
        };
        a.configureUnitsForDisplay = function(b) {
            var c = a.getForCurrUser("selectedUnits", {
                name: "IMPERIAL"
            }).name;
            b.unitsOverride && 0 < b.unitsOverride.trim().length && (c = b.unitsOverride);
            var d = a.getForCurrUser("selectedPressureSetting", {
                name: "RELATIVE"
            }).name;
            b.pressurePreferenceOverride && 0 < b.pressurePreferenceOverride.trim().length && (d = b.pressurePreferenceOverride);
            var e = a.getForCurrUser("pressureUnits", {
                    name: "DEFAULT"
                }).name,
                g = a.getForCurrUser("tempUnits", {
                    name: "DEFAULT"
                }).name,
                h = a.getForCurrUser("speedUnits", {
                    name: "DEFAULT"
                }).name,
                f = a.getForCurrUser("torqueUnits", {
                    name: "METRIC"
                }).name,
                p = a.getForCurrUser("flowUnits", {
                    name: "METRIC"
                }).name,
                n = b.units + "";
            "Engine speed" === b.name && (n = "RPM");
            "C" === b.units || "°C" === b.units ? "IMPERIAL" === c && "METRIC" !== g && (n = "F") : "hPa" === b.units || "MPa" === b.units || "kPa" === b.units || "bar" === b.units ? "IMPERIAL" === c && "METRIC" !== e && (n = "RELATIVE" === d ? "psig" : "psia") : "kg/h" === b.units ? "IMPERIAL" === c && "METRIC" !== p && (n = "lb/min") : "km/h" ===
                b.units ? "IMPERIAL" === c && "METRIC" !== h && (n = "mph") : "Nm" === b.units && "IMPERIAL" === c && "METRIC" !== f && (n = "lb/ft");
            b.maxPeakVal = null;
            b.minPeakVal = null;
            b.unitsForDisplay = n
        };
        a.goConfig = function() {
            a.getCurrentLogChannels(function(b) {
                a.proceedToDashConfig(b)
            }, function() {
                a.offlineMode && g.swal({
                    title: "Not Available",
                    text: "Dash config is not available. You need to log in once to your account to initialize the data for your vehicle.",
                    type: "error"
                })
            })
        };
        a.proceedToDashConfig = function(a) {
            g.close();
            a && 0 < a.length ? (k.nextViewOptions({
                    disableBack: !0
                }),
                h(function() {
                    r.go("bootmod3.configlogs")
                })) : g.swal({
                title: "Not Available",
                text: "Dash configuration not available for your vehicle.",
                type: "error"
            })
        };
        a.resetDash = function() {
            if (a.stockChart) {
                for (var b in a.stockChart.series) a.stockChart.series[b].setData([], !0, !1, !1);
                a.stockChart.xAxis[0].setExtremes()
            }
            if (a.gauges)
                for (var c in a.gauges) b = a.gauges[c], b.chart ? (b.chart.data.datasets[0].data[0] = 0, b.chart.valEl.innerText = 0, b.channel.minPeakVal = 0, b.channel.maxPeakVal = 0, b.chart.minEl.innerText = b.channel.minPeakVal,
                    b.chart.maxEl.innerText = b.channel.maxPeakVal, b.chart.update()) : b.set && b.set(0)
        };
        a.checkAlarms = function(b, c) {
            b = b.channel;
            var d = a.alarms;
            if ("undefined" !== typeof b.alarmMinVal) {
                b.alarmMinVal || (b.alarmMinVal = -1E6);
                var e = Number(b.alarmMinVal),
                    g = b.pid + "_LOW";
                e > Number(c) && (d[g] = {
                    name: g,
                    channel: b,
                    val: c,
                    alarmVal: e,
                    date: Date.now()
                })
            }
            "undefined" !== typeof b.alarmMaxVal && (b.alarmMaxVal || (b.alarmMaxVal = 1E6), e = Number(b.alarmMaxVal), g = b.pid + "_HIGH", e < Number(c) && (d[g] = {
                name: g,
                channel: b,
                val: c,
                alarmVal: e,
                date: Date.now()
            }));
            a.alarms = d
        };
        a.alarmsNotifier = v(function() {
            if (a.dashLive) {
                var b = a.alarms,
                    c;
                for (c in b) {
                    var d = b[c],
                        e = a.gauges[d.channel.pid];
                    e && !e.alarmActive && (document.getElementById("item-" + d.channel.pid).classList.toggle("alarm"), e.alarmActive = !0, e.alarm = d)
                }
            }
        }, 1E3);
        a.alarmsClear = v(function() {
            if (a.dashLive)
                for (var b in a.gauges) {
                    var c = a.gauges[b];
                    c.alarmActive && c.alarm.date + 5E3 < Date.now() && (document.getElementById("item-" + b).classList.toggle("alarm"), c.alarmActive = !1, delete a.alarms[c.alarm.name])
                }
        }, 1E3);
        a.updateGauge =
            function(a, b) {
                a.line ? (b = Number(b).toFixed(a.channel.precision), a.line.append(Date.now(), b)) : a.chart && a.chart.data ? (a.chart.data.datasets[0].data[0] = b, a.chart.valEl.innerText = b, a.chart.minEl.innerText = a.channel.minPeakVal, a.chart.maxEl.innerText = a.channel.maxPeakVal, a.chart.update()) : a.set && a.set(b);
                a.channel.minPeakVal || (a.channel.minPeakVal = 0);
                a.channel.maxPeakVal || (a.channel.maxPeakVal = 0);
                a.channel.minPeakVal = Math.min(b, a.channel.minPeakVal);
                a.channel.maxPeakVal = Math.max(b, a.channel.maxPeakVal)
            };
        a.updateStockChart = function(b) {
            a.liveChartMaxPoints || (a.liveChartMaxPoints = a.get("liveChartMaxPoints", 300));
            if (a.stockChart && b && b.length && 0 < b.length) {
                b = $jscomp.makeIterator(b);
                for (var c = b.next(); !c.done; c = b.next())
                    for (var d = c.value.split(a.dashDataSeparator), c = d[0], d = d[1], e = $jscomp.makeIterator(a.stockChart.series), g = e.next(); !g.done; g = e.next())
                        if (g = g.value, g.visible && g.options.channel.pid === c) try {
                            var h = g.points && g.points.length > a.liveChartMaxPoints;
                            g.addPoint({
                                x: (new Date).getTime(),
                                y: Number(d)
                            }, !1, h, !1);
                            break
                        } catch (f) {
                            console.error(f)
                        }
                        a.stockChart.redraw(!1)
            }
        };
        a.updateGauges = function() {
            if (a.dashLive && (a.liveChartRunning && a.updateStockChart(a.dashData), a.dashData)) try {
                for (var b = Date.now(), c = {}, d = 0; d < a.dashData.length; c = {
                        gauge: c.gauge,
                        val: c.val
                    }, d++) {
                    var e = a.dashData[d].split("+"),
                        g = e[0];
                    c.val = e[1];
                    0 < g.indexOf("_") && (g = g.substring(0, g.indexOf("_")));
                    var h = a.getLogChannel(g);
                    h && (h.val = String(c.val));
                    c.gauge = a.gauges[g];
                    if (c.gauge)
                        if (a.lastUpdate = Date.now(), Promise.resolve().then(function(b) {
                                return function() {
                                    a.checkAlarms(b.gauge,
                                        b.val)
                                }
                            }(c)), 0 >= c.gauge.channel.refreshRate) a.updateGauge(c.gauge, c.val);
                        else {
                            var f = 1E3 / c.gauge.channel.refreshRate;
                            a.lastUpdate && b - f > a.lastUpdate && a.updateGauge(c.gauge, c.val)
                        }
                }
            } catch (K) {}
        };
        a.getLogChannel = function(b) {
            if (a.logChannels)
                for (var c in a.logChannels)
                    if (a.logChannels[c].pid === b) return a.logChannels[c];
            return null
        };
        a.getLogConfig = function(b, c, d) {
            !b && a.clientSession && (b = a.clientSession.vin);
            a.VIN && (b = a.VIN);
            var e = a.getForVin("logChannels", null, b);
            if (e && 0 < e.length && (e = JSON.parse(e), !_.isEmpty(e))) {
                c &&
                    c(e);
                return
            }!b || b && 17 !== b.length ? d && d() : p({
                method: "GET",
                url: WS_BASE_URL + "/logconfig/" + b
            }).then(function(d) {
                a.logConfig(b, d.data, !0);
                c && c(d.data.channels)
            }, function(a) {
                d && d()
            })
        };
        a.getLogConfig = _.debounce(a.getLogConfig, 300, !0);
        a.getLogConfigAll = function(b, c, d) {
            !b && a.clientSession && (b = a.clientSession.vin);
            a.VIN && (b = a.VIN);
            var e = a.getForVin("logChannelsAll", null, b);
            if (e && 0 < e.length && (e = JSON.parse(e), !_.isEmpty(e))) {
                var g = 0,
                    z;
                for (z in e) !0 === e[z].ram && g++;
                a.hasAdvancedChannels = 0 < g;
                c && c(e);
                return
            }!b ||
                b && 17 !== b.length ? d && d() : p({
                    method: "GET",
                    url: WS_BASE_URL + "/logconfigall/" + b
                }).then(function(d) {
                    a.logConfigAll(b, d.data, !0);
                    c && c(d.data.channels)
                }, function(a) {
                    d && d()
                })
        };
        a.getLogConfigAll = _.debounce(a.getLogConfigAll, 300, !0);
        a.updateLogDashChannelData = function(b) {
            a.getLogConfig(b);
            a.getLogConfigAll(b)
        };
        a.attemptOBDAgentConnectFromIps = function() {
            if (a.ips && 0 < a.ips.length && "undefined" !== typeof AGENT_IP_ADDR && !a.detectedOBDAgent && !a.bmdConnecting && !a.bmdConnected) {
                var b = !1,
                    c;
                for (c in a.ips) {
                    var d = a.ips[c];
                    if (0 > a.ipsAttempted.indexOf(d)) {
                        b = !0;
                        AGENT_IP_ADDR = d;
                        a.ipsAttempted.push(d);
                        break
                    }
                }
                b || (a.ipsAttempted = [])
            }
        };
        a.adviseOfflineMode = function() {
            if (a.flashing) return !1;
            var b = window.location.href,
                b = b.substr(b.lastIndexOf("/") + 1);
            if (!(a.get("offlineMode") || -1 < b.indexOf("login"))) {
                var c = !1;
                a.offlineModeAvailable && (0 < b.trim().length && 0 > b.indexOf("login") ? (c = !0, g.swal({
                    title: "Error",
                    text: "Server is down for maintenance while we apply some updates. We can redirect over to offline mode instead for logging, dash and other offline features. Proceed?",
                    type: "error",
                    showCancelButton: !0,
                    cancelButtonText: "Cancel",
                    confirmButtonText: "Offline Mode"
                }, function(b) {
                    b && k.clearCache().then(function() {
                        a.offline()
                    })
                })) : (c = !0, g.swal({
                    title: "Error",
                    text: "Server is down for maintenance while we apply certain updates. You can use offline mode instead for logging, dash and other offline features in the meantime. Proceed?",
                    type: "error",
                    showCancelButton: !0,
                    cancelButtonText: "Cancel",
                    confirmButtonText: "Offline Mode"
                }, function(b) {
                    b && a.offline()
                })));
                return c
            }
        };
        var B = "00001a90 00001a91 00001b90 00001b91 00002a90 00004a90 00004a91 00004a92 00001c90 00004800".split(" ");
        a.isCustomROMBtld = function() {
            return a.customROMConn ? !0 : a.currentVehicleIds && a.currentVehicleIds.bootloaderId && B.includes(a.currentVehicleIds.bootloaderId)
        };
        a.clearCache = function(b) {
            b && a.clearSettings();
            a.remove("offlineMode");
            a.clientSession = null;
            a.hasAdvancedChannels = !0;
            a.license = null;
            a.vehicleData = null;
            a.idGetterInterval = null;
            a.oriVehicleData = null;
            a.ap = null;
            a.devices = null;
            a.flashStatusNeedsDismiss = !1;
            a.startupTime = new Date;
            a.dashData = [];
            a.vinMsgShown = !1;
            a.noVinMsgShown = !1;
            a.channelDataLoaded = !1;
            a.lastAgentUpdate = null;
            a.flashFinishingUp = !1
        };
        a.getClientSession = function(b, c) {
            a.offlineMode ? b && b() : a.clientSession && a.devices && !c ? h(b) : (a.serverConnectAttempted = !1, p({
                method: "GET",
                url: WS_BASE_URL + "/vehicle/clientsession"
            }).then(function(c) {
                a.serverConnectAttempted = !0;
                if ((c = c.data) && !c.userId) a.kick(!0);
                else {
                    a.downForMaintenanceMsg = !1;
                    a.serverConnected = !0;
                    a.clientSession = c;
                    var d = c.agentDeviceList;
                    a.userId = c.userId;
                    a.oriVehicleData = c.vehicleData;
                    a.ignoreBenchUnlock = a.getForVin("ignoreBenchUnlock", !1);
                    a.setForCurrentUser("devices", d);
                    var e = !1;
                    if (d) {
                        for (var g = 0; g < d.length; g++) {
                            var f = d[g];
                            f && f.activated && (a.userVIN = f.id, f.licenses ? (f.id === a.VIN && (e = f.available = !0, a.set("lastDevice", f)), a.license = f.licenses[0], a.ap = a.license.activationProfile, a.setForVin("license", a.license), a.ap.currentMapId && a.setLastFlashMapForVin(a.ap.vin, a.ap.currentMapId, new Date(a.ap.lastFlashDate)), a.setForVin("ap", a.ap)) : a.remove("ap"), a.ipsAttempted = [])
                        }
                        e || a.set("lastDevice", null);
                        a.setForVin("currentMapId", c.currentMap);
                        a.setForVin("currentMapName", c.currentMapName);
                        a.setForCurrentUser("userId", c.userId);
                        a.updateOfflineModeAvailable();
                        a.updateLogDashChannelData(c.vin);
                        a.devices = d;
                        a.$broadcast("devices");
                        b && h(b, 0, !1)
                    }
                }
            }, function(b) {
                a.serverConnectAttempted = !0;
                a.serverConnected = !1;
                a.offlineMode || (403 === b.status ? h(function() {
                    a.kick(!0)
                }) : 499 < b.status && a.isRegisteredDeviceConnected() && h(a.adviseOfflineMode, 2E3))
            }))
        };
        a.getClientSession = _.debounce(a.getClientSession, 300, !0);
        q.handleAuthentication()
    }
]);
angular.module("app.login", []).controller("loginCtrl", ["$scope", "$state", "lock", "authService", "$rootScope", "SweetAlert", "$cookies", "$bmd", "UI", "$location", "$mdDialog", function(b, a, d, c, k, g, l, h, e, q, n) {
    b.webApp = webApp;
    k.updateOfflineModeAvailable();
    b.signin = function() {
        c.login()
    };
    b.$on("$destroy", function() {});
    b.signup = function() {
        c.signup()
    };
    b.goHelp = function() {
        a.go("bootmod3.help", {}, {
            reload: !0
        })
    }
}]).controller("stompController", ["$scope", "$state", "$rootScope", "SweetAlert", "$cookies", "UI", function(b,
    a, d, c, k, g) {
    b.reconnect = function() {
        d.offlineMode ? g.toast("You're running offline mode. Exit back to the login screen to reconnect.") : (d.reconnectCount++, d.reconnectSTOMP())
    }
}]);
angular.module("app.dash", []).controller("dashboardCtrl", ["$route", "$scope", "SweetAlert", "$rootScope", "$bmd", "UI", "$interval", "$timeout", "$mdDialog", "$ionicSideMenuDelegate", "$mdBottomSheet", "$http", "$location", "$ionicScrollDelegate", function(b, a, d, c, k, g, l, h, e, q, n, v, r, x) {
    var t = null,
        p = null,
        C = null,
        y = null,
        B = null;
    c.getForCurrUser("autologThres", 70);
    c.getForCurrUser("autologCutoffSecs", 3);
    c.getForCurrUser("autoShowLog", !0);
    c.getForCurrUser("liveChartMaxPoints", 300);
    var A = document.documentElement;
    A.querySelector(".muurigrid");
    var w = l(c.dashMonitorFn, 1E3);
    a.registerEvents = function() {
        t || (t = c.$watch("VIN", function(b, c) {
            b !== c && a.handleVINConnected(b, c)
        }), c.$watch("clientSession", function(b, c) {
            b && a.loadDashboard(b)
        }), p = c.$on("dashconfigoff", function() {
            a.configureDashOff();
            c.unpauseGauges()
        }), C = c.$on("agentoff", function() {
            a.stopDash()
        }), y = c.$watch("logChannels", function(b, e) {
            e = c.getForCurrUser("startlogmsg");
            var g = c.getForCurrUser("stopdashreminders");
            g || (g = !1);
            e && g ? d.close() : (c.setForCurrentUser("startlogmsg", !0), d.swal({
                title: "Overview",
                text: "Double tap anywhere to start/stop logging. Single-tap any gauge to see its peak values. Press and hold on any gauge to configure it or enter layout mode.",
                type: "info",
                showCancelButton: !0,
                confirmButtonText: "OK",
                cancelButtonText: "Stop Reminders"
            }, function(a) {
                a ? c.setForCurrentUser("stopdashreminders", !1) : c.setForCurrentUser("stopdashreminders", !0)
            }));
            a.handleChannelsUpdate(b)
        }), B = c.$watch(function() {
            return q.getOpenRatio()
        }, function(a, b) {
            b !== a && (0 === a ? (l.cancel(w), w = l(c.dashMonitorFn, 1E3), c.unpauseGauges()) :
                (l.cancel(w), c.pauseGauges()))
        }))
    };
    a.registerEvents();
    a.destroyEvents = function() {
        l.cancel(w);
        t();
        p();
        C();
        y();
        B();
        a.stopDash();
        c.autolog && (c.autolog = !1, c.updateAgentAutoLogSettings());
        window.cordova && window.plugins.insomnia.allowSleepAgain()
    };
    a.$on("$ionicView.beforeLeave", a.destroyEvents);
    a.$on("$destroy", a.destroyEvents);
    c.dashConfigStatus = "off";
    c.gaugeDragEnabled = !1;
    a.configureDash = function(a) {
        n.hide();
        a.preventDefault();
        d.swal({
            title: "Layout Mode",
            text: "You can now reposition gauges. Double-tap any gauge to exit layout mode.",
            type: "info"
        }, function() {
            c.dashConfigStatus = "on";
            c.gaugeDragEnabled = !0
        })
    };
    a.configureDashOff = function(b) {
        b && b.preventDefault();
        c.dashConfigStatus = "off";
        c.gaugeDragEnabled = !1;
        a.start()
    };
    c.lastUpdate = Date.now();
    a.$on("$ionicView.loaded", function() {
        a.registerEvents()
    });
    a.showBottomMenu = function(b, d) {
        "on" !== c.dashConfigStatus && (a.channel = b, n.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/dashconfigbottommenu.html",
            parent: angular.element(document.body),
            targetEvent: d,
            preserveScope: !0,
            clickOutsideToClose: !0,
            scope: a,
            fullscreen: !0
        }).then(function(a) {
            n.hide()
        }).catch(function() {
            n.hide()
        }))
    };
    a.labelUpdate = function(a) {
        return a
    };
    a.flipLiveChart = function(a, b) {
        b.preventDefault();
        b = c.gauges[a.pid];
        n.hide();
        var d = document.getElementById(a.pid),
            e = document.getElementById("chart-" + a.pid);
        if ("block" === d.style.display) {
            var f = new SmoothieChart({
                    grid: {
                        strokeStyle: "#CD6700",
                        fillStyle: "black",
                        lineWidth: 1,
                        millisPerLine: 0,
                        verticalSections: 0,
                        horizontalSections: 0,
                        borderVisible: !1
                    },
                    labels: {
                        fillStyle: "yellow"
                    }
                }),
                g = new TimeSeries;
            f.addTimeSeries(g, {
                lineWidth: 2,
                strokeStyle: "#CD6700",
                fillStyle: "rgba(0,0,0,0.30)"
            });
            0 < a.refreshRate ? f.streamTo(document.getElementById("chart-" + a.pid), 1E3 / a.refreshRate) : f.streamTo(document.getElementById("chart-" + a.pid));
            b.chart = f;
            b.line = g;
            d.style.display = "none";
            e.style.display = "block"
        } else d.style.display = "block", e.style.display = "none", b.chart = null, b.line = null
    };
    a.showPeakValues = function(b, e) {
        e.preventDefault();
        "on" !== c.dashConfigStatus && (n.hide(), a.channel = b, c.gauges[b.pid] && (b =
            c.gauges[b.pid].channel), window.cordova && document.getElementById("rem-" + b.pid).classList.toggle("show"), e = "", e = b.maxPeakVal || b.minPeakVal ? "\x3cdiv class\x3d'maxPeak'\x3eMAX: " + b.maxPeakVal + "\x3c/div\x3e\x3cdiv class\x3d'minPeak'\x3eMIN: " + b.minPeakVal + "\x3c/div\x3e" : "No peak values recorded in this session.", d.swal({
            title: b.name,
            html: !0,
            text: e + "\x3cbr\x3e\x3cbr\x3eDouble-tap any gauge to start/stop logging. Tap and hold any gauge to configure it or use layout mode.",
            type: "info",
            confirmButtonText: "Reset",
            cancelButtonText: "Close",
            showCancelButton: !0
        }, function(a) {
            a && (b.minPeakVal = null, b.maxPeakVal = null)
        }))
    };
    a.configureChannel = function(b, c) {
        n.hide();
        a.channel = b;
        e.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/channelconfig.html",
            parent: angular.element(document.body),
            targetEvent: c,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.stopDash = function() {
        c.pauseGauges();
        if (c.gauges)
            for (var a in c.gauges) {
                var b = c.gauges[a];
                b && b.set(0)
            }
    };
    a.addNewGauge = function(b) {
        c.pauseGauges();
        var d = 0,
            g = 0,
            z = 0,
            f;
        for (f in a.channels) {
            var h = a.channels[f];
            (h.showInDash || h.selected || h.required) && d++;
            h.showInDash && g++;
            !h.selected && !h.required || h.showInDash || z++
        }
        a.filterOnlyLogged = 36 <= d;
        e.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/addchannel.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.setupGrid = function(b) {
        c.gauges = [];
        for (var d = 0; d < b.length; d++) {
            var e = b[d];
            c.configureUnitsForDisplay(e);
            if (e.showInDash && e.selected) {
                var g = c.gauges[e.pid],
                    f = document.getElementById(e.pid);
                f && g || (g = new Gauge(f), c.gauges[e.pid] = g, g.channel = e);
                a.setGaugeOptions(g, e)
            }
        }
        a.grid && a.grid.destroy();
        a.grid = new Muuri(".muurigrid", {
            dragEnabled: !0,
            layout: {
                fillGaps: !0,
                horizontal: !1,
                alignRight: !1,
                alignBottom: !1,
                rounding: !0
            },
            dragHammerSettings: {
                touchAction: "pan-x"
            },
            visibleStyles: {
                opacity: "1",
                transform: "scale(1)"
            },
            hiddenStyles: {
                opacity: "0",
                transform: "scale(0.5)"
            },
            layoutOnResize: 100,
            layoutOnInit: !1,
            layoutDuration: 300,
            layoutEasing: "ease",
            dragStartPredicate: function(b, d) {
                return c.gaugeDragEnabled && a.grid.getItems().indexOf(b) !== a.grid.getItems().length - 1 ? Muuri.ItemDrag.defaultStartPredicate(b, d) : !1
            }
        });
        a.grid.on("dragStart", function() {
            x.freezeAllScrolls(!0);
            q.canDragContent(!1);
            A.classList.add("dragging")
        });
        a.grid.on("dragEnd", function() {
            x.freezeAllScrolls(!1);
            q.canDragContent(!0);
            A.classList.remove("dragging")
        });
        a.grid.on("layoutEnd", function(b) {
            if ("on" === c.dashConfigStatus) {
                var d = !1,
                    f;
                for (f in b) {
                    var e = b[f]._element.id.substring(5),
                        g;
                    for (g in a.channels) {
                        var m = a.channels[g];
                        if (m.pid === e) {
                            d |= m.order !== Number(f);
                            m.order = Number(f);
                            break
                        }
                    }
                }
                d && a.saveConfig()
            }
        });
        h(function() {
            a.grid.refreshItems().layout()
        })
    };
    a.removeGauge = function(b, e) {
        e.preventDefault();
        n.hide();
        d.swal({
            title: "Confirm",
            text: "Are you sure you want to remove the " + b.name + " gauge from the dash?",
            type: "warning",
            confirmButtonText: "Remove",
            closeOnConfirm: !0,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(d) {
            d && (c.dashId = Date.now(), b.showInDash = !1, delete c.gauges[b.pid],
                a.grid.remove(document.getElementById("dashitem-" + b.pid)), a.saveConfig(b))
        })
    };
    a.addGauge = function(b) {
        var d = null;
        b && b.pid && (d = b.pid);
        if (d) {
            if (g.hide(), !c.gauges[d]) {
                var e, h;
                for (h in a.channels)
                    if (e = a.channels[h], e.pid === d) {
                        e.showInDash = !0;
                        break
                    }
                e && (e.order = Object.keys(c.gauges).length, c.pauseGauges(), c.updateChannelDetails(b, function() {
                    a.loadDashboard()
                }))
            }
        } else g.toast("Invalid channel selected..")
    };
    a.saveConfig = function(b, d, e) {
        c.dashId = Date.now();
        b && (a.channel = b);
        if (a.channel) {
            if (d = c.gauges[a.channel.pid])
                for (var g in a.channels) {
                    var f =
                        a.channels[g];
                    if (f.pid === a.channel.pid) {
                        f.minVal = a.channel.minVal;
                        f.maxVal = a.channel.maxVal;
                        f.minValImp = a.channel.minValImp;
                        f.maxValImp = a.channel.maxValImp;
                        f.precision = a.channel.precision;
                        f.pressurePreferenceOverride = a.channel.pressurePreferenceOverride;
                        f.unitsOverride = a.channel.unitsOverride;
                        f.alarmMinVal = a.channel.alarmMinVal;
                        f.alarmMaxVal = a.channel.alarmMaxVal;
                        f.refreshRate = a.channel.refreshRate;
                        f.strokeColor = a.channel.strokeColor;
                        f.colorStart = a.channel.colorStart;
                        f.pointerColor = a.channel.pointerColor;
                        f.pointerStrokeWidth = a.channel.pointerStrokeWidth;
                        f.pointerLength = a.channel.pointerLength;
                        0 < f.pointerStrokeWidth ? (a.channel.pointerLength = .6, f.pointerLength = .6) : (a.channel.pointerLength = 0, f.pointerLength = 0);
                        f.lineThickness = a.channel.lineThickness;
                        d.channel = f;
                        a.setGaugeOptions(d, f);
                        break
                    }
                }
            if (e)
                for (var h in a.channels)
                    if (g = a.channels[h], e || g.pid === a.channel.pid) g.strokeColor = a.channel.strokeColor, g.colorStart = a.channel.colorStart, g.pointerColor = a.channel.pointerColor, g.pointerLength = a.channel.pointerLength,
                        g.pointerStrokeWidth = a.channel.pointerStrokeWidth, 0 < g.pointerStrokeWidth ? (a.channel.pointerLength = .6, g.pointerLength = .6) : (a.channel.pointerLength = 0, g.pointerLength = 0), g.lineThickness = a.channel.lineThickness, (f = c.gauges[g.pid]) && d && f.channel.pid !== d.channel.pid && a.setGaugeOptions(f, g, !0)
        }
        c.pauseGauges();
        c.updateChannelDetails(b, function() {
            a.loadDashboard();
            a.doSaveConfig()
        })
    };
    a.doSaveConfig = function() {
        g.toast("Dash config updated.")
    };
    a.setGaugeOptions = function(a, b, d) {
        a.setOptions({
            angle: b.angle,
            lineWidth: b.lineThickness,
            radiusScale: b.radiusScale,
            pointer: {
                length: b.pointerLength,
                strokeWidth: b.pointerStrokeWidth,
                color: b.pointerColor
            },
            limitMax: !1,
            limitMin: !1,
            animationSpeed: 1,
            colorStart: b.colorStart,
            strokeColor: b.strokeColor,
            highDpiSupport: !1,
            generateGradient: !1
        });
        c.configureUnitsForDisplay(b);
        document.getElementById(b.pid + "_val").style.top = b.pointerStrokeWidth && 0 < b.pointerStrokeWidth ? "110px" : "65px";
        d || (a.minValue = b.minVal, a.maxValue = b.maxVal, a.setTextField(document.getElementById(b.pid + "_val"), b.precision));
        a.channel =
            b;
        a.set(0)
    };
    a.handleVINConnected = function(b, d) {
        b && 0 < b.length && c.getCurrentLogChannels(function(b) {
            a.handleChannelsUpdate(b)
        })
    };
    a.handleChannelsUpdate = function(b) {
        a.start(b)
    };
    a.updateAvailableChannels = function(b) {
        b = _.sortBy(b, "name");
        b.forEach(function(a) {
            c.configureUnitsForDisplay(a)
        });
        a.channels = _.where(b, {
            selected: !0
        })
    };
    a.start = function(b) {
        b && 0 < b.length && (a.updateAvailableChannels(b), h(function() {
            a.setupGrid(b);
            c.unpauseGauges(b)
        }));
        window.cordova && window.plugins.insomnia.keepAwake()
    };
    a.loadDashboard =
        function() {
            c.getCurrentLogChannels(function(b) {
                a.handleChannelsUpdate(b)
            })
        };
    a.loadDashboard()
}]).controller("ChannelConfigCtrl", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", "$rootScope", function(b, a, d, c, k, g, l) {
    function h(a) {
        var b = a.toLowerCase();
        return function(a) {
            return -1 < a.name.toLowerCase().indexOf(b)
        }
    }
    b.selectedChannels = [];
    for (var e in b.channels) a = b.channels[e], a.selected && !a.showInDash && b.selectedChannels.push(a);
    b.hide = function() {
        l.unpauseGauges();
        g.hide()
    };
    b.cancel = function() {
        l.unpauseGauges();
        g.hide()
    };
    this.querySearch = function(a) {
        return a ? b.selectedChannels.filter(h(a)) : b.selectedChannels
    }
}]);
angular.module("app.dash2", []).controller("dashboardCtrl2", ["$route", "$scope", "SweetAlert", "$rootScope", "$bmd", "UI", "$interval", "$timeout", "$mdDialog", "$ionicSideMenuDelegate", "$mdBottomSheet", "$http", "$location", "$ionicScrollDelegate", function(b, a, d, c, k, g, l, h, e, q, n, v, r, x) {
    c.getForCurrUser("autologThres", 70);
    c.getForCurrUser("autologCutoffSecs", 3);
    c.getForCurrUser("autoShowLog", !0);
    c.getForCurrUser("liveChartMaxPoints", 300);
    c.dashConfigStatus = "off";
    c.gaugeDragEnabled = !1;
    c.lastUpdate = Date.now();
    var t =
        null,
        p = null,
        C = null,
        y = null,
        B = null,
        A = l(c.dashMonitorFn, 1E3);
    a.registerEvents = function() {
        t || (t = c.$watch("VIN", function(b, c) {
            b !== c && a.handleVINConnected(b, c)
        }), c.$watch("clientSession", function(b) {
            a.loadDashboard(b)
        }), p = c.$on("dashconfigoff", function() {
            a.configureDashOff();
            c.unpauseGauges()
        }), C = c.$on("agentoff", function() {
            a.stopDash()
        }), y = c.$watch("logChannels", function(b, e) {
            e = c.getForCurrUser("startlogmsg");
            var g = c.getForCurrUser("stopdashreminders");
            g || (g = !1);
            e && g ? d.close() : (c.setForCurrentUser("startlogmsg", !0), d.swal({
                title: "Overview",
                text: "Double tap anywhere to start/stop logging. Single-tap any gauge to see its peak values. Press and hold on any gauge to configure it or enter layout mode.",
                type: "info",
                showCancelButton: !0,
                confirmButtonText: "OK",
                cancelButtonText: "Stop Reminders"
            }, function(a) {
                a ? c.setForCurrentUser("stopdashreminders", !1) : c.setForCurrentUser("stopdashreminders", !0)
            }));
            a.handleChannelsUpdate(b)
        }), B = c.$watch(function() {
            return q.getOpenRatio()
        }, function(a, b) {
            b !== a && (0 === a ? (l.cancel(A),
                A = l(c.dashMonitorFn, 1E3), c.unpauseGauges()) : (l.cancel(A), c.pauseGauges()))
        }))
    };
    a.configureDash = function(a) {
        n.hide();
        a.preventDefault();
        d.swal({
            title: "Layout Mode",
            text: "You can now reposition gauges. Double-tap any gauge to exit layout mode.",
            type: "info"
        }, function() {
            c.dashConfigStatus = "on";
            c.gaugeDragEnabled = !0
        })
    };
    a.configureDashOff = function(a) {
        a && a.preventDefault();
        c.dashConfigStatus = "off";
        c.gaugeDragEnabled = !1
    };
    a.destroyEvents = function() {
        l.cancel(A);
        t();
        p();
        C();
        y();
        B();
        a.stopDash();
        c.autolog && (c.autolog = !1, c.updateAgentAutoLogSettings());
        window.cordova && window.plugins.insomnia.allowSleepAgain()
    };
    a.$on("$ionicView.beforeEnter", a.registerEvents);
    a.$on("$ionicView.beforeLeave", a.destroyEvents);
    a.$on("$destroy", a.destroyEvents);
    a.showBottomMenu = function(b, d) {
        "on" !== c.dashConfigStatus && (c.pauseGauges(), a.channel = b, n.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/dashconfigbottommenu-bars.html",
            parent: angular.element(document.body),
            targetEvent: d,
            preserveScope: !0,
            clickOutsideToClose: !0,
            scope: a,
            fullscreen: !0
        }).then(function(a) {
            c.unpauseGauges();
            n.hide()
        }).catch(function() {
            c.unpauseGauges();
            n.hide()
        }))
    };
    a.labelUpdate = function(a) {
        return a
    };
    a.genColour = function() {
        return Math.floor(200 * Math.random())
    };
    a.createBarChart = function(b) {
        var d = b.minVal,
            e = b.maxVal;
        d || (d = 0);
        e || (e = 0);
        var g = c.gauges[b.pid],
            h = document.getElementById("dash2item-canvas-" + b.pid).getContext("2d"),
            f = document.getElementById("dash2item-" + b.pid + "-val"),
            p = document.getElementById("dash2item-" + b.pid + "-min"),
            n = document.getElementById("dash2item-" +
                b.pid + "-max");
        document.getElementById("dash2item-" + b.pid + "-units").innerText = b.unitsForDisplay;
        b = "rgb(" + a.genColour() + "," + a.genColour() + "," + a.genColour() + ")";
        d = new Chart(h, {
            type: "horizontalBar",
            data: {
                datasets: [{
                    data: [d],
                    backgroundColor: [b],
                    borderColor: [b],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: !0,
                maintainAspectRatio: !1,
                showLines: !1,
                scales: {
                    xAxes: [{
                        display: !0,
                        ticks: {
                            max: e,
                            min: d,
                            maxRotation: 0
                        }
                    }]
                },
                legend: {
                    display: !1
                },
                defaultFontColor: "white"
            }
        });
        g.chart = d;
        g.chart.valEl = f;
        g.chart.minEl = p;
        g.chart.maxEl = n;
        return d
    };
    a.showPeakValues = function(b, e) {
        e.preventDefault();
        "on" !== c.dashConfigStatus && (n.hide(), a.channel = b, c.gauges[b.pid] && (b = c.gauges[b.pid].channel), window.cordova && document.getElementById("rem-" + b.pid).classList.toggle("show"), e = "", e = b.maxPeakVal || b.minPeakVal ? "\x3cdiv class\x3d'maxPeak'\x3eMAX: " + b.maxPeakVal + "\x3c/div\x3e\x3cdiv class\x3d'minPeak'\x3eMIN: " + b.minPeakVal + "\x3c/div\x3e" : "No peak values recorded in this session.", d.swal({
            title: b.name,
            html: !0,
            text: e + "\x3cbr\x3e\x3cbr\x3eDouble-tap any gauge to start/stop logging. Tap and hold any gauge to configure it or use layout mode.",
            type: "info",
            confirmButtonText: "Reset",
            cancelButtonText: "Close",
            showCancelButton: !0
        }, function(a) {
            a && (b.minPeakVal = null, b.maxPeakVal = null)
        }))
    };
    a.configureChannel = function(b, c) {
        n.hide();
        a.channel = b;
        e.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/channelconfig.html",
            parent: angular.element(document.body),
            targetEvent: c,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.stopDash = function() {
        c.pauseGauges();
        if (c.gauges)
            for (var a in c.gauges) {
                var b = c.gauges[a];
                b.chart && (b.chart.data.datasets[0].data[0] = 0, b.chart.update())
            }
    };
    a.addNewGauge = function(b) {
        c.pauseGauges();
        var d = 0,
            g = 0,
            h = 0,
            p;
        for (p in a.channels) {
            var f = a.channels[p];
            (f.showInDash || f.selected || f.required) && d++;
            f.showInDash && g++;
            !f.selected && !f.required || f.showInDash || h++
        }
        a.filterOnlyLogged = 36 <= d;
        e.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/addchannel.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.setupGrid = function(b) {
        c.gauges = [];
        for (var d = 0; d < b.length; d++) {
            var e = b[d];
            c.configureUnitsForDisplay(e);
            if (e.showInDash && e.selected) {
                var g = c.gauges[e.pid];
                document.getElementById(e.pid) && g || (g = {}, c.gauges[e.pid] = g, g.channel = e);
                a.setGaugeOptions(g, e)
            }
        }
    };
    a.removeGauge = function(b, e) {
        e.preventDefault();
        n.hide();
        d.swal({
                title: "Confirm",
                text: "Are you sure you want to remove the " + b.name + " gauge from the dash?",
                type: "warning",
                confirmButtonText: "Remove",
                closeOnConfirm: !0,
                showConfirmButton: !0,
                showCancelButton: !0
            },
            function(d) {
                d && (c.dashId = Date.now(), b.showInDash = !1, delete c.gauges[b.pid], c.pauseGauges(), c.updateChannelDetails(b, function() {
                    a.loadDashboard()
                }))
            })
    };
    a.addGauge = function(b) {
        c.pauseGauges();
        c.updateChannelDetails(b, function() {
            a.loadDashboard()
        })
    };
    a.setGaugeOptions = function(b, d, e) {
        c.configureUnitsForDisplay(d);
        e || (b.minValue = d.minVal, b.maxValue = d.maxVal, b.precision = d.precision);
        b.channel = d;
        a.createBarChart(d)
    };
    a.handleVINConnected = function(b, d) {
        b && 0 < b.length && c.getCurrentLogChannels(function(b) {
            a.handleChannelsUpdate(b)
        })
    };
    a.handleChannelsUpdate = function(b) {
        a.start(b)
    };
    a.updateAvailableChannels = function(b) {
        b = _.sortBy(b, "name");
        b.forEach(function(a) {
            c.configureUnitsForDisplay(a)
        });
        a.channels = _.where(b, {
            selected: !0
        })
    };
    a.start = function(b) {
        b && 0 < b.length && (a.updateAvailableChannels(b), h(function() {
            a.setupGrid(b);
            c.unpauseGauges(b)
        }));
        window.cordova && window.plugins.insomnia.keepAwake()
    };
    a.loadDashboard = function() {
        c.getCurrentLogChannels(function(b) {
            a.handleChannelsUpdate(b)
        })
    };
    h(function() {
        a.loadDashboard()
    })
}]);
angular.module("app.dash3", []).controller("dashboardCtrl3", ["$route", "$scope", "SweetAlert", "$rootScope", "$bmd", "UI", "$interval", "$timeout", "$mdDialog", "$ionicSideMenuDelegate", "$mdBottomSheet", "$http", "$location", "$ionicScrollDelegate", function(b, a, d, c, k, g, l, h, e, q, n, v, r, x) {
    var t = null,
        p = null,
        C = null,
        y = null,
        B = null;
    a.$on("$ionicView.loaded", function() {
        a.registerEvents()
    });
    var A = l(c.dashMonitorFn, 1E3);
    a.registerEvents = function() {
        t || (t = c.$watch("VIN", function(b, c) {
            b !== c && a.handleVINConnected(b, c)
        }), c.$watch("clientSession",
            function(b) {
                a.loadDashboard(b)
            }), p = c.$on("dashconfigoff", function() {
            a.configureDashOff();
            c.unpauseGauges()
        }), C = c.$on("agentoff", function() {
            a.stopDash()
        }), y = c.$watch("logChannels", function(b, e) {
            e = c.getForCurrUser("startlogmsg");
            var g = c.getForCurrUser("stopdashreminders");
            g || (g = !1);
            e && g ? d.close() : (c.setForCurrentUser("startlogmsg", !0), d.swal({
                title: "Overview",
                text: "Double tap anywhere to start/stop logging. Single-tap any gauge to see its peak values. Press and hold on any gauge to configure it or enter layout mode.",
                type: "info",
                showCancelButton: !0,
                confirmButtonText: "OK",
                cancelButtonText: "Stop Reminders"
            }, function(a) {
                a ? c.setForCurrentUser("stopdashreminders", !1) : c.setForCurrentUser("stopdashreminders", !0)
            }));
            a.handleChannelsUpdate(b)
        }), B = c.$watch(function() {
            return q.getOpenRatio()
        }, function(a, b) {
            b !== a && (0 === a ? (l.cancel(A), A = l(c.dashMonitorFn, 1E3), c.unpauseGauges()) : (l.cancel(A), c.pauseGauges()))
        }))
    };
    a.registerEvents();
    a.destroyEvents = function() {
        l.cancel(A);
        t();
        p();
        C();
        y();
        B();
        a.stopDash();
        c.stockChart = null;
        c.autolog &&
            (c.autolog = !1, c.updateAgentAutoLogSettings());
        window.cordova && window.plugins.insomnia.allowSleepAgain()
    };
    a.$on("$ionicView.beforeLeave", a.destroyEvents);
    a.$on("$destroy", a.destroyEvents);
    c.getForCurrUser("autologThres", 70);
    c.getForCurrUser("autologCutoffSecs", 3);
    c.getForCurrUser("autoShowLog", !0);
    c.getForCurrUser("liveChartMaxPoints", 300);
    c.stockChart && (c.stockChart.destroy(), c.stockChart = null);
    document.documentElement.querySelector(".muurigrid");
    a.zoomed = !1;
    a.resetZoom = function() {
        c.stockChart.xAxis[0].setExtremes();
        a.zoomed = !1
    };
    a.createStocksChart = function() {
        if (!c.stockChart) {
            var b = {
                    xAxis: {
                        visible: !1,
                        gridLineWidth: 0,
                        events: {
                            afterSetExtremes: function(b) {
                                a.zoomed = !(this.dataMin === this.min && this.dataMax === this.max)
                            }
                        }
                    },
                    animation: !1,
                    plotOptions: {
                        getExtremesFromAll: !0,
                        visible: !1,
                        line: {
                            animation: {
                                duration: 0
                            },
                            states: {
                                hover: {
                                    enabled: !0,
                                    lineWidth: 2
                                }
                            },
                            showInLegend: !0
                        }
                    },
                    yAxis: [{
                        id: "high",
                        softMin: 0,
                        visible: !1,
                        softMax: 1E3,
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        opposite: !1,
                        startOnTick: !1,
                        endOnTick: !1,
                        minPadding: 0,
                        maxPadding: 0,
                        minorTickLength: 0
                    }, {
                        id: "med",
                        softMin: 0,
                        visible: !1,
                        softMax: 100,
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        startOnTick: !1,
                        endOnTick: !1,
                        minPadding: 0,
                        maxPadding: 0,
                        minorTickLength: 0,
                        opposite: !1
                    }, {
                        id: "low",
                        softMin: 0,
                        visible: !1,
                        softMax: 30,
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        startOnTick: !1,
                        endOnTick: !1,
                        minPadding: 0,
                        maxPadding: 0,
                        minorTickLength: 0
                    }],
                    chart: {
                        zoomType: "x",
                        panning: !0,
                        renderTo: "live-chart",
                        defaultSeriesType: "line",
                        backgroundColor: "#202020"
                    },
                    rangeSelector: {
                        enabled: !1
                    },
                    exporting: !1,
                    reflow: !0,
                    tooltip: {
                        shared: !0,
                        backgroundColor: "rgb(122,122,122)",
                        borderColor: "rgba(100, 100, 100, .90)"
                    },
                    legend: {
                        enabled: !0,
                        backgroundColor: "#454545",
                        borderRadius: 5,
                        borderColor: "#454545",
                        borderWidth: 1,
                        floating: !1,
                        shadow: !0,
                        itemStyle: {
                            fontSize: "8px",
                            font: "8px Trebuchet MS, Verdana, sans-serif",
                            color: "white"
                        },
                        itemHiddenStyle: {
                            color: "grey"
                        }
                    },
                    credits: {
                        enabled: !1
                    },
                    scrollbar: {
                        enabled: !0
                    },
                    series: [],
                    navigator: {
                        adaptToUpdatedData: !1,
                        series: [],
                        height: c.native ? 30 : 40
                    },
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                subtitle: {
                                    text: null
                                },
                                navigator: {
                                    enabled: !1
                                }
                            }
                        }]
                    }
                },
                d = [],
                e;
            for (e in a.channels) {
                var g = a.channels[e],
                    h = g.minVal,
                    f = g.maxVal,
                    p = g.units;
                "IMPERIAL" === c.getForCurrUser("selectedUnits", {
                    name: "IMPERIAL"
                }).name && (h = g.minValImp, f = g.maxValImp, p = g.unitsImp);
                var n = {
                    data: [],
                    type: "line"
                };
                n.name = g.name + "[" + p + "]";
                n.channel = g;
                n.pid = g.pid;
                n.minMax = {
                    min: h,
                    max: f
                };
                d.push(n)
            }
            e = 0;
            for (var k in d) {
                g = d[k];
                e = Math.max(e, g.minMax.max);
                g.yAxis = 50 >= g.minMax.max ? "low" : 300 < g.minMax.max ? "high" : "med";
                var h = !1,
                    l;
                for (l in c.gauges)
                    if (c.gauges[l].channel.pid ===
                        g.pid) {
                        h = !0;
                        break
                    }
                b.series.push(g);
                0 === g.name.indexOf("Accel. Pedal") ? (g.visible = !0, g.showInLegend = !1, b.navigator.series.push(g)) : g.visible = h
            }
            b.yAxis[0].max = e;
            c.stockChart = Highcharts.StockChart(b, function() {})
        }
    };
    c.dashConfigStatus = "off";
    c.gaugeDragEnabled = !1;
    a.configureDash = function(a) {
        n.hide();
        a.preventDefault();
        d.swal({
            title: "Layout Mode",
            text: "You can now reposition gauges. Double-tap any gauge to exit layout mode.",
            type: "info"
        }, function() {
            c.dashConfigStatus = "on";
            c.gaugeDragEnabled = !0
        })
    };
    a.configureDashOff =
        function(b) {
            b && b.preventDefault();
            c.dashConfigStatus = "off";
            c.gaugeDragEnabled = !1;
            a.start()
        };
    a.stopped = !0;
    a.showing = !0;
    c.lastUpdate = Date.now();
    a.showBottomMenu = function(b, d) {
        "on" !== c.dashConfigStatus && (a.channel = b, n.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/dashconfigbottommenu-livechart.html",
            parent: angular.element(document.body),
            targetEvent: d,
            preserveScope: !0,
            clickOutsideToClose: !0,
            scope: a,
            fullscreen: !0
        }).then(function(a) {
            n.hide()
        }).catch(function() {
            n.hide()
        }))
    };
    a.labelUpdate = function(a) {
        return a
    };
    a.genColour = function() {
        return Math.floor(200 * Math.random())
    };
    a.createBarChart = function(b) {
        var d = b.minVal,
            e = b.maxVal,
            g = c.gauges[b.pid],
            h = document.getElementById("dash3item-canvas-" + b.pid).getContext("2d"),
            f = document.getElementById("dash3item-" + b.pid + "-val"),
            p = document.getElementById("dash3item-" + b.pid + "-min"),
            n = document.getElementById("dash3item-" + b.pid + "-max");
        document.getElementById("dash3item-" + b.pid + "-units").innerText = b.unitsForDisplay;
        b = "rgb(" + a.genColour() +
            "," + a.genColour() + "," + a.genColour() + ")";
        g.chart = new Chart(h, {
            type: "horizontalBar",
            data: {
                datasets: [{
                    data: [d],
                    backgroundColor: [b],
                    borderColor: [b],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: !0,
                maintainAspectRatio: !1,
                showLines: !1,
                scales: {
                    xAxes: [{
                        display: !0,
                        ticks: {
                            max: e,
                            min: d,
                            maxRotation: 0
                        }
                    }]
                },
                title: {
                    display: !1
                },
                legend: {
                    display: !1
                },
                defaultFontColor: "white"
            }
        });
        g.chart.rgbColor = b;
        g.chart.valEl = f;
        g.chart.minEl = p;
        g.chart.maxEl = n
    };
    a.showPeakValues = function(b, e) {
        e.preventDefault();
        "on" !== c.dashConfigStatus && (n.hide(),
            a.channel = b, c.gauges[b.pid] && (b = c.gauges[b.pid].channel), window.cordova && document.getElementById("rem-" + b.pid).classList.toggle("show"), e = "", e = b.maxPeakVal || b.minPeakVal ? "\x3cdiv class\x3d'maxPeak'\x3eMAX: " + b.maxPeakVal + "\x3c/div\x3e\x3cdiv class\x3d'minPeak'\x3eMIN: " + b.minPeakVal + "\x3c/div\x3e" : "No peak values recorded in this session.", d.swal({
                title: b.name,
                html: !0,
                text: e + "\x3cbr\x3e\x3cbr\x3eDouble-tap any gauge to start/stop logging. Tap and hold any gauge to configure it or use layout mode.",
                type: "info",
                confirmButtonText: "Reset",
                cancelButtonText: "Close",
                showCancelButton: !0
            }, function(a) {
                a && (b.minPeakVal = null, b.maxPeakVal = null)
            }))
    };
    a.configureChannel = function(b, c) {
        n.hide();
        a.channel = b;
        e.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/channelconfig.html",
            parent: angular.element(document.body),
            targetEvent: c,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.stopDash = function() {
        c.pauseGauges();
        if (c.gauges)
            for (var a in c.gauges) {
                var b = c.gauges[a];
                b.chart && (b.chart.data.datasets[0].data[0] = 0, b.chart.update())
            }
    };
    a.addNewGauge = function(b) {
        c.pauseGauges();
        var d = 0,
            g = 0,
            h = 0,
            p;
        for (p in a.channels) {
            var f = a.channels[p];
            (f.showInDash || f.selected || f.required) && d++;
            f.showInDash && g++;
            !f.selected && !f.required || f.showInDash || h++
        }
        a.filterOnlyLogged = 36 <= d;
        e.show({
            controller: "ChannelConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/addchannel.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.setupGrid = function(b) {
        c.gauges = [];
        for (var d = 0; d < b.length; d++) {
            var e = b[d];
            c.configureUnitsForDisplay(e);
            if (e.showInDash && e.selected) {
                var g = c.gauges[e.pid],
                    h = document.getElementById(e.pid);
                g && h || (g = {}, c.gauges[e.pid] = g, g.channel = e);
                a.setGaugeOptions(g, e)
            }
        }
        a.createStocksChart()
    };
    a.removeGauge = function(b, e) {
        e.preventDefault();
        n.hide();
        d.swal({
            title: "Confirm",
            text: "Are you sure you want to remove the " + b.name + " gauge from the dash?",
            type: "warning",
            confirmButtonText: "Remove",
            closeOnConfirm: !0,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(d) {
            d && (c.dashId = Date.now(), b.showInDash = !1, delete c.gauges[b.pid], c.logConfig(c.VIN, {
                channels: a.channels
            }), c.unpauseGauges(), a.doSaveConfig())
        })
    };
    a.addGauge = function(b) {
        c.pauseGauges();
        c.updateChannelDetails(b, function() {
            a.loadDashboard()
        })
    };
    a.setGaugeOptions = function(b, d, e) {
        c.configureUnitsForDisplay(d);
        e || (b.minValue = d.minVal, b.maxValue = d.maxVal, b.precision = d.precision);
        b.channel = d;
        a.createBarChart(d)
    };
    a.handleVINConnected = function(b, d) {
        b && 0 < b.length && c.getCurrentLogChannels(function(b) {
            a.handleChannelsUpdate(b)
        })
    };
    a.handleChannelsUpdate = function(b) {
        a.start(b)
    };
    a.updateAvailableChannels = function(b) {
        b = _.sortBy(b, "name");
        b.forEach(function(a) {
            c.configureUnitsForDisplay(a)
        });
        a.channels = _.where(b, {
            selected: !0
        })
    };
    a.start = function(b) {
        a.showing = !0;
        b && 0 < b.length && (a.updateAvailableChannels(b), h(function() {
            a.stopped = !1;
            a.setupGrid(b);
            c.unpauseGauges(b)
        }));
        window.cordova && window.plugins.insomnia.keepAwake()
    };
    a.loadDashboard = function() {
        c.getCurrentLogChannels(function(b) {
            a.handleChannelsUpdate(b)
        })
    }
}]);
angular.module("app.dash4", []).controller("dashboardCtrl4", ["$route", "$scope", "SweetAlert", "$rootScope", "$bmd", "UI", "$interval", "$timeout", "$mdDialog", "$ionicSideMenuDelegate", "$mdBottomSheet", "$http", "$location", "$ionicScrollDelegate", function(b, a, d, c, k, g, l, h, e, q, n, v, r, x) {
    a.channels = [];
    a.selectedUnits = c.getForCurrUser("selectedUnits", {
        name: "IMPERIAL"
    }).name;
    a.selectedPressureSetting = c.getForCurrUser("selectedPressureSetting", {
        name: "RELATIVE"
    }).name;
    a.goUnits = function(b) {
        c.setForCurrentUser("selectedUnits", {
            name: b
        });
        a.selectedUnits = c.getForCurrUser("selectedUnits", {
            name: b
        }).name;
        c.updateUnitsForDisplay(function(b) {
            a.channels = b;
            a.loadDashboard()
        })
    };
    a.goPressure = function(b) {
        c.setForCurrentUser("selectedPressureSetting", {
            name: b
        });
        a.selectedPressureSetting = c.getForCurrUser("selectedPressureSetting", {
            name: b
        }).name;
        c.updateUnitsForDisplay(function(b) {
            a.channels = b;
            a.loadDashboard()
        })
    };
    a.startLogging = function(b) {
        c.VIN ? a.map ? c.isAuthorizedTuner() ? a.checkAccess() && (a.map.vin !== c.VIN ? d.swal({
            title: "Vehicle Mismatch",
            text: "Connected vehicle doesn't match loaded map's VIN.",
            type: "error"
        }) : c.startLogging()) : d.swal({
            title: "Tuner Access",
            text: "To enable logging from the map editor you need to register as a bootmod3 tuner. Please check the User Manual or contact Tech Support.",
            type: "warning"
        }) : d.swal({
            title: "Map Not Open",
            text: "To datalog from the editor you need to open a Map or Tune Request matching the vehicle connected. If you're tuning a customer vehicle ask them to send you a Tune Request from their user account to get started.",
            type: "error"
        }) : d.swal({
            title: "No Vehicle Connected",
            text: "Connect to the vehicle to start datalogging.",
            type: "error"
        })
    };
    var t = null,
        p = null,
        C = null,
        y = null,
        B = null,
        A, w = null;
    a.registerEvents = function() {
        t || (t = c.$watch("VIN", function(b, c) {
            b !== c && a.handleVINConnected(b, c)
        }), p = c.$watch("clientSession", function(b, c) {
            a.loadDashboard()
        }), A = c.$on("startdash", function() {
            a.unpauseGauges()
        }), w = c.$on("stopdash", function() {
            c.pauseGauges()
        }), C = c.$on("dashconfigoff", function() {
            a.configureDashOff()
        }), y = c.$on("agentoff",
            function() {
                c.pauseGauges()
            }), B = c.$watch("logChannels", function(b, c) {
            a.handleChannelsUpdate(b)
        }))
    };
    a.registerEvents();
    a.destroyEvents = function() {
        t();
        p();
        A();
        w();
        C();
        y();
        B()
    };
    a.$on("$destroy", a.destroyEvents);
    c.getForCurrUser("autologThres", 70);
    c.getForCurrUser("autologCutoffSecs", 3);
    c.getForCurrUser("autoShowLog", !0);
    c.getForCurrUser("liveChartMaxPoints", 300);
    c.dashConfigStatus = "off";
    c.gaugeDragEnabled = !1;
    a.setupGrid = function(b) {
        c.gauges = [];
        for (var d = {}, e = 0; e < b.length; d = {
                gaugeEl: d.gaugeEl
            }, e++) {
            var g =
                b[e];
            if (g.selected) {
                var f = c.gauges[g.pid];
                d.gaugeEl = document.getElementById(g.pid);
                d.gaugeEl && f || (f = {}, f.set = function(a) {
                    return function(b) {
                        a.gaugeEl.innerText = b
                    }
                }(d), c.gauges[g.pid] = f, f.channel = g);
                a.setGaugeOptions(f, g)
            }
        }
    };
    a.setGaugeOptions = function(a, b, c) {
        c || (a.minValue = b.minVal, a.maxValue = b.maxVal, a.precision = b.precision);
        a.channel = b
    };
    a.labelUpdate = function(a) {
        return a
    };
    a.genColour = function() {
        return Math.floor(200 * Math.random())
    };
    a.updateAvailableChannels = function(b) {
        b = _.sortBy(b, "name");
        b.forEach(function(a) {
            c.configureUnitsForDisplay(a)
        });
        a.channels = _.where(b, {
            selected: !0
        })
    };
    a.handleVINConnected = function(b, d) {
        b && 0 < b.length && c.getCurrentLogChannels(function(b) {
            a.handleChannelsUpdate(b)
        })
    };
    a.handleChannelsUpdate = function(b) {
        a.start(b)
    };
    a.start = function(b) {
        b && 0 < b.length && (a.updateAvailableChannels(b), a.setupGrid(b), a.dashShowing && c.unpauseGauges(b));
        window.cordova && window.plugins.insomnia.keepAwake()
    };
    a.loadDashboard = function() {
        c.getCurrentLogChannels(function(b) {
            a.handleChannelsUpdate(b)
        })
    };
    a.loadDashboard()
}]);
angular.module("app.logs", []).controller("datalogsCtrl", ["$scope", "SweetAlert", "$rootScope", "store", "$log", "$state", "$ionicHistory", "UI", "$interval", "$ionicPopover", "$ionicModal", "$cordovaClipboard", "$bmd", "$timeout", "$mdBottomSheet", "$http", "$mdDialog", "$ionicFilterBar", function(b, a, d, c, k, g, l, h, e, q, n, v, r, x, t, p, C, y) {
    function B(a) {
        return !isNaN(parseFloat(a)) && isFinite(a)
    }
    var A = null,
        w = null;
    b.registerEvents = function() {
        A || (A = d.$on("showlog", function(a, c) {
            d.autolog ? (d.autoCapturedLogs || (d.autoCapturedLogs =
                0), d.autoCapturedLogs++, h.toast(d.autoCapturedLogs + " datalogs auto-captured.")) : d.autoShowLog && 0 === d.autoCapturedLogs && b.showGraph(c)
        }), w = d.$on("logupload", function() {
            b.getLogs()
        }))
    };
    b.registerEvents = _.debounce(b.registerEvents, 300, !0);
    b.$on("$destroy", function() {
        b.destroyEvents()
    });
    b.showFilterBar = function() {
        y.show({
            items: b.logs,
            update: function(a) {
                b.logs = a
            }
        })
    };
    d.$watch("detectedOBDAgent", function(a) {
        a || (d.logging = !1)
    });
    b.$on("$ionicView.beforeEnter", function() {
        b.registerEvents()
    });
    b.$on("$ionicView.beforeLeave",
        function() {
            b.destroyEvents()
        });
    b.destroyEvents = function() {
        A && (A(), w())
    };
    b.add = function() {
        g.go("bootmod3.addlog")
    };
    b.removeLog = function(c, e) {
        a.swal({
            title: "Confirm",
            text: "Are you sure you want to remove this log?",
            type: "warning",
            confirmButtonText: "YES",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(g) {
            g && (a.close(), a.swal({
                title: "Please wait",
                text: "Removing log..",
                type: "info"
            }), d.offlineMode || e ? r.send("/app/clearlog", c, {
                jwt: d.get("token")
            }) : (p({
                method: "POST",
                url: WS_BASE_URL + "/clearlog",
                data: {
                    id: c.id
                }
            }).then(function(c) {
                a.close();
                b.getLogs()
            }, function(b) {
                a.swal({
                    title: "Failed",
                    text: "Clear logs request failed. Please try again.",
                    type: "error",
                    confirmButtonClass: "btn-error"
                })
            }), d.bmdConnected && r.send("/app/clearlog", c, {
                jwt: d.get("token")
            })))
        })
    };
    b.showPopup = function(a, c, d, e) {
        b.selectedLog = a;
        b.selectedLog.offline = e;
        b.popover.show(d)
    };
    b.closePopover = function() {
        b.popover && b.popover.hide()
    };
    q.fromTemplateUrl("datalogs-menu.html", {
        scope: b
    }).then(function(a) {
        b.popover = a
    });
    b.showShareLogDialog = function(a, c) {
        b.logURL = a;
        C.show({
            controller: "ShareLinkController",
            templateUrl: "templates/share-link.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: c,
            clickOutsideToClose: !0,
            scope: b,
            preserveScope: !0,
            fullscreen: !0,
            hasBackdrop: !0
        })
    };
    b.logAction = function(c, e) {
        b.selectedAction = c;
        b.selectedEvent = e;
        if ("rename" === c) C.show({
            controller: "LogRenameController",
            templateUrl: "templates/log-rename.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: e,
            clickOutsideToClose: !1,
            scope: b,
            preserveScope: !0,
            fullscreen: !0
        });
        else if (d.offlineMode || b.selectedLog.offline) r.send("/app/getlog",
            b.selectedLog, {
                jwt: d.get("token")
            });
        else if (c = "https://www.bootmod3.net/log?id\x3d" + b.selectedLog.id, "link" === b.selectedAction) b.closePopover(), b.showShareLogDialog(c, e), a.close();
        else if ("download" === b.selectedAction) b.closePopover(), d.openLink("https://www.bootmod3.net/dlog?id\x3d" + b.selectedLog.id, !0), a.close();
        else if (d.native)(e = b.selectedLog.name) && 0 !== e.trim().length || (e = "bootmod3 datalog"), a.swal({
            title: "Graphing..",
            text: "Generating chart for " + e + " please wait..",
            type: "info",
            showCancelButton: !0,
            showConfirmButton: !1
        }), p({
            method: "POST",
            url: WS_BASE_URL + "/getlog",
            data: {
                id: b.selectedLog.id
            }
        }).then(function(a) {
            b.showGraph(a.data)
        }, function(b) {
            a.swal({
                title: "Failed",
                text: "Get log request failed. Please try again.",
                type: "error",
                confirmButtonClass: "btn-error"
            })
        });
        else {
            var g = window.open(c);
            g && !g.closed && "undefined" != typeof g.closed || b.showShareLogDialog(c, e)
        }
        b.closePopover()
    };
    b.removeAll = function(c) {
        !(c || b.logs && 0 !== b.logs.length) || c && !d.offlineLogs ? h.toast("Datalog list is empty.") : a.swal({
            title: "Confirm",
            text: "Are you sure you want to clear all " + (c ? "locally stored" : "cloud stored") + " datalogs?",
            type: "warning",
            confirmButtonText: "YES",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(e) {
            e && (a.swal({
                title: "Please wait",
                text: "Clearing " + (c ? "locally stored" : "cloud stored") + " datalogs, please wait..",
                type: "info",
                showConfirmButton: !1,
                showCancelButton: !1
            }), d.offlineMode || c ? r.send("/app/clearlogs", {}, {
                jwt: d.get("token")
            }) : (p({
                method: "GET",
                url: WS_BASE_URL + "/clearlogs"
            }).then(function(c) {
                    a.close();
                    b.getLogs()
                },
                function(b) {
                    a.swal({
                        title: "Failed",
                        text: "Clear logs request failed. Please try again.",
                        type: "error",
                        confirmButtonClass: "btn-error"
                    })
                }), d.bmdConnected && r.send("/app/clearlogs", {}, {
                jwt: d.get("token")
            })))
        })
    };
    b.removeAll = _.debounce(b.removeAll, 300, !0);
    b.showAfterLogAction = function() {
        b.alert = "";
        t.show({
            templateUrl: "templates/datalog-action-template.html",
            controller: "DatalogActionController",
            disableBackdrop: !0
        }).then(function(a) {
            b.alert = a.name + " clicked!"
        }).catch(function(a) {})
    };
    b.start = function(c, e) {
        d.dashConfigStatus &&
            "on" === d.dashConfigStatus ? d.$broadcast("dashconfigoff") : b.noDevices ? a.swal({
                title: "Error",
                text: "No vehicles present",
                type: "error"
            }) : d.bmdConnected ? d.VIN ? d.logging ? d.stopLogging(c) : d.startLogging(c) : a.swal({
                title: "No connection",
                text: "Vehicle not detected",
                type: "error"
            }) : a.swal({
                title: "No connection",
                text: "OBD Agent not detected",
                type: "error"
            })
    };
    b.start = _.debounce(b.start, 300, !0);
    b.toggleLegend = function() {
        b.chart.legendToggle()
    };
    b.showGraph = function(c) {
        a.close();
        C.show({
            controller: "DialogController",
            templateUrl: "templates/loggraph.html",
            parent: angular.element(document.body),
            clickOutsideToClose: !0,
            scope: b,
            fullscreen: !0,
            preserveScope: !0,
            onComplete: function() {
                b.showGraphOnModalRender(c)
            }
        })
    };
    b.showGraphOnModalRender = function(c) {
        var e = JSON.parse(window.localStorage.getItem("selectedSeries"));
        e || (e = [], window.localStorage.setItem("selectedSeries", JSON.stringify(e)));
        var g = "bootmod3 datalog";
        if (b.selectedLog && b.selectedLog.name) {
            var h = b.selectedLog.name;
            h && 0 < h.trim().length && (g = h)
        }
        g = {
            title: {
                text: g
            },
            xAxis: {
                visible: !1,
                gridLineWidth: 0
            },
            plotOptions: {
                getExtremesFromAll: !1,
                visible: !1,
                line: {
                    states: {
                        hover: {
                            enabled: !0,
                            lineWidth: 2
                        }
                    },
                    events: {
                        legendItemClick: function() {
                            var a = e.indexOf(this.name);
                            this.visible ? 0 > a && e.push(this.name) : -1 < a && e.splice(a, 1);
                            window.localStorage.setItem("selectedSeries", JSON.stringify(e))
                        }
                    },
                    showInLegend: !0
                }
            },
            yAxis: [{
                id: "high",
                softMin: 0,
                softMax: 1E3,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                opposite: !1,
                startOnTick: !1,
                endOnTick: !1,
                minPadding: 0,
                maxPadding: 0,
                minorTickLength: 0
            }, {
                id: "med",
                softMin: 0,
                softMax: 100,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                startOnTick: !1,
                endOnTick: !1,
                minPadding: 0,
                maxPadding: 0,
                minorTickLength: 0,
                opposite: !1
            }, {
                id: "low",
                softMin: 0,
                softMax: 30,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                startOnTick: !1,
                endOnTick: !1,
                minPadding: 0,
                maxPadding: 0,
                minorTickLength: 0
            }],
            chart: {
                zoomType: "x",
                panning: !0,
                renderTo: "log-chart",
                defaultSeriesType: "line",
                backgroundColor: "#ffffff"
            },
            rangeSelector: {
                enabled: !1
            },
            exporting: !1,
            reflow: !0,
            tooltip: {
                shared: !0,
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderColor: "rgba(100, 100, 100, .90)"
            },
            legend: {
                enabled: !0,
                backgroundColor: "#454545",
                borderRadius: 5,
                borderColor: "#454545",
                borderWidth: 1,
                floating: !1,
                shadow: !0,
                itemStyle: {
                    fontSize: "10px",
                    font: "10px Trebuchet MS, Verdana, sans-serif",
                    color: "white"
                },
                itemHiddenStyle: {
                    color: "grey"
                }
            },
            credits: {
                enabled: !0,
                href: "https://www.bootmod3.com",
                text: "powered by bootmod3"
            },
            scrollbar: {
                enabled: !0
            },
            series: [],
            navigator: {
                series: [],
                height: d.native ? 30 : 40
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        subtitle: {
                            text: "bootmod3"
                        },
                        navigator: {
                            enabled: !1
                        }
                    }
                }]
            }
        };
        c = c.data;
        c.data && (c = c.data);
        var h = c.split(/[\r?\n|\r|\n]+/),
            f = h[0].split(",");
        f.pop();
        c = [];
        for (var p = 0; p < f.length; p++) {
            var n = {
                data: [],
                type: "line"
            };
            n.name = f[p];
            n.minMax = {
                min: 0,
                max: 0
            };
            c.push(n)
        }
        c[c.length - 1].visible = !1;
        c[c.length - 2].visible = !1;
        for (f = 1; f < h.length; f++)
            if (0 < h[f].length)
                for (p = h[f].split(","), n = 0; n < p.length; n++) {
                    var k = c[n],
                        l = 0;
                    B(p[n]) && (l = parseFloat(p[n]));
                    k.minMax.min = Math.min(k.minMax.min, l);
                    k.minMax.max = Math.max(k.minMax.max, l);
                    k.data.push(l)
                }
            var h = 0,
                f = 0 === e.length,
                q;
        for (q in c)
            if (p =
                c[q], h = Math.max(h, p.minMax.max), p.yAxis = 50 >= p.minMax.max ? "low" : 300 < p.minMax.max ? "high" : "med", "Time" !== p.name && g.series.push(p), "Accel. Pedal[%]" === p.name && (g.navigator.series = p, p.visible = !0), f) switch (p.name) {
                case "Accel. Pedal[%]":
                case "Engine speed[rpm]":
                case "Boost (Pre-Throttle)[psi]":
                case "Boost pressure (Target)[psi]":
                case "Throttle Angle[%]":
                case "Ignition Timing 1[deg]":
                case "Ignition Timing 2[deg]":
                case "Ignition Timing 3[deg]":
                case "Ignition Timing 4[deg]":
                case "Ignition Timing 5[deg]":
                case "Ignition Timing 6[deg]":
                case "Lambda Act. (Bank 1)[AFR]":
                    p.visible = !0;
                    e.push(p.name);
                    break;
                default:
                    p.visible = !1
            }
            window.localStorage.setItem("selectedSeries", JSON.stringify(e));
        g.yAxis[0].max = h;
        b.chart = Highcharts.StockChart(g);
        a.close()
    };
    b.selectAll = function(a) {
        b.chart.series.forEach(function(b) {
            "Navigator" !== b.name && b.setVisible(a, !1)
        });
        b.chart.redraw()
    };
    b.getLogs = function() {
        d.bmdConnected && r.send("/app/getlogs", {}, {
            jwt: d.get("token")
        });
        var a = WS_BASE_URL + "/getlogs";
        b.map && b.map.mapRequestId && (a += "/" + b.map.mapRequestId);
        b.loadingLogs = !0;
        p({
            method: "GET",
            url: a
        }).then(function(a) {
            b.loadingLogs = !1;
            a = a.data;
            d.logs = [];
            if (a && 0 < a.length)
                for (var c = 0; c < a.length; c++) {
                    var e = a[c];
                    if (e.createdDate) try {
                        e.createdDate = (new Date(e.createdDate)).toString()
                    } catch (f) {}
                    d.logs.push(e)
                }
            b.$broadcast("scroll.refreshComplete")
        }, function(a) {
            b.loadingLogs = !1;
            d.logs = [];
            b.$broadcast("scroll.refreshComplete");
            h.toast("Failed to retrieve cloud saved datalogs from server.");
            b.showLocalLogs()
        })
    };
    b.getLogs = _.debounce(b.getLogs, 300, !0);
    b.showLocalLogs = function() {
        d.bmdConnected && (b.offline(!0), r.send("/app/getlogs", {}, {
            jwt: d.get("token")
        }))
    };
    b.doRefresh = function(a) {
        a && (d.setForCurrentUser("pulldownRefreshLogsShown", a), d.pulldownRefreshLogsShown = a);
        b.getLogs()
    };
    b.doRefresh = _.debounce(b.doRefresh, 300, !0)
}]).controller("DatalogActionController", ["$scope", "$mdBottomSheet", function(b, a) {
    b.items = [{
        name: "Share",
        icon: "share-arrow"
    }, {
        name: "View",
        icon: "view"
    }, {
        name: "Close",
        icon: "close"
    }];
    b.listItemClick = function(d) {
        a.hide(b.items[d])
    }
}]).controller("LogRenameController", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", function(b,
    a, d, c, k, g) {
    b.cancel = function() {
        g.cancel()
    };
    b.hide = function() {
        g.hide()
    };
    b.update = function(c) {
        g.hide(c);
        k({
            method: "POST",
            url: WS_BASE_URL + "/log/rename",
            data: {
                id: b.selectedLog.id,
                name: b.selectedLog.name
            }
        }).then(function(a) {
            d.toast("Log renamed to " + b.selectedLog.name)
        }, function(b) {
            a.swal({
                title: "Error",
                text: "Failed to rename log, try again.",
                type: "error"
            })
        })
    }
}]).controller("ShareLinkController", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", function(b, a, d, c, k, g) {
    b.cancel = function() {
        g.cancel()
    };
    b.hide = function() {
        g.hide()
    };
    b.share = function(a) {
        a = document.getElementById("logURLId");
        a.select();
        a.setSelectionRange(0, 99999);
        document.execCommand("copy");
        d.toast("Log URL copied to clipboard. You can now paste it elsewhere.")
    }
}]);
angular.module("app.tcu", []).controller("transmissionCtrl", ["$scope", "$state", function(b, a) {
    b.tcuDescription = function(b) {
        "stock" === b ? a.go("bootmod3.transmissionStockDescription", {}, {
            reload: !0
        }) : "cs" === b ? a.go("bootmod3.transmissionCSDescription", {}, {
            reload: !0
        }) : a.go("bootmod3.transmissionDescription", {}, {
            reload: !0
        })
    }
}]).controller("transmissionDescriptionCtrl", ["$scope", "$bmd", "$state", "$log", "SweetAlert", "$timeout", "$http", "$rootScope", "$ionicHistory", "UI", "ngProgressFactory", function(b, a, d, c, k, g,
    l, h, e, q, n) {
    b.map = {};
    b.flashOffline = function(c) {
        h.bmdConnected ? h.VIN || "D" === c ? (h.agentVersion || (a.send("/app/version", {}, {
            jwt: h.get("token")
        }), a.send("/app/id", {}, {
            jwt: h.get("token")
        })), h.agentOutdated ? h.showAgentOutdatedMsg() : b.doFlashOffline(c)) : k.swal({
            title: "Error",
            text: "Vehicle not connected.",
            type: "error"
        }) : k.swal({
            title: "Error",
            text: "OBD Agent not detected.",
            type: "error"
        })
    };
    b.doFlashOffline = function(a) {
        k.swal({
            title: "Confirm",
            text: "\x3cb\x3e***WARNING:\x3c/b\x3e Battery charger is highly recommended! Turn headlights and fan OFF and plug the driver's side seatbelt in. Do not open/close doors while flashing. If using a piggyback device make sure its off or in map 0.",
            type: "warning",
            html: !0,
            confirmButtonText: "Flash",
            closeOnConfirm: !1,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(c) {
            c && b.exportAndFlash(a)
        })
    };
    b.exportAndFlash = function(c) {
        if (h.offlineMode) k.swal({
            title: "Offline Mode",
            text: "Transmission programming requires download of data from bootmod3 servers. You cannot use this feature in offline mode at this time.",
            type: "error",
            confirmButtonClass: "btn-warning",
            showConfirmButton: !0
        });
        else {
            k.swal({
                title: "Please wait",
                text: "Downloading transmission data from the bootmod3 servers, please wait..",
                type: "warning",
                confirmButtonClass: "btn-warning",
                showConfirmButton: !1,
                showCancelButton: !1
            });
            var d = "",
                d = "stock" === c ? "EGS_S" : "cs" === c ? "EGS_M_CS" : "EGS_M",
                e = "";
            "EGS_M" === d ? e = "Modified " : "EGS_M_CS" === d ? e = "CS " : "EGS_S" === d && (e = "Stock ");
            e += h.clientSession.transmission;
            b.mapExport = {
                mapId: d,
                mapName: e,
                mapDescription: d,
                vin: h.VIN,
                version: b.map.version,
                vehicleData: h.vehicleData,
                type: d,
                ecuId: "EGS",
                agentVersion: h.agentVersion,
                agentOS: h.agentOS,
                agentOSVersion: h.agentOSVersion,
                apiVersion: "2"
            };
            e = {
                method: "POST",
                url: WS_BASE_URL +
                    "/map/exportoffline",
                responseType: "arraybuffer",
                data: b.mapExport
            };
            h.progressbar = n.createInstance();
            h.progressbar.setHeight("8px");
            h.progressbar.setColor("blue");
            h.progressbar.set(0);
            h.progressbar.start();
            l(e).then(function(e) {
                try {
                    b.map.offlineStatus = "ready";
                    var g = base64ArrayBuffer(e.data),
                        n = {
                            id: b.map.id,
                            data: g,
                            type: d
                        };
                    h.progressbar.setColor("green");
                    h.progressbar.complete();
                    window.cordova && window.plugins.insomnia.keepAwake();
                    a.send("/app/flash", n, {
                        jwt: h.get("token")
                    });
                    "D" === c ? (h.progressbar.setColor("green"),
                        h.progressbar.complete(), k.swal({
                            title: "Success",
                            text: "Download of " + b.map.name + " to your OBD Agent is complete.",
                            type: "success",
                            showConfirmButton: !0
                        })) : (h.progressbar.set(0), h.progressbar.setColor("red"))
                } catch (y) {
                    h.progressbar.setColor("yellow"), h.progressbar.complete(), console.error(y), q.toast("Failed to export map.")
                }
            }, function(a) {
                h.progressbar.setColor("yellow");
                h.progressbar.complete();
                console.error("Failed getting map export");
                412 === a.status ? k.swal({
                    title: "Please wait",
                    text: "Map validation in progress, should be ready to flash momentarily, please try again. If this error persists please contact us at our Tech Support Portal for assistance.",
                    type: "warning"
                }) : 417 === a.status ? k.swal({
                    title: "Apologies",
                    text: "OBD Agent you're running seems to be outdated and needs an update before flashing.",
                    type: "warning"
                }) : 409 === a.status ? k.swal({
                    title: "Error",
                    text: "It seems the data on the vehicle has changed due to possible programming outside of bootmod3 by another tool during a service visit.",
                    type: "error"
                }) : 424 === a.status ? k.swal({
                    title: "Apologies",
                    text: "We've discovered an issue we're working on resolving at this time. If any questions at all please contact Tech Support for details.",
                    type: "error"
                }) : 400 === a.status ? k.swal({
                    title: "Error",
                    text: "You need to register as a Tuner prior to using the Map Export feature.",
                    type: "error"
                }) : k.swal({
                    title: "Error",
                    text: "Failed to download map.",
                    type: "error"
                })
            })
        }
    }
}]);
angular.module("app.tunereqs", []).controller("tuneRequestsCtrl", ["$scope", "$state", "$log", "SweetAlert", "$rootScope", "$ionicHistory", "$http", "$ionicFilterBar", function(b, a, d, c, k, g, l, h) {
    var e = null;
    b.$on("$ionicView.loaded", function() {
        e = k.$on("tuneupdate", function() {
            b.doRefresh()
        })
    });
    b.$on("$destroy", function() {
        e()
    });
    b.showFilterBar = function() {
        h.show({
            items: b.reqs,
            update: function(a) {
                b.reqs = a
            }
        })
    };
    b.doRefresh = function(a) {
        a && (k.setForCurrentUser("pulldownRefreshTuneReqsShown", a), k.pulldownRefreshTuneReqsShown =
            a);
        a = {
            method: "GET",
            url: WS_BASE_URL + "/tunereqs"
        };
        b.activeRequest = null;
        l(a).then(function(a) {
            if (k.VIN && 0 < a.data.length)
                for (var c in a.data) {
                    var d = a.data[c];
                    d.map.vin === k.VIN && (b.activeRequest = d, d.active = !0)
                }
            b.reqs = a.data;
            b.$broadcast("scroll.refreshComplete")
        }, function(a) {
            b.$broadcast("scroll.refreshComplete");
            c.swal({
                title: "Error",
                text: "Failed loading tune requests.",
                type: "error",
                showConfirmButton: !0,
                showCancelButton: !1
            })
        })
    };
    b.view = function(b) {
        a.tuneReq = b;
        a.req = b.mapRequest;
        a.selectedMap = b.map;
        g.clearCache().then(function() {
            a.go("bootmod3.tuneReqDescription", {}, {
                reload: !0
            })
        })
    }
}]).controller("tuneReqDescriptionCtrl", ["$scope", "$state", "SweetAlert", "$log", "$timeout", "$ionicHistory", "UI", "$mdDialog", "$rootScope", "$http", function(b, a, d, c, k, g, l, h, e, q) {
    b.map = a.selectedMap;
    b.tuneReq = a.tuneReq;
    b.req = a.req;
    b.ots = a.ots;
    b.VIN = e.VIN;
    var n = null;
    b.$on("$ionicView.loaded", function() {
        n = e.$on("tuneupdate", function() {
            b.getHistory()
        })
    });
    b.$on("$destroy", function() {
        n()
    });
    b.rename = function(a) {
        h.show({
            controller: "TuneReqRenameController",
            templateUrl: "templates/tune-req-rename.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: a,
            clickOutsideToClose: !1,
            scope: b,
            preserveScope: !0,
            fullscreen: !0
        })
    };
    b.updateCustomerDetails = function() {
        var a = b.tuneReq;
        b.customerDetails = "Tune Request Name: " + a.mapRequest.name + "\nVersion: " + a.map.version + "\nUser Name: " + a.user.name + "\nEmail: " + a.user.email + "\nVIN: " + a.map.vin + "\nEngine Type: " + a.engineTypeLong + "\nROM: " + a.map.romVersion + "\nRequestID: " + a.mapRequest.id + "\n\nDescription: " + b.req.mapRequestDetail + "\n"
    };
    b.updateCustomerDetails();
    b.copyCustomerDetails =
        function() {
            var a = document.getElementById("customerDetailsId");
            a.select();
            a.setSelectionRange(0, 99999);
            document.execCommand("copy");
            l.toast("Customer details copied to clipboard. You can paste them elsewhere.")
        };
    b.useBinToRespond = function(a) {
        e.isAuthorizedTuner() ? h.show({
                controller: "ReleaseTuneWithBinCtrl",
                controllerAs: "ctrl",
                templateUrl: "templates/mapEdit-releaseTuneWithBin.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: a,
                preserveScope: !0,
                clickOutsideToClose: !1,
                scope: b,
                fullscreen: !0
            }) :
            d.swal({
                title: "Tuner Access",
                text: "To enable sending raw BIN files on tune requests you need to get your bootmod3 tuner account authorized. Please check the User Manual or contact Tech Support.",
                type: "warning"
            })
    };
    b.releaseTune = function(a) {
        0 < b.commited && b.dirty ? l.toast("You have unsaved/uncommitted changes. You need to revert them prior to releasing the tune for flash.") : h.show({
            controller: "ReleaseTuneCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-releaseTune.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: a,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: b,
            fullscreen: !0
        })
    };
    b.getHistory = function() {
        q({
            method: "GET",
            url: WS_BASE_URL + "/tunereqhist/" + b.req.id
        }).then(function(a) {
            b.$broadcast("scroll.refreshComplete");
            b.reqHist = a.data
        }, function(a) {
            b.$broadcast("scroll.refreshComplete");
            d.swal({
                title: "Error",
                text: "Failed loading tune request history.",
                type: "error",
                showConfirmButton: !0,
                showCancelButton: !1
            })
        })
    };
    b.getHistory();
    b.doRefresh = function() {
        b.getHistory()
    };
    b.editor = {
        vin: null,
        ignoreWarn: !1
    };
    b.reject =
        function(c) {
            d.swal({
                title: "Confirm",
                text: "Are you sure you'd like to reject this tune request? It will show up as rejected for the user that sent you a request for tune.",
                type: "warning",
                html: !0,
                confirmButtonText: "Yes",
                closeOnConfirm: !0,
                showConfirmButton: !0,
                showCancelButton: !0
            }, function(c) {
                c && q({
                    method: "DELETE",
                    url: WS_BASE_URL + "/tunereq/" + b.req.id
                }).then(function(b) {
                    l.toast("Rejected tune request.");
                    g.clearCache().then(function() {
                        g.nextViewOptions({
                            disableBack: !0
                        });
                        a.go("bootmod3.tuneRequests", {}, {
                            reload: !0
                        })
                    })
                }, function(a) {
                    d.swal({
                        title: "Error",
                        text: "Failed rejecting tune request.",
                        type: "error"
                    })
                })
            })
        };
    b.comment = "";
    b.showComment = function(a) {
        b.comment = "";
        h.show({
            controller: "DialogController",
            templateUrl: "templates/mapEdit-comment.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: a,
            controllerAs: "ctrl",
            clickOutsideToClose: !1,
            scope: b,
            preserveScope: !0,
            fullscreen: !0
        })
    };
    b.postComment = function(a) {
        b.req || (b.req = {
            id: b.map.mapRequestId
        });
        q({
            method: "POST",
            url: WS_BASE_URL + "/reqcomment",
            data: {
                mapRequestId: b.req.id,
                comment: b.comment
            }
        }).then(function(a) {
            b.reqHist.unshift(a.data);
            l.toast("Comment sent..")
        }, function(a) {
            d.swal({
                title: "Error",
                text: "Failed adding comment.",
                type: "error"
            })
        })
    };
    b.edit = function(c, d) {
        if (d || e.getForCurrUser("editorIgnoreWarn")) {
            if (!e.getForCurrUser("editorIgnoreWarn")) {
                if (!b.editor.vin || b.editor.vin && b.editor.vin.toUpperCase() !== b.map.vin.toUpperCase()) {
                    l.toast("Invalid VIN");
                    return
                }
                e.setForCurrentUser("editorIgnoreWarn", b.editor.ignoreWarn)
            }
            h.hide();
            a.selectedMap = b.map;
            a.selectedReq = b.tuneReq;
            g.clearCache().then(function() {
                a.go("bootmod3.mapEdit", {}, {
                    reload: !0
                })
            })
        } else h.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-confirmTR.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: c,
            clickOutsideToClose: !1,
            scope: b,
            preserveScope: !0,
            fullscreen: !0
        })
    }
}]).controller("TuneReqRenameController", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", function(b, a, d, c, k, g) {
    b.update = function(c) {
        g.hide(c);
        a.swal({
            title: "Please wait..",
            text: "Updating tune request name",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !1
        });
        k({
            method: "POST",
            url: WS_BASE_URL + "/tunereq/rename",
            data: {
                id: b.tuneReq.mapRequest.id,
                name: b.tuneReq.mapRequest.name
            }
        }).then(function(c) {
            a.close();
            b.updateCustomerDetails();
            d.toast("Tune Request name updated")
        }, function(b) {
            a.close();
            a.swal({
                title: "Error",
                text: "Failed to rename tune request, try again.",
                type: "error"
            })
        })
    };
    b.cancel = function() {
        g.cancel()
    };
    b.hide = function() {
        g.hide()
    }
}]);
angular.module("app.tuners", []).controller("tunersCtrl", ["$scope", "$state", "$log", "SweetAlert", "$rootScope", "$ionicHistory", "$http", "UI", "$ionicFilterBar", function(b, a, d, c, k, g, l, h, e) {
    d = {
        method: "GET",
        url: WS_BASE_URL + "/tunersNoFilter"
    };
    b.showFilterBar = function() {
        e.show({
            items: b.tuners,
            update: function(a) {
                b.tuners = a
            }
        })
    };
    b.tuners = [];
    l(d).then(function(a) {
        b.tuners = a.data
    }, function(a) {
        h.toast("Failed loading tuners.")
    });
    b.view = function(c) {
        a.selectedTuner = c;
        c.myself ? b.config() : g.clearCache().then(function() {
            a.go("bootmod3.tunerDescription", {}, {
                reload: !0
            })
        })
    };
    b.config = function() {
        b.tuner = [];
        l({
            method: "GET",
            url: WS_BASE_URL + "/tunerconfig"
        }).then(function(c) {
            b.tuner = c.data;
            a.selectedTuner = b.tuner;
            g.clearCache().then(function() {
                a.go("bootmod3.tunerconfig", {}, {
                    reload: !0
                })
            })
        }, function(a) {
            h.toast("Failed getting tuner details")
        })
    }
}]).controller("tunerDescriptionCtrl", ["$scope", "$state", "SweetAlert", "$log", "$timeout", "$ionicHistory", "UI", "$mdDialog", "$rootScope", "$http", function(b, a, d, c, k, g, l, h, e, q) {
    b.tuner = a.selectedTuner;
    b.like = function(a,
        c) {
        q({
            method: "GET",
            url: WS_BASE_URL + "/liketuner/" + c.id
        }).then(function(a) {
            l.toast("Like sent to " + b.tuner.name + " :)")
        }, function(a) {
            l.toast("Error sending like through please try again later")
        })
    }
}]).controller("tunerConfigCtrl", ["$scope", "$state", "SweetAlert", "$log", "$timeout", "$ionicHistory", "UI", "$mdDialog", "$rootScope", "$http", function(b, a, d, c, k, g, l, h, e, q) {
    b.tuner = a.selectedTuner;
    b.cancel = function() {
        g.goBack(-1)
    };
    b.register = function() {
        b.tuner.name && 0 !== b.tuner.name.trim().length ? d.swal({
                title: "Terms",
                text: "Making changes to maps can cause serious damage to drivetrain components such as the engine and transmission.\x3cbr\x3e\x3cbr\x3eProceeding with registration will allow you to develop a new tune based on your stock tune as well as help others tune their vehicles by having them send you tune requests.\x3cbr\x3e\x3cbr\x3eAre you sure you'd like to proceed?",
                type: "warning",
                confirmButtonText: "I Accept All Liability, Register Me..",
                html: !0,
                closeOnConfirm: !0,
                showConfirmButton: !0,
                showCancelButton: !0
            },
            function(a) {
                a && k(b.save, 100)
            }) : d.swal({
            title: "Invalid Name",
            text: "Tuner name needs to be specified. This is the name that your listing will show up under in the Tuner Directory.",
            type: "error"
        })
    };
    b.save = function() {
        q({
            method: "POST",
            url: WS_BASE_URL + "/tunerconfig",
            data: b.tuner
        }).then(function(b) {
            l.toast("Tuner info updated.");
            g.clearCache().then(function() {
                e.getClientSession(null, !0);
                a.go("bootmod3.tuners", {}, {
                    reload: !0
                })
            })
        }, function(a) {
            a && a.data ? (a = a.data, d.swal({
                    title: a.title,
                    text: a.msg,
                    type: "error"
                })) :
                d.swal({
                    title: "Error",
                    text: "Failed saving tuner registration details.",
                    type: "error"
                })
        })
    }
}]);
angular.module("app.maps", []).controller("mapsCtrl", ["$scope", "$state", "$log", "SweetAlert", "$rootScope", "$ionicHistory", "$http", "UI", "$mdDialog", "$bmd", "$ionicFilterBar", function(b, a, d, c, k, g, l, h, e, q, n) {
    b.tuners = [];
    var v = null,
        r = null,
        x = null,
        t = null;
    b.registerEvents = function() {
        r || (r = k.$on("devices", function() {
                b.noDevices = !k.devices || 0 === k.devices.length
            }), v = k.$on("vehicledata", function() {
                b.vehicleData = k.getForVin("vehicleData");
                b.updateWithOfflineMaps();
                b.$apply()
            }), x = k.$on("tuneupdateoffline", function() {
                b.updateWithOfflineMaps()
            }),
            t = k.$on("tuneupdate", function() {
                b.doRefresh()
            }))
    };
    b.registerEvents = _.debounce(b.registerEvents, 300, !0);
    b.$on("$ionicView.loaded", function() {
        b.registerEvents()
    });
    b.$on("$destroy", function() {
        r();
        v();
        x();
        t()
    });
    b.goOTS = function() {
        g.nextViewOptions({
            disableBack: !0
        });
        a.go("bootmod3.otsmaps")
    };
    b.goEncrypt = function() {
        k.clientSession ? k.clientSession.webTuner && "REGULAR" !== k.clientSession.webTuner.tunerLevel ? b.encryptMap() : c.swal({
            title: "Tuner Setup Incomplete",
            text: "BIN file encryption is available on authorized bootmod3 accounts. Registering as a tuner requires no charge. To authorize your tuner account contact support@protuningfreaks.com.",
            type: "error"
        }) : h.toast("Loading data, please wait..")
    };
    b.showFilterBar = function() {
        n.show({
            items: b.maps,
            update: function(a) {
                b.maps = a
            }
        })
    };
    b.requestTuneFromStock = function(a) {
        b.mapName = "";
        e.show({
            controller: "RequestTuneCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-requestTune.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: a,
            clickOutsideToClose: !1,
            scope: b,
            preserveScope: !0,
            fullscreen: !0
        })
    };
    b.isMultiMapBuilderAvailable = function() {
        return b.maps && k.clientSession && ("B58-T0-C" === k.clientSession.engineType ||
            "B58-T0-D" === k.clientSession.engineType || "B58-F" === k.clientSession.engineType)
    };
    b.hasCustomROMSupport = !1;
    b.checkCustomROMSupport = function() {
        if (b.maps && 0 < b.maps.length)
            for (var a in b.maps)
                if (b.maps[a].cRomAvail) return b.hasCustomROMSupport = !0;
        return b.hasCustomROMSupport = !1
    };
    b.checkMultiMapBuilderSupport = function() {
        return !b.isMultiMapBuilderAvailable() && b.checkCustomROMSupport() ? (c.swal({
            title: "Unavailable",
            text: "MultiMap builder is currently unavailable for your vehicle. A custom tune from a BM3 Custom Tuner can be done to build you a custom MultiMap with any CustomROM feature included. Please email support@protuningfreaks.com for any assistance.",
            type: "warning"
        }), !1) : !0
    };
    b.buildMultiMap = function(a) {
        b.checkMultiMapBuilderSupport() && e.show({
            controller: "MultiMapBuildCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/multimapBuild.html",
            parent: angular.element(document.body),
            targetEvent: a,
            clickOutsideToClose: !1,
            scope: b,
            preserveScope: !0,
            fullscreen: !0
        })
    };
    b.reloadTuners = function() {
        l({
            method: "GET",
            url: WS_BASE_URL + "/tuners"
        }).then(function(a) {
            if (a)
                for (var c = 0; c < a.data.length; c++) {
                    var d = a.data[c],
                        d = {
                            tunerId: d.id,
                            name: d.name,
                            display: d.name,
                            companyName: d.companyName,
                            value: d.name.toLowerCase(),
                            tunerInfo: d
                        };
                    b.tuners.push(d)
                }
        }, function(a) {})
    };
    b.reloadTuners = _.debounce(b.reloadTuners, 300, !0);
    b.details = function(c, e) {
        d.debug(c);
        a.selectedMap = c;
        a.selectedMap.offline = e;
        a.tuners = b.tuners;
        g.clearCache().then(function() {
            a.go("bootmod3.mapDescription", {}, {
                reload: !0
            })
        })
    };
    b.add = function() {
        if (k.devices) {
            for (var b = null, d = 0, e = 0; e < k.devices.length; e++) {
                var g = k.devices[e];
                g.activated && (b = g, d++)
            }
            b ? a.go("bootmod3.addmap") : k.clientSession && k.clientSession.webTuner ? a.go("bootmod3.addmap") :
                c.swal({
                    title: "No Activated Devices",
                    text: "bootmod3 device needs to be activated before adding new maps.",
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
        } else c.swal({
            title: "No device found",
            text: "bootmod3 device needs to be connected to the OBD port and our servers to add new maps.",
            type: "error",
            showConfirmButton: !0,
            showCancelButton: !1
        })
    };
    b.encryptMap = function() {
        if (k.devices) {
            for (var b = null, d = 0, e = 0; e < k.devices.length; e++) {
                var g = k.devices[e];
                g.activated && (b = g, d++)
            }
            a.selectedMap = {};
            b ? a.go("bootmod3.encryptmap") :
                k.clientSession && k.clientSession.webTuner ? a.go("bootmod3.encryptmap") : c.swal({
                    title: "Unavailable",
                    text: "bootmod3 license needs to be activated or tuner account needs to be set up before encrypting maps.",
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
        } else h.toast("Account data loading, please wait..")
    };
    b.updateWithOfflineMaps = function() {
        console.log("Update with offline maps");
        if (b.maps && 0 < b.maps.length && k.offlineMaps && 0 < k.offlineMaps.length) {
            var a = {},
                c;
            for (c in b.maps) a.map = b.maps[c], getMap(a.map,
                function(a) {
                    return function(c, d) {
                        if (c)
                            for (var e in b.maps) c = b.maps[e], c.id === d.id && (c.offlineStatus = "ready");
                        else listOfflineMapsForMap(a.map, function(a) {
                            if (a && 0 < a.length) {
                                var c = 0,
                                    d;
                                for (d in a) c = Math.max(c, a[d].updateTs);
                                for (var e in b.maps) d = b.maps[e], d.id === a[0].id && c < d.updateTs && (d.offlineStatus = "update")
                            }
                        }, function() {})
                    }
                }(a),
                function() {}), a = {
                map: a.map
            }
        }
        if (k.devices)
            for (a = 0; a < k.devices.length; a++)(c = k.devices[a]) && c.activated && (b.vehicleData = k.getForVin("vehicleData"))
    };
    b.reloadMaps = function() {
        k.offlineMaps = [];
        listMaps(function(a) {
            k.offlineMaps = a && 0 < a.length ? a : [];
            b.reloadMapsFromServer()
        }, function() {
            k.offlineMaps = [];
            console.error("Failed to read maps from local store");
            b.reloadMapsFromServer()
        })
    };
    b.reloadMaps = _.debounce(b.reloadMaps, 300, !0);
    b.reloadMapsFromServer = function() {
        k.offlineMode ? (b.$broadcast("scroll.refreshComplete"), b.showLocalMaps(!0)) : (b.loadingMaps = !0, l({
            method: "GET",
            url: WS_BASE_URL + "/maps"
        }).then(function(a) {
                b.loadingMaps = !1;
                b.$broadcast("scroll.refreshComplete");
                b.updateOnlineMaps(a.data)
            },
            function(a) {
                b.loadingMaps = !1;
                b.$broadcast("scroll.refreshComplete");
                b.showLocalMaps();
                h.toast("Failed to retrieve your cloud saved maps from the bootmod3 servers. To flash your maps without internet access, set up offline mode and download prior to connecting to vehicle.")
            }))
    };
    b.reloadMapsFromServer = _.debounce(b.reloadMapsFromServer, 300, !0);
    b.showLocalMaps = function(a) {
        b.maps = [];
        a && b.offline(!0);
        listMaps(function(b) {
            b && 0 < b.length ? k.offlineMaps = b : a && c.swal({
                title: "Info",
                text: "No previously downloaded maps found. To flash maps in offline mode you need to log in and download the maps first. Consult Offline Mode instructions on how best to use Offline Mode when needed or contact support@protuningfreaks.com for assistance.",
                type: "info"
            })
        }, function() {
            k.offlineMaps = [];
            console.error("Failed to read maps from local store")
        });
        b.$broadcast("scroll.refreshComplete")
    };
    b.updateOnlineMaps = function(a) {
        if (a && 0 < a.length)
            for (var c in a) {
                var d = a[c];
                if (d.stock) {
                    b.stockTune = d;
                    break
                }
            }
        b.maps = a;
        b.checkCustomROMSupport();
        b.updateWithOfflineMaps()
    };
    b.doRefresh = function(a) {
        a && (k.setForCurrentUser("pulldownRefreshMapsShown", a), k.pulldownRefreshMapsShown = a);
        k.offlineMode || b.reloadTuners();
        b.reloadMaps()
    };
    b.registerEvents();
    b.doRefresh()
}]).controller("mapDescriptionCtrl", ["$scope", "$state", "SweetAlert", "$log", "$timeout", "$ionicHistory", "UI", "$mdDialog", "$rootScope", "$http", "$bmd", "$mdBottomSheet", function(b, a, d, c, k, g, l, h, e, q, n, v) {
    var r = this;
    a.selectedMap && (b.map = a.selectedMap);
    if (b.map || b.editor) {
        b.tuners = a.tuners;
        b.selectedTuner = null;
        a.slotConfig = 1;
        b.goMapConfig = function(a) {
            b.map.slots && 1 !== b.map.slots ? h.show({
                controller: "DialogController",
                templateUrl: "templates/mapConfig-slotSelection.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: a,
                controllerAs: "ctrl",
                clickOutsideToClose: !0,
                scope: b,
                preserveScope: !0,
                fullscreen: !0
            }) : b.configureSlot(a, 1)
        };
        b.configureSlot = function(c, e) {
            a.slotConfig = e;
            q({
                method: "GET",
                url: WS_BASE_URL + "/mapconfig/" + b.map.id
            }).then(function(c) {
                a.selectedMap.mapConfig = c.data.mapConfig;
                a.selectedMap.multiMapConfigs = c.data.multiMapConfigs;
                b.map.mapConfig = c.data.mapConfig;
                b.map.multiMapConfigs = c.data.multiMapConfigs;
                a.go("bootmod3.mapconfig", {}, {
                    reload: !0
                })
            }, function(a) {
                d.swal({
                    title: "Error",
                    text: "Failed retrieving map config for this map. Please try again or contact support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            })
        };
        b.goLiveAdj = function() {
            e.VIN ? (g.nextViewOptions({
                disableBack: !0
            }), g.clearCache().then(function() {
                a.go("bootmod3.liveadjust", {}, {
                    reload: !0
                })
            })) : d.swal({
                title: "Connection",
                text: "Vehicle not connected. To adjust live values on a CustomROM DME you need to be connected.",
                type: "error"
            })
        };
        r.doCustomRomConvert = function() {
            var c = {
                method: "POST",
                url: WS_BASE_URL + "/map/crom",
                data: {
                    id: b.map.id
                }
            };
            d.swal({
                title: "CustomROM Build",
                text: "Converting " + b.map.name + " to CustomROM, please wait...",
                type: "info",
                html: !0,
                showCancelButton: !1,
                showConfirmButton: !1
            });
            q(c).then(function(c) {
                d.swal({
                    title: "CustomROM Enabled",
                    text: b.map.name + " map conversion to CustomROM is successful. You can find the CustomROM copy of this map under My Maps and flash it to use the new features.\x3cbr\x3e\x3cbr\x3eTo custom tune any features available to CustomROM maps please contact your preferred bootmod3 custom tuner.",
                    type: "success",
                    html: !0
                }, function() {
                    g.nextViewOptions({
                        disableBack: !0
                    });
                    g.clearCache().then(function() {
                        a.go("bootmod3.maps", {}, {
                            reload: !0
                        })
                    })
                })
            }, function(a) {
                d.swal({
                    title: "Error",
                    text: "Failed converting map to CustomROM. Please try again or contact support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            })
        };
        b.customRomConvert = function() {
            d.swal({
                title: "CustomROM Conversion",
                text: "Converting this map to CustomROM will create a copy of this map under My Maps and enable bootmod3 CustomROM features with default settings on it. For instance, it will turn on the Antilag feature. Are you sure you'd like to proceed?",
                type: "warning",
                showConfirmButton: !0,
                showCancelButton: !0
            }, function(a) {
                a && r.doCustomRomConvert()
            })
        };
        var x = null;
        b.$on("$ionicView.loaded", function() {
            x = e.$on("tuneupdate", function() {
                b.loadHistory()
            })
        });
        b.$on("$destroy", function() {
            x && x();
            window.cordova && window.plugins.insomnia.allowSleepAgain()
        });
        getMap(b.map, function(a) {
            a && (b.map.offlineStatus = "ready")
        }, function() {});
        if (b.map && b.map.tunerId && b.tuners)
            if (b.map.otsMapId)
                for (k = 0; k < b.tuners.length; k++) {
                    var t = b.tuners[k];
                    if ("PTF" === t.name) {
                        b.selectedTuner = t;
                        break
                    }
                } else
                    for (k =
                        0; k < b.tuners.length; k++)
                        if (t = b.tuners[k], t.tunerId === b.map.tunerId || t.tunerInfo.tuneRequestTunerId === b.map.tunerId) {
                            b.selectedTuner = t;
                            break
                        }
        b.canRequestUpdate = b.map.stock || b.map.mapRequestId && !b.map.flashBlocked || null !== b.selectedTuner;
        b.comment = "";
        b.showComment = function(a) {
            "COPIED" === b.map.mapRequest.status ? d.swal({
                    title: "Warning",
                    text: "You cannot comment on copies of custom tune requests. To interact with your tuner and do further changes ensure you comment on the original tune request.",
                    type: "warning"
                }) :
                (b.comment = "", h.show({
                    controller: "DialogController",
                    templateUrl: "templates/mapEdit-comment.tmpl.html",
                    parent: angular.element(document.body),
                    targetEvent: a,
                    controllerAs: "ctrl",
                    clickOutsideToClose: !0,
                    scope: b,
                    preserveScope: !0,
                    fullscreen: !0
                }))
        };
        b.postComment = function(a) {
            "COPIED" === b.map.mapRequest.status ? d.swal({
                    title: "Warning",
                    text: "You cannot comment on copies of custom tune requests. To interact with your tuner and do further changes ensure you comment on the original tune request.",
                    type: "warning"
                }) :
                q({
                    method: "POST",
                    url: WS_BASE_URL + "/reqcomment",
                    data: {
                        mapRequestId: b.map.mapRequestId,
                        comment: b.comment
                    }
                }).then(function(a) {
                    b.reqHist.unshift(a.data);
                    l.toast("Comment sent..")
                }, function(a) {
                    d.swal({
                        title: "Error",
                        text: "Failed adding comment.",
                        type: "error"
                    })
                })
        };
        b.loadHistory = function() {
            b.reqHist = [];
            q({
                method: "GET",
                url: WS_BASE_URL + "/tunereqhist/" + b.map.mapRequestId
            }).then(function(a) {
                b.$broadcast("scroll.refreshComplete");
                (a = a.data) && 0 < a.length && (a.forEach(function(a) {
                        a.createdDate && (a.createdDate = (new Date(a.createdDate)).toString())
                    }),
                    b.reqHist = a)
            }, function(a) {
                b.$broadcast("scroll.refreshComplete")
            })
        };
        b.doRefresh = function() {
            b.loadHistory()
        };
        b.map.mapRequestId && b.loadHistory();
        b.editor = {
            vin: null,
            ignoreWarn: !1
        };
        b.requestTune = function(a) {
            b.mapName = b.map.stock ? "" : b.map.name;
            h.show({
                controller: "RequestTuneCtrl",
                controllerAs: "ctrl",
                templateUrl: "templates/mapEdit-requestTune.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: a,
                clickOutsideToClose: !1,
                scope: b,
                preserveScope: !0,
                fullscreen: !0
            })
        };
        b.requestSupport = function(a) {
            b.mapName =
                b.map.stock ? "" : b.map.name;
            h.show({
                controller: "RequestSupportCtrl",
                controllerAs: "ctrl",
                templateUrl: "templates/mapEdit-requestSupport.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: a,
                clickOutsideToClose: !1,
                scope: b,
                preserveScope: !0,
                fullscreen: !0
            })
        };
        b.rename = function(a) {
            h.show({
                controller: "MapRenameController",
                templateUrl: "templates/map-rename.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: a,
                clickOutsideToClose: !1,
                scope: b,
                preserveScope: !0,
                fullscreen: !0
            })
        };
        b.lockedMap = function() {
            if (b.map.stock) d.swal({
                title: "Stock Tune",
                text: "This is your Stock (OEM) Map. You can open the editor and view the map but changes to the Stock Tune are disabled. To build your own custom map using the bootmod3 Editor you need to create a 'Copy' of it. Refer to the bootmod3 User Manual for further details.",
                type: "info",
                showCancelButton: !0,
                showConfirmButton: !0,
                confirmButtonText: "Copy",
                closeOnConfirm: !1
            }, function(a) {
                a && b.copy()
            });
            else if (b.map.otsMapId) d.swal({
                title: "OTS Map",
                text: "This is an OTS Map. Editing is not available for OTS Maps. To create your own custom maps refer to the bootmod3 User Manual for further details.",
                type: "info"
            });
            else if (b.map.locked || b.map.mapRequestId) {
                var a = "",
                    a = b.map.tunerName ? "This is a custom map built by " + b.map.tunerName + ". Changes to this map are only possible by your bootmod3 Authorized Tuner. Refer to the User Manual for details." : "This is a custom map. To use the built-in Advanced Map Editor to build your own maps refer to the bootmod3 User Manual for details.";
                d.swal({
                    title: "Custom Map",
                    text: a,
                    type: "info"
                })
            }
        };
        b.edit = function(c, n) {
            if (e.clientSession.webTuner)
                if (e.clientSession.webTuner.ots ||
                    !b.map.locked && !b.map.rejected)
                    if (b.email = e.clientSession.webUser.email, n || e.getForCurrUser("editorIgnoreWarn")) {
                        if (!e.getForCurrUser("editorIgnoreWarn")) {
                            if (!b.VIN)
                                if (b.email) {
                                    if (!b.editor.email || b.editor.email && b.editor.email.toUpperCase() !== b.email.toUpperCase()) {
                                        l.toast("Username/email entered doesn't match your login username/email.");
                                        return
                                    }
                                } else {
                                    l.toast("Cannot start editor as you have no vehicles registered and your email is invalid.");
                                    return
                                }
                            else if (!b.editor.vin || b.editor.vin && b.editor.vin.toUpperCase() !==
                                b.VIN.toUpperCase()) {
                                l.toast("Invalid VIN");
                                return
                            }
                            e.setForCurrentUser("editorIgnoreWarn", b.editor.ignoreWarn)
                        }
                        h.hide();
                        a.selectedMap.stock || !a.selectedMap.locked ? (a.selectedMap = b.map, g.clearCache().then(function() {
                            a.go("bootmod3.mapEdit", {}, {
                                reload: !0
                            })
                        })) : l.toast("This map is locked, cannot be edited")
                    } else h.show({
                        controller: "DialogController",
                        templateUrl: "templates/mapEdit-confirm.tmpl.html",
                        parent: angular.element(document.body),
                        targetEvent: c,
                        clickOutsideToClose: !1,
                        scope: b,
                        preserveScope: !0,
                        fullscreen: !0
                    });
            else d.swal({
                title: "Error",
                text: "This map is not editable.",
                type: "warning"
            });
            else d.swal({
                title: "Error",
                text: "Before opening and using the editor you need to configure your account with your info as a tuner in the Tuner Directory screen. To start out it is just an end user tuner account with functionality limited to just your own account.",
                type: "warning"
            })
        };
        b.isIE = function() {
            var a = navigator.userAgent;
            return -1 < a.indexOf("MSIE ") || -1 < a.indexOf("Trident/")
        };
        b.flashOptions = function() {
            b.isIE() ? d.swal({
                title: "Warning",
                text: "Internet Explorer should not be used with bootmod3. Use Google Chrome, Firefox or Safari instead.",
                type: "warning"
            }) : v.show({
                templateUrl: "templates/flashMapBottomSheet.html",
                controller: "FlashCtrl",
                preserveScope: !0,
                scope: b
            })
        };
        b.flashOffline = function(a, c) {
            v.hide();
            e.bmdConnected || "D" === a ? e.VIN || "D" === a ? (e.agentVersion || (n.send("/app/version", {}, {
                jwt: e.get("token")
            }), n.send("/app/id", {}, {
                jwt: e.get("token")
            })), e.agentOutdated ? e.showAgentOutdatedMsg() : b.map.buReq && !e.isCustomROMBtld() ? b.handleOBDLockedFlash(a,
                function() {
                    b.runFlashWithExport(a)
                }) : b.runFlashWithExport(a)) : d.swal({
                title: "Error",
                text: "Vehicle not connected.",
                type: "error"
            }) : d.swal({
                title: "Error",
                text: "OBD Agent not detected.",
                type: "error"
            })
        };
        b.handleOBDLockedFlash = function(a, b) {
            e.ignoreBenchUnlock = e.getForVin("ignoreBenchUnlock", !1);
            e.ignoreBenchUnlock || "D" === a || "C" === a || "L" === a || "LF" === a || e.sigValid ? b(a) : d.swal({
                title: "Warning",
                text: "Your vehicle's DME software requires a bench unlock. If you'd like to proceed and the flash fails, click on the Stock Tune and choose the 'FLASH AND RELOCK DME' option to restore the DME back to stock.",
                type: "warning",
                html: !0,
                confirmButtonText: "Ignore Warning",
                showConfirmButton: !0,
                closeOnConfirm: !1,
                showCancelButton: !0
            }, function(c) {
                c && d.swal({
                    title: "Ignore Warnings",
                    text: "Ignore all future warnings about bench unlock requirement for your vehicle?",
                    type: "warning",
                    html: !0,
                    confirmButtonText: "Yes",
                    showConfirmButton: !0,
                    showCancelButton: !0,
                    closeOnConfirm: !1
                }, function(c) {
                    c && (e.setForCurrentUser("ignoreBenchUnlock", !0), e.ignoreBenchUnlock = !0);
                    b(a)
                })
            })
        };
        b.runFlashWithExport = function(a) {
            "D" === a ? b.exportAndFlash(a) :
                "L" === a || "LF" === a ? d.swal({
                    title: "Warning!!",
                    text: "\x3cb\x3e***WARNING:\x3c/b\x3e This will flash the DME back to stock tune and \x3cb\x3eRELOCK YOUR DME\x3c/b\x3e. If you're unsure of what this option is for DO NOT use it.\x3cbr\x3e\x3cbr\x3eAre you sure you would like to continue?",
                    type: "warning",
                    html: !0,
                    confirmButtonText: "FLASH AND RELOCK MY DME",
                    closeOnConfirm: !1,
                    showConfirmButton: !0,
                    showCancelButton: !0
                }, function(c) {
                    c && b.doFlashOffline(a)
                }) : "U" === a ? d.swal({
                    title: "Warning!!",
                    text: "\x3cb\x3e***WARNING:\x3c/b\x3e This will \x3cb\x3eUNLOCK\x3c/b\x3e the DME for OBD programming so you can flash OTS and custom tunes. If you're unsure of what this option is for DO NOT use it.\x3cbr\x3e\x3cbr\x3eAre you sure you would like to continue?",
                    type: "warning",
                    html: !0,
                    confirmButtonText: "YES, UNLOCK DME",
                    closeOnConfirm: !1,
                    showConfirmButton: !0,
                    showCancelButton: !0
                }, function(c) {
                    c && b.doFlashOffline(a)
                }) : "PF" === a || "FF" === a ? d.swal({
                    title: "Warning!!",
                    text: "\x3cb\x3e***WARNING:\x3c/b\x3e Are you sure you would like to skip flash preconditions checks? If you're unsure of what this option is for DO NOT use it without instructions from Tech Support.\x3cbr\x3e\x3cbr\x3eAre you sure you would like to continue?",
                    type: "warning",
                    html: !0,
                    confirmButtonText: "YES, SKIP CHECK AND FLASH",
                    closeOnConfirm: !1,
                    showConfirmButton: !0,
                    showCancelButton: !0
                }, function(c) {
                    c && b.doFlashOffline(a)
                }) : b.doFlashOffline(a)
        };
        b.checkMapDownload = function(a) {
            v.hide();
            !e.unlockStatus || "BENCH" !== e.unlockStatus && "FEMTO" !== e.unlockStatus || e.sigValid ? b.checkMapDownloadNoBenchRequired(a) : b.handleOBDLockedFlash(a, function() {
                b.checkMapDownloadNoBenchRequired(a)
            })
        };
        b.checkMapDownloadNoBenchRequired = function(a) {
            getMap(b.map, function(c) {
                b.map.offlineStatus = c ? "ready" : null;
                b.doFlashOffline(a)
            }, function() {
                b.map.offlineStatus =
                    null;
                b.doFlashOffline(a)
            })
        };
        b.doFlashOffline = function(a) {
            e.pauseGauges();
            if (e.VIN) {
                if (!e.isRegisteredDeviceConnected()) {
                    if (!e.isAuthorizedTuner()) {
                        d.swal({
                            title: "Tuner Registration",
                            text: "Contact bootmod3 support for registration as an Authorized Dealer / Tuner Shop to enable flashing of vehicles not registered in this account.",
                            type: "error"
                        });
                        return
                    }
                    if (!b.tuneReq) {
                        d.swal({
                            title: "Not a Tune Request",
                            text: "To flash vehicles not registered in your account you need to use the the Map Editor and receive a Tune Request from the customer you're tuning.",
                            type: "error"
                        });
                        return
                    }
                }
                var c = "\x3cb\x3e***WARNING:\x3c/b\x3e Battery charger is highly recommended! Turn headlights and fan OFF and plug the driver's side seatbelt in. Do not open/close doors while flashing. If using a piggyback device make sure its off or in map 0.";
                "U" === a && (c = "\x3cb\x3e***WARNING:\x3c/b\x3e You're unlocking your DME for OBD programming. Battery charger is highly recommended! Turn headlights and fan OFF and plug the driver's side seatbelt in. Do not open/close doors while flashing. If using a piggyback device make sure its off or in map 0.");
                d.swal({
                    title: "Confirm",
                    text: c,
                    type: "warning",
                    html: !0,
                    confirmButtonText: "Flash",
                    closeOnConfirm: !1,
                    showConfirmButton: !0,
                    showCancelButton: !0
                }, function(c) {
                    c && ("U" === a || "UF" === a || "L" === a || "LF" === a || "FFC" === a ? b.exportAndFlash(a) : (d.swal({
                        title: "Please wait",
                        text: "Checking for previously downloaded map..",
                        type: "warning",
                        confirmButtonClass: "btn-warning",
                        showConfirmButton: !1,
                        showCancelButton: !1
                    }), readMap(b.map, function(c) {
                        if ("ready" === b.map.offlineStatus && "U" !== a && "UF" !== a && "L" !== a && "LF" !== a) {
                            c = base64ArrayBuffer(c);
                            d.swal({
                                title: "Please wait",
                                text: "Map ready to flash, initializing..",
                                type: "warning",
                                confirmButtonClass: "btn-warning",
                                showConfirmButton: !1,
                                showCancelButton: !1
                            });
                            c = {
                                id: b.map.id,
                                data: c,
                                type: a,
                                force: !0
                            };
                            window.cordova && window.plugins.insomnia.keepAwake();
                            e.pbar = document.getElementById("pbar");
                            if (!e.pbar) {
                                var g = document.getElementsByClassName("sweet-alert")[0];
                                e.pbar = document.createElement("div");
                                e.pbar.setAttribute("id", "pbar");
                                g.insertBefore(e.pbar, g.firstChild)
                            }
                            e.progressbar.setHeight("8px");
                            e.progressbar.setParent(pbar);
                            e.progressbar.setColor("yellow");
                            e.progressbar.set(0);
                            e.progressbar.start();
                            e.flashingMapId = b.map.id;
                            e.flashing = !0;
                            n.send("/app/flash", c, {
                                jwt: e.get("token")
                            })
                        } else b.exportAndFlash(a)
                    }, function() {
                        b.exportAndFlash(a)
                    })))
                })
            } else d.swal({
                title: "No vehicle",
                text: "Vehicle not connected.",
                type: "error"
            })
        };
        b.postSaveToStorage = function(a, c) {
            a = base64ArrayBuffer(a);
            a = {
                id: b.map.id,
                data: a,
                type: c
            };
            e.progressbar.setColor("green");
            e.progressbar.complete();
            b.map.offlineStatus = "ready";
            "D" !== c ? (window.cordova && window.plugins.insomnia.keepAwake(),
                n.send("/app/flash", a, {
                    jwt: e.get("token")
                }), e.progressbar.set(0), e.progressbar.setColor("red")) : (e.progressbar.setColor("green"), e.progressbar.complete(), d.swal({
                title: "Success",
                text: "Download completed successfully.",
                type: "success",
                showConfirmButton: !0
            }))
        };
        b.exportAndFlash = function(a) {
            if (!e.offlineMode || "U" !== a && "UF" !== a && "L" !== a && "LF" !== a && "FFC" !== a) {
                "L" !== a && "LF" !== a || storeClear();
                d.swal({
                    title: "Please wait",
                    text: "Downloading " + b.map.name + " map data from the bootmod3 servers, please wait..",
                    type: "warning",
                    confirmButtonClass: "btn-warning",
                    showConfirmButton: !1,
                    showCancelButton: !1
                });
                var c = e.agentVersion;
                e.agentVersion || (c = "1000.00.000");
                b.mapExport = {
                    mapId: b.map.id,
                    vin: b.map.vin,
                    version: b.map.version,
                    type: a,
                    agentVersion: c,
                    agentOS: e.agentOS,
                    agentOSVersion: e.agentOSVersion,
                    apiVersion: "2"
                };
                c = {
                    method: "POST",
                    url: WS_BASE_URL + "/map/exportoffline",
                    responseType: "arraybuffer",
                    data: b.mapExport
                };
                e.progressbar.setHeight("8px");
                e.progressbar.setColor("blue");
                e.progressbar.set(0);
                e.progressbar.start();
                q(c).then(function(c) {
                    if ("L" ===
                        a || "LF" === a || "U" === a || "UF" === a || "FFC" === a) b.postSaveToStorage(c.data, a);
                    else try {
                        saveMap(b.map, c.data, function() {
                            e.$broadcast("tuneupdate");
                            removeOfflineMapsForMap(b.map, function() {
                                b.postSaveToStorage(c.data, a)
                            })
                        }, function() {
                            b.postSaveToStorage(c.data, a)
                        })
                    } catch (B) {
                        b.postSaveToStorage(c.data, a)
                    }
                }, function(a) {
                    e.progressbar.setColor("yellow");
                    e.progressbar.complete();
                    console.error("Failed getting map export");
                    console.error(a);
                    403 === a.status ? d.swal({
                            title: "Session expired",
                            text: "Unfortunately your session has expired. Please log in again. If the issue persists contact support@protuningfreaks.com for assistance.",
                            type: "info"
                        }, function() {
                            e.kick(!0)
                        }) : 417 === a.status ? d.swal({
                            title: "Error",
                            text: "OBD Agent you're running seems to be outdated and needs an update before flashing.",
                            type: "error"
                        }) : 409 === a.status ? d.swal({
                            title: "Error",
                            text: "It seems the data on the vehicle has changed due to possible programming outside of bootmod3 by another tool during a service visit.",
                            type: "error"
                        }) : 406 === a.status ? d.swal({
                            title: "Error",
                            text: "OBD Agent you're running seems to be outdated and needs an update before flashing.",
                            type: "error"
                        }) :
                        424 === a.status ? d.swal({
                            title: "Failed",
                            text: "Failed to export map for flash. Please contact support@protuningfreaks.com for assistance.",
                            type: "error"
                        }) : 400 === a.status ? d.swal({
                            title: "Error",
                            text: "You need to register as a Tuner prior to using the Map Export feature.",
                            type: "error"
                        }) : d.swal({
                            title: "Error",
                            text: "Failed to download map. If the issue persists contact support@protuningfreaks.com for assistance.",
                            type: "error"
                        })
                })
            } else d.swal({
                title: "Offline Mode",
                text: "This flash requires download of data from bootmod3 servers. You cannot use this feature in offline mode.",
                type: "error",
                confirmButtonClass: "btn-warning",
                showConfirmButton: !0
            })
        };
        b.removeMap = function() {
            d.swal({
                title: "Confirm",
                text: "Are you sure you want to remove this map?",
                type: "warning",
                confirmButtonText: "Remove",
                closeOnConfirm: !0,
                showConfirmButton: !0,
                showCancelButton: !0
            }, function(e) {
                e && (d.swal({
                    title: "Please wait..",
                    text: "Removing map..",
                    type: "warning",
                    showConfirmButton: !1,
                    showCancelButton: !1
                }), q({
                    method: "POST",
                    url: WS_BASE_URL + "/removemap",
                    data: {
                        id: b.map.id
                    }
                }).then(function(b) {
                    d.close();
                    b = b.data;
                    c.debug(b);
                    b && (g.nextViewOptions({
                        disableBack: !0
                    }), g.clearCache().then(function() {
                        a.go("bootmod3.maps", {}, {
                            reload: !0
                        })
                    }))
                }, function(a) {
                    d.swal({
                        title: "Error",
                        text: "Failed to remove map, try again.",
                        type: "error"
                    })
                }))
            })
        };
        b.copy = function() {
            d.swal({
                title: "Confirm",
                text: "Are you sure you want to create a copy of this map?",
                type: "warning",
                confirmButtonText: "Yes",
                closeOnConfirm: !1,
                showConfirmButton: !0,
                showCancelButton: !0
            }, function(e) {
                e && (d.swal({
                    title: "Please wait..",
                    text: "Creating a copy of this map..",
                    type: "warning",
                    showConfirmButton: !1,
                    showCancelButton: !1
                }), q({
                    method: "POST",
                    url: WS_BASE_URL + "/copymap",
                    data: {
                        id: b.map.id
                    }
                }).then(function(b) {
                    d.close();
                    b = b.data;
                    c.debug(b);
                    b ? (g.nextViewOptions({
                        disableBack: !0
                    }), g.clearCache().then(function() {
                        a.go("bootmod3.maps", {}, {
                            reload: !0
                        })
                    })) : d.swal({
                        title: "Error",
                        text: "Failed to create a copy of the map, please try again or contact Tech Support for assistance.",
                        type: "error"
                    })
                }, function(a) {
                    d.swal({
                        title: "Error",
                        text: "Failed to create a copy of the map, please try again.",
                        type: "error"
                    })
                }))
            })
        }
    } else g.nextViewOptions({
            disableBack: !0
        }),
        g.clearCache().then(function() {
            a.go("bootmod3.maps", {}, {
                reload: !0
            })
        })
}]).controller("MapRenameController", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", function(b, a, d, c, k, g) {
    b.cancel = function() {
        g.cancel()
    };
    b.hide = function() {
        g.hide()
    };
    b.update = function(c) {
        g.hide(c);
        k({
            method: "POST",
            url: WS_BASE_URL + "/map/rename",
            data: {
                id: b.map.id,
                name: b.map.name,
                desc: b.map.desc,
                version: b.map.version
            }
        }).then(function(a) {
            d.toast("Map " + b.map.name + " updated.");
            b.mapName = b.map.name
        }, function(b) {
            406 ===
                b.status ? a.swal({
                    title: "Error",
                    text: "Map with name specified already exists.",
                    type: "error"
                }) : a.swal({
                    title: "Error",
                    text: "Failed to rename map, try again.",
                    type: "error"
                })
        })
    }
}]).controller("MapReplaceController", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", function(b, a, d, c, k, g) {
    b.cancel = function() {
        g.cancel()
    };
    b.hide = function() {
        g.hide()
    };
    b.doReplaceMap = function(c) {
        g.hide(c);
        k({
            method: "POST",
            url: WS_BASE_URL + "/rmap",
            data: b.map
        }).then(function(a) {
                d.toast("Map " + b.map.name + " updated.")
            },
            function(b) {
                406 === b.status ? a.swal({
                    title: "Error",
                    text: "Map with name specified already exists.",
                    type: "error"
                }) : a.swal({
                    title: "Error",
                    text: "Failed to rename map, try again.",
                    type: "error"
                })
            })
    }
}]).controller("MultiMapBuildCtrl", ["$scope", "$mdDialog", "UI", "SweetAlert", "$http", "$ionicHistory", "$state", function(b, a, d, c, k, g, l) {
    b.availableMapsForMultimap = [];
    b.maps.forEach(function(a) {
        (a.stock || a.otsMapId) && b.availableMapsForMultimap.push({
            id: a.id,
            name: a.name,
            stock: a.stock,
            customRom: a.customRom,
            otsMapId: a.otsMapId
        })
    });
    b.cancel = function() {
        a.hide()
    };
    b.multimapConfig = {
        name: "",
        activeMapSlots: 2,
        mapSlot1: null,
        mapSlot2: null,
        mapSlot3: null,
        mapSlot4: null
    };
    b.doMultimapCreate = function() {
        console.log(b.multimapConfig);
        if (0 === b.multimapConfig.name.trim().length) c.swal({
            title: "Error",
            text: "Name cannot be blank.",
            type: "error"
        });
        else if (2 > b.multimapConfig.activeSlots) c.swal({
            title: "Error",
            text: "You need to select 2 or more maps to build a MultiMap.",
            type: "error"
        });
        else if (4 < b.multimapConfig.activeSlots) c.swal({
            title: "Error",
            text: "Maximum number of configurable slots in a MultiMap is 4.",
            type: "error"
        });
        else if ((2 !== b.multimapConfig.activeSlots || b.multimapConfig.mapSlot1 && b.multimapConfig.mapSlot2) && (3 !== b.multimapConfig.activeSlots || b.multimapConfig.mapSlot1 && b.multimapConfig.mapSlot2 && b.multimapConfig.mapSlot3) && (4 !== b.multimapConfig.activeSlots || b.multimapConfig.mapSlot1 && b.multimapConfig.mapSlot2 && b.multimapConfig.mapSlot3 && b.multimapConfig.mapSlot4)) {
            var d = {
                method: "POST",
                url: WS_BASE_URL + "/multimap",
                data: b.multimapConfig
            };
            c.swal({
                title: "Please wait..",
                text: "Building your MultiMap, please wait...",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !1
            });
            k(d).then(function(b) {
                a.hide();
                c.swal({
                    title: "Success",
                    text: "Your MultiMap has now been created and you can find it under My Maps.",
                    type: "success"
                }, function() {
                    g.clearCache().then(function() {
                        g.nextViewOptions({
                            disableBack: !0
                        });
                        l.go("bootmod3.maps", {}, {
                            reload: !0
                        })
                    })
                })
            }, function(a) {
                c.swal({
                    title: "Error",
                    text: "Request to build your MultiMap failed. Please try again or contact support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            })
        } else c.swal({
            title: "Error",
            text: "You need to configure " + b.multimapConfig.activeSlots + " slots as per your active maps selection in the screen.",
            type: "error"
        })
    }
}]).controller("FlashCtrl", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", function(b, a, d, c, k, g) {
    b.cancel = function() {
        g.cancel()
    };
    b.hide = function() {
        g.hide()
    };
    b.update = function(c) {
        g.hide(c);
        k({
            method: "POST",
            url: WS_BASE_URL + "/map/rename",
            data: {
                id: b.map.id,
                name: b.map.name,
                desc: b.map.desc,
                version: b.map.version
            }
        }).then(function(a) {
            d.toast("Map " + b.map.name +
                " updated.");
            b.mapName = b.map.name
        }, function(b) {
            406 === b.status ? a.swal({
                title: "Error",
                text: "Map with name specified already exists.",
                type: "error"
            }) : a.swal({
                title: "Error",
                text: "Failed to rename map, try again.",
                type: "error"
            })
        })
    }
}]).controller("mapConfigCtrl", ["$scope", "$state", "SweetAlert", "$log", "$timeout", "$ionicHistory", "UI", "$mdDialog", "$rootScope", "$http", "$mdConstant", function(b, a, d, c, k, g, l, h, e, q, n) {
    b.map = a.selectedMap;
    b.mapConfig = a.selectedMap.mapConfig;
    b.mapConfig || (b.mapConfig = {}, a.selectedMap.mapConfig =
        b.mapConfig);
    b.slotConfig = a.slotConfig;
    1 < b.slotConfig && b.map.multiMapConfigs && (b.mapConfig = b.map.multiMapConfigs[b.slotConfig - 2]);
    b.mapConfig.codes || (b.mapConfig.codes = []);
    b.keys = [n.KEY_CODE.ENTER, n.KEY_CODE.COMMA, n.KEY_CODE.SPACE, 186];
    b.saveConfig = function(c) {
        d.swal({
            title: "Confirm",
            text: "Are you sure you want to save these configuration changes?",
            type: "warning",
            confirmButtonText: "Save",
            closeOnConfirm: !1,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(e) {
            e && (b.map.flashBlocked = !1, a.selectedMap.flashBlocked = !1, d.swal({
                title: "Please wait..",
                text: "Saving map configuration...",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !1
            }), e = b.slotConfig, 0 === e && (e += 1), q({
                method: "POST",
                url: WS_BASE_URL + "/map/saveconfig",
                data: {
                    id: a.selectedMap.id,
                    mapConfig: b.mapConfig,
                    activeSlot: e
                }
            }).then(function(e) {
                d.swal({
                    title: "Success",
                    text: "Map configuration saved. Reflash this map to have the changes applied to the DME.",
                    type: "success",
                    showConfirmButton: !0
                }, function() {
                    b.map.offlineStatus = "update";
                    c ? h.hide() : (g.nextViewOptions({
                            disableBack: !0
                        }),
                        g.clearCache().then(function() {
                            a.go("bootmod3.maps")
                        }))
                })
            }, function(a) {
                406 === a.status ? d.swal({
                    title: "Error",
                    text: "Map with name specified already exists.",
                    type: "error"
                }) : d.swal({
                    title: "Error",
                    text: "Failed to update map, try again.",
                    type: "error"
                })
            }))
        })
    }
}]);
angular.module("app.devices", []).controller("devicesCtrl", ["$scope", "$log", "$state", "SweetAlert", "UI", "$rootScope", "$location", "$http", "$bmd", function(b, a, d, c, k, g, l, h, e) {
    var q = null;
    b.registerEvents = function() {
        q || (q = g.$on("devices", function() {
            b.devices = g.getForCurrUser("devices");
            b.noDevices = null === b.devices || b.devices && 0 === b.devices.length;
            g.pulldownRefreshDevicesShown = g.getForCurrUser("pulldownRefreshDevicesShown", !1)
        }))
    };
    b.registerEvents();
    b.$on("$destroy", function() {
        q()
    });
    b.$on("$ionicView.beforeEnter",
        function() {
            b.doRefresh()
        });
    b.devices = g.getForCurrUser("devices");
    b.noDevices = null === b.devices || b.devices && 0 === b.devices.length;
    b.details = function(a) {
        d.selectedDevice = a;
        d.go("bootmod3.deviceDetails")
    };
    b.detailsVIN = function() {
        d.selectedDevice = {
            id: g.VIN
        };
        d.go("bootmod3.deviceVinDetails")
    };
    b.add = function() {
        d.go("bootmod3.deviceReg")
    };
    b.doRefresh = function(a) {
        a && (g.setForCurrentUser("pulldownRefreshDevicesShown", a), g.pulldownRefreshDevicesShown = a);
        g.currentVehicleIds = null;
        g.fetchIdsNoDebounce();
        g.getClientSession(function() {
            g.pulldownRefreshDevicesShown =
                g.getForCurrUser("pulldownRefreshDevicesShown", !1);
            b.$broadcast("scroll.refreshComplete")
        }, a)
    }
}]).controller("vehicleDetailsCtrl", ["$state", "$scope", "SweetAlert", "$rootScope", "$bmd", "UI", "$ionicHistory", "$timeout", "$http", "$mdDialog", function(b, a, d, c, k, g, l, h, e, q) {
    a.cancel = function() {
        q.hide()
    };
    a.checkSupport = function(a) {
        c.VIN ? c.currentVehicleIds ? (a = {
            method: "POST",
            url: WS_BASE_URL + "/checksupport",
            data: c.currentVehicleIds
        }, d.swal({
            title: "Please wait",
            text: "Checking software support for your vehicle...",
            type: "info"
        }), e(a).then(function(a) {
                "ACTIVATION_PENDING" === a.data.status ? d.swal({
                    title: "Success",
                    text: "Your vehicle is supported by bootmod3.\x3cbr/\x3e\x3cbr/\x3eProceed with activation and flashing a tune on your car.",
                    type: "success",
                    showConfirmButton: !0,
                    showCancelButton: !1,
                    confirmButtonText: "OK",
                    html: !0
                }) : d.swal({
                    title: "Contact Support",
                    text: "To inquire on support for your vehicle please contact Tech Support at support@protuningfreaks.com.",
                    type: "info",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            },
            function(a) {
                d.swal({
                    title: "Error",
                    text: "Failed checking vehicle support. If this error persists please contact our Tech Support for assistance.",
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            })) : d.swal({
            title: "Data Unavailable",
            text: "Could not obtain vehicle data. Click on the 'Help' button for information on how to connect with your vehicle's OBD port.",
            type: "error"
        }) : d.swal({
            title: "Connection",
            text: "No vehicle connection detected. Click on the 'Help' button for information on how to connect with your vehicle's OBD port.",
            type: "error"
        })
    }
}]).controller("deviceDetailsCtrl", ["$state", "$scope", "SweetAlert", "$rootScope", "$bmd", "UI", "$ionicHistory", "$timeout", "$http", "$mdDialog", function(b, a, d, c, k, g, l, h, e, q) {
    a.device = b.selectedDevice;
    a.$on("$ionicView.beforeEnter", function() {
        c.fetchIdsNoDebounce()
    });
    var n = null,
        v = null;
    a.$on("$ionicView.loaded", function() {
        n = c.$on("devices", r);
        v = c.$on("activate", r)
    });
    a.$on("$destroy", function() {
        n();
        v()
    });
    a.copyVin = function() {
        var a = document.getElementById("vin");
        a.select();
        a.setSelectionRange(0,
            99999);
        document.execCommand("copy");
        g.toast("Copied VIN " + a.innerText + " to clipboard.")
    };
    a.transferEmail = "";
    a.transferVin = "";
    a.transferConfirm = !1;
    a.startTransferLicense = function(b) {
        q.hide();
        q.show({
            controller: "DialogController",
            templateUrl: "templates/licenseTransfer-confirm.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            controllerAs: "ctrl",
            clickOutsideToClose: !0,
            scope: a,
            preserveScope: !0,
            fullscreen: !0
        })
    };
    a.handleTransferError = function(b) {
        console.error(b);
        404 === b.status ? d.swal({
                title: "Error",
                text: "License not active currently. It cannot be transferred.",
                type: "error"
            }) : 417 === b.status ? d.swal({
                title: "Not Uninstalled",
                text: "You need to uninstall bootmod3 first. Go to Stock Tune and click Flash -\x3e Flash and Relock DME option. Once complete you'll be able to proceed with your transfer.",
                type: "error"
            }) : 409 === b.status ? d.swal({
                title: "Error",
                text: "Please contact support@protuningfreaks.com for assistance in completing this vehicle's license transfer.",
                type: "error"
            }) : 422 === b.status && b.data &&
            b.data.status ? a.handleUnprocessableTransferError(b.data.status) : 423 === b.status ? d.swal({
                title: "Used License",
                text: "This license is was previously transferred. License transfer is not possible for used licenses.",
                type: "error"
            }) : d.swal({
                title: "Error",
                text: "Please contact support at support@protuningfreaks.com for assistance in completing this vehicle's license transfer",
                type: "error"
            })
    };
    a.handleUnprocessableTransferError = function(a) {
        a ? "NO_CODING" === a ? d.swal({
                title: "Not Ready",
                text: "bootmod3 needs to verify software compatibility for the other car before proceeding with transfer. Start the bootmod3 OBD Agent on the other car and then try your license transfer again.\x3cbr\x3e\x3cbr\x3eIf any issues contact support@protuningfreaks.com.",
                type: "error",
                html: !0
            }) : "ENGINE_TYPE_INCOMPATIBILITY" === a ? d.swal({
                title: "Compatibility",
                text: "Your license cannot be transferred to this vehicle. You can only transfer to vehicles where license is of the same or lower cost on the other vehicle.",
                type: "error"
            }) : "UNKNOWN_DME" !== a && "DME_NOT_SUPPORTED" !== a && "UNRECOGNIZED_DATA" !== a && "INVALID_AP" !== a && "IDS_NOT_SUPPORTED" !== a || d.swal({
                title: "Not Supported",
                text: "Vehicle you're attempting to transfer to is not currently supported by bootmod3.",
                type: "error"
            }) :
            d.swal({
                title: "Error",
                text: "Please contact support at support@protuningfreaks.com for assistance in completing this vehicle's license transfer",
                type: "error"
            })
    };
    a.doTransferLicense = function() {
        var b;
        b = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(a.transferEmail) ? !0 : !1;
        b ? a.transferVin && 17 === a.transferVin.trim().length ? a.transferVin === c.userVIN ? g.toast("You cannot license transfer your own VIN.") : a.transferConfirm ? (q.hide(), d.swal({
            title: "Confirm",
            text: "If you confirm this transfer, your account data will be deleted and your bootmod3 license will be transferred to\x3cbr\x3e\x3cbr\x3e" +
                a.transferEmail + "\x3cbr\x3e\x3cbr\x3eAre you sure you'd like to proceed?",
            type: "warning",
            html: !0,
            showConfirmButton: !0,
            showCancelButton: !0,
            confirmButtonText: "Transfer"
        }, function(b) {
            b && (d.swal({
                title: "Please wait..",
                text: "License transfer in progress...",
                type: "info"
            }), e({
                method: "POST",
                url: WS_BASE_URL + "/vehicle/transfer",
                data: {
                    toEmail: a.transferEmail,
                    toVin: a.transferVin
                }
            }).then(function(a) {
                d.swal({
                        title: "Success",
                        text: "Your license is now transferred",
                        type: "success",
                        allowOutsideClick: !1,
                        clickOutsideToClose: !1
                    },
                    function() {
                        c.kick(!0)
                    })
            }, function(b) {
                a.handleTransferError(b)
            }))
        })) : g.toast("Please confirm transfer by checking off the Confirm Transfer checkbox above.") : g.toast("Invalid VIN entered. It needs to be 17 characters long.") : g.toast("Invalid email address entered.")
    };
    a.readVehicleData = function() {
        c.bmdConnected ? c.fetchIds() : d.swal({
            title: "Not Found",
            text: "OBD Agent not detected yet. Please ensure it is running and connected to the OBD Port and try again.",
            type: "error",
            showConfirmButton: !0,
            showCancelButton: !1
        })
    };
    var r = function() {
        for (var b = 0; b < c.devices.length; b++) {
            var d = c.devices[b];
            if (d.id === a.device.id) {
                a.device = d;
                break
            }
        }
    };
    a.deactivate = function() {
        d.swal({
            title: "Not Supported",
            text: "This feature is not supported in the app currently. Please contact us on our Tech Support portal for assistance.",
            type: "error",
            showConfirmButton: !0,
            showCancelButton: !1
        })
    };
    a.remove = function() {
        d.swal({
            title: "Not Supported",
            text: "This feature is not supported in the app currently. Please contact us on our Tech Support portal for assistance.",
            type: "error",
            showConfirmButton: !0,
            showCancelButton: !1
        })
    }
}]).controller("deviceVinDetailsCtrl", ["$state", "$scope", "SweetAlert", "$rootScope", "$bmd", "UI", "$ionicHistory", "$timeout", "$http", "$mdDialog", function(b, a, d, c, k, g, l, h, e, q) {
    a.$on("$ionicView.beforeEnter", function() {
        c.fetchIdsNoDebounce()
    });
    var n = null,
        v = null;
    a.$on("$ionicView.loaded", function() {
        n = c.$on("devices", r);
        v = c.$on("activate", r)
    });
    a.$on("$destroy", function() {
        n();
        v()
    });
    a.copyVin = function() {
        var a = document.getElementById("vin");
        a.select();
        a.setSelectionRange(0, 99999);
        document.execCommand("copy");
        g.toast("Copied VIN " + a.innerText + " to clipboard.")
    };
    a.readVehicleData = function() {
        c.bmdConnected ? c.fetchIds() : d.swal({
            title: "Not Found",
            text: "OBD Agent not detected yet. Please ensure it is running and connected to the OBD Port and try again.",
            type: "error",
            showConfirmButton: !0,
            showCancelButton: !1
        })
    };
    var r = function() {
        for (var b = 0; b < c.devices.length; b++) {
            var d = c.devices[b];
            if (d.id === a.device.id) {
                a.device = d;
                break
            }
        }
    }
}]);
angular.module("app.devicereg", []).controller("deviceRegCtrl", ["$scope", "$log", "SweetAlert", "$bmd", "$state", "$rootScope", "UI", "$ionicHistory", "$http", function(b, a, d, c, k, g, l, h, e) {
    b.device = {};
    g.vehicleData = null;
    g.authenticated || h.clearCache().then(function() {
        location.href = "index.html"
    });
    b.devices = g.devices;
    b.noDevices = null === g.devices || g.devices && 0 === g.devices.length;
    g.VIN && (b.device = {
        vin: g.VIN,
        devInfo: g.devInfo
    }, c.send("/app/id", {
        forceUpdate: !0
    }, {
        jwt: g.get("token")
    }));
    var q = null;
    b.$on("$ionicView.loaded",
        function() {
            q = g.$on("devices", function() {
                b.devices = g.devices;
                b.noDevices = null === g.devices || g.devices && 0 === g.devices.length;
                b.device = {
                    vin: g.VIN,
                    devInfo: g.devInfo
                }
            })
        });
    b.$on("$destroy", function() {
        q()
    });
    b.readFile = function(a) {
        a.file(function(a) {
            var c = new FileReader;
            c.onload = function(a) {
                b.device.fileContent = "base64," + encode(a.target.result);
                l.toast("File is ready for upload");
                b.$apply()
            };
            c.readAsArrayBuffer(a)
        }, function(a) {})
    };
    b.selectFile = function() {
        window.cordova && "iOS" === device.platform ? window.FilePicker.pickFile(function(a) {
            l.toast("Reading selected file..");
            var c = a.lastIndexOf("/"),
                c = a.substring(c + 1);
            b.device.fileName = c;
            b.$apply();
            window.resolveLocalFileSystemURL("file://" + a, b.readFile, function(a) {
                l.toast("Failed reading file " + a)
            })
        }, function(a) {}, "public.data") : document.getElementsByName("mapFile")[0].click()
    };
    b.fileNameChanged = function(a) {
        var c = new FileReader;
        c.onload = function() {
            b.device.fileContent = c.result;
            b.$apply()
        };
        b.device.fileName = a.files[0].name;
        c.readAsDataURL(a.files[0])
    };
    b.submitForm = function(a) {
        a ? b.add() : d.swal({
            title: "Error",
            text: "Please ensure all the fields are filled out correctly.",
            type: "warning",
            timer: 3E3
        })
    };
    b.add = function() {
        g.vehicleData && g.vehicleData.vid ? (d.swal({
            title: "Please wait..",
            text: "Adding vehicle to your account..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !1
        }), h.clearCache().then(function() {
            var a = {
                id: b.device.vin.toUpperCase(),
                activationSerial: b.device.activationSerial,
                devInfo: g.devInfo,
                map: {
                    data: {
                        data: b.device.fileContent
                    }
                },
                vehicleData: g.vehicleData
            };
            e({
                method: "POST",
                url: WS_BASE_URL + "/activate",
                data: a
            }).then(function(a) {
                a = a.data;
                "FAILED_VEHICLE_UNAVAILABLE" ===
                a.status ? d.swal({
                        title: "Failed",
                        text: "OBD Agent doesn't seem to be running as vehicle VIN is not detected.",
                        type: "error",
                        showCancelButton: !1,
                        confirmButtonText: "Ok",
                        closeOnConfirm: !0,
                        closeOnCancel: !0
                    }) : "FAILED_INVALID_DATA" === a.status ? d.swal({
                        title: "Failed",
                        text: "Activation is not successful. Please contact our Technical Support team for assistance at support@protuningfreaks.com.",
                        type: "error",
                        showCancelButton: !1,
                        confirmButtonText: "Ok",
                        closeOnConfirm: !0,
                        closeOnCancel: !0
                    }) : "FAILED_VIN_MISMATCH" === a.status ?
                    d.swal({
                        title: "Failed",
                        text: "This activation key is not valid. If this error persists please contact our Tech Support.",
                        type: "error",
                        showCancelButton: !1,
                        confirmButtonText: "Ok",
                        closeOnConfirm: !0,
                        closeOnCancel: !0
                    }) : "FAILED_KEY_DISABLED" === a.status ? d.swal({
                        title: "Failed",
                        text: "This activation key is not available at this time due to an issue with your order. If this error persists please send your order details to our Tech Support team and they'll review.",
                        type: "error",
                        showCancelButton: !1,
                        confirmButtonText: "Ok",
                        closeOnConfirm: !0,
                        closeOnCancel: !0
                    }) : "FAILED_VEHICLE_INFO_NOT_RECOGNIZED" === a.status ? d.swal({
                        title: "Failed",
                        text: "Your vehicle's DME data does not seem to be recognized. Please email support@protuningfreaks.com to reach Tech Support.",
                        type: "error",
                        showCancelButton: !1,
                        confirmButtonText: "Ok",
                        closeOnConfirm: !0,
                        closeOnCancel: !0
                    }) : "FAILED_DATA_UNAVAILABLE" === a.status ? d.swal({
                        title: "Data Support",
                        text: "Your vehicle's DME data support is in progress. Please email support@protuningfreaks.com and include a screenshot of the Vehicle Details page showing Software Version Details.",
                        type: "warning",
                        showCancelButton: !1,
                        confirmButtonText: "Ok",
                        closeOnConfirm: !0,
                        closeOnCancel: !0
                    }) : "ACTIVE_ALREADY" === a.status ? d.swal({
                        title: "Error",
                        text: "Unable to activate this vehicle using activation key provided [Error 5001]. Please contact us on our Tech Support portal for assistance.",
                        type: "error",
                        showConfirmButton: !0,
                        showCancelButton: !1
                    }) : "FAILED_REQUIRES_DIFFERENT_FLASHER" === a.status ? d.swal({
                        title: "Error",
                        text: "Vehicle's DME is not currently supported. Please contact us on our Tech Support portal for assistance.",
                        type: "error",
                        showConfirmButton: !0,
                        showCancelButton: !1
                    }) : "ACTIVE" === a.status ? (g.updateLogDashChannelData(), d.swal({
                        title: "Success",
                        text: "New vehicle has been successfully registered and activated in your account. You can go ahead and choose a map from the OTS Maps screen and flash it.",
                        type: "success",
                        showConfirmButton: !0,
                        showCancelButton: !1,
                        confirmButtonText: "OK",
                        html: !0
                    }, function(a) {
                        g.clientSession = null;
                        g.getClientSession(function() {
                            h.clearCache().then(function() {
                                h.nextViewOptions({
                                    disableBack: !0
                                });
                                k.go("bootmod3.devices", {}, {
                                    reload: !0
                                })
                            })
                        }, !0)
                    })) : "FAILED_ACTIVATION_INTERNAL_ERROR" === a.status && d.swal({
                        title: "Error",
                        text: "Failed adding vehicle. If this error persists please contact us on our Tech Support portal for assistance.",
                        type: "error",
                        showConfirmButton: !0,
                        showCancelButton: !1
                    })
            }, function(a) {
                d.swal({
                    title: "Error",
                    text: "Failed adding vehicle. If this error persists please contact us on our Tech Support portal for assistance.",
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            })
        })) : d.swal({
            title: "Error",
            text: "Ensure OBD Agent is running, ignition is on and vehicle software versions are showing in the screen.",
            type: "warning"
        })
    }
}]);
angular.module("app.devicestatus", []).controller("deviceStatusCtrl", ["$scope", "$log", "$state", "SweetAlert", "UI", "$rootScope", "$interval", function(b, a, d, c, k, g, l) {
    b.deviceStatus = "device off";
    b.devices = [];
    var h = null,
        e = null,
        q = null,
        n = null;
    this.$onInit = function() {
        q = g.$on("VIN", function() {
            b.updateDeviceStatus()
        });
        n = g.$on("clientSession", function() {
            b.updateDeviceStatus()
        });
        h = g.$on("devices", function() {
            b.updateDeviceStatus()
        });
        e = g.$on("agenton", function() {
            b.updateDeviceStatus()
        })
    };
    this.$onDestroy = function() {
        h();
        e();
        q();
        n()
    };
    b.updateDeviceStatus = function() {
        b.deviceStatus = "device " + (g.VIN ? "on" : "off")
    }
}]);
angular.module("app.addmap", []).controller("addMapCtrl", ["$scope", "$log", "SweetAlert", "$state", "$ionicHistory", "UI", "$http", function(b, a, d, c, k, g, l) {
    window.cordova && "iOS" === device.platform && (b.platform = "iOS");
    b.map = {
        version: 1,
        stock: !1
    };
    b.readFile = function(a) {
        a.file(function(a) {
            var c = new FileReader;
            c.onload = function(a) {
                b.map.fileContent = "base64," + encode(a.target.result);
                g.toast("File is ready for upload");
                b.$apply()
            };
            c.readAsArrayBuffer(a)
        }, function(a) {})
    };
    b.selectFile = function() {
        window.cordova && "iOS" ===
            device.platform ? window.FilePicker.pickFile(function(a) {
                g.toast("Reading selected file..");
                var c = a.lastIndexOf("/"),
                    c = a.substring(c + 1);
                b.map.fileName = c;
                b.$apply();
                window.resolveLocalFileSystemURL("file://" + a, b.readFile, function(a) {
                    g.toast("Failed reading file " + a)
                })
            }, function(a) {}, "public.data") : document.getElementsByName("mapFile") && document.getElementsByName("mapFile")[0].click()
    };
    b.fileNameChanged = function(a) {
        var c = new FileReader;
        c.onload = function() {
            b.map.fileContent = c.result;
            b.$apply()
        };
        b.map.fileName =
            a.files[0].name;
        c.readAsDataURL(a.files[0])
    };
    b.add = function(a) {
        a ? (d.swal({
            title: "Please wait..",
            text: "Uploading map to bootmod3..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !1
        }), k.clearCache().then(function() {
            b.map.name && 0 !== b.map.name.trim().length || (b.map.name = b.map.fileName);
            b.addMap = {
                desc: b.map.desc,
                name: b.map.name,
                version: b.map.version,
                data: {
                    data: b.map.fileContent
                }
            };
            l({
                method: "POST",
                url: WS_BASE_URL + "/map",
                data: b.addMap
            }).then(function(a) {
                if (a = a.data)
                    if ("SUCCESS" === a.status) d.close(),
                        g.toast("Your new map has been uploaded successfully."), k.clearCache().then(function() {
                            k.nextViewOptions({
                                disableBack: !0
                            });
                            c.go("bootmod3.maps")
                        });
                    else {
                        var b = "Failed uploading map file.";
                        a && a.status && ("FAILED_INTERNAL_ERROR" === a.status ? b = "Failed uploading map file." : "FAILED_INVALID_FILE_DETECTED" === a.status ? b = "Failed uploading map file. It seems to be an invalid or corrupt file." : "FAILED_VEHICLE_TUNE_MISMATCH" === a.status ? b = "Failed uploading map file as it doesn't match your vehicle." : "FAILED_VEHICLE_NOT_DETECTED" ===
                            a.status && (b = "Failed uploading map file. Vehicle not connected or no activated devices found in your account. To upload new maps you need have one device fully registered and active in your account."));
                        d.swal({
                            title: "Map Upload Failed",
                            text: b,
                            type: "error",
                            showConfirmButton: !0,
                            showCancelButton: !1
                        })
                    }
            }, function() {
                d.swal({
                    title: "Map Upload Failed",
                    text: "Failed uploading map file.",
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            })
        })) : d.swal({
            title: "Error",
            text: "Please ensure all the fields are filled out correctly.",
            type: "warning",
            timer: 3E3
        })
    }
}]).controller("addLogCtrl", ["$scope", "$log", "SweetAlert", "$state", "$ionicHistory", "UI", "$http", function(b, a, d, c, k, g, l) {
    window.cordova && "iOS" === device.platform && (b.platform = "iOS");
    b.log = {};
    b.readFile = function(a) {
        a.file(function(a) {
            var c = new FileReader;
            c.onload = function(a) {
                b.log.fileContent = "base64," + encode(a.target.result);
                g.toast("File is ready for upload");
                b.$apply()
            };
            c.readAsArrayBuffer(a)
        }, function(a) {})
    };
    b.selectFile = function() {
        window.cordova && "iOS" === device.platform ?
            window.FilePicker.pickFile(function(a) {
                g.toast("Reading selected file..");
                var c = a.lastIndexOf("/"),
                    c = a.substring(c + 1);
                b.log.fileName = c;
                b.$apply();
                window.resolveLocalFileSystemURL("file://" + a, b.readFile, function(a) {
                    g.toast("Failed reading file " + a)
                })
            }, function(a) {}, "public.data") : document.getElementsByName("logFile") && document.getElementsByName("logFile")[0].click()
    };
    b.fileNameChanged = function(a) {
        var c = new FileReader;
        c.onload = function() {
            b.log.fileContent = c.result;
            b.$apply()
        };
        b.log.fileName = a.files[0].name;
        c.readAsDataURL(a.files[0])
    };
    b.add = function(a) {
        a ? (d.swal({
            title: "Please wait..",
            text: "Uploading datalog to bootmod3..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !1
        }), k.clearCache().then(function() {
            b.log.name && 0 !== b.log.name.trim().length || (b.log.name = b.log.fileName);
            b.addLog = {
                desc: b.log.desc,
                name: b.log.name,
                data: {
                    data: b.log.fileContent
                }
            };
            l({
                method: "POST",
                url: WS_BASE_URL + "/ulog",
                data: b.addLog
            }).then(function(a) {
                d.close();
                g.toast("Datalog uploaded successfully.");
                k.clearCache().then(function() {
                    k.nextViewOptions({
                        disableBack: !0
                    });
                    c.go("bootmod3.datalogs")
                })
            }, function() {
                d.swal({
                    title: "Datalog Upload Failed",
                    text: "Failed uploading datalog file.",
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            })
        })) : d.swal({
            title: "Error",
            text: "Please ensure all the fields are filled out correctly.",
            type: "warning",
            timer: 3E3
        })
    }
}]).controller("encryptMapCtrl", ["$scope", "$log", "SweetAlert", "$state", "$ionicHistory", "UI", "$http", "$rootScope", function(b, a, d, c, k, g, l, h) {
    window.cordova && "iOS" === device.platform && (b.platform = "iOS");
    b.map = {
        version: 1,
        stock: !1
    };
    b.readFile = function(a) {
        a.file(function(a) {
            var c = new FileReader;
            c.onload = function(a) {
                b.map.fileContent = "base64," + encode(a.target.result);
                g.toast("File is ready for upload");
                b.$apply()
            };
            c.readAsArrayBuffer(a)
        }, function(a) {})
    };
    b.selectFile = function() {
        window.cordova && "iOS" === device.platform ? window.FilePicker.pickFile(function(a) {
            g.toast("Reading selected file..");
            var c = a.lastIndexOf("/"),
                c = a.substring(c + 1);
            b.map.fileName = c;
            b.$apply();
            window.resolveLocalFileSystemURL("file://" + a, b.readFile, function(a) {
                g.toast("Failed reading file " +
                    a)
            })
        }, function(a) {}, "public.data") : document.getElementsByName("mapFile") && document.getElementsByName("mapFile")[0].click()
    };
    b.fileNameChanged = function(a) {
        var c = new FileReader;
        c.onload = function() {
            b.map.fileContent = c.result;
            b.$apply()
        };
        b.map.fileName = a.files[0].name;
        c.readAsDataURL(a.files[0])
    };
    b.encryptMap = function(a) {
        h.clientSession ? h.clientSession.webTuner && "REGULAR" !== h.clientSession.webTuner.tunerLevel ? a ? (d.swal({
            title: "Please wait..",
            text: "Encryption in progress, please wait..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !1
        }), k.clearCache().then(function() {
            b.map.name && 0 !== b.map.name.trim().length || (b.map.name = b.map.fileName);
            b.encryptMap = {
                desc: b.map.desc,
                name: b.map.name,
                vin: b.map.vin,
                version: b.map.version,
                data: {
                    data: b.map.fileContent
                }
            };
            l({
                method: "POST",
                url: WS_BASE_URL + "/encryptmap",
                responseType: "arraybuffer",
                data: b.encryptMap
            }).then(function(a) {
                d.close();
                g.toast("Map encrypted, saving to disk..");
                try {
                    var e = new Blob([a.data], {
                        type: "application/zip"
                    });
                    saveAs(e, b.encryptMap.name +
                        ".bm3")
                } catch (v) {
                    d.swal({
                        title: "Encryption Failed",
                        text: "Failed saving encrypted file. Please try again or contact support@protuningfreaks.com for assistance.",
                        type: "error",
                        showConfirmButton: !0,
                        showCancelButton: !1
                    });
                    return
                }
                g.toast("Your file has been encrypted successfully.");
                k.clearCache().then(function() {
                    k.nextViewOptions({
                        disableBack: !0
                    });
                    c.go("bootmod3.maps")
                })
            }, function(a) {
                var b = "Failed encrypting file.";
                console.error(a);
                401 === a.status ? b = "BIN file encryption feature is only available to authorized tuners and shops. To register as an authorized bootmod3 tuner please contact support@protuningfreaks.com." :
                    415 === a.status ? b = "Invalid file provided. Ensure only full BINs are uploaded, not just the calibration area." : 422 === a.status && (b = "File provided not recognized, may be a bad file. Ensure only full BINs are uploaded, not just the calibration area.");
                d.swal({
                    title: "Encryption Failed",
                    text: b,
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            })
        })) : d.swal({
            title: "Error",
            text: "Please ensure all the fields are filled out correctly.",
            type: "warning",
            timer: 3E3
        }) : d.swal({
            title: "Tuner Setup Required",
            text: "Raw BIN file encryption is an advanced feature for authorized tuners. If you're a professional tuner or shop setting up as a tuner using the Tuners screen in bootmod3 is free. To authorize your account please contact support@protuningfreaks.com.",
            type: "error",
            showConfirmButton: !1,
            showCancelButton: !1
        }) : g.toast("Loading data, please wait..")
    }
}]);
angular.module("app.codes", []).controller("codesCtrl", ["$scope", "$rootScope", function(b, a) {
    b.codes = a.codes
}]);
angular.module("app.help", []).controller("helpCtrl", [function() {}]);
angular.module("app.diag", []).controller("diagnosticsCtrl", ["$scope", "SweetAlert", "$rootScope", "$state", "$log", "UI", "$http", "$timeout", "$bmd", "$ionicHistory", "$mdBottomSheet", function(b, a, d, c, k, g, l, h, e, q, n) {
    b.onlineRecodeCheck = !1;
    b.writeDMEBin = function(a, b, c) {
        a.createWriter(function(a) {
            var b = new Blob([c], {
                type: "application/octet-stream"
            });
            a.write(b)
        })
    };
    b.reloadMaps = function() {
        d.offlineMode ? d.bmdConnected && e.send("/app/maps", {}, {
            jwt: d.get("token")
        }) : b.reloadMapsFromServer()
    };
    b.reloadMapsFromServer =
        function() {
            l({
                method: "GET",
                url: WS_BASE_URL + "/maps"
            }).then(function(a) {
                b.$broadcast("scroll.refreshComplete");
                b.updateOnlineMaps(a.data)
            }, function(a) {
                b.$broadcast("scroll.refreshComplete");
                g.toast("Failed getting maps.")
            })
        };
    b.updateOnlineMaps = function(a) {
        if (a && 0 < a.length)
            for (var c in a) {
                var d = a[c];
                if (d.stock) {
                    b.stockTune = d;
                    break
                }
            }
        b.maps = a
    };
    b.read = function() {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? (d.codes = [], d.detectedOBDAgent && d.VIN ? (a.swal({
            title: "Please wait..",
            text: "Reading codes..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !0
        }), e.send("/app/readcodes", {}, {
            jwt: d.get("token")
        })) : a.swal({
            title: "Failed",
            text: "OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })) : a.swal({
            title: "Failed",
            text: "Registered OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })
    };
    b.clear = function() {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? (d.codes = [], d.detectedOBDAgent && d.VIN ? (a.swal({
            title: "Please wait..",
            text: "Clearing codes..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !0
        }), e.send("/app/clearcodes", {}, {
            jwt: d.get("token")
        })) : a.swal({
            title: "Failed",
            text: "OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })) : a.swal({
            title: "Failed",
            text: "Registered OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })
    };
    b.reset = function() {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? d.detectedOBDAgent && d.VIN ? (a.swal({
            title: "Please wait..",
            text: "Resetting adaptations..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !0
        }), e.send("/app/clearadaptations", {}, {
            jwt: d.get("token")
        })) : a.swal({
            title: "Failed",
            text: "OBD Agent not detected or connected to the vehicle.",
            type: "error"
        }) : a.swal({
            title: "Failed",
            text: "Registered OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })
    };
    b.goResetSpecific = function() {
        c.go("bootmod3.diagAdaptResets", {}, {
            reload: !0
        })
    };
    b.resetSpecific = function(c, e) {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? d.detectedOBDAgent && d.VIN ? 1 === c && 5 === e && a.swal({
            title: "Throttle Reset",
            text: "WARNING: Engine must be OFF before continuing. Once it is reset, turn ignition OFF and then back ON and wait 30 seconds before starting the engine. Not following these instructions will cause a drivetrain malfunction error.",
            type: "warning",
            confirmButtonText: "YES",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(d) {
            d ? b.doResetAdaptsSpecific(c, e) : a.swal({
                title: "Adaptation Reset",
                text: "WARNING: Engine must be OFF before continuing. Are you sure you'd like to continue?",
                type: "warning",
                confirmButtonText: "YES",
                showConfirmButton: !0,
                showCancelButton: !0
            }, function(a) {
                a && b.doResetAdaptsSpecific(c, e)
            })
        }) : a.swal({
            title: "Failed",
            text: "OBD Agent not detected or connected to the vehicle.",
            type: "error"
        }) : a.swal({
            title: "Failed",
            text: "Registered OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })
    };
    b.doResetAdaptsSpecific = function(b, c) {
        a.swal({
            title: "Please wait..",
            text: "Resetting chosen adaptation, please wait..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !0
        });
        e.send("/app/clearadaptationsspecific", {
            byteIdx: b,
            bitIdx: c
        }, {
            jwt: d.get("token")
        })
    };
    b.actuateExhaustFlap = function(b) {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? d.detectedOBDAgent && d.VIN ? (a.swal({
                title: "Please wait..",
                text: "Actuating exhaust flap..",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !0
            }),
            e.send("/app/exhaustflap", {
                state: b
            }, {
                jwt: d.get("token")
            })) : a.swal({
            title: "Failed",
            text: "OBD Agent not detected or connected to the vehicle.",
            type: "error"
        }) : a.swal({
            title: "Failed",
            text: "Registered OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })
    };
    b.updateCoding = function() {
        d.bmdConnected ? d.VIN ? a.swal({
            title: "Warning",
            text: "Only use if instructed by Tech Support. This will run a backup on your DME's coding.",
            type: "warning",
            html: !0,
            confirmButtonText: "Backup",
            closeOnConfirm: !1,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(a) {
            a && e.send("/app/updatecoding", {}, {
                jwt: d.get("token")
            })
        }) : a.swal({
            title: "Error",
            text: "OBD Agent is not connected to the vehicle.",
            type: "error"
        }) : a.swal({
            title: "Error",
            text: "OBD Agent is not detected.",
            type: "error"
        })
    };
    b.setActiveSound = function(b) {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? d.detectedOBDAgent && d.VIN ? (b = {
            state: b
        }, a.swal({
            title: "Please wait..",
            text: "Changing active sound ..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !0
        }), e.send("/app/activesound",
            b, {
                jwt: d.get("token")
            })) : a.swal({
            title: "Failed",
            text: "OBD Agent not detected or connected to the vehicle.",
            type: "error"
        }) : a.swal({
            title: "Failed",
            text: "Registered OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })
    };
    b.resetECU = function() {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? d.detectedOBDAgent && d.VIN ? (a.swal({
            title: "Please wait..",
            text: "Resetting ECU..",
            type: "warning",
            showConfirmButton: !1,
            showCancelButton: !0
        }), e.send("/app/resetecu", {}, {
            jwt: d.get("token")
        })) : a.swal({
            title: "Failed",
            text: "OBD Agent not detected or connected to the vehicle.",
            type: "error"
        }) : a.swal({
            title: "Failed",
            text: "Registered OBD Agent not detected or connected to the vehicle.",
            type: "error"
        })
    };
    b.doDMERead = function(b) {
        if (d.bmdConnected)
            if (d.VIN) {
                b ? e.send("/app/readdmefull", {}, {
                    jwt: d.get("token")
                }) : e.send("/app/readdme", {}, {
                    jwt: d.get("token")
                });
                var c = "Attempting DME read, please wait..";
                b && (c = "Attempting DME full read, please wait..");
                a.swal({
                    title: "Please wait",
                    text: c,
                    type: "warning",
                    showCancelButton: !1,
                    showConfirmButton: !1,
                    allowOutsideClick: !1,
                    clickOutsideToClose: !1
                })
            } else a.swal({
                title: "Error",
                text: "OBD Agent is not connected to the vehicle.",
                type: "error"
            });
        else a.swal({
            title: "Error",
            text: "OBD Agent is not detected.",
            type: "error"
        })
    };
    b.readOptions = function() {
        n.show({
            templateUrl: "templates/dmeReadBottomSheet.html",
            controller: "DmeReadCtrl",
            preserveScope: !0,
            scope: b
        })
    };
    b.readDME = function() {
        b.readOptions()
    }
}]).controller("DmeReadCtrl", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdBottomSheet", "$timeout", function(b,
    a, d, c, k, g, l) {
    b.cancel = function() {
        g.hide()
    };
    b.hide = function() {
        g.hide()
    };
    b.partialRead = function(c) {
        g.hide(c);
        a.swal({
            title: "Warning!",
            text: "Vehicle should be in ignition only mode to read the DME. DO NOT attempt this with the motor running. Are you sure you want to proceed?",
            type: "warning",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(a) {
            a && l(function() {
                b.doDMERead(!1)
            }, 100)
        })
    };
    b.fullRead = function(c) {
        g.hide(c);
        a.swal({
            title: "Warning!",
            text: "Full DME read can take a long time. Vehicle should be in ignition only mode to read the DME. DO NOT attempt this with the motor running. Are you sure you want to proceed?",
            type: "warning",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(a) {
            a && l(function() {
                b.doDMERead(!0)
            }, 100)
        })
    }
}]).controller("supportCtrl", ["$scope", "SweetAlert", "$rootScope", "$state", "$log", "UI", "$http", "$timeout", "$bmd", function(b, a, d, c, k, g, l, h, e) {
    var q = null;
    b.$on("$ionicView.loaded", function() {
        q = d.$on("agenton", function(a) {
            b.addSubscriber()
        })
    });
    b.$on("$destroy", function() {
        q();
        b.stopForFlashSub && (e.unsubscribe(b.stopForFlashSub), b.stopForFlashSub = null)
    });
    b.addSubscriber = function() {
        b.stopForFlashSub &&
            (e.unsubscribe(b.stopForFlashSub), b.stopForFlashSub = null);
        b.stopForFlashSub = e.subscribe("/user/queue/stopforflash", function(b) {
            b && "SUCCESS" === b.status ? a.swal({
                title: "Success",
                text: "Server connection is active.",
                type: "success",
                showConfirmButton: !0,
                showCancelButton: !1
            }) : a.swal({
                title: "Failed",
                text: "Server connection failed. Please try again.",
                type: "error",
                confirmButtonClass: "btn-error"
            })
        }, {
            jwt: d.get("token")
        })
    };
    b.stopForDiag = function() {
        d.offlineMode ? g.toast("Not available in offline mode.") : d.bmdConnected ?
            d.VIN ? (b.addSubscriber(), a.swal({
                title: "Please wait..",
                text: "Establishing server connection..",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !1
            }), e.send("/app/stopforflash", {}, {
                jwt: d.get("token")
            })) : g.toast("Vehicle not detected.") : g.toast("OBD Agent not connected.")
    }
}]);
angular.module("app.otsmaps", []).controller("otsMapsCtrl", ["$scope", "SweetAlert", "$log", "$http", "$state", "$rootScope", "$ionicFilterBar", function(b, a, d, c, k, g, l) {
    b.maps = [];
    b.noOtsMapsAvailable = !1;
    b.noOtsMapsPossible = !1;
    b.showFilterBar = function() {
        l.show({
            items: b.maps,
            update: function(a, c) {
                b.oriMaps || (b.oriMaps = b.maps.slice(0));
                if (c) {
                    var d = [],
                        e;
                    for (e in a) {
                        var g = a[e];
                        (-1 < g.name.toUpperCase().indexOf(c.toUpperCase()) || -1 < g.engineType.toUpperCase().indexOf(c.toUpperCase())) && d.push(g)
                    }
                    b.maps = d
                } else b.maps =
                    b.oriMaps
            }
        })
    };
    b.details = function(a) {
        d.debug(a);
        k.selectedMap = a;
        k.ots = !0;
        k.go("bootmod3.otsMapDescription")
    };
    b.reloadOTSMaps = function() {
        c({
            method: "GET",
            url: WS_BASE_URL + "/ots"
        }).then(function(a) {
            a = a.data;
            b.maps = a;
            b.noDevices = !g.devices || 0 === g.devices.length;
            b.noOtsMapsAvailable = !b.noDevices && (!a || 0 === a.length)
        }, function(c) {
            b.$broadcast("scroll.refreshComplete");
            424 === c.status ? (b.noOtsMapsPossible = !0, a.swal({
                title: "Failed",
                text: "No vehicle registered in account. OTS maps listing is only available for accounts where a vehicle is registered.",
                type: "error"
            })) : (b.$broadcast("scroll.refreshComplete"), a.swal({
                title: "Failed",
                text: "Failed getting OTS maps.",
                type: "error"
            }))
        })
    };
    var h = null;
    b.$on("$ionicView.loaded", function() {
        h = g.$on("devices", function() {
            b.noDevices = !g.devices || 0 === g.devices.length
        })
    });
    b.$on("$destroy", function() {
        h()
    });
    b.removeMap = function() {
        a.swal({
            title: "Confirm",
            text: "Are you sure you want to remove this map?",
            type: "warning",
            confirmButtonText: "Remove",
            closeOnConfirm: !0,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(e) {
            e &&
                (a.swal({
                    title: "Please wait..",
                    text: "Removing map..",
                    type: "warning",
                    showConfirmButton: !1,
                    showCancelButton: !1
                }), c({
                    method: "POST",
                    url: WS_BASE_URL + "/removemap",
                    data: {
                        id: b.map.id
                    }
                }).then(function(b) {
                    a.close();
                    b = b.data;
                    d.debug(b);
                    b && ($ionicHistory.nextViewOptions({
                        disableBack: !0
                    }), $ionicHistory.clearCache().then(function() {
                        k.go("bootmod3.otsmaps", {}, {
                            reload: !0
                        })
                    }))
                }, function(b) {
                    a.swal({
                        title: "Error",
                        text: "Failed to remove map, try again.",
                        type: "error"
                    })
                }))
        })
    }
}]).controller("otsMapDescriptionCtrl", ["$scope",
    "$state", "SweetAlert", "$http", "$ionicHistory", "$timeout", "$rootScope", "$mdDialog",
    function(b, a, d, c, k, g, l, h) {
        b.map = a.selectedMap;
        for (var e = 0; e < l.devices.length; e++) {
            var q = l.devices[e];
            if (q.activated) {
                b.device = q;
                break
            }
        }
        b.acquireTune = function(a) {
            b.device ? d.swal({
                title: "Confirm",
                text: "Are you sure you'd like to acquire the " + b.map.name + " map?",
                type: "warning",
                html: !0,
                confirmButtonText: "Yes",
                closeOnConfirm: !0,
                showConfirmButton: !0,
                showCancelButton: !0
            }, function(a) {
                d.close();
                a && g(b.doAcquireTune, 100)
            }) : d.swal({
                title: "Not Registered",
                text: "No vehicle registered in your account.",
                type: "error"
            })
        };
        b.otsBundleKey = "";
        b.doAcquireTune = function(e, g) {
            h.hide();
            d.swal({
                title: "Please wait",
                text: "Adding " + b.map.name + " map under My Maps. Please wait...",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !1
            });
            var l = {
                method: "POST",
                url: WS_BASE_URL + "/acquireOts",
                data: {
                    otsMapId: b.map.id
                }
            };
            g && b.otsBundleKey && 0 < b.otsBundleKey.length && (l.data.key = b.otsBundleKey);
            c(l).then(function(c) {
                d.swal({
                    title: "Success",
                    text: b.map.name + " acquired successfully. You can now find it under the My Maps screen and proceed to flash.",
                    type: "success"
                }, function(b) {
                    k.nextViewOptions({
                        disableBack: !0
                    });
                    a.go("bootmod3.maps")
                })
            }, function(a) {
                h.hide();
                424 === a.status ? b.handleInsufficientCredits(e) : 406 === a.status ? b.handleInvalidCode(e) : d.swal({
                    title: "Failed",
                    text: "Failed acquiring OTS map. Please contact tech support at support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            })
        };
        b.handleInsufficientCredits = function(a) {
            d.swal({
                title: "Map Credits",
                text: "You have insufficient map credits to acquire additional OTS maps. To purchase the OTS Maps bundle and gain flash access to all the OTS maps refer to our website at protuningfreaks.com or contact support@protuningfreaks.com for more details.",
                type: "error",
                showCancelButton: !0,
                showConfirmButton: !0,
                cancelButtonText: "OK",
                confirmButtonText: "Enter Bundle Code"
            }, function(c) {
                c && h.show({
                    controller: "DialogController",
                    templateUrl: "templates/otsBundleCode-confirm.tmpl.html",
                    parent: angular.element(document.body),
                    controllerAs: "ctrl",
                    clickOutsideToClose: !0,
                    scope: b,
                    event: a,
                    preserveScope: !0,
                    fullscreen: !0
                })
            })
        };
        b.handleInvalidCode = function(a) {
            d.swal({
                title: "Invalid Code",
                text: "OTS Bundle activation code doesn't seem to be valid. Please verify it or contact support@protuningfreaks.com with your order number and VIN for assistance.",
                type: "error",
                showCancelButton: !0,
                showConfirmButton: !0,
                cancelButtonText: "Cancel",
                confirmButtonText: "Re-Enter Code"
            }, function(c) {
                c && h.show({
                    controller: "DialogController",
                    templateUrl: "templates/otsBundleCode-confirm.tmpl.html",
                    parent: angular.element(document.body),
                    controllerAs: "ctrl",
                    clickOutsideToClose: !0,
                    scope: b,
                    event: a,
                    preserveScope: !0,
                    fullscreen: !0
                })
            })
        }
    }
]);
angular.module("app.logconfig", []).controller("datalogConfigCtrl", ["$scope", "$stateParams", "$rootScope", "SweetAlert", "UI", "$ionicFilterBar", "$http", "$timeout", function(b, a, d, c, k, g, l, h) {
    var e = null,
        q = null,
        n = null,
        v = null,
        r = null,
        x = null;
    b.registerEvents = function() {
        e || (e = b.$watch("config.liveChartMaxPoints", function(a) {
            d.setForCurrentUser("liveChartMaxPoints", a);
            d.liveChartMaxPoints = a
        }), q = b.$watch("config.autoShowLog", function(a) {
            d.autoShowLog = a;
            d.setForCurrentUser("autoShowLog", a)
        }), n = b.$watch("config.thres",
            function(a) {
                d.setForCurrentUser("autologThres", a);
                d.updateAgentAutoLogSettings()
            }), v = b.$watch("config.cutoff", function(a) {
            d.setForCurrentUser("autologCutoffSecs", a);
            d.updateAgentAutoLogSettings()
        }), r = d.$watch("clientSession", function() {
            b.setupChannels()
        }), x = d.$watch("VIN", function() {
            b.setupChannels()
        }))
    };
    b.setupChannels = function() {
        d.getCurrentLogChannelsAll(function(a) {
            a = _.sortBy(a, "name");
            d.getCurrentLogChannels(function(c) {
                c.forEach(function(b) {
                    var c = _.findWhere(a, {
                        pid: b.pid
                    });
                    c && (c.showInDash =
                        b.showInDash, c.selected = b.selected)
                });
                b.logChannels = a
            })
        })
    };
    b.$on("$destroy", function() {
        b.destroyEvents()
    });
    b.$on("$ionicView.beforeEnter", function() {
        b.registerEvents()
    });
    b.$on("$ionicView.beforeLeave", function() {
        b.dirty && d.getCurrentLogChannels(function(a) {
            b.updateChannels(a)
        });
        b.destroyEvents()
    });
    b.destroyEvents = function() {
        e();
        q();
        n();
        v();
        r();
        x()
    };
    b.config = {
        thres: d.getForCurrUser("autologThres", 70),
        cutoff: d.getForCurrUser("autologCutoffSecs", 3),
        autoShowLog: d.getForCurrUser("autoShowLog", !0),
        liveChartMaxPoints: d.getForCurrUser("liveChartMaxPoints",
            300)
    };
    b.units = [{
        name: "IMPERIAL"
    }, {
        name: "METRIC"
    }];
    b.layouts = [{
        name: "Live Charts",
        id: "livecharts"
    }, {
        name: "Bar Graphs",
        id: "bargraphs"
    }, {
        name: "Dials",
        id: "dials"
    }];
    b.selectedUnits = d.getForCurrUser("selectedUnits", {
        name: "IMPERIAL"
    }).name;
    b.selectedLayout = d.getForCurrUser("selectedLayout", {
        name: "Bar Graphs",
        id: "bargraphs"
    }).name;
    b.pressureSettings = [{
        name: "RELATIVE"
    }, {
        name: "ABSOLUTE"
    }];
    b.selectedPressureSetting = d.getForCurrUser("selectedPressureSetting", {
        name: "RELATIVE"
    }).name;
    b.pressureUnits = d.getForCurrUser("pressureUnits", {
        name: "DEFAULT"
    }).name;
    b.tempUnits = d.getForCurrUser("tempUnits", {
        name: "DEFAULT"
    }).name;
    b.speedUnits = d.getForCurrUser("speedUnits", {
        name: "DEFAULT"
    }).name;
    b.torqueUnits = d.getForCurrUser("torqueUnits", {
        name: "METRIC"
    }).name;
    b.flowUnits = d.getForCurrUser("flowUnits", {
        name: "METRIC"
    }).name;
    (a = d.ap) || (a = d.getForCurrUser("ap"));
    b.ecus = a && a.dualDME ? [{
        id: "12",
        name: "DME"
    }, {
        id: "13",
        name: "DME (Secondary)"
    }, {
        id: "12,13",
        name: "DME 1 \x26 2 - Concurrent"
    }] : [{
        id: "12",
        name: "DME"
    }];
    b.selectedEcu = d.getForCurrUser("selectedEcu", {
        id: "12",
        name: "DME"
    }).id;
    b.type = "default";
    b.switchChannels = function(a) {
        "other" === a && (c.swal({
            title: "Other Channels",
            text: "*** WARNING: This tab shows non-default channels, some of which may not be compatible with your vehicle. Adding a non-default channel can cause the Dashboard and logging to stop working (e.g. show all zeros). If this happens, go to the About screen and click on the 'Reset Settings' button.",
            html: !0,
            type: "warning"
        }), h(function() {
            b.type = a
        }, 100));
        b.updateTotals()
    };
    b.updateTotals =
        function() {
            b.totalDefChannels = 0;
            b.selDefChannels = 0;
            b.selRamChannels = 0;
            b.totalOtherChannels = 0;
            b.totalRamChannels = 0;
            b.selOtherChannels = 0;
            b.totalSelChannels = 0;
            b.maxChannels = 36;
            b.totalChannels = b.logChannels.length;
            for (var a in b.logChannels) {
                var c = b.logChannels[a];
                c.ram ? (b.totalRamChannels++, c.selected && b.selRamChannels++) : c.def || c.required ? (c.selected && b.selDefChannels++, b.totalDefChannels++) : (c.selected && b.selOtherChannels++, b.totalOtherChannels++)
            }
            b.logChannels.sort(function(a, b) {
                return a.name.localeCompare(b.name)
            });
            b.totalSelChannels = b.selDefChannels + b.selOtherChannels
        };
    b.showFilterBar = function() {
        g.show({
            items: b.logChannels,
            update: function(a) {
                b.logChannels = a
            }
        })
    };
    b.reset = function() {
        l({
            method: "GET",
            url: WS_BASE_URL + "/logconfigreset"
        }).then(function(a) {
            k.toast("Dash config reset");
            h(d.updateLogDashChannelData, 1)
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed resetting log channel config.",
                type: "error"
            })
        })
    };
    b.dirty = !1;
    b.toggle = function(a) {
        b.updateTotals();
        var e = b.selDefChannels + b.selOtherChannels;
        a.selected && !a.ram &&
            e > b.maxChannels ? (console.log("Too many channels " + e), c.swal({
                title: "Error",
                text: "Exceeding a max of 36 channels total is not possible. No other channels can be selected unless some are removed first.",
                type: "error"
            }, function() {
                a.selected = !a.selected;
                a.showInDash = a.selected;
                b.updateTotals()
            })) : (d.pauseGauges(), d.updateChannelDetails(a, function() {
                b.dirty = !0
            }))
    };
    b.updateChannel = function(a) {};
    d.prepDefaultChannelsForSave = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            d.def && !d.ram && b.push(d)
        }
        return b
    };
    d.prepRAMChannelsForSave = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            d.ram && b.push(d)
        }
        return b
    };
    d.prepOtherChannelsForSave = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            d.ram || d.def || b.push(d)
        }
        return b
    };
    b.updateChannels = function(a) {
        l({
            method: "POST",
            url: WS_BASE_URL + "/updatelogchannels",
            data: {
                channels: a
            }
        }).then(function(a) {
            b.dirty = !1;
            b.updateTotals()
        }, function(a) {
            b.dirty = !1;
            b.updateTotals()
        })
    };
    b.updateDefaultChannels = function() {
        var a = d.prepDefaultChannelsForSave(b.logChannels);
        b.updateChannels(a)
    };
    b.updateRAMChannels = function() {
        var a = d.prepRAMChannelsForSave(b.logChannels);
        b.updateChannels(a)
    };
    b.updateOtherChannels = function() {
        var a = d.prepOtherChannelsForSave(b.logChannels);
        b.updateChannels(a)
    };
    b.updateUnits = function(a) {
        d.setForCurrentUser("selectedUnits", {
            name: a
        })
    };
    b.updateLayout = function(a) {
        var c = b.layouts.find(function(b) {
            return b.name === a
        });
        d.setForCurrentUser("selectedLayout", {
            name: c.name,
            id: c.id
        });
        d.stockChart = null
    };
    b.updatePressureSettings = function(a) {
        d.setForCurrentUser("selectedPressureSetting", {
            name: a
        })
    };
    b.updateEcu = function(a) {
        d.setForCurrentUser("selectedEcu", {
            id: a
        })
    };
    b.updatePressureUnits = function(a) {
        d.setForCurrentUser("pressureUnits", {
            name: a
        })
    };
    b.updateTempUnits = function(a) {
        d.setForCurrentUser("tempUnits", {
            name: a
        })
    };
    b.updateSpeedUnits = function(a) {
        d.setForCurrentUser("speedUnits", {
            name: a
        })
    };
    b.updateTorqueUnits = function(a) {
        d.setForCurrentUser("torqueUnits", {
            name: a
        })
    };
    b.updateFlowUnits = function(a) {
        d.setForCurrentUser("flowUnits", {
            name: a
        })
    };
    b.updateSettings = function() {
        d.stockChart = null;
        var a = {
            method: "POST",
            url: WS_BASE_URL + "/updateecu",
            data: {
                ecuInHex: d.getForCurrUser("selectedEcu", {
                    name: "DME",
                    id: "12"
                }).id,
                units: d.getForCurrUser("selectedUnits", {
                    name: "IMPERIAL"
                }).name,
                pressurePreference: d.getForCurrUser("selectedPressureSetting", {
                    name: "IMPERIAL"
                }).name,
                pressureUnits: d.getForCurrUser("pressureUnits", {
                    name: "DEFAULT"
                }).name,
                tempUnits: d.getForCurrUser("tempUnits", {
                    name: "DEFAULT"
                }).name,
                speedUnits: d.getForCurrUser("speedUnits", {
                    name: "DEFAULT"
                }).name,
                torqueUnits: d.getForCurrUser("torqueUnits", {
                    name: "METRIC"
                }).name,
                flowUnits: d.getForCurrUser("flowUnits", {
                    name: "METRIC"
                }).name
            }
        };
        l(a).then(function(a) {
            d.channelDataLoaded = !1
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed updating pressure setting.",
                type: "error"
            })
        })
    }
}]);
angular.module("app.dashconfig", []).controller("dashConfigCtrl", ["$scope", "$rootScope", "SweetAlert", "UI", "$ionicFilterBar", "$http", "$timeout", function(b, a, d, c, k, g, l) {
    b.dashChannels = [];
    a.getCurrentLogChannels(function(a) {
        b.dashChannels = a
    });
    b.units = [{
        name: "IMPERIAL"
    }, {
        name: "METRIC"
    }];
    b.selectedUnits = a.get("selectedUnits", {
        name: "IMPERIAL"
    });
    b.pressureSettings = [{
        name: "RELATIVE"
    }, {
        name: "ABSOLUTE"
    }];
    b.selectedPressureSetting = a.get("selectedPressureSetting");
    b.showFilterBar = function() {
        k.show({
            items: b.dashChannels,
            update: function(a) {
                b.dashChannels = a
            }
        })
    };
    b.reset = function() {
        g({
            method: "GET",
            url: WS_BASE_URL + "/dashconfigreset"
        }).then(function(b) {
            l(a.updateLogDashChannelData, 1)
        }, function(a) {
            d.swal({
                title: "Error",
                text: "Failed retrieving dash configuration.",
                type: "error"
            })
        })
    };
    b.toggle = function(b) {
        a.updateChannelDetails(b, function() {}, function() {})
    }
}]);
angular.module("app.agent", []).controller("obdAgentCtrl", ["$scope", "$rootScope", "SweetAlert", "$timeout", "ngProgressFactory", "UI", function(b, a, d, c, k, g) {
    b.devices = a.offlineMode ? a.getForCurrUser("devices") : a.devices;
    b.noDevices = null === a.devices || a.devices && 0 === a.devices.length;
    b.status = function() {
        a.detectedOBDAgent ? g.toast("OBD Agent is up and running.", "short") : g.toast("OBD Agent not detected on your network.", "short")
    };
    b.restart = function() {
        if (a.detectedOBDAgent) {
            var b;
            var c = new XMLHttpRequest;
            c.open("POST",
                "http://" + AGENT_IP_ADDR + ":8181/restart", !1);
            try {
                c.send(), b = 200 <= c.status && (300 > c.status || 304 === c.status)
            } catch (n) {
                b = !1
            }
            b && g.toast("OBD Agent restart requested successfully. Agent is restarting..", "short")
        } else g.toast("OBD Agent not detected on your network.", "short")
    };
    var l = function() {
            var a = new XMLHttpRequest;
            a.open("HEAD", "http://" + AGENT_IP_ADDR + ":8181", !1);
            try {
                return a.send(), 200 <= a.status && (300 > a.status || 304 === a.status)
            } catch (q) {
                return console.error(q), !1
            }
        },
        h = function() {
            d.swal({
                title: "Agent Update",
                text: "Please wait, downloading latest OBD Agent update..",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !1
            });
            b.progressbar = k.createInstance();
            b.progressbar.setHeight("6px");
            b.progressbar.setColor("blue");
            b.progressbar.set(0);
            b.progressbar.start();
            var c = new XMLHttpRequest;
            c.open("POST", "http://" + AGENT_IP_ADDR + ":8181/downloadandupdate", !0);
            c.addEventListener("progress", function(a) {}, !1);
            c.onreadystatechange = function() {
                a.agentOff();
                4 === c.readyState ? (b.progressbar.setColor("green"), b.progressbar.complete(),
                    d.swal({
                        title: "Update Complete",
                        text: "OBD Agent is now updated to the latest version.",
                        type: "warning",
                        showConfirmButton: !0,
                        showCancelButton: !1
                    })) : (b.progressbar.setColor("red"), b.progressbar.complete(), d.swal({
                    title: "Error",
                    text: "Unable to update the OBD Agent.",
                    type: "error"
                }, function() {}))
            };
            c.send()
        };
    b.update = function() {
        a.detectedOBDAgent ? l() ? d.swal({
            title: "Agent Update",
            html: !0,
            text: "About to download the latest OBD Agent update to update your current version.\x3cbr\x3e\x3cbr\x3eWould you like to proceed?",
            type: "warning",
            closeOnConfirm: !1,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(a) {
            a && c(b.doUpdate(), 100)
        }) : g.toast("OBD Agent version you're running does not support in-app updates. Please update it to the latest manually first. Contact us on our Tech Support portal for assistance.") : g.toast("OBD Agent not detected on your network and cannot be updated.")
    };
    b.doUpdate = function() {
        h()
    };
    b.download = function(a, c) {
        var e = new FileTransfer;
        a = a.toURL();
        e.onprogress = function(a) {
            a.lengthComputable && b.progressbar.set(Math.floor(a.loaded /
                a.total * 100))
        };
        e.download(c, a, function(a) {
            a.file(function(a) {
                console.dir(a)
            });
            d.swal({
                title: "Agent Update",
                text: "Please wait, sending latest update to your OBD Agent..",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !1
            }, function() {});
            b.upload()
        }, function(a) {
            b.progressbar.setColor("red");
            b.progressbar.complete();
            d.swal({
                title: "Error",
                text: "Failed to download latest update for your OBD Agent.",
                type: "error"
            }, function() {})
        }, null, {})
    };
    b.upload = function() {
        window.requestFileSystem(window.TEMPORARY,
            26214400,
            function(d) {
                d.root.getFile("agent.jar", {
                    create: !0,
                    exclusive: !1
                }, function(d) {
                    d = d.toURL();
                    var e = new FileUploadOptions;
                    e.fileKey = "file";
                    e.fileName = d.substr(d.lastIndexOf("/") + 1);
                    e.mimeType = "application/zip";
                    e.chunkedMode = !1;
                    var g = new FileTransfer;
                    g.onprogress = function(a) {
                        a.lengthComputable && b.progressbar.set(Math.floor(a.loaded / a.total * 100))
                    };
                    b.progressbar.set(0);
                    b.progressbar.start();
                    g.upload(d, encodeURI("http://" + AGENT_IP_ADDR + ":8181/agentupdate"), a, c, e)
                })
            });
        var a = function(a) {
                b.progressbar.setColor("green");
                b.progressbar.complete();
                d.swal({
                    title: "Success",
                    text: "OBD Agent successfully updated and will now restart.",
                    type: "success"
                }, function() {})
            },
            c = function(a) {
                b.progressbar.setColor("red");
                b.progressbar.complete();
                d.swal({
                    title: "Error",
                    text: "Failed updating OBD Agent.",
                    type: "error"
                }, function() {})
            }
    }
}]);
angular.module("app.mapedit", []).controller("mapEditCtrl", ["$route", "$scope", "$state", "SweetAlert", "$ionicFilterBar", "$rootScope", "UI", "$mdSidenav", "$ionicPlatform", "$ionicHistory", "$mdDialog", "$mdPanel", "$http", "$timeout", "hotkeys", "$mdBottomSheet", "$sce", "uiGridConstants", "$ionicSideMenuDelegate", "$ionicScrollDelegate", "$mdMenu", "$bmd", function(b, a, d, c, k, g, l, h, e, q, n, v, r, x, t, p, C, y, B, A, w, z) {
    function I() {
        this.heatmap || (this.heatmap = {
            min: null,
            max: null
        });
        for (var a = 0, b = this.countCols(); a < b; a++)
            for (var c =
                    0, d = this.countRows(); c < d; c++) {
                var f = this.heatmap,
                    e = this.getDataAtCell(c, a);
                this.heatmap = {
                    min: f.min ? Math.min(f.min, e) : e,
                    max: f.max ? Math.max(f.max, e) : e
                }
            }
    }

    function N(a, b, c) {
        return (c - a) / (b - a)
    }

    function J(b, c, d, e, g, h, k) {
        if (f.isNumeric(h)) {
            Handsontable.renderers.NumericRenderer.apply(this, arguments);
            var m = null,
                u = null;
            b.tableId && (m = b.getDataAtCell(d, e), u = b.axis ? "h" === b.axis ? f.originalDataHAxis[b.tableId][0][e] : f.originalDataVAxis[b.tableId][d][0] : f.originalData[b.tableId][d][e]);
            var F = {},
                D = O(N(b.heatmap.min,
                    b.heatmap.max, parseInt(h, 10))).hex();
            b.heatmap && (a.viewingDiff || (F.background = m !== u ? D + " linear-gradient(135deg, #8b00bf, #8b00bf 6px, transparent 6px, transparent)" : D));
            m = c;
            u = Object.keys(F).length;
            0 < u && (3 < u ? (m.style.display = "none", Object.assign(m.style, F), m.style.display = "") : Object.assign(m.style, F))
        }
    }
    var f = this;
    a.mapName = "Tuning Editor";
    a.editor = !0;
    a.map = null;
    d.selectedMap = null;
    a.tuneReq = null;
    a.importMap = null;
    a.channels = [];
    a.selectedTab = 0;
    window.cordova && "iOS" === device.platform && (a.platform = "iOS");
    var K = null,
        L = null;
    a.$on("$ionicView.loaded", function() {
        a.registerEvents()
    });
    a.dashShowing = null;
    a.registerEvents = function() {
        L || (L = g.$watch(function() {
            return B.getOpenRatio()
        }, function(b, c) {
            b !== c && a.dashShowing && (0 === b ? g.$broadcast("startdash") : g.$broadcast("stopdash"))
        }), K = g.$on("offlinelogs", function() {
            a.loadingLogsLocal = null;
            a.logsLocalGrid.gridOptions.data = [];
            a.logsLocalGrid.gridOptions.data = g.offlineLogs
        }))
    };
    A.freezeAllScrolls(!0);
    B.canDragContent(!1);
    var H = Handsontable.editors.NumericEditor.prototype.extend();
    H.prototype.saveValue = function(a, b) {
        b = f.getCurrentTableValProps(this.instance);
        var c = Number(a[0][0]);
        c < b.min ? c = b.min : c > b.max ? c = b.max : 0 < b.precision && (c = Math.floor(c * Math.pow(10, Number(b.precision))) / Math.pow(10, Number(b.precision)));
        a[0][0] = String(c);
        b = this.instance.draggable.lastSelection.selectedCells[0];
        b[0] > b[2] && (c = b[0], b[0] = b[2], b[2] = c);
        b[1] > b[3] && (c = b[1], b[1] = b[3], b[3] = c);
        this.instance.populateFromArray(b[0], b[1], a, b[2], b[3], "edit");
        this.instance.editing = !1
    };
    var M = window.addEventListener("beforeunload",
        function(a) {
            window.ignoreOpenWindow || (a.preventDefault(), a.returnValue = "Are you sure you would like to close the bootmod3 Map Editor?")
        });
    b = g.getForCurrUser("selectedLayout", {
        name: "Bar Graphs",
        id: "bargraphs"
    });
    a.dashLayout = b.name && "dials" !== b.id ? b.name && "bargraphs" !== b.id ? b.name && "livecharts" !== b.id ? "dash2" : "dash3" : "dash2" : "dash";
    (d.selectedMap || d.tuneReq) && c.swal({
        title: "Please wait..",
        text: "Loading map data..",
        type: "info",
        showConfirmButton: !1,
        showCancelButton: !1
    });
    a.show3dTables = g.getForCurrUser("show3dTables", !1);
    t.bindTo(a).add({
        combo: "mod+s",
        description: "Save: Save all changes to this map.",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.save(!1, b)
        }
    });
    t.bindTo(a).add({
        combo: "mod+shift+s",
        description: "Save As: Save a copy of this map as another map, ignoring any current unsaved changes.",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.save(!0, b)
        }
    });
    t.bindTo(a).add({
        combo: "mod+r",
        description: "Release Tune: Release tune to customer.",
        allowIn: ["INPUT",
            "SELECT", "TEXTAREA"
        ],
        callback: function(b) {
            b.preventDefault();
            a.releaseTune(b)
        }
    });
    t.bindTo(a).add({
        combo: "mod+o",
        description: "Open: Open a new map for editing.",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.open(b, !1)
        }
    });
    t.bindTo(a).add({
        combo: "mod+i",
        description: "Import: Import another map on top of this current one and view their differences.",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.open(b, !0)
        }
    });
    t.bindTo(a).add({
        combo: "mod+f",
        description: "Flash: Flash this map to your car.",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.flashOptions()
        }
    });
    t.bindTo(a).add({
        combo: "mod+m",
        description: "Map Config: Open map config.",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.showMapConfig(b)
        }
    });
    t.bindTo(a).add({
        combo: "mod+l",
        description: "Datalogs: View datalogs tab",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.showLogs(b)
        }
    });
    t.bindTo(a).add({
        combo: "mod+h",
        description: "Version History: View version history tab",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.selectedTab = 2
        }
    });
    t.bindTo(a).add({
        combo: "mod+e",
        description: "Editor: View editor tab",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            b.preventDefault();
            a.selectedTab = 0
        }
    });
    t.bindTo(a).add({
        combo: "mod+x",
        description: "Tune Request Comments: View tune request comments for this car",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            a.tuneReq && (b.preventDefault(),
                a.showCustomerComments(b))
        }
    });
    t.bindTo(a).add({
        combo: "mod+d",
        description: "Tune Request Details: View tune request details for this car",
        allowIn: ["INPUT", "SELECT", "TEXTAREA"],
        callback: function(b) {
            a.tuneReq && (b.preventDefault(), a.showRequestDetails(b))
        }
    });
    a.loadTuners = function() {
        r({
            method: "GET",
            url: WS_BASE_URL + "/tuners"
        }).then(function(b) {
                if (b)
                    for (var c = 0; c < b.data.length; c++) {
                        var d = b.data[c],
                            d = {
                                tunerId: d.id,
                                name: d.name,
                                display: d.name,
                                companyName: d.companyName,
                                value: d.name.toLowerCase()
                            };
                        a.tuners.push(d)
                    }
            },
            function(a) {})
    };
    a.loadTuners = _.debounce(a.loadTuners, 300, !0);
    a.generateTune = function(b) {
        0 < a.commited && a.dirty ? l.toast("You have unsaved/uncommitted changes. You need to close current map before proceeding to generate a new tune request.") : a.map || a.tuneReq ? c.swal({
            title: "Warning",
            text: "You need to close current map before proceeding to generate a new tune request.",
            type: "error"
        }) : (a.newTuneReq = {
            vin: g.VIN
        }, n.show({
            controller: "GenerateTuneCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-generateTune.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !1,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        }))
    };
    a.releaseTune = function(b) {
        a.tuneReq && (0 < a.commited && a.dirty ? l.toast("You have unsaved/uncommitted changes. You need to revert them prior to releasing the tune for flash.") : n.show({
            controller: "ReleaseTuneCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-releaseTune.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        }))
    };
    a.releaseTuneWithBIN = function(b) {
        n.show({
            controller: "ReleaseTuneWithBinCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-releaseTuneWithBin.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.replaceTuneWithBIN = function(b) {
        n.show({
            controller: "ReplaceTuneWithBinCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-replaceTuneWithBin.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.requestTune = function(b) {
        0 < a.commited && a.dirty ? l.toast("You have unsaved/uncommitted changes. You need to revert them prior to requesting a tune.") : n.show({
            controller: "RequestTuneCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-requestTune.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })
    };
    a.showLiveAdjust = function(a) {
        n.show({
            controller: "liveAdjustCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-liveadjust.html",
            parent: angular.element(document.body),
            targetEvent: a,
            preserveScope: !1,
            clickOutsideToClose: !1,
            fullscreen: !1
        })
    };
    a.rejectTuneReq = function(b) {
        c.swal({
            title: "Confirm",
            text: "Are you sure you'd like to reject this tune request? It will show up as rejected for the end user and they won't be able to flash it.",
            type: "warning",
            html: !0,
            confirmButtonText: "Reject",
            closeOnConfirm: !0,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(b) {
            b && r({
                method: "DELETE",
                url: WS_BASE_URL + "/tunereq/" + a.map.mapRequestId
            }).then(function(a) {
                l.toast("Tune request rejected.");
                f.doCloseMap()
            }, function(a) {
                c.swal({
                    title: "Error",
                    text: "Failed to reject tune request. Please try again or reach out to support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            })
        })
    };
    a.closeLogs = function() {
        n.hide()
    };
    a.showLogs = function(b) {
        a.reloadLogs();
        a.selectedTab = 1
    };
    a.showRequestDetails = function(b, c) {
        a.selectedTuneReq = c ? c : a.tuneReq;
        n.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-requestTuneView.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0,
            hasBackdrop: !0,
            multiple: !0
        })
    };
    a.showCustomerComments = function(b, c, d) {
        a.selectedTuneReq = c ? c : a.tuneReq;
        a.reqHistLoading = !0;
        a.reqHist = [];
        n.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-tuneReqCommentsView.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0,
            hasBackdrop: !0,
            multiple: d,
            onComplete: function() {
                autosize.destroy(document.getElementsByClassName("comment-text"));
                f.loadHistory(a.selectedTuneReq.mapRequest.id)
            }
        })
    };
    a.comment = "";
    a.showComment = function(b) {
        a.comment = "";
        n.show({
            controller: "DialogController",
            templateUrl: "templates/mapEdit-comment.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            controllerAs: "ctrl",
            clickOutsideToClose: !0,
            fullscreen: !0
        })
    };
    a.postComment = function(b) {
        "COPIED" === a.selectedTuneReq.status ? c.swal({
            title: "Warning",
            text: "You cannot comment on copies of custom tune requests. To interact with your tuner and do further changes ensure you comment on the original tune request.",
            type: "warning"
        }) : a.comment && 0 !== a.comment.trim().length ? (a.sendingComment = !0, b = {
            method: "POST",
            url: WS_BASE_URL + "/reqcomment",
            data: {
                mapRequestId: a.selectedTuneReq.mapRequest.id,
                comment: a.comment + ""
            }
        }, a.comment = "", r(b).then(function(b) {
            a.sendingComment = !1;
            f.loadHistory(a.selectedTuneReq.mapRequest.id);
            l.toast("Comment sent..")
        }, function(b) {
            a.sendingComment = !1;
            c.swal({
                title: "Error",
                text: "Failed adding comment.",
                type: "error"
            })
        })) : l.toast("Empty message..")
    };
    a.postComment = _.debounce(a.postComment, 300, !0);
    f.lastHistReqId = null;
    f.loadHistory = function(b) {
        a.reqHist = [];
        f.lastHistReqId = b;
        a.reqHistLoading = !0;
        r({
            method: "GET",
            url: WS_BASE_URL + "/tunereqhist/" + (b ? b : a.tuneReq.id)
        }).then(function(b) {
            a.reqHistLoading = !1;
            a.$broadcast("scroll.refreshComplete");
            (b = b.data) && 0 < b.length && b.forEach(function(a) {
                a.createdDate && (a.createdDate = (new Date(a.createdDate)).toString())
            });
            a.reqHist = b;
            x(function() {
                autosize(document.getElementsByClassName("comment-text"))
            })
        }, function(b) {
            a.reqHistLoading = !1;
            a.$broadcast("scroll.refreshComplete")
        })
    };
    f.loadHistory = _.debounce(f.loadHistory, 300, !0);
    a.publishOTS = function(b) {
        0 < a.commited && a.dirty ? l.toast("You have unsaved/uncommitted changes. You need to revert them prior to publishing.") : (a.mapPublish = {
            mapId: a.map.id,
            mapName: a.map.name,
            mapDescription: a.map.desc,
            credits: 1,
            version: a.map.version
        }, n.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-publishOTS.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0,
            hasBackdrop: !1
        }))
    };
    a.showDash = function(a) {};
    a.stopDash = function() {
        g.pauseGauges()
    };
    a.doPublish = function(b) {
        0 > a.mapPublish.credits ? c.swal({
            title: "Error",
            text: "Credits cost cannot be less than 0.",
            type: "error"
        }) : b ? a.confirmedPublish(!0) : c.swal({
            title: "Confirm",
            text: "Are you sure you'd like to publish a new version instead of just update current?",
            type: "warning",
            showCancelButton: !0,
            showConfirmButton: !0
        }, function(b) {
            b && a.confirmedPublish(!1)
        })
    };
    a.confirmedPublish = function(b) {
        c.swal({
            title: "Publishing",
            text: "Please wait, " + (b ? "updating current" : "publishing new") + " map..",
            type: "warning",
            showCancelButton: !1,
            showConfirmButton: !1
        });
        a.mapPublish.updateOnly = b;
        r({
            method: "POST",
            url: WS_BASE_URL + "/ots",
            data: a.mapPublish
        }).then(function(a) {
            c.swal({
                title: "Success",
                text: "Map published successfully.",
                type: "success"
            })
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed to publish map.",
                type: "error"
            })
        })
    };
    a.confirmAndPublish = _.debounce(a.confirmAndPublish, 300, !0);
    a.doExport = function() {
        c.swal({
            title: "Exporting",
            text: "Please wait, exporting map..",
            type: "warning",
            showCancelButton: !0,
            showConfirmButton: !1
        });
        r({
            method: "POST",
            url: WS_BASE_URL + "/map/export",
            responseType: "arraybuffer",
            data: a.mapExport
        }).then(function(b) {
            c.close();
            l.toast("Map ready, save to disk..");
            var d = a.mapExport.mapName + ".bm3";
            try {
                var m = new Blob([b.data], {
                    type: "application/zip"
                });
                saveAs(m, d)
            } catch (D) {
                l.toast("Failed to export map.")
            }
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed to export map.",
                type: "error"
            })
        })
    };
    a.doExport = _.debounce(a.doExport, 300, !0);
    a.exportCustomROMTables =
        function(b) {
            c.swal({
                title: "Exporting CustomROM Tables..",
                text: "Please wait, exporting CustomROM table definitions in CSV format for use in external editor..",
                type: "warning",
                showCancelButton: !0,
                showConfirmButton: !1
            });
            r({
                method: "GET",
                url: WS_BASE_URL + "/map/exporttables/" + a.map.id,
                responseType: "arraybuffer"
            }).then(function(a) {
                c.close();
                l.toast("CSV file export ready, save to disk..");
                try {
                    var b = new Blob([a.data], {
                            type: "text/csv"
                        }),
                        d = a.headers()["content-disposition"],
                        m = d.substring(22, d.length - 1);
                    saveAs(b,
                        m)
                } catch (E) {
                    console.log(E), l.toast("Failed to export CustomROM table definitions as CSV. Please contact support@protuningfreaks.com for assistance.")
                }
            }, function(a) {
                c.swal({
                    title: "Error",
                    text: "Failed to export CustomROM table definitions. Please contact support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            })
        };
    a.exportCustomROMTables = _.debounce(a.exportCustomROMTables, 300, !0);
    a.exportStockMap = function(b) {
        a.map ? (c.swal({
            title: "Exporting Stock..",
            text: "Please wait, exporting raw stock version of the map..",
            type: "warning",
            showCancelButton: !0,
            showConfirmButton: !1
        }), r({
            method: "POST",
            url: WS_BASE_URL + "/map/exportstock",
            responseType: "arraybuffer",
            data: {
                mapId: a.map.id,
                mapName: a.map.name
            }
        }).then(function(a) {
            c.close();
            l.toast("Map ready, save to disk..");
            try {
                var b = new Blob([a.data], {
                        type: "application/octet-stream"
                    }),
                    d = a.headers()["content-disposition"],
                    m = d.substring(22, d.length - 1);
                saveAs(b, m)
            } catch (E) {
                console.log(E), l.toast("Failed to export stock map.")
            }
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed to export stock map.",
                type: "error"
            })
        })) : c.swal({
            title: "Error",
            text: "Stock map export requires an open map in the editor. Stock map is generated based on the open map's ROM information.",
            type: "error"
        })
    };
    a.exportStockMap = _.debounce(a.exportStockMap, 300, !0);
    a.configureSlot = function(b, c) {
        d.selectedMap = a.map;
        d.slotConfig = c;
        n.show({
            controller: "mapConfigCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapConfig.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a
        })
    };
    a.showMapConfig =
        function(b) {
            a.map.slots && 1 !== a.map.slots ? n.show({
                controller: "DialogController",
                templateUrl: "templates/mapConfig-slotSelection.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: b,
                controllerAs: "ctrl",
                clickOutsideToClose: !0,
                scope: a,
                preserveScope: !0
            }) : a.configureSlot(b, 1)
        };
    a.exportMap = function(b) {
        a.map ? 0 < a.commited && a.dirty ? l.toast("You have unsaved/uncommitted changes. You need to revert them prior to export the map.") : (a.mapExport = {
            mapId: a.map.id,
            mapName: a.map.name,
            mapDescription: a.map.desc,
            vin: a.map.vin,
            version: a.map.version
        }, n.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-export.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !0,
            scope: a,
            fullscreen: !0
        })) : c.swal({
            title: "Error",
            text: "Export requires an open map in the editor. Once a map is opened, it can be exported.",
            type: "error"
        })
    };
    a.filterMapsForImport = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            d.availableForImport = !1;
            if (!d.locked ||
                d.allowImport) {
                b.push(d);
                var m = f.checkIfMapImportPossible(d);
                d.availableForImport = m
            }
        }
        return b
    };
    f.checkIfMapImportPossible = function(b) {
        if (a.map && a.map.engineTypeExpanded && b.engineTypeExpanded) {
            var c = 0 === b.engineTypeExpanded.indexOf("B58-F") && 0 === a.map.engineTypeExpanded.indexOf("B58-F") || 0 === b.engineTypeExpanded.indexOf("B58-G") && 0 === a.map.engineTypeExpanded.indexOf("B58-G") || 0 === b.engineTypeExpanded.indexOf("B58-F") && 0 === a.map.engineTypeExpanded.indexOf("B58-G") || 0 === b.engineTypeExpanded.indexOf("B58-G") &&
                0 === a.map.engineTypeExpanded.indexOf("B58-F") || 0 === b.engineTypeExpanded.indexOf("B58-T0") && 0 === a.map.engineTypeExpanded.indexOf("B58-T0") || 0 === b.engineTypeExpanded.indexOf("B58-T0-C") && 0 === a.map.engineTypeExpanded.indexOf("B58-T0-C") || 0 === b.engineTypeExpanded.indexOf("B58-T0-D") && 0 === a.map.engineTypeExpanded.indexOf("B58-T0-D") || 0 === b.engineTypeExpanded.indexOf("S55") && 0 === a.map.engineTypeExpanded.indexOf("S55");
            if ((!b.locked || b.allowImport) && (b.engineTypeExpanded === a.map.engineTypeExpanded || c)) return !0
        }
        return !1
    };
    a.reloadMaps = function() {
        a.loadingMaps || (a.loadingMaps = !0, a.availableMaps = [], r({
            method: "GET",
            url: WS_BASE_URL + "/editor/maps"
        }).then(function(b) {
            a.loadingMaps = !1;
            a.availableMaps = null;
            var c = [];
            if (b = b.data)
                for (var d = 0; d < b.length; d++) {
                    var m = b[d];
                    if (m.cDate) try {
                        m.cDate = (new Date(m.cDate)).toString()
                    } catch (G) {}
                    if (m.uDate) try {
                        m.uDate = (new Date(m.uDate)).toString()
                    } catch (G) {} else m.uDate = m.cDate;
                    m.locked && !m.allowImport || c.push(m)
                }
            a.availableMaps = c;
            a.mapsGrid.gridOptions.data = a.availableMaps
        }, function(b) {
            a.loadingMaps = !1;
            c.swal({
                title: "Error",
                text: "Failed loading maps.",
                type: "error",
                showConfirmButton: !0,
                showCancelButton: !1
            })
        }))
    };
    a.reloadMaps = _.debounce(a.reloadMaps, 300, !0);
    a.reloadFreeMaps = function() {
        a.loadingFreeMaps || (a.loadingFreeMaps = !0, a.availableFreeMaps = [], r({
            method: "GET",
            url: WS_BASE_URL + "/editor/freemaps"
        }).then(function(b) {
            a.loadingFreeMaps = !1;
            a.availableFreeMaps = null;
            var c = [];
            if (b = b.data)
                for (var d = 0; d < b.length; d++) {
                    var m = b[d];
                    if (m.cDate) try {
                        m.cDate = (new Date(m.cDate)).toString()
                    } catch (G) {}
                    if (m.uDate) try {
                        m.uDate =
                            (new Date(m.uDate)).toString()
                    } catch (G) {}
                    m.locked && !m.allowImport || c.push(m)
                }
            a.availableFreeMaps = c;
            a.freeMapsGrid.gridOptions.data = a.availableFreeMaps
        }, function(b) {
            a.loadingFreeMaps = !1;
            c.swal({
                title: "Error",
                text: "Failed loading system provided/free reference maps.",
                type: "error",
                showConfirmButton: !0,
                showCancelButton: !1
            })
        }))
    };
    a.reloadFreeMaps = _.debounce(a.reloadFreeMaps, 300, !0);
    a.reloadTuneReqs = function() {
        if (!a.loadingReqs) {
            a.loadingReqs = !0;
            a.availableTuneRequests = null;
            var b = {
                method: "GET",
                url: WS_BASE_URL +
                    "/tunereqs"
            };
            a.activeRequest = null;
            r(b).then(function(b) {
                    a.loadingReqs = null;
                    for (var c in b.data) {
                        var d = b.data[c];
                        d.map.vin === g.VIN && (a.activeRequest = d, d.active = !0);
                        if (d.mapRequest.respondedDate) try {
                            d.mapRequest.respondedDate = (new Date(d.mapRequest.respondedDate)).toString()
                        } catch (E) {}
                        if (d.mapRequest.createdDate) try {
                            d.mapRequest.createdDate = (new Date(d.mapRequest.createdDate)).toString()
                        } catch (E) {}
                        if (d.mapRequest.inProgressDate) try {
                            d.mapRequest.inProgressDate = (new Date(d.mapRequest.inProgressDate)).toString()
                        } catch (E) {}
                        d =
                            d.map;
                        if (a.map && a.map.engineTypeExpanded && d.engineTypeExpanded) {
                            var m = 0 === d.engineTypeExpanded.indexOf("B58-F") && 0 === a.map.engineTypeExpanded.indexOf("B58-F") || 0 === d.engineTypeExpanded.indexOf("B58-G") && 0 === a.map.engineTypeExpanded.indexOf("B58-G") || 0 === d.engineTypeExpanded.indexOf("B58-F") && 0 === a.map.engineTypeExpanded.indexOf("B58-G") || 0 === d.engineTypeExpanded.indexOf("B58-G") && 0 === a.map.engineTypeExpanded.indexOf("B58-F") || 0 === d.engineTypeExpanded.indexOf("B58-T0") && 0 === a.map.engineTypeExpanded.indexOf("B58-T0") ||
                                0 === d.engineTypeExpanded.indexOf("B58-T0-C") && 0 === a.map.engineTypeExpanded.indexOf("B58-T0-C") || 0 === d.engineTypeExpanded.indexOf("B58-T0-D") && 0 === a.map.engineTypeExpanded.indexOf("B58-T0-D") || 0 === d.engineTypeExpanded.indexOf("S55") && 0 === a.map.engineTypeExpanded.indexOf("S55");
                            d.locked && !d.allowImport || d.engineTypeExpanded !== a.map.engineTypeExpanded && !m || (d.availableForImport = !0)
                        }
                    }
                    a.availableTuneRequests = b.data;
                    a.tuneReqsGrid.gridOptions.data = a.availableTuneRequests;
                    a.$broadcast("scroll.refreshComplete")
                },
                function(b) {
                    a.loadingReqs = null;
                    a.$broadcast("scroll.refreshComplete");
                    c.swal({
                        title: "Error",
                        text: "Failed loading tune requests.",
                        type: "error",
                        showConfirmButton: !0,
                        showCancelButton: !1
                    })
                })
        }
    };
    a.reloadTuneReqs = _.debounce(a.reloadTuneReqs, 300, !0);
    a.reloadLogs = function() {
        if (!a.loadingLogs) {
            a.reloadLogsLocal();
            a.logsGrid.gridOptions.data = [];
            a.loadingLogs = !0;
            var b = WS_BASE_URL + "/getlogs";
            a.map && a.map.mapRequestId && (b += "/" + a.map.mapRequestId);
            r({
                method: "GET",
                url: b
            }).then(function(b) {
                a.loadingLogs = null;
                b = b.data;
                g.logs = [];
                if (b && 0 < b.length)
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        if (d.createdDate) try {
                            d.createdDate = (new Date(d.createdDate)).toString()
                        } catch (G) {}
                        g.logs.push(d)
                    }
                a.$broadcast("scroll.refreshComplete");
                a.logsGrid.gridOptions.data = g.logs
            }, function(b) {
                a.loadingLogs = null;
                g.logs = [];
                a.logsGrid.gridOptions.data = g.logs;
                a.$broadcast("scroll.refreshComplete");
                l.toast("Failed to retrieve datalogs.");
                a.showLocalLogs()
            })
        }
    };
    a.reloadLogs = _.debounce(a.reloadLogs, 300, !0);
    a.reloadLogsLocal = function() {
        a.showLocalLogs()
    };
    a.showLocalLogs = function() {
        g.offlineLogs = [];
        a.logsLocalGrid.gridOptions.data = [];
        g.bmdConnected ? (a.loadingLogsLocal = !0, z.send("/app/getlogs", {}, {
            jwt: g.get("token")
        })) : a.loadingLogsLocal = null
    };
    a.$on("$ionicView.beforeLeave", f.destroyView);
    a.revert = function(a) {};
    a.showMapDesc = function(a, b) {
        c.swal({
            title: "Description",
            text: b.desc,
            type: "info"
        })
    };
    a.showTuneReqDesc = function(a, b) {
        c.swal({
            title: "Description",
            text: b.desc,
            type: "info"
        })
    };
    a.showVersions = function(a, b) {};
    a.compareTable = function(a) {};
    a.openPage =
        function(b, c) {
            if (!c.target.classList.contains("activetab")) {
                var d, m, f;
                f = c.target.parentNode.parentNode.getElementsByClassName("tablink");
                for (d = 0; d < f.length; d++) f[d].classList.remove("activetab");
                c.target.classList.toggle("activetab"); - 1 < b.indexOf("-rel") ? (f = b.substring(0, b.indexOf("-")), a.tabletree.tableData[f].showRel = !0) : (f = b.substring(0, b.indexOf("-")), delete a.tabletree.tableData[f].showRel);
                x(function() {
                    m = c.target.parentNode.parentNode.getElementsByClassName("tabcontent");
                    for (d = 0; d < m.length; d++) m[d].classList.remove("activetab");
                    document.getElementById(b).classList.add("activetab")
                })
            }
        };
    a.compareMap = function(b) {
        a.map ? 0 < a.commited ? c.swal({
            title: "Error",
            text: "Some tables have changed and changes were committed but not saved. Save changes first before you compare this map with other maps.",
            type: "error"
        }) : a.dirty ? c.swal({
            title: "Error",
            text: "Some tables have changes that haven't been committed yet. Commit changes on those tables first before you compare this map with other maps.",
            type: "error"
        }) : (a.importChanges = !0, n.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-importMap.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        })) : c.swal({
            title: "Error",
            text: "To compare a map you need to first open a map in the editor.",
            type: "error"
        })
    };
    a.checkAccess = function() {
        if (window.cordova) return c.swal({
            title: "Mobile Device",
            text: "Map editor is not optimized for mobile touch screen devices at this time. Please use a desktop or laptop browser.",
            type: "info"
        }), !1;
        if (!g.isTuner() || g.isTuner() && !g.isVinPresent()) c.swal({
            title: "Tuner Access",
            text: "You need to configure your account in the Tuners screen and contact bootmod3 support for Authorization on use of the Map Editor.\x3cbr\x3e\x3cbr\x3eIf you're a tuner shop looking to use bootmod3 for tuning please contact support@protuningfreaks.com for assistance.",
            type: "info",
            html: !0
        });
        else return !0
    };
    a.open = function(b, d) {
        if (g.clientSession && a.checkAccess())
            if (a.map || !0 !== d)
                if (0 < a.commited) c.swal({
                    title: "Warning",
                    text: "Some tables have changed and changes were committed but not saved. Save changes first before you compare this map with other maps. Would you still like to close and open a new map?",
                    type: "warning",
                    showCancelButton: !0,
                    showConfirmButton: !0
                }, function(c) {
                    c && (f.doCloseMap(), a.open(b, !1))
                });
                else if (a.dirty) c.swal({
            title: "Warning",
            text: "Some tables have changes that haven't been committed yet. Commit changes on those tables first before you compare this map with other maps. Would you still like to close and open a new map?",
            type: "warning",
            showCancelButton: !0,
            showConfirmButton: !0
        }, function(c) {
            c && (f.doCloseMap(), a.open(b, !1))
        });
        else {
            a.mapsGrid.gridOptions.data && 0 !== a.mapsGrid.gridOptions.data.length || a.reloadMaps();
            a.tuneReqsGrid.gridOptions.data && 0 !== a.tuneReqsGrid.gridOptions.data.length || a.reloadTuneReqs();
            var m = "templates/mapEdit-openMap.tmpl.html";
            (a.importChanges = d) && (m = "templates/mapEdit-importMap.tmpl.html");
            n.show({
                controller: "DialogController",
                controllerAs: "ctrl",
                templateUrl: m,
                parent: angular.element(document.body),
                targetEvent: b,
                preserveScope: !0,
                clickOutsideToClose: !1,
                scope: a,
                fullscreen: !0
            })
        } else c.swal({
            title: "Error",
            text: "To import a map you need to first open a base map in the editor.",
            type: "error"
        })
    };
    a.open = _.debounce(a.open, 300, !0);
    a.doCompare = function(a, b) {};
    a.doOpen = function(b, d, e) {
        f.compareRoot = null;
        a.importChanges = d;
        a.importChanges ? (a.importMap = a.mapSelected, f.checkIfMapImportPossible(a.importMap) ? f.loadCompareData(b, e) : c.swal({
            title: "Warning",
            text: "Map selected has a different engine type than the currently open map. Importing it is not recommended or safe operation. Are you sure you'd like to proceed?",
            type: "warning",
            clickOutsideToClose: !1,
            showCancelButton: !0,
            showConfirmButton: !0
        }, function(a) {
            a && f.loadCompareData(b, e)
        })) : a.closeMap(function() {
            a.map = a.mapSelected;
            c.swal({
                title: "Loading Map",
                text: "Retrieving " + a.mapSelected.name + " map data, please wait...",
                type: "info",
                showCancelButton: !1,
                showConfirmButton: !1,
                allowOutsideClick: !1,
                clickOutsideToClose: !1
            });
            x(f.loadData, 0, !1)
        })
    };
    a.doOpen = _.debounce(a.doOpen, 300, !0);
    a.doOpenTuneReq = function(b, d, e) {
        f.compareRoot = null;
        a.importChanges = d;
        a.importChanges ? (a.importMap =
            a.tuneReqSelected.map, f.checkIfMapImportPossible(a.importMap) ? f.loadCompareData(b, e) : c.swal({
                title: "Warning",
                text: "Map selected has a different engine type than the currently open map. Importing it is not recommended or safe operation. Are you sure you'd like to proceed?",
                type: "warning",
                clickOutsideToClose: !1,
                showCancelButton: !0,
                showConfirmButton: !0
            }, function(a) {
                a && f.loadCompareData(b, e)
            })) : (a.closeMap(), a.map = a.tuneReqSelected.map, a.tuneReq = a.tuneReqSelected, c.swal({
            title: "Loading Tune Request",
            text: "Retrieving " + a.map.name + " tune request data, please wait...",
            type: "info",
            showCancelButton: !1,
            showConfirmButton: !1,
            allowOutsideClick: !1,
            clickOutsideToClose: !1
        }), x(f.loadData, 0, !1))
    };
    a.doOpenTuneReq = _.debounce(a.doOpenTuneReq, 300, !0);
    a.close3dTable = function(a, b) {
        document.getElementById("3dtableContainer-" + b).classList.add("hidden-force");
        f.hot[b].showing3dTable = !1
    };
    f.setupWidth = function(a, b, c) {
        b *= c.def.columns;
        b = c.def.hasYAxis ? b + 190 : b + 20;
        b = Math.max(600, b);
        a.style.width = b + "px";
        if (a = document.getElementById("tableVAxisLabel-" +
                c.def.extId)) a.style.width = 22 * c.def.rows + "px";
        if (a = document.getElementById("tableHAxisLabel-" + c.def.extId)) a.style.width = 70 * c.def.columns + "px";
        return b
    };
    f.setupInteractOnEl = function(a) {
        interact(a).ignoreFrom(".wtSpreader,a,.ion-close-circled,.table3d,input,.infinite-tree-item,button,.ui-grid-column-resizer").draggable({
            inertia: !0,
            autoScroll: !0,
            onmove: dragMoveListener
        }).resizable({
            preserveAspectRatio: !1,
            edges: {
                left: !0,
                right: !0,
                bottom: !0,
                top: !0
            }
        }).on("resizemove", function(b) {
            var c = parseFloat(a.getAttribute("data-x")) ||
                0,
                d = parseFloat(a.getAttribute("data-y")) || 0;
            a.style.width = b.rect.width + "px";
            a.style.height = b.rect.height + "px";
            c += b.deltaRect.left;
            d += b.deltaRect.top;
            a.style.webkitTransform = a.style.transform = "translate(" + c + "px," + d + "px)";
            a.setAttribute("data-x", c);
            a.setAttribute("data-y", d);
            a.style.zIndex = parseInt(String((new Date).getTime() / 1E3))
        }).on("dragstart", function(a) {
            a.target.style.oldbackground = a.target.style.background;
            a.target.style.background = "#2d2d2d";
            a.target.style.zIndex = parseInt(String((new Date).getTime() /
                1E3))
        }).on("dragend", function(a) {
            a.target.style.background = a.target.style.oldbackground
        })
    };
    f.setupDraggable = function(a) {
        interact(a).ignoreFrom(".wtSpreader,a,.ion-close-circled,.table3d,button,input,.ui-grid-column-resizer,.handsontable").draggable({
            inertia: !0,
            autoScroll: !0,
            onmove: dragMoveListener
        }).resizable({
            preserveAspectRatio: !1,
            edges: {
                left: !1,
                right: !0,
                bottom: !1,
                top: !1
            }
        }).on("resizemove", function(b) {
            var c = parseFloat(a.getAttribute("data-x")) || 0,
                d = parseFloat(a.getAttribute("data-y")) || 0;
            a.style.width =
                b.rect.width + "px";
            a.style.height = b.rect.height + "px";
            c += b.deltaRect.left;
            d += b.deltaRect.top;
            a.style.webkitTransform = a.style.transform = "translate(" + c + "px," + d + "px)";
            a.setAttribute("data-x", c);
            a.setAttribute("data-y", d);
            a.style.zIndex = parseInt(String((new Date).getTime() / 1E3))
        }).on("dragstart", function(a) {
            a.target.style.oldbackground = a.target.style.background;
            a.target.style.background = "#2d2d2d";
            a.target.style.zIndex = parseInt(String((new Date).getTime() / 1E3))
        }).on("dragend", function(a) {
            a.target.style.background =
                a.target.style.oldbackground
        })
    };
    a.requestTunerSupport = function(b) {
        n.show({
            controller: "RequestTunerSupportCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-requestTunerSupport.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            clickOutsideToClose: !1,
            scope: a,
            preserveScope: !0,
            fullscreen: !0
        })
    };
    f.isDirty = function(a) {
        var b = f.originalData[a];
        if (b) {
            for (var c = f.currentData[a], d, m = 0; m < b.length; m++)
                for (var e = 0; e < b[m].length; e++)
                    if (d = b[m][e] !== c[m][e]) return !0;
            if (f.originalDataHAxis[a])
                for (b =
                    f.originalDataHAxis[a], c = f.currentDataHAxis[a], m = 0; m < b.length; m++)
                    for (e = 0; e < b[m].length; e++)
                        if (d = b[m][e] !== c[m][e]) return !0;
            if (f.originalDataVAxis[a])
                for (b = f.originalDataVAxis[a], c = f.currentDataVAxis[a], a = 0; a < b.length; a++)
                    for (m = 0; m < b[a].length; m++)
                        if (d = b[a][m] !== c[a][m]) return !0
        }
        return !1
    };
    a.updateTreeNodesForTableData = function(a, b) {
        if (a.nodes && f.tree)
            for (var c in a.nodes) {
                var d = f.tree.getNodeById(a.nodes[c]);
                d && f.tree.updateNode(d, {
                    shallowRendering: !0
                });
                a.dirty && b && f.openParents(d)
            }
    };
    a.updateTreeParentsForTableData =
        function(a) {
            if (a.nodes && f.tree)
                for (var b in a.nodes) {
                    var c = f.tree.getNodeById(a.nodes[b]);
                    c && f.tree.updateNode(c, {
                        shallowRendering: !0
                    })
                }
        };
    a.dirtyTablesCount = 0;
    a.openTablesCount = 0;
    f.updateDirty = function(b, c, d) {
        x(function(b) {
            var m = !1;
            if (f.originalData)
                if (b) f.originalData[b] && (u = f.isDirty(b), b = a.tabletree.tableData[b], b.dirty = u, m |= u, a.updateTreeNodesForTableData(b, c));
                else
                    for (var u in f.originalData)
                        if (f.currentData[u]) {
                            b = f.isDirty(u);
                            var e = a.tabletree.tableData[u];
                            e.dirty = b;
                            m |= b;
                            a.updateTreeNodesForTableData(e,
                                c)
                        }
            a.dirty = m;
            a.commited = f.getCommittedTables().length;
            a.dirtyTablesCount = f.getDirtyTables().length;
            d && d()
        }, 0, !0, b)
    };
    f.getDirtyTables = function() {
        var b = [];
        if (a.tabletree)
            for (var c in a.tabletree.tableData) {
                var d = a.tabletree.tableData[c];
                d.dirty && b.push(d)
            }
        b.sort(function(a, b) {
            return a.def.name.localeCompare(b.def.name)
        });
        return b
    };
    f.getCommittedTables = function() {
        var b = [];
        if (a.tabletree)
            for (var c in a.tabletree.tableData) {
                var d = a.tabletree.tableData[c];
                d.commited && b.push(d)
            }
        return b
    };
    a.resetTable = function(b,
        c) {
        f.originalData[c] = f.hot[c].beforeCompareData.slice(0);
        f.originalDataHAxis[c] = f.hotHAxis[c].beforeCompareData.slice(0);
        f.originalDataVAxis[c] = f.hotVAxis[c].beforeCompareData.slice(0);
        f.currentData[c] = f.originalData[c].map(function(a) {
            return a
        });
        f.currentDataHAxis[c] = f.originalDataHAxis[c].map(function(a) {
            return a
        });
        f.currentDataVAxis[c] = f.originalDataVAxis[c].map(function(a) {
            return a
        });
        f.hot[c] && f.hot[c].loadData(f.originalData[c].map(function(a) {
            return a
        }));
        f.hotHAxis[c] && f.hotHAxis[c].loadData(f.originalDataHAxis[c].map(function(a) {
            return a
        }));
        f.hotVAxis[c] && f.hotVAxis[c].loadData(f.originalDataVAxis[c].map(function(a) {
            return a
        }));
        f.hot[c] && (f.hot[c].clearUndo(), f.hot[c].render(), f.hot[c].beforeCompareData = null);
        f.hotHAxis[c] && (f.hotHAxis[c].clearUndo(), f.hotHAxis[c].render(), f.hotHAxis[c].beforeCompareData = null);
        f.hotVAxis[c] && (f.hotVAxis[c].clearUndo(), f.hotVAxis[c].render(), f.hotVAxis[c].beforeCompareData = null);
        a.tabletree.tableData[c].compareLoaded = null;
        f.updateDirty(c)
    };
    a.revertDirty = function() {
        0 === a.dirtyTablesCount ? l.toast("No changed tables currently to undo changes on.") :
            c.swal({
                title: "Undo All?",
                text: "Are you sure you'd like to revert all changed tables in the current map? This only reverts the data in the editor without saving.",
                type: "warning",
                allowOutsideClick: !1,
                clickOutsideToClose: !1,
                showCancelButton: !0,
                showConfirmButton: !0,
                confirmButtonText: "Undo All"
            }, function(b) {
                if (b) {
                    b = f.getDirtyTables();
                    for (var d in b) a.commitTable(null, b[d].def.extId, !0, !0);
                    f.updateDirty(null, !1, function() {
                        a.closeAllTables();
                        a.filterChanged = !1;
                        a.filter1d = !1;
                        a.filter2d = !1;
                        a.filter3d = !1;
                        f.tree.unfilter();
                        a.collapseAll();
                        c.close()
                    })
                }
            })
    };
    a.confirmAndSave = function(b) {
        0 < a.selectedTablesForSave.length ? n.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-save.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !0
        }) : l.toast("No tables selected for save.")
    };
    a.save = function(b, d) {
        if (a.checkAccess())
            if (a.map)
                if (a.saveAs = b, a.map.stock && !b) c.swal({
                    title: "Error",
                    text: "You can't save over the stock map. Use 'Save As' instead to create a new map.",
                    type: "error"
                }), a.saveAs = !1;
                else {
                    var m = f.getDirtyTables();
                    b = f.getCommittedTables();
                    var e = m.concat(b.filter(function(a) {
                        for (var b = 0; b < m.length; b++)
                            if (a.def.extId === m[b].def.extId) return !1;
                        return !0
                    }));
                    a.saveMapTablesGrid.gridOptions.data = [];
                    0 < e.length ? (a.selectedTablesForSave = [], n.show({
                        controller: "DialogController",
                        controllerAs: "ctrl",
                        templateUrl: "templates/mapEdit-confirmTables.tmpl.html",
                        parent: angular.element(document.body),
                        targetEvent: d,
                        clickOutsideToClose: !1,
                        preserveScope: !0,
                        scope: a,
                        fullscreen: !0,
                        onComplete: function() {
                            a.saveMapTablesGrid.gridOptions.data = e;
                            a.saveMapTablesGrid.gridApi.grid.modifyRows(a.saveMapTablesGrid.gridOptions.data);
                            a.saveMapTablesGrid.gridOptions.data.forEach(function(b, c) {
                                b.commited && a.saveMapTablesGrid.gridApi.selection.selectRow(a.saveMapTablesGrid.gridOptions.data[c])
                            })
                        }
                    })) : a.saveAs ? n.show({
                        controller: "DialogController",
                        controllerAs: "ctrl",
                        templateUrl: "templates/mapEdit-save.tmpl.html",
                        parent: angular.element(document.body),
                        targetEvent: d,
                        preserveScope: !0,
                        clickOutsideToClose: !1,
                        scope: a,
                        fullscreen: !0
                    }) : c.swal({
                        title: "No changes",
                        text: "No changes to save.",
                        type: "info"
                    })
                }
        else c.swal({
            title: "Error",
            text: "To save you need to first open a map in the editor.",
            type: "error"
        })
    };
    a.doSave = function() {
        var b = {
                mapName: a.map.name,
                mapDesc: a.map.desc,
                mapVersion: a.map.version,
                mapId: a.map.id,
                newMap: a.saveAs,
                newVersion: a.map.newVersion,
                versionComments: a.map.versionComments,
                tableTree: {
                    tableData: {}
                }
            },
            d;
        for (d in a.selectedTablesForSave) {
            var e = a.selectedTablesForSave[d];
            e.dirty && a.commitTable(null,
                e.def.extId, !1, !0)
        }
        f.updateDirty();
        for (var g in a.selectedTablesForSave) d = a.selectedTablesForSave[g], b.tableTree.tableData[d.def.extId] = {
            def: {
                extId: d.def.extId
            },
            rows: d.rows,
            vAxis: d.vAxis,
            hAxis: d.hAxis
        };
        c.swal({
            title: "Please wait..",
            text: "Saving " + b.mapName,
            type: "warning",
            showCancelButton: !1,
            showConfirmButton: !1
        });
        r({
            method: "POST",
            url: WS_BASE_URL + "/map/v2/saveall",
            data: b
        }).then(function(b) {
            if ((b = b.data) && b.id && 0 === b.error.length) {
                removeMapInternal(a.map, null);
                a.map = b;
                l.toast("Changes saved");
                for (var d in a.selectedTablesForSave) a.selectedTablesForSave[d].commited = !1;
                f.updateDirty();
                a.selectedTablesForSave = [];
                for (var m in a.tabletree.tableData) a.tabletree.tableData[m].gridOptions = null;
                a.gridOptions.data = null;
                a.mapsGrid.gridOptions.data = null;
                c.close()
            } else if (b.error && 0 !== b.error.length) {
                d = "\x3cbr\x3e";
                for (var e in b.error) d += b.error[e] + "\x3cbr\x3e";
                c.swal({
                    title: "Error",
                    text: "Failed saving map, errors: " + d,
                    html: !0,
                    type: "error"
                })
            } else c.swal({
                title: "Error",
                text: "Failed saving map.",
                type: "error"
            })
        }, function(a) {
            406 === a.status ? c.swal({
                title: "Error",
                text: "Failed Saving map. Your account is not set up as a tuner. Use the Tuners screen to configure your account prior to changing any maps.",
                type: "error"
            }) : c.swal({
                title: "Error",
                text: "Failed saving map.",
                type: "error"
            })
        })
    };
    a.doSave = _.debounce(a.doSave, 300, !0);
    a.revert = function(b, c) {
        a.tabletree.tableData[c].dirty && (a.tabletree.tableData[c].compareLoaded = null, f.hot[c] ? f.hot[c].populateFromArray(0, 0, f.originalData[c]) : f.currentData[c] = f.originalData[c].slice(), f.hotHAxis[c] ? f.hotHAxis[c].populateFromArray(0, 0, f.originalDataHAxis[c]) : f.currentDataHAxis[c] = f.originalDataHAxis[c].slice(), f.hotVAxis[c] ? f.hotVAxis[c].populateFromArray(0, 0, f.originalDataVAxis[c]) :
            f.currentDataVAxis[c] = f.originalDataVAxis[c].slice())
    };
    a.commit = function(b, c, d) {
        a.tabletree.tableData[c].dirty && (f.originalData[c] = f.hot[c] ? f.hot[c].getData().slice() : f.currentData[c].slice(), f.originalDataHAxis[c] = f.hotHAxis[c] ? f.hotHAxis[c].getData().slice() : f.currentDataHAxis[c].slice(), f.originalDataVAxis[c] = f.hotVAxis[c] ? f.hotVAxis[c].getData().slice() : f.currentDataVAxis[c].slice(), f.hot[c] && (f.hot[c].clearUndo(), f.hot[c].render(), f.hot[c].beforeCompareData = null), f.hotHAxis[c] && (f.hotHAxis[c].clearUndo(),
            f.hotHAxis[c].render(), f.hotHAxis[c].beforeCompareData = null), f.hotVAxis[c] && (f.hotVAxis[c].clearUndo(), f.hotVAxis[c].render(), f.hotVAxis[c].beforeCompareData = null), a.commitToTableData(b, c), d || f.updateDirty(c))
    };
    a.commitToTableData = function(b, c) {
        b = [];
        for (var d in f.originalData[c]) b.push({
            values: f.originalData[c][d]
        });
        d = {
            values: []
        };
        if ("1" === a.tabletree.tableData[c].def.rows) d.values[0] = 0;
        else
            for (var m = 0; m < f.originalDataVAxis[c].length; m++) d.values.push(f.originalDataVAxis[c][m][0]);
        m = {
            values: []
        };
        if ("1" !== a.tabletree.tableData[c].def.columns && f.originalDataHAxis[c][0])
            for (var e = 0; e < f.originalDataHAxis[c][0].length; e++) m.values[e] = f.originalDataHAxis[c][0][e];
        else m.values[0] = 0;
        a.tabletree.tableData[c].hAxis = m;
        a.tabletree.tableData[c].vAxis = d;
        a.tabletree.tableData[c].rows = b;
        a.tabletree.tableData[c].commited = !0;
        a.tabletree.tableData[c].dirty = !1;
        a.closeTable(c)
    };
    a.commitTable = function(b, d, f, e) {
        !f && a.map.stock ? c.swal({
            title: "Error",
            text: "You can't make changes to the stock map. Use 'Save As' instead first to create a new map.",
            type: "error"
        }) : (a.tabletree.tableData[d].toggleDataCurrent = null, f ? a.revert(b, d, e) : a.commit(b, d, e))
    };
    a.viewingDiff = !1;
    a.current = function(b, c) {
        a.tabletree.tableData[c].toggleDataCurrent = "current";
        a.viewingDiff = !1;
        a.tabletree.tableData[c].dirty && (f.hot[c].populateFromArray(0, 0, f.currentData[c], null, null, "loadData"), f.hotHAxis[c] && f.hotHAxis[c].populateFromArray(0, 0, f.currentDataHAxis[c], null, null, "loadData"), f.hotVAxis[c] && f.hotVAxis[c].populateFromArray(0, 0, f.currentDataVAxis[c], null, null, "loadData"))
    };
    a.original = function(b, c) {
        a.tabletree.tableData[c].toggleDataCurrent = "original";
        a.viewingDiff = !1;
        a.tabletree.tableData[c].dirty && (f.hot[c].populateFromArray(0, 0, f.originalData[c], null, null, "loadData"), f.hotHAxis[c] && f.hotHAxis[c].populateFromArray(0, 0, f.originalDataHAxis[c], null, null, "loadData"), f.hotVAxis[c] && f.hotVAxis[c].populateFromArray(0, 0, f.originalDataVAxis[c], null, null, "loadData"))
    };
    a.originalDiff = function(b, c) {
        a.tabletree.tableData[c].toggleDataCurrent = "diff";
        a.viewingDiff = !0;
        if (a.tabletree.tableData[c].dirty) {
            var d =
                f.getCurrentTableValProps(f.hot[c]),
                m = [];
            f.originalData[c].forEach(function(a, b) {
                var e = [];
                m.push(e);
                a.forEach(function(a, m) {
                    m = f.currentData[c][b][m];
                    m = Math.floor(m * Math.pow(10, Number(d.precision))) / Math.pow(10, Number(d.precision));
                    a = Math.floor(a * Math.pow(10, Number(d.precision))) / Math.pow(10, Number(d.precision));
                    e.push(Math.floor((m - a) / a * 100))
                })
            });
            f.hot[c].populateFromArray(0, 0, m, null, null, "loadData");
            if (f.hotVAxis[c]) {
                var d = f.getCurrentTableValProps(f.hotVAxis[c]),
                    e = [];
                f.originalDataVAxis[c].forEach(function(a,
                    b) {
                    var m = [];
                    e.push(m);
                    a.forEach(function(a, e) {
                        e = f.currentDataVAxis[c][b][e];
                        e = Math.floor(e * Math.pow(10, Number(d.precision))) / Math.pow(10, Number(d.precision));
                        a = Math.floor(a * Math.pow(10, Number(d.precision))) / Math.pow(10, Number(d.precision));
                        m.push(Math.floor((e - a) / a * 100))
                    })
                });
                f.hotVAxis[c].populateFromArray(0, 0, e, null, null, "loadData")
            }
            if (f.hotHAxis[c]) {
                d = f.getCurrentTableValProps(f.hotHAxis[c]);
                b = [];
                var g = [];
                b.push(g);
                f.originalDataHAxis[c][0].forEach(function(a, b) {
                    b = f.currentDataHAxis[c][0][b];
                    b =
                        Math.floor(b * Math.pow(10, Number(d.precision))) / Math.pow(10, Number(d.precision));
                    a = Math.floor(a * Math.pow(10, Number(d.precision))) / Math.pow(10, Number(d.precision));
                    g.push(Math.floor((b - a) / a * 100))
                });
                f.hotHAxis[c].populateFromArray(0, 0, b, null, null, "loadData")
            }
        }
    };
    a.rename = function(b) {
        a.map.mapRequestId ? n.show({
                controller: "TuneReqRenameController",
                templateUrl: "templates/tune-req-rename.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: b,
                clickOutsideToClose: !1,
                scope: a,
                preserveScope: !0,
                fullscreen: !0
            }) :
            n.show({
                controller: "MapRenameController",
                templateUrl: "templates/map-rename.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: b,
                clickOutsideToClose: !1,
                scope: a,
                preserveScope: !0,
                fullscreen: !0
            })
    };
    a.replaceMap = function(b) {
        a.map && n.show({
            controller: "MapReplaceController",
            templateUrl: "templates/map-replace.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: b,
            clickOutsideToClose: !1,
            scope: a,
            preserveScope: !0,
            fullscreen: !0
        })
    };
    a.toggle3DTables = function() {
        a.show3dTables = !g.getForCurrUser("show3dTables", !1);
        g.setForCurrentUser("show3dTables", a.show3dTables)
    };
    a.doMath = function(a, b, c, d, f, e) {
        return "+" === b ? Math.min(Number(a) + Number(c), Number(f)) : "-" === b ? Math.max(Number(a) - Number(c), Number(d)) : "*" === b ? Math.min(Number(a) * Number(c), Number(f)) : "/" === b ? Math.max(Number(a) / Number(c), Number(d)) : "+ %" === b ? Math.min(Number(a) + Number(c) / 100 * Number(a), Number(f)) : "- %" === b ? Math.min(Number(a) - Number(c) / 100 * Number(a), Number(f)) : a < d ? Number(d) : a > f ? Number(f) : Number(a)
    };
    a.linkTable = function(b, c) {
        c && c.stopPropagation();
        x(function() {
            a.editTable(b, !1, c)
        })
    };
    a.closeAllTables = function() {
        if (a.tabletree) {
            var b = -1;
            for (b in a.tabletree.tableData) {
                var c = a.tabletree.tableData[b];
                c.open && a.closeTable(c.def.extId, !0)
            }
        }
        f.previousTable = null;
        f.currentTable = null;
        f.tree && (f.tree.selectNode(f.tree.getRootNode().getFirstChild(), {
            silent: !0,
            autoScroll: !1
        }), f.tree.scrollToNode(f.tree.getRootNode().getFirstChild(), {
            silent: !0
        }))
    };
    f.setCurrentTable = function(b) {
        f.previousTable && f.previousTable.tableId === b.tableId || (f.previousTable = f.currentTable ?
            f.currentTable : b);
        f.currentTable = b;
        a.currentTableId = b.tableId
    };
    a.closeTable = function(b, d) {
        d ? f.doCloseTable(b, d) : a.tabletree.tableData[b].dirty ? c.swal({
            title: "Uncommitted Changes",
            text: "Table has uncommitted changes. Commit first or just close?",
            type: "warning",
            showConfirmButton: !0,
            showCancelButton: !0,
            confirmButtonText: "Commit and Close",
            cancelButtonText: "Close",
            allowEscapeKey: !1,
            allowOutsideClick: !1,
            clickOutsideToClose: !1
        }, function(c) {
            c && a.commitTable(null, b, !1);
            f.doCloseTable(b, d)
        }) : f.doCloseTable(b,
            d)
    };
    f.doCloseTable = function(b, c) {
        a.tabletree.tableData[b].open = null;
        (c = a.tabletree.tableData[b].node) && f.tree.updateNode(c, {
            shallowRendering: !0
        });
        f.hot[b] && f.hot[b].destroy();
        f.hotHAxis[b] && f.hotHAxis[b].destroy();
        f.hotVAxis[b] && f.hotVAxis[b].destroy();
        f.hot[b] && delete f.hot[b];
        f.hotVAxis[b] && delete f.hotVAxis[b];
        f.hotHAxis[b] && delete f.hotHAxis[b];
        a.openTablesCount = Object.keys(f.hot).length;
        0 === a.openTablesCount && (f.currentTable = null, f.previousTable = null)
    };
    f.getCurrentTableValProps = function(b) {
        var c,
            d, f, m, e = a.tabletree.tableData[b.tableId];
        b.axis ? "v" === b.axis ? (c = e.def.yFactor, d = e.def.minY, f = e.def.maxY, m = e.def.yPrecision) : "h" === b.axis && (c = e.def.xFactor, d = e.def.minX, f = e.def.maxX, m = e.def.xPrecision) : (c = e.def.factor, d = e.def.min, f = e.def.max, m = e.def.precision);
        return {
            factor: c,
            min: d,
            max: f,
            precision: m
        }
    };
    a.math = function(b, c, d, e) {
        a.symbol = b;
        e || (e = f.currentTable.draggable.lastSelection.hot);
        if (e)
            if (c = f.getCurrentTableValProps(e), d && "prompt" === d) {
                d = "";
                "+" === b ? d = "Enter a value to increment selected cell(s) by:" :
                    "-" === b ? d = "Enter a value to decrement selected cell(s) by:" : "/" === b ? d = "Enter a value to divide selected cell(s) by:" : "*" === b ? d = "Enter a value to multiply selected cell(s) by:" : "+ %" === b ? d = "Enter a percentage value to increment cell(s) by:" : "- %" === b && (d = "Enter a percentage value to decrement cell(s) by:");
                for (var m = document.getElementById("mathVal-" + e.tableId).value; !m || !f.isNumeric(m);)
                    if (m = prompt(d), !m) return;
                document.getElementById("mathVal-" + e.tableId).value = m;
                document.getElementById("mathVal-" +
                    e.tableId).focus();
                f.updateValFromMath(b, m, c.min, c.max, c.precision, !1, e)
            } else f.updateValFromMath(b, c.factor, c.min, c.max, c.precision, !0, e);
        else l.toast("Select cells in a table to apply this function to first.")
    };
    a.hvInterpolate = function(b, c) {
        c || (c = f.currentTable.draggable.lastSelection.hot);
        a.hInterpolate(b, c) && a.vInterpolate(b, c)
    };
    a.hInterpolate = function(a, b) {
        b || (b = f.currentTable.draggable.lastSelection.hot);
        if (b) {
            a = f.getCurrentTableValProps(b);
            for (var c = b.getSelected(), d = b.getData(), m = !1, e = 0; e <
                c.length; e++) {
                for (var g = c[e], u = g[0], h = g[2], k = g[1], n = g[3], g = Math.max(u, h), q = Math.min(k, n), k = Math.max(k, n), u = Math.min(u, h); u <= g; u++)
                    for (var h = d[u], r = Math.max(q - 1, 0), n = Math.min(k + 1, b.countCols() - 1), p = (h[n] - h[r]) / Math.abs(n - r), r = r + 1; r < n; r++) m = h[r - 1] + p, m < a.min ? m = a.min : m > a.max ? m = a.max : 0 < a.precision && (m = Math.floor(m * Math.pow(10, Number(a.precision))) / Math.pow(10, Number(a.precision))), h[r] = m, m = !0;
                m && 0 < d.length && b.populateFromArray(0, 0, d)
            }
            return !0
        }
        l.toast("Select cells in a table to apply this function to first.");
        return !1
    };
    a.vInterpolate = function(a, b) {
        b || (b = f.currentTable.draggable.lastSelection.hot);
        if (b) {
            a = f.getCurrentTableValProps(b);
            for (var c = b.getSelected(), d = b.getData(), m = !1, e = 0; e < c.length; e++)
                for (var g = c[e], u = g[0], h = g[2], k = g[1], n = g[3], g = Math.min(u, h), u = Math.max(u, h), h = Math.max(k, n), k = Math.min(k, n); k <= h; k++)
                    for (var q = Math.max(g - 1, 0), n = Math.min(u + 1, b.countRows() - 1), r = (d[n][k] - d[q][k]) / Math.abs(n - q), q = q + 1; q < n; q++) {
                        var m = d[q],
                            p = d[q - 1][k] + r;
                        p < a.min ? p = a.min : p > a.max ? p = a.max : 0 < a.precision && (p = Math.floor(p *
                            Math.pow(10, Number(a.precision))) / Math.pow(10, Number(a.precision)));
                        m[k] = p;
                        m = !0
                    }
            m && 0 < d.length && b.populateFromArray(0, 0, d);
            return !0
        }
        l.toast("Select cells in a table to apply this function to first.");
        return !1
    };
    f.updateValFromMath = function(b, c, d, e, g, h, k) {
        k || (k = f.currentTable.draggable.lastSelection.hot);
        for (var m = k.getSelected(), u = k.getData(), D = !1, F = 0; F < m.length; F++) {
            var l = m[F],
                n = l[0],
                G = l[2],
                q = l[1],
                r = l[3],
                l = Math.min(n, G),
                n = Math.max(n, G),
                G = Math.min(q, r),
                q = Math.max(q, r),
                r = Number(g),
                p = c;
            0 < r && (p = 1 / Math.pow(10,
                r));
            c < p && (c = p);
            for (var p = [], x = l; x <= n; x++) {
                var v = [];
                p.push(v);
                for (var t = G; t <= q; t++) {
                    var E = Number(u[x][t]);
                    c = Number(c);
                    D = a.doMath(E, b, c, d, e, g);
                    if (0 < r) {
                        var E = E.toFixed(r),
                            w = D.toFixed(r);
                        E === w && h && (D = a.doMath(D, b, c, d, e, g))
                    }
                    0 < r && (D = (Math.round(D * Math.pow(10, r)) / Math.pow(10, r)).toFixed(r));
                    v.push(D);
                    D = !0
                }
            }
            D && 0 < p.length && k.populateFromArray(l, G, p, n, q)
        }
    };
    a.editTable = function(b, c, d, e) {
        if (b) {
            d && d.stopPropagation();
            var m = a.tabletree.tableData[b];
            _.isUndefined(m.dirty) && (m.dirty = !1);
            f.hot[b] ? a.makeTopId(b, !0, !1, d) : (m.rendering = !0, m.open = !0, e || f.tree.updateNode(m.node, {
                silent: !0,
                shallowRendering: !0
            }), a.openTablesCount = _.where(a.tabletree.tableData, {
                open: !0
            }).length, a.$apply(), console.log("renderTable"), f.renderTable(m, c, d))
        } else console.error("No table id")
    };
    f.getPrecisionForData = function(a, b) {
        var c = "0";
        if (!a || "0" === a || "-1" === a) c = "0";
        else if (0 < a) c += "." + "0".repeat(a);
        else if (b && 0 < b.length) {
            a = !1;
            for (var d = 0; d < b.length; d++) {
                for (var f = 0; f < b.length && !(a = 0 !== b[d][f] % 1); f++);
                if (a) break
            }
            a && (c = "0.00")
        }
        return c
    };
    f.handleKeyStrokeOnTable = function(b, c) {
        var d = b.key;
        if ("Escape" === d) c.editing || (b.stopImmediatePropagation(), a.closeTable(c.tableId));
        else if (!b.metaKey && !b.ctrlKey && "Meta" !== d && (!b.metaKey && !b.ctrlKey || "c" !== d && "v" !== d && "a" !== d && "z" !== d)) {
            f.setCurrentTable(c);
            var e = c.getSelected()[0];
            if (e && 4 === e.length) {
                var m = e[0],
                    g = e[2],
                    u = e[1],
                    h = e[3],
                    e = Math.min(u, h),
                    u = Math.max(u, h),
                    m = Math.min(m, g) !== Math.max(m, g) || e !== u;
                "Backspace" !== d && "Delete" !== d || !m ? f.isHInterpolateKey(b) ? (b.stopImmediatePropagation(), a.hInterpolate(b,
                        c)) : f.isVInterpolateKey(b) ? (b.stopImmediatePropagation(), a.vInterpolate(b, c)) : f.isInterpolateKey(b) ? (b.stopImmediatePropagation(), a.hvInterpolate(b, c)) : f.isIncrementKey(b) ? (b.stopImmediatePropagation(), b.preventDefault(), a.math("+", b, null, c)) : f.isDecrementKey(b, c) ? (b.stopImmediatePropagation(), b.preventDefault(), a.math("-", b, null, c)) : f.isCommitKey(b) ? (b.stopImmediatePropagation(), a.commitTable(b, c.tableId)) : f.isUndoKey(b) ? (b.stopImmediatePropagation(), a.commitTable(b, c.tableId, !0)) : f.isAllowedKey(b) ||
                    b.stopImmediatePropagation() : (b.stopImmediatePropagation(), c.deselectCell())
            } else f.isAllowedKey(b) || b.stopImmediatePropagation()
        }
    };
    f.isVInterpolateKey = function(a) {
        return "v" === a.key && !a.metaKey && !a.ctrlKey
    };
    f.isHInterpolateKey = function(a) {
        return "h" === a.key && !a.metaKey && !a.ctrlKey
    };
    f.isInterpolateKey = function(a) {
        return "a" === a.key && !a.metaKey && !a.ctrlKey
    };
    f.isCommitKey = function(a) {
        return "c" === a.key && !a.metaKey && !a.ctrlKey
    };
    f.isEnterKey = function(a) {
        return "Enter" === a.key && !a.metaKey && !a.ctrlKey
    };
    f.isMinusKey =
        function(a) {
            return "-" === a.key && !a.metaKey && !a.ctrlKey
        };
    f.isUndoKey = function(a) {
        return "u" === a.key && !a.metaKey && !a.ctrlKey
    };
    f.isIncrementKey = function(a) {
        return "," === a.key || 33 === a.keyCode || 219 === a.keyCode
    };
    f.isDecrementKey = function(a, b) {
        a = a.keyCode;
        return (34 === a || 221 === a) && !b.editing
    };
    f.calcMinColWidthForTable = function(b) {
        b = a.tabletree.tableData[b];
        var c = 0;
        b.def.hasXAxis && 0 < b.hAxis.values.length && b.hAxis.values.forEach(function(a) {
            c = Math.max(String(a).length, c)
        });
        b.rows.forEach(function(a) {
            a.values.forEach(function(a) {
                c =
                    Math.max(String(a).length, c)
            })
        });
        return Math.max(12 * c, 20) + 5
    };
    f.renderTable = function(b, c, d) {
        var e = b.def.extId;
        if (!f.hot[e] || c) {
            if (!f.originalData[e]) {
                f.originalData[e] = [];
                for (c = 0; c < b.rows.length; c++) f.originalData[e].push(b.rows[c].values);
                f.originalDataHAxis[e] = [];
                b.def.hasXAxis && f.originalDataHAxis[e].push(b.hAxis.values);
                f.originalDataVAxis[e] = [];
                if (b.def.hasYAxis)
                    for (c = 0; c < b.vAxis.values.length; c++) {
                        var m = [];
                        m.push(b.vAxis.values[c]);
                        f.originalDataVAxis[e].push(m)
                    }
            }
            f.currentData[e] || (f.currentData[e] =
                f.originalData[e].slice());
            f.currentDataHAxis[e] || (f.currentDataHAxis[e] = f.originalDataHAxis[e].slice());
            f.currentDataVAxis[e] || (f.currentDataVAxis[e] = f.originalDataVAxis[e].slice());
            c = document.getElementById("draggable-" + e);
            f.setupWidth(c, 70, b);
            f.setupDraggable(c);
            var g, m = JSON.parse(JSON.stringify(f.currentData[e]));
            if (f.hot[e]) f.hot[e].loadData(m);
            else {
                var u = [];
                g = f.getPrecisionForData(b.def.precision, m);
                for (var h = 0; h < b.hAxis.values.length; h++) {
                    var k = {
                        type: "numeric",
                        editor: H,
                        numericFormat: {
                            culture: "en-US"
                        },
                        renderer: J
                    };
                    k.numericFormat.pattern = "0" !== g ? g : {
                        mantissa: 0
                    };
                    u.push(k)
                }
                g = document.createElement("div");
                f.hot[e] = new Handsontable(g, {
                    licenseKey: "013fe-31daf-131d2-94204-9f03f",
                    startRows: b.def.rows,
                    startCols: b.def.columns,
                    colWidths: 70,
                    rowHeights: 22,
                    colHeaders: !1,
                    rowHeaders: !1,
                    dropdownMenu: !1,
                    autoRowSize: !1,
                    autoColumnSize: !1,
                    autoInsertRow: !1,
                    autoInsertColumn: !1,
                    fillHandle: !0,
                    outsideClickDeselects: !1,
                    observeDOMVisibility: !1,
                    columns: u,
                    maxCols: b.hAxis.values.length,
                    maxRows: b.vAxis.values.length,
                    afterInit: function() {
                        console.log("afterInit: " +
                            e)
                    },
                    afterUpdateSettings: function() {
                        console.log("afterUpdateSettings: " + e)
                    },
                    afterLoadData: I,
                    beforeKeyDown: function(a) {
                        return f.handleKeyStrokeOnTable(a, this.getInstance())
                    },
                    afterBeginEditing: function() {
                        this.getInstance().editing = !0;
                        var a = this.getInstance();
                        this.getActiveEditor().TEXTAREA.focus();
                        this.getActiveEditor().TEXTAREA.select();
                        f.setCurrentTable(a);
                        a.draggable && (a.draggable.lastSelection = {
                            hot: this,
                            selectedCells: a.getSelected()
                        });
                        this.tableData && !this.tableData.rendering && f.makeTop(a.draggable,
                            a.tableData, !0)
                    },
                    afterSelectionEnd: function(a, b, c, d) {
                        var e = this;
                        a = this.getInstance();
                        x(function() {
                            e.getActiveEditor().TEXTAREA.select()
                        });
                        f.setCurrentTable(a);
                        a.editing || (a.draggable && (a.draggable.lastSelection = {
                            hot: this,
                            selectedCells: a.getSelected()
                        }), this.tableData && !this.tableData.rendering && f.makeTop(a.draggable, a.tableData, !0), f.hotHAxis[a.tableId] && f.hotHAxis[a.tableId].deselectCell(), f.hotVAxis[a.tableId] && f.hotVAxis[a.tableId].deselectCell())
                    },
                    afterChange: function(a, b) {
                        "loadData" !== b && "update" !==
                            b && (a = this.getInstance(), f.currentData[a.tableId] = a.getData().slice(0), f.updateDirty(a.tableId), f.show3d(null, a.tableId))
                    }
                });
                f.hot[e].sel = null;
                f.hot[e].axis = null;
                f.hot[e].tableId = e;
                f.hot[e].tableData = b;
                f.hot[e].draggable = c;
                f.hot[e].heatmap = {
                    min: null,
                    max: null
                };
                f.hot[e].loadData(m);
                document.getElementById("tableData-" + e).appendChild(g);
                f.hot[e].render()
            }
            b.def.hasYAxis && 1 < b.vAxis.values.length && (m = JSON.parse(JSON.stringify(f.currentDataVAxis[e])), f.hotVAxis[e] ? f.hotVAxis[e].loadData(m) : (g = f.getPrecisionForData(b.def.yPrecision,
                m), u = [], h = {
                type: "numeric",
                editor: H,
                numericFormat: {
                    culture: "en-US"
                },
                renderer: J
            }, h.numericFormat.pattern = "0" !== g ? g : {
                mantissa: 0
            }, u.push(h), g = document.createElement("div"), f.hotVAxis[e] = new Handsontable(g, {
                licenseKey: "013fe-31daf-131d2-94204-9f03f",
                startRows: b.def.rows,
                startCols: 1,
                colWidths: 70,
                rowHeights: 23,
                colHeaders: !1,
                rowHeaders: !1,
                dropdownMenu: !1,
                autoRowSize: !1,
                autoColumnSize: !1,
                autoInsertRow: !1,
                autoInsertColumn: !1,
                fillHandle: !0,
                outsideClickDeselects: !1,
                observeDOMVisibility: !1,
                maxCols: 1,
                maxRows: b.vAxis.values.length,
                columns: u,
                afterLoadData: I,
                beforeKeyDown: function(a) {
                    return f.handleKeyStrokeOnTable(a, this.getInstance())
                },
                afterBeginEditing: function() {
                    var a = this.getInstance();
                    this.getActiveEditor().TEXTAREA.focus();
                    this.getActiveEditor().TEXTAREA.select();
                    a.editing = !0;
                    f.setCurrentTable(a);
                    a.draggable && (a.draggable.lastSelection = {
                        hot: this,
                        selectedCells: a.getSelected()
                    });
                    this.tableData && !this.tableData.rendering && f.makeTop(a.draggable, a.tableData, !0)
                },
                afterSelectionEnd: function(a, b, c, d) {
                    var e = this;
                    a = this.getInstance();
                    x(function() {
                        e.getActiveEditor().TEXTAREA.select()
                    });
                    f.setCurrentTable(a);
                    a.editing || (a.draggable && (a.draggable.lastSelection = {
                        hot: this,
                        selectedCells: a.getSelected()
                    }), this.tableData && !this.tableData.rendering && f.makeTop(a.draggable, a.tableData, !0), f.hot[a.tableId] && f.hot[a.tableId].deselectCell(), f.hotHAxis[a.tableId] && f.hotHAxis[a.tableId].deselectCell())
                },
                afterChange: function(a, b) {
                    "loadData" !== b && (a = this.getInstance(), f.currentDataVAxis[a.tableId] = a.getData().slice(), f.updateDirty(a.tableId), f.show3d(null,
                        a.tableId))
                }
            }), f.hotVAxis[e].tableId = e, f.hotVAxis[e].sel = null, f.hotVAxis[e].axis = "v", f.hotVAxis[e].draggable = c, f.hotVAxis[e].heatmap = {
                min: null,
                max: null
            }, f.hotVAxis[e].loadData(m), document.getElementById("tableVAxis-" + e).appendChild(g), f.hotVAxis[e].render()));
            if (b.def.hasXAxis && 1 < b.hAxis.values.length)
                if (m = JSON.parse(JSON.stringify(f.currentDataHAxis[e])), f.hotHAxis[e]) f.hotHAxis[e].loadData(m);
                else {
                    u = [];
                    g = f.getPrecisionForData(b.def.xPrecision, m);
                    for (h = 0; h < b.hAxis.values.length; h++) k = {
                        type: "numeric",
                        editor: H,
                        numericFormat: {
                            culture: "en-US"
                        },
                        renderer: J
                    }, k.numericFormat.pattern = "0" !== g ? g : {
                        mantissa: 0
                    }, u.push(k);
                    g = document.createElement("div");
                    f.hotHAxis[e] = new Handsontable(g, {
                        licenseKey: "013fe-31daf-131d2-94204-9f03f",
                        startRows: 1,
                        startCols: b.def.columns,
                        colWidths: 70,
                        rowHeights: 22,
                        colHeaders: !1,
                        rowHeaders: !1,
                        dropdownMenu: !1,
                        autoRowSize: !1,
                        autoColumnSize: !1,
                        autoInsertRow: !1,
                        autoInsertColumn: !1,
                        fillHandle: !0,
                        outsideClickDeselects: !1,
                        observeDOMVisibility: !1,
                        maxCols: b.hAxis.values.length,
                        maxRows: 1,
                        columns: u,
                        afterLoadData: I,
                        beforeKeyDown: function(a) {
                            return f.handleKeyStrokeOnTable(a, this.getInstance())
                        },
                        afterBeginEditing: function() {
                            var a = this.getInstance();
                            this.getActiveEditor().TEXTAREA.focus();
                            this.getActiveEditor().TEXTAREA.select();
                            f.setCurrentTable(a);
                            a.editing = !0;
                            a.draggable && (a.draggable.lastSelection = {
                                hot: this,
                                selectedCells: a.getSelected()
                            });
                            this.tableData && !this.tableData.rendering && f.makeTop(this, !0)
                        },
                        afterSelectionEnd: function(a, b, c, d) {
                            var e = this;
                            a = this.getInstance();
                            x(function() {
                                e.getActiveEditor().TEXTAREA.select()
                            });
                            f.setCurrentTable(a);
                            a.editing || (a.draggable && (a.draggable.lastSelection = {
                                hot: this,
                                selectedCells: a.getSelected()
                            }), this.tableData && !this.tableData.rendering && f.makeTop(this, !0), f.hot[a.tableId] && f.hot[a.tableId].deselectCell(), f.hotVAxis[a.tableId] && f.hotVAxis[a.tableId].deselectCell())
                        },
                        afterChange: function(a, b) {
                            "loadData" !== b && (a = this.getInstance(), f.currentDataHAxis[a.tableId] = this.getInstance().getData().slice(), f.updateDirty(a.tableId), f.show3d(null, a.tableId))
                        }
                    });
                    f.hotHAxis[e].tableId = e;
                    f.hotHAxis[e].sel =
                        null;
                    f.hotHAxis[e].axis = "h";
                    f.hotHAxis[e].draggable = c;
                    f.hotHAxis[e].heatmap = {
                        min: null,
                        max: null
                    };
                    f.hotHAxis[e].loadData(m);
                    document.getElementById("tableHAxis-" + e).appendChild(g);
                    f.hotHAxis[e].render()
                }
            f.makeTop(c, b, !1, !1, d);
            f.show3d(null, e);
            b.rendering = !1;
            a.$apply()
        }
    };
    f.findHighestZIndexEl = function(a) {
        a = a.children;
        for (var b = null, c = Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1), d = 0; d < a.length; d++) {
            var e = Number.parseInt(document.defaultView.getComputedStyle(a[d], null).getPropertyValue("z-index"), 10);
            e > c && (c = e, b = a[d])
        }
        return b
    };
    a.showDesc = function(a) {
        a.target.classList.toggle("active");
        a = a.target.nextElementSibling;
        a.style.maxHeight = a.style.maxHeight ? null : a.scrollHeight + "px"
    };
    a.unselectTopTable = function(b) {
        b.target.closest(".table-edit") || (f.currentTable && !f.currentTable.isDestroyed && f.currentTable.deselectCell(), f.previousTable && !f.previousTable.isDestroyed && f.previousTable.deselectCell(), f.currentTable = null, a.currentTableId = null, f.previousTable = null)
    };
    a.makeTopId = function(a, b, c, d) {
        f.makeTop(f.hot[a].draggable,
            f.hot[a].tableData, b, c, d, !1);
        (a = f.hot[a].tableData.node) && !a.state.selected && f.tree.selectNode(a, {
            autoScroll: !0,
            silent: !0
        })
    };
    f.makeTop = function(b, c, d, e, g, h) {
        g && g.target.classList.contains("close-table-icon") || (g && g.preventDefault(), c = f.hot[c.def.extId], b && a.currentTableId !== c.tableId && (g = f.findHighestZIndexEl(b.parentNode), e = {
            zIndex: Number.parseInt(document.defaultView.getComputedStyle(g, null).getPropertyValue("z-index"), 10) + 1
        }, d || (d = g.getBoundingClientRect(), e.top = Math.max(d.top - 50, 75) + "px", e.left =
            Math.max(d.left + 10, 455) + "px"), b.lastSelection && (b.lastSelection.hot.tableData.rendering = !0, b.lastSelection.hot.selectCells(b.lastSelection.selectedCells), b.lastSelection.hot.tableData.rendering = !1), Object.assign(b.style, e)), h || f.setCurrentTable(c))
    };
    a.compareMapVersions = function(a) {};
    a.compareTableVersions = function(a, b) {
        if (b.selectedTableVersions && 2 === b.selectedTableVersions.length) {
            var c = b.selectedTableVersions[0],
                d = b.selectedTableVersions[1],
                e = b.def.extId;
            f.hot[e].beforeCompareData = f.originalData[e].slice(0);
            a = c.tVerData;
            for (var g = [], m = 0; m < a.rows.length; m++) {
                for (var u = a.rows[m], h = [], k = 0; k < u.values.length; k++) h.push(u.values[k]);
                g.push(h)
            }
            f.originalData[e] = g;
            if (b.def.hasXAxis && a.hAxis && 0 < a.hAxis.values.length) {
                f.hotHAxis[e].beforeCompareData = f.originalDataHAxis[e].slice(0);
                g = [];
                m = [];
                for (u = 0; u < a.hAxis.values.length; u++) m.push(a.hAxis.values[u]);
                g.push(m);
                f.originalDataHAxis[e] = g
            }
            if (b.def.hasYAxis && a.vAxis && 0 < a.vAxis.values.length) {
                f.hotVAxis[e].beforeCompareData = f.originalDataVAxis[e].slice(0);
                g = [];
                for (m =
                    0; m < a.vAxis.values.length; m++) u = [], u.push(a.vAxis.values[m]), g.push(u);
                f.originalDataVAxis[e] = g
            }
            b.ver1 = c.id;
            b.ver2 = d.id;
            b.compareLoaded = !0;
            a = d.tVerData;
            g = [];
            for (c = 0; c < a.rows.length; c++) {
                d = a.rows[c];
                e = [];
                for (m = 0; m < d.values.length; m++) e.push(d.values[m]);
                g.push(e)
            }
            f.hot[b.def.extId].populateFromArray(0, 0, g, "edit");
            if (b.def.hasXAxis && a.hAxis && 0 < a.hAxis.values.length) {
                c = [];
                d = [];
                for (e = 0; e < a.hAxis.values.length; e++) d.push(a.hAxis.values[e]);
                c.push(d);
                f.hotHAxis[b.def.extId].populateFromArray(0, 0, c, "edit")
            }
            if (b.def.hasYAxis &&
                a.vAxis && 0 < a.vAxis.values.length) {
                c = [];
                for (d = 0; d < a.vAxis.values.length; d++) e = [], e.push(a.vAxis.values[d]), c.push(e);
                f.hotVAxis[b.def.extId].populateFromArray(0, 0, c, "edit")
            }
            a = document.getElementById(b.def.extId + "-def");
            c = a.parentNode.parentNode.getElementsByClassName("tablink");
            for (b = 0; b < c.length; b++) c[b].classList.remove("activetab");
            a.classList.toggle("activetab");
            c = a.parentNode.parentNode.getElementsByClassName("tabcontent");
            for (b = 0; b < c.length; b++) c[b].classList.remove("activetab");
            a.classList.add("activetab")
        }
    };
    a.importTableVersionToCurrent = function(a, b) {
        if (b.selectedTableVersions) {
            a = b.selectedTableVersions[0].tVerData;
            for (var c = [], d = 0; d < a.rows.length; d++) {
                for (var e = a.rows[d], g = [], m = 0; m < e.values.length; m++) g.push(e.values[m]);
                c.push(g)
            }
            f.hot[b.def.extId].populateFromArray(0, 0, c, "edit");
            if (b.def.hasXAxis && a.hAxis && 0 < a.hAxis.values.length) {
                c = [];
                d = [];
                for (e = 0; e < a.hAxis.values.length; e++) d.push(a.hAxis.values[e]);
                c.push(d);
                f.hotHAxis[b.def.extId].populateFromArray(0, 0, c, "edit")
            }
            if (b.def.hasYAxis && a.vAxis && 0 <
                a.vAxis.values.length) {
                c = [];
                for (d = 0; d < a.vAxis.values.length; d++) e = [], e.push(a.vAxis.values[d]), c.push(e);
                f.hotVAxis[b.def.extId].populateFromArray(0, 0, c, "edit")
            }
            a = document.getElementById(b.def.extId + "-def");
            c = a.parentNode.parentNode.getElementsByClassName("tablink");
            for (b = 0; b < c.length; b++) c[b].classList.remove("activetab");
            a.classList.toggle("activetab");
            c = a.parentNode.parentNode.getElementsByClassName("tabcontent");
            for (b = 0; b < c.length; b++) c[b].classList.remove("activetab");
            a.classList.add("activetab")
        }
    };
    a.importMapVersionToCurrent = function(b) {
        a.importMap = a.map;
        a.closeAllTables();
        a.doOpen(b, !0, f.selectedMapVersions[0].id)
    };
    a.closeMap = function(b) {
        a.map || a.tuneReq ? 0 < a.commited || a.dirty ? c.swal({
            title: "Warning",
            text: "There are unsaved changes to the currently open map. Would you like to ignore all currently unsaved changes and close the current open map?",
            type: "warning",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(a) {
            a && f.doCloseMap();
            b && b()
        }) : c.swal({
            title: "Close map?",
            text: "Are you sure you'd like to close the current open map?",
            type: "warning",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(a) {
            a && f.doCloseMap();
            b && b()
        }) : b && b()
    };
    f.doCloseMap = function() {
        a.closeAllTables();
        a.mapName = "Tuning Editor";
        delete a.importChanges;
        delete a.importMap;
        delete a.tableCount;
        delete a.changedTables;
        delete a.filterChanged;
        delete f.selectedMapVersions;
        delete a.map;
        delete a.commited;
        delete a.dirtyTablesCount;
        delete a.dirty;
        delete a.tuneReq;
        delete a.tabletree;
        delete f.originalData;
        delete f.originalDataHAxis;
        delete f.originalDataVAxis;
        delete f.currentData;
        delete f.currentDataHAxis;
        delete f.currentDataVAxis;
        delete f.hot;
        delete f.hotVAxis;
        delete f.hotHAxis;
        a.importMapTablesGrid.gridOptions.data = null;
        a.gridOptions.data = null;
        f.tree && f.tree.clear();
        delete f.tree
    };
    f.loadData = function() {
        r({
            method: "POST",
            url: WS_BASE_URL + "/map/v2/tabletree",
            data: {
                mapId: a.map.id
            }
        }).then(function(b) {
                a.commited = 0;
                a.dirtyTablesCount = 0;
                a.dirty = !1;
                f.originalData = [];
                f.originalDataHAxis = [];
                f.originalDataVAxis = [];
                f.currentData = [];
                f.currentDataHAxis = [];
                f.currentDataVAxis = [];
                f.hot = [];
                f.hotHAxis = [];
                f.hotVAxis = [];
                a.closeAllTables();
                var d = document.getElementsByClassName("table-edit");
                if (d && 0 < d.length)
                    for (var e = 0; e > d.length; e++) {
                        var g = d[e];
                        g.parentNode.removeChild(g)
                    }
                b = b.data;
                d = document.getElementById("editorStatus");
                b.locked ? (c.swal({
                    title: "Error",
                    text: "Failed opening map. Please contact support@protuningfreaks.com for assistance.",
                    type: "error"
                }), a.closeMap()) : b.nodes && b.nodes.length ? (a.mapName = a.map.name + " [" + b.romVersion + "]", a.openTables = [], a.tabletree = b, c.swal({
                    title: "Please wait..",
                    text: "Initializing table data..",
                    type: "info",
                    showConfirmButton: !1,
                    showCancelButton: !1
                }), a.initEditorTreeWidget(), a.tableCount = Object.keys(a.tabletree.tableData).length, f.setupInteractOnEl(document.getElementById("tables-menu")), c.close()) : (f.doCloseMap(), c.swal({
                    title: "ROM Support",
                    text: "ROM version of this map doesn't seem to be supported by the editor at this time. Please contact support@protuningfreaks.com for assistance.",
                    type: "error"
                }), d && (d.innerHTML = "ROM version of this map doesn't seem to be supported by the editor at this time. Please contact support@protuningfreaks.com for assistance."))
            },
            function(a) {
                c.swal({
                    title: "Error",
                    text: "Failed getting table data for this map. Please try again or contact support@protuningfreaks.com for assistance.",
                    type: "error"
                });
                f.doCloseMap()
            })
    };
    f.loadData = _.debounce(f.loadData, 300, !0);
    f.toggleTableShow = function(b, c, d, e, g) {
        if (b && b.extId) {
            var m = a.tabletree.tableData[b.extId];
            !m.open || c ? (d || f.tree.openNode(b, {
                silent: !0
            }), m.node = b, a.editTable(b.extId, !1, e, g)) : (d || f.tree.closeNode(b, {
                silent: !0
            }), a.closeTable(b.extId))
        } else d || f.tree.openNode(b, {
            silent: !0
        })
    };
    a.initEditorTreeWidget =
        function() {
            f.tree || (f.tree = new InfiniteTree({
                el: document.querySelector("#tablesMainTree"),
                layout: "div",
                tabIndex: 1,
                rowRenderer: function(b, c) {
                    c = null;
                    if (!1 !== b.state.filtered) {
                        if (!0 === b.state.filtered && b.parent.rel && !a.filterChanged && !a.searchIncludeRelTables) return !1;
                        var d = 18 * b.state.depth + "px",
                            e = "";
                        "1d" === b.type ? e = "oned" : "2d" === b.type ? e = "twod" : "3d" === b.type && (e = "threed");
                        b.extId && (c = a.tabletree.tableData[b.extId], c.typeCls = e, c.type = b.type);
                        if (b.hasChildren()) return b.extId ? ['\x3cdiv data-id\x3d"' +
                            b.id + '" class\x3d"infinite-tree-item ' + (b.state.selected ? "infinite-tree-selected" : "") + '" title\x3d"' + b.name + (b.nameOld ? " (former: " + b.nameOld + ")" : "") + (b.a2lId ? "[" + b.a2lId + "]" : "") + '"\x3e', '\x3cdiv class\x3d"infinite-tree-node reltables" style\x3d"margin-left: ' + d + '"\x3e', '\x3cspan class\x3d"infinite-tree-title ' + e + '"\x3e' + b.type.toUpperCase() + "\x3c/span\x3e", '\x3cspan class\x3d"infinite-tree-title tname ' + (c.open ? "open" : "") + (c.dirty ? " dirty" : "") + (c.commited ? " commited" : "") + '"\x3e' + b.name + "\x3c/span\x3e",
                            '\x3cspan class\x3d"reltables-link"\x3eVIEW REL \x26#x2B0E;\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e'
                        ].join("") : ['\x3cdiv data-id\x3d"' + b.id + '" class\x3d"infinite-tree-item ' + (b.state.selected ? "infinite-tree-selected" : "") + '" title\x3d"' + b.name + '"\x3e', '\x3cdiv class\x3d"infinite-tree-node folder ' + (b.state.open ? "open" : "") + '" style\x3d"margin-left: ' + d + '"\x3e', '\x3cspan class\x3d"infinite-tree-title ' + e + '"\x3e' + b.type.toUpperCase() + "\x3c/span\x3e", '\x3cspan class\x3d"infinite-tree-title tname"\x3e' + b.name +
                            "\x3c/span\x3e", "\x3c/div\x3e\x3c/div\x3e"
                        ].join("");
                        if (b.id) return ['\x3cdiv data-id\x3d"' + b.id + '" class\x3d"infinite-tree-item ' + (b.state.selected ? "infinite-tree-selected" : "") + '" title\x3d"' + b.name + (b.nameOld ? " (former: " + b.nameOld + ")" : "") + (b.a2lId ? "[" + b.a2lId + "]" : "") + '"\x3e', '\x3cdiv class\x3d"infinite-tree-node" style\x3d"margin-left: ' + d + '"\x3e', '\x3cspan class\x3d"infinite-tree-title ' + e + '"\x3e' + b.type.toUpperCase() + "\x3c/span\x3e", '\x3cspan class\x3d"infinite-tree-title tname ' + (c.open ? "open" :
                            "") + (c.dirty ? " dirty" : "") + (c.commited ? " commited" : "") + '"\x3e' + b.name + "\x3c/span\x3e", "\x3c/div\x3e\x3c/div\x3e"].join("")
                    }
                }
            }), f.tree.on("keyDown", function(b) {
                b.preventDefault();
                var c = f.tree.getSelectedNode(),
                    d = f.tree.getSelectedIndex();
                if (37 === b.keyCode) c.state.open ? c.hasChildren() ? f.tree.closeNode(c) : f.tree.selectNode(c.parent, {
                    silent: !0,
                    autoScroll: !1
                }) : f.tree.selectNode(c.parent, {
                    silent: !0,
                    autoScroll: !1
                });
                else if (38 === b.keyCode)
                    if (f.tree.filtered) {
                        b = c;
                        for (--d; 0 <= d; --d)
                            if (f.tree.nodes[d].state.filtered) {
                                b =
                                    f.tree.nodes[d];
                                break
                            }
                        f.tree.selectNode(b, {
                            silent: !0,
                            autoScroll: !1
                        })
                    } else f.tree.selectNode(f.tree.nodes[d - 1] || c, {
                        silent: !0,
                        autoScroll: !1
                    });
                else if (39 === b.keyCode) c.children && 0 < c.children.length && f.tree.openNode(c, {
                    silent: !0
                });
                else if (13 === b.keyCode) f.toggleTableShow(c, !1, !0, b, !0);
                else if (70 === b.keyCode) a.toggleFilter();
                else if (67 === b.keyCode) c.extId && a.tabletree.tableData[c.extId].dirty && (a.commitTable(b, c.extId), l.toast(c.name + ": Table committed"));
                else if (85 === b.keyCode) c.extId && a.tabletree.tableData[c.extId].dirty &&
                    (a.commitTable(b, c.extId, !0), l.toast(c.name + ": Table reverted"));
                else if (32 === b.keyCode) f.toggleTableShow(c, !1, !0, b, !0);
                else if (27 === b.keyCode) a.closeTable(c.extId);
                else if (40 === b.keyCode)
                    if (f.tree.filtered) {
                        b = c;
                        for (d += 1; d < f.tree.nodes.length; ++d)
                            if (f.tree.nodes[d].state.filtered) {
                                b = f.tree.nodes[d];
                                break
                            }
                        f.tree.selectNode(b, {
                            silent: !0,
                            autoScroll: !1
                        })
                    } else f.tree.selectNode(f.tree.nodes[d + 1] || c, {
                        silent: !0,
                        autoScroll: !1
                    })
            }), f.tree.on("click", function(b) {
                var c = f.tree.getNodeFromPoint(b.clientX, b.clientY);
                if (c) {
                    b.preventDefault();
                    var d = b.target.classList.contains("reltables-link");
                    if (d || !c.extId && c.children && 0 < c.children.length) c.state.open ? c.state.open && f.tree.closeNode(c, {
                        silent: !0
                    }) : f.tree.openNode(c, {
                        silent: !0
                    });
                    c.extId && (b.stopImmediatePropagation(), a.tabletree.tableData[c.extId].open ? a.makeTopId(c.extId, !0, !1, b) : d || f.toggleTableShow(c, !1, !0, b, !0));
                    c.state.selected || f.tree.selectNode(c, {
                        silent: !0,
                        autoScroll: !1
                    })
                }
            }));
            f.tree.on("contentWillUpdate", function() {
                console.log("contentWillUpdate")
            });
            f.tree.on("clusterWillChange",
                function() {
                    console.log("clusterWillChange")
                });
            f.tree.loadData(a.initEditorTreeData(a.tabletree))
        };
    a.toggleDash = function(b) {
        b.target.classList.contains("active") ? (a.dashShowing = null, g.$broadcast("stopdash")) : (a.dashShowing = !0, g.$broadcast("startdash"));
        b.target.classList.toggle("active");
        b.target.nextElementSibling.classList.toggle("active")
    };
    a.initEditorTreeData = function(b) {
        var c = [],
            d;
        for (d in b.nodes) {
            var e = b.nodes[d],
                f = {
                    id: e.uid,
                    name: e.name,
                    type: ""
                };
            if (e = a.initEditorTreeData(e)) f.children = e;
            c.push(f)
        }
        for (var g in b.tables)
            if (d =
                b.tables[g], f = a.getTableNameForNode(d.extId)) f = {
                id: d.uid,
                extId: d.extId,
                a2lId: d.id,
                name: f
            }, f.type = d.hasXAxis && d.hasYAxis ? "3d" : d.hasXAxis ? "2d" : "1d", e = a.tabletree.tableData[d.extId], e.def.nameOld && (f.nameOld = e.def.nameOld), e = a.tabletree.tableData[d.extId], e.type = f.type, e.nodes || (e.nodes = []), e.nodes.push(f.id), !d.related && (d = a.initEditorTreeData(d)) && (f.rel = !0, f.children = d), c.push(f);
        return 0 === c.length ? null : c
    };
    a.getTableNameForNode = function(b) {
        if ((b = a.tabletree.tableData[b]) && !b.name) {
            var c = b.def.name;
            b.def.units && 0 !== b.def.units.trim().length && "-" !== b.def.units.trim() && "" !== b.def.units.trim() && (c += " [" + b.def.units + "]");
            return b.name = c
        }
        return b ? b.name : null
    };
    a.queryForHits = function(a, b) {
        var c = !1;
        b && 0 < b.length && (c = -1 < a.name.toUpperCase().indexOf(b.trim().toUpperCase()));
        return c
    };
    a.expandAll = function() {};
    a.setDimFilter = function(a) {};
    a.setChangesFilter = function(a) {};
    a.setSorting = function(a) {};
    a.sortModeProp = a.getForCurrUser("sortModeProp", "name");
    a.setSortMode = function(b) {
        a.set("sortModeProp", b);
        a.sortModeProp = a.getForCurrUser("sortModeProp", "name")
    };
    a.toggleSortMode = function() {
        a.sortModeProp = a.getForCurrUser("sortModeProp", "name");
        "name" === a.sortModeProp ? a.set("sortModeProp", "type") : a.set("sortModeProp", "name");
        a.sortModeProp = a.getForCurrUser("sortModeProp", "name")
    };
    a.orderBySortMode = function(b) {
        return "name" === a.sortModeProp ? b.name : b.type
    };
    a.filter1d = !1;
    a.filter2d = !1;
    a.filter3d = !1;
    a.filterChanged = !1;
    a.filterTreeActivate = function() {
        x(function() {
            a.doFilterTreeActivate()
        })
    };
    a.doFilterTreeActivate =
        function() {
            a.filter1d || a.filter2d || a.filter3d || a.filterChanged ? f.tree.filter(function(b) {
                if (b.parent && b.parent.rel && !a.filterChanged && !a.searchIncludeRelTables) return !1;
                if (b.extId) {
                    var c = !1;
                    a.filterChanged && a.tabletree.tableData[b.extId].dirty && (f.openParents(b), c = !0);
                    a.filter1d && "1d" === b.type && (c = !0);
                    a.filter2d && "2d" === b.type && (c = !0);
                    a.filter3d && "3d" === b.type && (c = !0);
                    return c
                }
            }) : (f.tree.unfilter(), a.collapseAll())
        };
    a.filterDirty = function() {
        a.filterChanged ? f.tree.filter(function(b) {
            if (b.extId) return a.tabletree.tableData[b.extId].dirty ?
                !0 : !1
        }) : (f.tree.unfilter(), a.collapseAll())
    };
    a.setFilterTablesByDimension = function(b) {
        "1d" === b ? a.filter1d = !a.filter1d : "2d" === b ? a.filter2d = !a.filter2d : "3d" === b ? a.filter3d = !a.filter3d : "changed" === b && (a.filterChanged = !a.filterChanged);
        a.filterTreeActivate()
    };
    a.updateChangedTables = function() {
        a.changedTables = f.getDirtyTables()
    };
    f.buildPlotData = function(a, b, c) {
        for (var d = [], e = 0; e < c.length; e++) d[e] = c[e][0];
        if (c && 1 < c.length) a = [{
            x: b[0],
            y: d,
            z: a,
            type: "surface",
            opacity: .8,
            hidesurface: !1,
            contours: {
                x: {
                    show: !1
                },
                y: {
                    show: !1
                },
                z: {
                    show: !1
                }
            },
            showscale: !1
        }];
        else {
            c = [];
            for (d = 0; d < a[0].length; d++) c[d] = a[0][d];
            a = [{
                x: b[0],
                y: c,
                type: "lines+markers"
            }]
        }
        return a
    };
    a.loadMapHistory = function(b) {
        a.gridOptions.data || (a.loadingVersions = !0, r({
            method: "POST",
            url: WS_BASE_URL + "/map/versions",
            data: {
                mapId: a.map.id
            }
        }).then(function(b) {
            a.loadingVersions = null;
            b = b.data.versions;
            b.forEach(function(a) {
                a.cDate = (new Date(a.cDate)).toString()
            });
            a.gridOptions.data = b
        }, function(b) {
            a.loadingVersions = null;
            c.swal({
                title: "Error",
                text: "Failed retrieving version history for this map. Please try again or contact support@protuningfreaks.com for assistance.",
                type: "error"
            })
        }))
    };
    a.loadTableHistory = function(b, d) {
        d.gridOptions || (d.loadingVersions = !0, d.selectedTableVersions = [], d.gridOptions = {
            enableRowSelection: !0,
            enableSelectAll: !1,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            multiselect: !0,
            enableColumnResizing: !0,
            columnDefs: [{
                name: "Date",
                field: "cDate",
                sort: {
                    direction: y.DESC,
                    priority: 1
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "Version Comments",
                field: "versionComments"
            }, {
                name: "Map Description",
                field: "desc"
            }],
            onRegisterApi: function(b) {
                d.gridApi = b;
                d.gridApi.selection.on.rowSelectionChanged(a, function(a) {
                    var b = d.gridApi.selection.getSelectedRows();
                    2 < b.length ? (l.toast("Only two versions can be selected at the same time for comparison."), a.setSelected(!1)) : d.selectedTableVersions = b
                })
            }
        }, r({
            method: "POST",
            url: WS_BASE_URL + "/table/versions",
            data: {
                mapId: a.map.id,
                tableId: d.def.extId
            }
        }).then(function(a) {
            d.loadingVersions = null;
            a = a.data.versions;
            a.forEach(function(a) {
                a.cDate = (new Date(a.cDate)).toString()
            });
            d.gridOptions.data = a
        }, function(a) {
            d.loadingVersions =
                null;
            c.swal({
                title: "Error",
                text: "Failed retrieving version history for this table. Please try again or contact support@protuningfreaks.com for assistance.",
                type: "error"
            })
        }))
    };
    a.toggle3d = function(b, c) {
        f.hot[c].showing3dTable ? a.close3dTable(b, c) : f.show3d(b, c, !0)
    };
    a.awaiting3dRender = !1;
    f.show3d = function(b, c, d) {
        var e = a.tabletree.tableData[c];
        a.show3dTables = g.getForCurrUser("show3dTables", !1);
        (a.show3dTables || d) && e.def.hasXAxis && 1 < e.def.columns && x(function() {
            a.doShow3d(b, c)
        })
    };
    a.doShow3d = function(b, c) {
        b =
            f.hot[c];
        var d = "3dtable-" + c;
        document.getElementById(d).style.width = b.draggable.style.width;
        var e = f.buildPlotData(f.currentData[c], f.currentDataHAxis[c], f.currentDataVAxis[c]);
        b.plot = Plotly.newPlot(d, e, {
            scene: {
                bgcolor: "#120f3e",
                camera: {
                    eye: {
                        x: -1.25,
                        y: -1.25,
                        z: 1.25
                    }
                },
                xaxis: {
                    spikecolor: "#1fe5bd",
                    spikesides: !1,
                    spikethickness: 6
                },
                yaxis: {
                    spikecolor: "#1fe5bd",
                    spikesides: !1,
                    spikethickness: 6
                },
                zaxis: {
                    spikecolor: "#1fe5bd",
                    spikethickness: 6
                }
            },
            showlegend: !1,
            showscale: !1,
            hidesurface: !1,
            margin: {
                l: 80,
                r: 80,
                b: 80,
                t: 0,
                pad: 4
            },
            font: {
                family: "Courier New, monospace",
                size: 12,
                color: "#fff"
            },
            paper_bgcolor: "#120f3e",
            plot_bgcolor: "#120f3e"
        }, {
            displaylogo: !1,
            displayModeBar: !1,
            modeBarButtonsToRemove: ["sendDataToCloud", "hoverCompareCartesian"]
        });
        b.showing3dTable || (d = document.getElementById(d), d.on("plotly_hover", function(a) {
            a && a.points && f.hot[c].setCellMeta(a.points[0].pointNumber, a.points[0].curveNumber, "className", "cellhover")
        }), d.on("plotly_unhover", function(a) {
            a && a.points && f.hot[c].removeCellMeta(a.points[0].pointNumber,
                a.points[0].curveNumber, "className")
        }), document.getElementById("3dtableContainer-" + c).classList.remove("hidden-force"));
        b.showing3dTable = !0;
        a.awaiting3dRender = !1
    };
    a.doImport = function() {
        if (0 < a.selectedTablesForImport.length) {
            a.closeAllTables();
            for (var b in a.selectedTablesForImport) {
                var d = a.selectedTablesForImport[b].def.extId,
                    e = a.tabletree.tableData[d],
                    g = f.compareRoot.tableData[d];
                if (e && g) {
                    if (!f.originalData[d]) {
                        f.originalData[d] = [];
                        for (var h = 0; h < e.rows.length; h++) f.originalData[d].push(e.rows[h].values);
                        f.originalDataHAxis[d] = [];
                        f.originalDataHAxis[d].push(e.hAxis.values);
                        f.originalDataVAxis[d] = [];
                        for (h = 0; h < e.vAxis.values.length; h++) {
                            var k = [];
                            k.push(e.vAxis.values[h]);
                            f.originalDataVAxis[d].push(k)
                        }
                    }
                    f.currentData[d] = [];
                    for (h = 0; h < g.rows.length; h++) f.currentData[d].push(g.rows[h].values);
                    f.hot[d] && f.hot[d].loadData(f.currentData[d].slice());
                    e.def.hasXAxis ? (f.currentDataHAxis[d] = [], f.currentDataHAxis[d].push(g.hAxis.values), f.hotHAxis[d] && f.hotHAxis[d].loadData(f.currentDataHAxis[d].slice())) : f.currentDataHAxis[d] =
                        f.originalDataHAxis[d].slice();
                    if (e.def.hasYAxis) {
                        f.currentDataVAxis[d] = [];
                        for (e = 0; e < g.vAxis.values.length; e++) h = [], h.push(g.vAxis.values[e]), f.currentDataVAxis[d].push(h);
                        f.hotVAxis[d] && f.hotVAxis[d].loadData(f.currentDataVAxis[d].slice())
                    } else f.currentDataVAxis[d] = f.originalDataVAxis[d].slice()
                }
            }
            f.updateDirty(null, !0);
            a.importMap = null;
            a.selectedTab = 0;
            a.selectedTablesForImport = [];
            a.filterChanged = !1;
            a.filter1d = !1;
            a.filter2d = !1;
            a.filter3d = !1;
            f.tree.unfilter();
            a.setFilterTablesByDimension("changed");
            c.close()
        } else a.selectedTablesForImport = [], c.swal({
            title: "No Changes",
            text: "No changes detected in the map you're importing from compared to the map currently loaded and showing.",
            type: "info"
        })
    };
    f.compareTableData = function(a, b) {
        var c = a.rows.length === b.rows.length && a.rows.every(function(a, c) {
            return a.values.length === b.rows[c].values.length && a.values.every(function(a, d) {
                return a === b.rows[c].values[d]
            })
        });
        c && b.def.hasYAxis && (c = a.vAxis.values.length === b.vAxis.values.length && a.vAxis.values.every(function(a,
            c) {
            return a === b.vAxis.values[c]
        }));
        c && b.def.hasXAxis && (c = a.hAxis.values.length === b.hAxis.values.length && a.hAxis.values.every(function(a, c) {
            return a === b.hAxis.values[c]
        }));
        return c
    };
    f.loadCompareData = function(b, d) {
        a.checkAccess() && (b = "Importing " + a.importMap.name, d && (b = "Importing " + a.importMap.name + ", from version history id " + d), c.swal({
                title: "Please wait",
                text: b,
                type: "info",
                showCancelButton: !1,
                showConfirmButton: !1
            }), b = {
                method: "POST",
                url: WS_BASE_URL + "/map/v2/tabletree",
                data: {
                    mapId: a.importMap.id
                }
            },
            d && (b.data.versionId = d), r(b).then(function(b) {
                var d = b.data;
                if (d.locked && !a.importMap.allowImport) c.swal({
                    title: "Error",
                    text: "This map is locked and cannot be opened inside the editor.",
                    type: "error"
                });
                else if (d.nodes && 0 < d.nodes.length) {
                    b = 0 === a.tabletree.engineType.indexOf("N20") || 0 === a.tabletree.engineType.indexOf("N26");
                    var e = 0 === d.engineType.indexOf("N20") || 0 === d.engineType.indexOf("N26"),
                        g = 0 === a.tabletree.engineType.indexOf("N55-EWG") || 0 === a.tabletree.engineType.indexOf("N55-M2"),
                        m = 0 === d.engineType.indexOf("N55-M2") ||
                        0 === d.engineType.indexOf("N55-EWG"),
                        h = 0 === a.tabletree.engineType.indexOf("B58-F") || 0 === a.tabletree.engineType.indexOf("B58-G"),
                        k = 0 === d.engineType.indexOf("B58-F") || 0 === d.engineType.indexOf("B58-G"),
                        l = 0 === a.tabletree.engineType.indexOf("B58-T0"),
                        n = 0 === d.engineType.indexOf("B58-T0"),
                        q = 0 === a.tabletree.engineType.indexOf("B58-T0-C"),
                        u = 0 === d.engineType.indexOf("B58-T0-C"),
                        r = 0 === a.tabletree.engineType.indexOf("B58-T0-D"),
                        p = 0 === d.engineType.indexOf("B58-T0-D"),
                        x = 0 === a.tabletree.engineType.indexOf("S55"),
                        v = 0 === d.engineType.indexOf("S55"),
                        t = 0 === a.tabletree.engineType.indexOf("S58-1"),
                        F = 0 === d.engineType.indexOf("S58-1"),
                        w = 0 === a.tabletree.engineType.indexOf("S58-2");
                    d.engineType.indexOf("S58-2");
                    var y = 0 === a.tabletree.engineType.indexOf("S63T4-1"),
                        z = 0 === d.engineType.indexOf("S63T4-1"),
                        A = 0 === a.tabletree.engineType.indexOf("S63T4-2"),
                        B = 0 === d.engineType.indexOf("S63T4-2");
                    if (a.tabletree.engineType !== d.engineType) {
                        if (!b || !e)
                            if (!g || !m)
                                if (!h || !k)
                                    if (!l || !n)
                                        if (!q || !u)
                                            if (!r || !p)
                                                if (!x || !v)
                                                    if (!t || !F)
                                                        if (!w || !w)
                                                            if (!y ||
                                                                !z)
                                                                if (!A || !B) {
                                                                    c.swal({
                                                                        title: "Warning - Not compatible!",
                                                                        text: "The map you're importing isn't compatible with the currently open map and there may be issues during import. Are you sure you'd like to proceed with this import?",
                                                                        type: "warning",
                                                                        clickOutsideToClose: !1,
                                                                        showCancelButton: !0,
                                                                        showConfirmButton: !0
                                                                    }, function(a) {
                                                                        a && f.proceedWithImport(d)
                                                                    });
                                                                    return
                                                                }
                    } else {
                        if (a.tabletree.romVersion !== d.romVersion && !a.tabletree.structSharingActive) {
                            c.swal({
                                title: "Warning!",
                                text: "The map you're importing isn't compatible with the currently open map and there may be issues during import. Are you sure you'd like to proceed with this import?",
                                type: "warning",
                                clickOutsideToClose: !1,
                                showCancelButton: !0,
                                showConfirmButton: !0
                            }, function(a) {
                                a && f.proceedWithImport(d)
                            });
                            return
                        }
                        if (a.tabletree.engineLong !== d.engineLong) {
                            c.swal({
                                title: "Warning - Not compatible!",
                                text: "The map you're importing isn't compatible with the currently open map and there may be issues during import. Are you sure you'd like to proceed with this import?",
                                type: "warning",
                                clickOutsideToClose: !1,
                                showCancelButton: !0,
                                showConfirmButton: !0
                            }, function(a) {
                                a && f.proceedWithImport(d)
                            });
                            return
                        }
                    }
                    f.proceedWithImport(d)
                } else c.swal({
                    title: "Error",
                    text: "This map's software version is not supported by the editor at this time.",
                    type: "error"
                })
            }, function(a) {
                c.swal({
                    title: "Error",
                    text: "Failed getting table data. Please contact support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            }))
    };
    f.loadCompareData = _.debounce(f.loadCompareData, 300, !0);
    f.proceedWithImport = function(b) {
        f.compareRoot = b;
        var d = [],
            e = null,
            g = null,
            m;
        for (m in b.tableData) g = b.tableData[m], (e = a.tabletree.tableData[m]) ? e.def.columns !== g.def.columns || e.def.rows !== g.def.rows || e.def.hasYAxis &&
            e.def.columns !== g.def.columns || e.def.hasXAxis && e.def.rows !== g.def.rows ? g.invalid = !0 : !f.compareTableData(g, e) && 0 > d.indexOf(m) && d.push(g) : g.missing = !0;
        0 < d.length ? (a.importMapTablesGrid.gridOptions.data = [], c.close(), n.show({
                controller: ["$scope", "$mdDialog", function(a, b) {
                    a.cancel = function() {
                        b.hide()
                    };
                    a.answer = function() {
                        0 === a.selectedTablesForImport.length ? c.swal({
                            title: "None selected",
                            text: "No tables selected for import. You can hit cancel on the tables listing to cancel the import.",
                            type: "info"
                        }) : (b.hide(),
                            a.doImport())
                    }
                }],
                templateUrl: "templates/mapEdit-importTables.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: null,
                controllerAs: "ctrl",
                preserveScope: !0,
                clickOutsideToClose: !1,
                scope: a,
                fullscreen: !0,
                onComplete: function() {
                    a.importMapTablesGrid.gridOptions.data = d;
                    a.importMapTablesGrid.gridApi.grid.modifyRows(a.importMapTablesGrid.gridOptions.data);
                    a.importMapTablesGrid.gridOptions.data.forEach(function(b, c) {
                        b.def.core && a.importMapTablesGrid.gridApi.selection.selectRow(a.importMapTablesGrid.gridOptions.data[c])
                    })
                }
            })) :
            c.swal({
                title: "No Changes",
                text: "There are no differences between maps.",
                type: "info"
            })
    };
    f.isNumeric = function(a) {
        return !isNaN(parseFloat(a)) && isFinite(a)
    };
    f.isAlpha = function(a) {
        return /[a-zA-Z]/.test(a)
    };
    f.isAllowedKey = function(a) {
        var b = a.key;
        return a.metaKey || a.ctrlKey || f.isNumeric(b) || "Enter" === b || "Backspace" === b || "Delete" === b || "Esc" === b || "ArrowUp" === b || "ArrowDown" === b || "ArrowLeft" === b || "ArrowRight" === b || "." === b || "-" === b
    };
    f.destroyView = function() {
        a.stopDash();
        A.freezeAllScrolls(!1);
        B.canDragContent(!0);
        a.editor = !1;
        f.doCloseMap();
        K();
        L();
        f.hot && (f.hot = []);
        f.hotHAxis && (f.hotHAxis = []);
        f.hotVAxis && (f.hotVAxis = []);
        M && window.removeEventListener("beforeunload", M)
    };
    a.$on("$destroy", f.destroyView);
    a.$on("$ionicView.beforeLeave", f.destroyView);
    a.$on("$stateChangeStart", function(b) {
        a.dirty && !confirm("You have changes that haven't been committed and saved in this map. Are you sure you want to exit without saving?") ? b.preventDefault() : 0 < a.commited && !confirm("You have changes that haven't been saved in this map. Are you sure you want to exit without saving?") &&
            b.preventDefault()
    });
    a.isIE = function() {
        var a = navigator.userAgent;
        return -1 < a.indexOf("MSIE ") || -1 < a.indexOf("Trident/")
    };
    a.flashOptions = function() {
        if (g.VIN) {
            if (!(g.clientSession && a.map && a.map.vin && a.map.vin === g.clientSession.vin && g.VIN === a.map.vin)) {
                if (!a.tuneReq) {
                    c.swal({
                        title: "Tune Request Not Open",
                        text: "To flash maps from editor you need to open an existing Tune Request and connect to the vehicle matching it. If you're tuning a customer vehicle ask them to send you a Tune Request from their user account's My Maps screen to get started.",
                        type: "error"
                    });
                    return
                }
                if (a.tuneReq.mapRequest.vin !== g.VIN) {
                    c.swal({
                        title: "Vehicle Mismatch",
                        text: "Currently open Tune Request does not match the vehicle connected. If you're tuning a customer vehicle ask them to send you a Tune Request from their user account's My Maps screen to get started.",
                        type: "error"
                    });
                    return
                }
            }
            g.isAuthorizedTuner() ? a.tuneReq || g.clientSession || g.clientSession.vin ? 0 < a.commited && a.dirty ? l.toast("You have unsaved/uncommitted changes. You need to revert or commit/save them prior to flashing the map.") :
                a.isIE() ? c.swal({
                    title: "Warning",
                    text: "Internet Explorer should not be used with bootmod3. Use Google Chrome or Firefox instead.",
                    type: "warning"
                }) : a.checkAccess() && p.show({
                    templateUrl: "templates/flashMapBottomSheet.html",
                    controller: "FlashCtrl",
                    preserveScope: !0,
                    scope: a
                }) : c.swal({
                    title: "Flash Limited Access",
                    text: "Your account is an Authorized Tuner account. However, it has no VIN registration and is limited to flashing vehicles for which you receive a Tune Request. To proceed, inquire with the customer send you a Tune Request from their user account and open the Tune Request in the Editor and flash it. To flash maps you uploaded as raw BIN files under My Maps for testing on your own vehicle you need register your VIN in this account.",
                    type: "error"
                }) : c.swal({
                    title: "Tuner Access",
                    text: "To enable flashing from the map editor you need to register as a bootmod3 tuner. Please check the User Manual or contact Tech Support.",
                    type: "warning"
                })
        } else c.swal({
            title: "No Vehicle Connected",
            text: "Connect to the vehicle to start programming.",
            type: "error"
        })
    };
    a.showHotKeys = function() {
        n.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-shortcuts.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: null,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !1,
            multiple: !0
        })
    };
    a.map = d.selectedMap ? d.selectedMap : null;
    a.mapSelected = null;
    a.tuneReq = d.tuneReq;
    a.importMap = null;
    a.mapsGrid = {
        gridOptions: {
            enableSelectAll: !1,
            enableRowSelection: !0,
            enableRowHeaderSelection: !0,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            multiselect: !0,
            enableFiltering: !0,
            enableColumnResizing: !0,
            enableGridMenu: !0,
            noUnselect: !1,
            columnDefs: [{
                name: "Map Name",
                width: 300,
                field: "name",
                filter: {
                    placeholder: "filter on any column...",
                    flags: {
                        caseSensitive: !1
                    }
                }
            }, {
                name: "Engine Type",
                field: "engineTypeExpanded",
                width: 80
            }, {
                name: "ROM",
                field: "romVersion",
                width: 80
            }, {
                name: "Updated Date",
                field: "uDate",
                width: 200,
                type: "date",
                sort: {
                    direction: y.ASC,
                    priority: 1
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "Created Date",
                field: "cDate",
                width: 200,
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 2
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "Description",
                field: "desc",
                width: "*",
                cellTooltip: function(a, b) {
                    return a.entity.desc
                }
            }],
            rowTemplate: '\x3cdiv ng-dblclick\x3d"grid.appScope.mapsRowDblClick(row)"  ng-repeat\x3d"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class\x3d"ui-grid-cell" ng-class\x3d"{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell\x3e\x3c/div\x3e',
            onRegisterApi: function(b) {
                a.mapsGrid.gridApi = b
            }
        }
    };
    a.deleteSelectedMaps = function(b) {
        var d = b;
        d || (d = a.mapsGrid.gridApi.selection.getSelectedRows());
        0 === d.length ? l.toast("Select a map in the list to delete.") : a.map && _.findWhere(d, {
            id: a.map.id
        }) ? (b = "You've selected the currently open map for deletion. Are you sure you'd like to proceed?", 1 < d.length && (b = "Currently open map is one of the selected for deletion. Are you sure you'd like to delete it along with others selected?"), c.swal({
            title: "Delete?",
            text: b,
            type: "warning",
            showCancelButton: !0
        }, function(b) {
            b && (f.doCloseMap(), a.doDelete(d))
        })) : c.swal({
            title: "Confirm",
            text: "Are you sure you want to remove this map?",
            type: "warning",
            confirmButtonText: "Remove",
            closeOnConfirm: !0,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(a) {
            a && f.doDelete(d)
        })
    };
    f.doDelete = function(b) {
        if (0 < b.length) {
            c.swal({
                title: "Please wait..",
                text: "Removing " + b.length + " maps selected...",
                type: "warning",
                showConfirmButton: !1,
                showCancelButton: !1
            });
            var d = [];
            _.each(b, function(a) {
                a = _.pick(a,
                    "id");
                d.push(a)
            });
            r({
                method: "POST",
                url: WS_BASE_URL + "/removemaps",
                data: {
                    maps: d
                }
            }).then(function(b) {
                a.reloadMaps()
            }, function(a) {
                c.swal({
                    title: "Error",
                    text: "Failed to remove maps, please try again.",
                    type: "error"
                })
            })
        }
    };
    a.openSelectedMap = function() {
        var b = a.mapsGrid.gridApi.selection.getSelectedRows();
        0 === b.length ? l.toast("Select a map in the list to open or double click on it.") : 1 < b.length ? l.toast("You've selected more than one map. Select a single map to open or double click on it in the list.") : a.mapsRowDblClick({
            entity: b[0]
        })
    };
    a.mapsRowDblClick = function(b) {
        a.mapSelected = b.entity;
        a.map || a.tuneReq ? (n.hide(), n.show({
            controller: "ConfirmOpenCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-confirmOpenMap.html",
            parent: angular.element(document.body),
            targetEvent: null,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !1,
            multiple: !0
        })) : (n.hide(), a.doOpen())
    };
    a.freeMapsGrid = {
        gridOptions: {
            enableSelectAll: !1,
            enableRowSelection: !0,
            enableRowHeaderSelection: !1,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            multiselect: !1,
            paginationPageSize: 25,
            enablePaginationControls: !0,
            enableFiltering: !0,
            enableColumnResizing: !0,
            enableGridMenu: !0,
            multiSelect: !1,
            noUnselect: !0,
            columnDefs: [{
                name: "Map Name",
                width: 300,
                field: "name",
                filter: {
                    placeholder: "filter on any column...",
                    flags: {
                        caseSensitive: !1
                    }
                }
            }, {
                name: "Engine Type",
                field: "engineTypeExpanded",
                width: 80
            }, {
                name: "ROM",
                field: "romVersion",
                width: 80
            }, {
                name: "Updated Date",
                field: "uDate",
                width: 200,
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 1
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "Created Date",
                field: "cDate",
                width: 200,
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 2
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "Description",
                field: "desc",
                width: "*",
                cellTooltip: function(a, b) {
                    return a.entity.desc
                }
            }],
            rowTemplate: '\x3cdiv ng-dblclick\x3d"grid.appScope.freeMapsRowDblClick(row)"  ng-repeat\x3d"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class\x3d"ui-grid-cell" ng-class\x3d"{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell\x3e\x3c/div\x3e',
            onRegisterApi: function(b) {
                a.freeMapsGrid.gridApi =
                    b
            }
        }
    };
    a.freeMapsRowDblClick = function(b) {
        a.mapSelected = b.entity;
        a.map || a.tuneReq ? f.checkIfMapImportPossible(b.entity) ? confirm && (n.hide(), a.importMap = b.entity, f.loadCompareData()) : c.swal({
                title: "Warning",
                text: "Map selected has a different engine type than the currently open map. Importing it is not recommended or safe operation. Are you sure you'd like to proceed?",
                type: "warning",
                clickOutsideToClose: !1,
                showCancelButton: !0,
                showConfirmButton: !0
            }, function(c) {
                c && (n.hide(), a.importMap = b.entity, f.loadCompareData())
            }) :
            (n.hide(), c.swal({
                title: "No map open",
                text: "System provided (Free) maps can only be imported to other maps or tune requests. They cannot be opened for editing as they're just reference maps. You need to open another map or tune request first and then import one of the free reference maps.",
                type: "error"
            }))
    };
    a.tuneReqRowDblClick = function(b) {
        a.mapSelected = b.entity.map;
        a.tuneReqSelected = b.entity;
        a.map || a.tuneReq ? (n.hide(), n.show({
            controller: "ConfirmOpenCtrl",
            controllerAs: "ctrl",
            templateUrl: "templates/mapEdit-confirmOpenTuneReq.html",
            parent: angular.element(document.body),
            targetEvent: null,
            preserveScope: !0,
            clickOutsideToClose: !1,
            scope: a,
            fullscreen: !1,
            multiple: !0
        })) : (n.hide(), a.doOpenTuneReq())
    };
    a.tuneReqsGrid = {
        gridOptions: {
            enableSelectAll: !1,
            enableRowSelection: !0,
            enableRowHeaderSelection: !1,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            multiselect: !1,
            paginationPageSize: 25,
            enablePaginationControls: !0,
            enableFiltering: !0,
            enableColumnResizing: !0,
            enableGridMenu: !0,
            multiSelect: !1,
            noUnselect: !0,
            columnDefs: [{
                name: "Customer Email",
                field: "user.email",
                filter: {
                    placeholder: "filter on any column...",
                    flags: {
                        caseSensitive: !1
                    }
                },
                width: 250,
                cellTemplate: '\x3cdiv\x3e\x3cspan class\x3d"button button-smallest button-dark ion-information-circled" title\x3d"View tune request details" ng-click\x3d"grid.appScope.showRequestDetails(null, row.entity)"\x3e\x3c/span\x3e\x3cspan class\x3d"button button-smallest button-dark ion-ios-person-outline" title\x3d"View customer comments" ng-click\x3d"grid.appScope.showCustomerComments(null, row.entity, true)"\x3e\x3c/span\x3e\x3cspan\x3e{{row.entity.user.email}}\x3c/span\x3e\x3c/div\x3e'
            }, {
                name: "VIN",
                field: "map.vin",
                width: 200,
                groupPriority: 0
            }, {
                name: "Map Name",
                field: "map.name",
                width: 250
            }, {
                name: "Engine Type",
                field: "map.engineTypeExpanded",
                width: 80
            }, {
                name: "ROM",
                field: "map.romVersion",
                width: 80
            }, {
                name: "Status",
                field: "mapRequest.status",
                width: 100,
                filter: {
                    type: y.filter.SELECT,
                    selectOptions: [{
                        value: "REQUESTED",
                        label: "Requested"
                    }, {
                        value: "IN_PROGRESS",
                        label: "In Progress"
                    }, {
                        value: "COMMENTED",
                        label: "Commented"
                    }, {
                        value: "FLASH_READY",
                        label: "Flash Ready"
                    }, {
                        value: "COMPLETED",
                        label: "Completed"
                    }, {
                        value: "DOWNLOADED",
                        label: "Downloaded"
                    }]
                }
            }, {
                name: "Update Date",
                field: "mapRequest.respondedDate",
                width: 200,
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 1
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "In Progress Date",
                field: "mapRequest.inProgressDate",
                width: 200,
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 2
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "Created Date",
                field: "mapRequest.createdDate",
                width: 200,
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 3
                },
                sortingAlgorithm: f.dateSorter
            }, {
                name: "Description",
                field: "map.desc",
                width: "*",
                cellTooltip: function(a,
                    b) {
                    return a.entity.map.desc
                }
            }],
            rowTemplate: '\x3cdiv ng-keypress\x3d"if ($event.which \x3d\x3d\x3d 13) grid.appScope.tuneReqRowDblClick(row)" ng-dblclick\x3d"grid.appScope.tuneReqRowDblClick(row)"  ng-repeat\x3d"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class\x3d"ui-grid-cell" ng-class\x3d"{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell\x3e\x3c/div\x3e',
            onRegisterApi: function(b) {
                a.tuneReqsGrid.gridApi = b
            }
        }
    };
    a.logRowDblClick = function(b) {
        a.selectedLog =
            b.entity;
        a.logView(b)
    };
    a.logsGrid = {
        gridOptions: {
            enableSelectAll: !1,
            enableRowSelection: !0,
            enableRowHeaderSelection: !1,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            multiselect: !1,
            paginationPageSize: 25,
            enablePaginationControls: !0,
            enableFiltering: !0,
            enableColumnResizing: !0,
            enableGridMenu: !0,
            multiSelect: !1,
            noUnselect: !0,
            columnDefs: [{
                name: "Log Name",
                field: "name",
                filter: {
                    placeholder: "filter on any column...",
                    flags: {
                        caseSensitive: !1
                    }
                },
                cellTemplate: '\x3cdiv\x3e\x3cspan class\x3d"button button-smallest button-positive" title\x3d"View Log Chart" ng-click\x3d"grid.appScope.logView(row)"\x3eChart\x3c/span\x3e \x3cspan class\x3d"button button-smallest button-energized" title\x3d"View Log Chart" ng-click\x3d"grid.appScope.logCsv(row)"\x3eCSV\x3c/span\x3e \x3cspan class\x3d"button button-smallest button-calm" title\x3d"Link Log Chart" ng-click\x3d"grid.appScope.logLink(row)"\x3eLink\x3c/span\x3e \x3cspan\x3e{{row.entity.name}}\x3c/span\x3e\x3c/div\x3e'
            }, {
                name: "VIN",
                field: "vin",
                width: 200
            }, {
                name: "Duration (s)",
                field: "duration",
                width: 200,
                cellTemplate: "\x3cdiv\x3e{{row.entity.duration}} secs\x3c/div\x3e"
            }, {
                name: "Created Date",
                field: "createdDate",
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 0
                },
                sortingAlgorithm: f.dateSorter
            }],
            rowTemplate: '\x3cdiv ng-keypress\x3d"if ($event.which \x3d\x3d\x3d 13) grid.appScope.logRowDblClick(row)" ng-dblclick\x3d"grid.appScope.logRowDblClick(row)"  ng-repeat\x3d"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class\x3d"ui-grid-cell" ng-class\x3d"{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell\x3e\x3c/div\x3e',
            onRegisterApi: function(b) {
                a.logsGrid.gridApi = b
            }
        }
    };
    a.logView = function(b) {
        a.selectedLog = b.entity;
        a.logAction("graph")
    };
    a.logCsv = function(b) {
        a.selectedLog = b.entity;
        a.logAction("download")
    };
    a.logLink = function(b) {
        a.selectedLog = b.entity;
        a.logAction("link")
    };
    a.logAction = function(b, d) {
        a.selectedAction = b;
        a.selectedEvent = d;
        if ("rename" === b) n.show({
            controller: "LogRenameController",
            templateUrl: "templates/log-rename.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: d,
            clickOutsideToClose: !1,
            scope: a,
            preserveScope: !0,
            fullscreen: !0
        });
        else if (g.offlineMode || a.selectedLog.offline) z.send("/app/getlog", a.selectedLog, {
            jwt: g.get("token")
        });
        else if (b = "https://www.bootmod3.net/log?id\x3d" + a.selectedLog.id, "link" === a.selectedAction) a.showShareLogDialog(b, d);
        else if ("download" === a.selectedAction) window.ignoreOpenWindow = !0, g.openLink("https://www.bootmod3.net/dlog?id\x3d" + a.selectedLog.id, !0), window.ignoreOpenWindow = !1;
        else if (g.native)(d = a.selectedLog.name) && 0 !== d.trim().length || (d = "bootmod3 datalog"), c.swal({
            title: "Graphing..",
            text: "Generating chart for " + d + " please wait..",
            type: "info"
        }), r({
            method: "POST",
            url: WS_BASE_URL + "/getlog",
            data: {
                id: a.selectedLog.id
            }
        }).then(function(b) {
            a.showGraph(b.data)
        }, function(a) {
            c.swal({
                title: "Failed",
                text: "Get log request failed. Please try again.",
                type: "error",
                confirmButtonClass: "btn-error"
            })
        });
        else {
            var e = window.open(b);
            e && !e.closed && "undefined" != typeof e.closed || a.showShareLogDialog(b, d)
        }
    };
    a.showShareLogDialog = function(b, c) {
        a.logURL = b;
        n.show({
            controller: "ShareLinkController",
            templateUrl: "templates/share-link.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: c,
            clickOutsideToClose: !0,
            scope: a,
            preserveScope: !0,
            fullscreen: !0,
            hasBackdrop: !0,
            multiple: !0
        })
    };
    a.logsLocalGrid = {
        gridOptions: {
            enableSelectAll: !1,
            enableRowSelection: !0,
            enableRowHeaderSelection: !1,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            multiselect: !1,
            paginationPageSize: 25,
            enablePaginationControls: !0,
            enableFiltering: !0,
            enableColumnResizing: !0,
            enableGridMenu: !0,
            multiSelect: !1,
            noUnselect: !0,
            columnDefs: [{
                name: "CSV Log Name",
                field: "name",
                filter: {
                    placeholder: "filter on any column...",
                    flags: {
                        caseSensitive: !1
                    }
                },
                cellTemplate: '\x3cdiv\x3e\x3cspan class\x3d"button button-smallest button-positive" title\x3d"View Log Chart" ng-click\x3d"grid.appScope.logLocalView(row)"\x3eChart\x3c/span\x3e \x3cspan class\x3d"button button-smallest button-energized" title\x3d"View Log Chart" ng-click\x3d"grid.appScope.logLocalCsv(row)"\x3eCSV\x3c/span\x3e \x3cspan class\x3d"button button-smallest button-calm" title\x3d"Link Log Chart" ng-click\x3d"grid.appScope.logLocalLink(row)"\x3eLink\x3c/span\x3e \x3cspan\x3e{{row.entity.name}}\x3c/span\x3e\x3c/div\x3e'
            }, {
                name: "VIN",
                field: "vin",
                width: 200
            }, {
                name: "Duration (s)",
                field: "duration",
                width: 200,
                cellTemplate: "\x3cdiv\x3e{{row.entity.duration}} secs\x3c/div\x3e"
            }, {
                name: "Created Date",
                field: "createdDate",
                type: "date",
                sort: {
                    direction: y.DESC,
                    priority: 0
                },
                sortingAlgorithm: f.dateSorter
            }],
            rowTemplate: '\x3cdiv ng-keypress\x3d"if ($event.which \x3d\x3d\x3d 13) grid.appScope.logLocalRowDblClick(row)" ng-dblclick\x3d"grid.appScope.logLocalRowDblClick(row)"  ng-repeat\x3d"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class\x3d"ui-grid-cell" ng-class\x3d"{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell\x3e\x3c/div\x3e',
            onRegisterApi: function(b) {
                a.logsLocalGrid.gridApi = b
            }
        }
    };
    a.logLocalRowDblClick = function(b) {
        a.selectedLog = b.entity;
        a.logLocalView(b)
    };
    a.logLocalView = function(b) {
        a.selectedLog = b.entity;
        a.logAction("graph")
    };
    a.logLocalCsv = function(b) {
        a.selectedLog = b.entity;
        a.logAction("download")
    };
    a.logLocalLink = function(b) {
        a.selectedLog = b.entity;
        a.logAction("link")
    };
    a.availableMaps = [];
    a.availableTuneRequests = [];
    a.commited = 0;
    a.dirtyTablesCount = 0;
    a.tuners = [];
    f.hot = [];
    f.hotHAxis = [];
    f.hotVAxis = [];
    f.originalData = [];
    f.originalDataHAxis = [];
    f.originalDataVAxis = [];
    f.currentData = [];
    f.currentDataHAxis = [];
    f.currentDataVAxis = [];
    f.selectedMapVersions = [];
    f.dateSorter = function(a, b, c) {
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        c = moment(a);
        if (!c.isValid()) return console.log("Invalid date: ", a), -1;
        a = moment(b);
        return c.isValid() ? c.isSame(a) ? 0 : c.isBefore(a) ? -1 : 1 : (console.log("Invalid date: ", b), -1)
    };
    a.gridOptions = {
        enableRowSelection: !0,
        enableSelectAll: !1,
        selectionRowHeaderWidth: 25,
        rowHeight: 25,
        showGridFooter: !0,
        multiselect: !1,
        enableColumnResizing: !0,
        columnDefs: [{
            name: "Date",
            field: "cDate",
            sort: {
                direction: y.DESC,
                priority: 1
            },
            sortingAlgorithm: f.dateSorter
        }, {
            name: "Version Comments",
            field: "versionComments"
        }, {
            name: "Map Version",
            field: "id"
        }, {
            name: "Map Description",
            field: "desc",
            cellTooltip: function(a, b) {
                return a.entity.desc
            }
        }],
        onRegisterApi: function(b) {
            a.gridApi = b;
            a.gridApi.selection.on.rowSelectionChanged(a, function(b) {
                var c = a.gridApi.selection.getSelectedRows();
                2 < c.length ? (l.toast("Only two versions can be selected at the same time for comparison."),
                    b.setSelected(!1)) : f.selectedMapVersions = c
            })
        }
    };
    a.importMapTablesGrid = {
        gridOptions: {
            enableRowSelection: !0,
            enableSelectAll: !0,
            enableFiltering: !0,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            columnDefs: [{
                name: "Table Name",
                width: "*",
                minWidth: 600,
                field: "def.name",
                filter: {
                    placeholder: "filter on any column...",
                    flags: {
                        caseSensitive: !1
                    }
                },
                sort: {
                    direction: y.ASC,
                    priority: 0
                },
                cellTooltip: function(a, b) {
                    return a.entity.def.name + ": " + htmlToPlaintext(a.entity.def.desc)
                }
            }, {
                name: "Size",
                field: "def",
                width: 100,
                cellTemplate: "\x3cdiv\x3e{{row.entity.def.rows}}x{{row.entity.def.columns}}\x3c/div\x3e",
                filter: {
                    condition: function(a, b) {
                        return 0 <= (b.rows + "x" + b.colums).trim().toLowerCase().indexOf(a)
                    }
                }
            }, {
                name: "Table Type",
                field: "def.core",
                width: 150,
                cellTemplate: '\x3cdiv\x3e{{row.entity.def.core?"Core Table":"Related Table"}}\x3c/div\x3e',
                filter: {
                    type: y.filter.SELECT,
                    selectOptions: [{
                        value: !0,
                        label: "Only Core Tables"
                    }, {
                        value: !1,
                        label: "Only Related Tables"
                    }],
                    condition: function(a, b) {
                        return a ? a ? !0 === b : !0 : _.isUndefined(b) ||
                            !1 === b
                    }
                }
            }, {
                name: "Map ID",
                field: "def.id",
                width: 200
            }],
            onRegisterApi: function(b) {
                a.importMapTablesGrid.gridApi = b;
                a.importMapTablesGrid.gridApi.selection.on.rowSelectionChanged(a, function(b) {
                    a.selectedTablesForImport = a.importMapTablesGrid.gridApi.selection.getSelectedRows()
                });
                a.importMapTablesGrid.gridApi.selection.on.rowSelectionChangedBatch(a, function(b) {
                    a.selectedTablesForImport = a.importMapTablesGrid.gridApi.selection.getSelectedRows()
                })
            }
        }
    };
    a.saveMapTablesGrid = {
        gridOptions: {
            enableRowSelection: !0,
            enableSelectAll: !0,
            enableFiltering: !0,
            selectionRowHeaderWidth: 25,
            rowHeight: 25,
            showGridFooter: !0,
            data: [],
            columnDefs: [{
                name: "Table Name",
                width: "*",
                minWidth: 600,
                field: "def.name",
                filter: {
                    placeholder: "filter on any column...",
                    flags: {
                        caseSensitive: !1
                    }
                },
                sort: {
                    direction: y.ASC,
                    priority: 0
                },
                cellTemplate: "\x3cdiv class\x3d\"tname\" ng-class\x3d\"{'dirty':row.entity.dirty, 'commited':row.entity.commited}\"\x3e{{row.entity.name}}\x3c/div\x3e",
                cellTooltip: function(a, b) {
                    return a.entity.def.name + ": " + htmlToPlaintext(a.entity.def.desc)
                }
            }, {
                name: "Size",
                field: "def",
                width: 100,
                cellTemplate: "\x3cdiv\x3e{{row.entity.def.rows}}x{{row.entity.def.columns}}\x3c/div\x3e",
                filter: {
                    condition: function(a, b) {
                        return 0 <= (b.rows + "x" + b.colums).trim().toLowerCase().indexOf(a)
                    }
                }
            }, {
                name: "Table Type",
                field: "def.core",
                width: 150,
                cellTemplate: '\x3cdiv\x3e{{row.entity.def.core?"Core Table":"Related Table"}}\x3c/div\x3e',
                filter: {
                    type: y.filter.SELECT,
                    selectOptions: [{
                        value: !0,
                        label: "Only Core Tables"
                    }]
                }
            }],
            onRegisterApi: function(b) {
                a.saveMapTablesGrid.gridApi = b;
                a.saveMapTablesGrid.gridApi.selection.on.rowSelectionChanged(a,
                    function(b) {
                        a.selectedTablesForSave = a.saveMapTablesGrid.gridApi.selection.getSelectedRows()
                    });
                a.saveMapTablesGrid.gridApi.selection.on.rowSelectionChangedBatch(a, function(b) {
                    a.selectedTablesForSave = a.saveMapTablesGrid.gridApi.selection.getSelectedRows()
                })
            }
        }
    };
    a.collapseAll = function() {
        a.initEditorTreeWidget()
    };
    a.searchFilterText = "";
    a.searchExactMatch = !1;
    a.searchOldName = !1;
    a.searchIncludeRelTables = !1;
    a.toggleFilter = function() {
        a.searchFilterText = "";
        a.searchIncludeRelTables = !1;
        a.searchExactMatch = !1;
        a.searchOldName = !1;
        a.showSearchFilter = !a.showSearchFilter;
        a.showSearchFilter ? x(function() {
            document.getElementById("searchField").focus()
        }, 0, !0) : (f.tree.unfilter(), a.collapseAll())
    };
    f.openParents = function(a) {
        f.doOpenParents(a)
    };
    f.doOpenParents = function(a) {
        for (a = a.parent; a;) a.state.open || a.extId && !a.rel || f.tree.openNode(a, {
            silent: !0
        }), a = a.parent
    };
    a.searchTree = function(a) {
        x(function() {
            f.doSearchTree(a)
        })
    };
    f.doSearchTree = function(b) {
        if (b && 27 === b.keyCode) a.toggleFilter();
        else {
            var c = document.getElementById("searchField");
            f.tree.filter(function(b) {
                if (b.parent && b.parent.rel && !a.filterChanged && !a.searchIncludeRelTables || !b.extId) return !1;
                var d = c.value,
                    e;
                e = b.name || "";
                var g = b.a2lId || "";
                a.searchOldName && b.nameOld && (e = b.nameOld || "");
                (e = a.searchExactMatch ? e.trim().toLowerCase() === d.trim().toLowerCase() : 0 <= e.toLowerCase().trim().indexOf(d.trim().toLowerCase())) || (e = 0 <= g.toLowerCase().trim().indexOf(d.trim().toLowerCase()));
                e && f.openParents(b);
                return e
            })
        }
    };
    var O = chroma.scale(["#0059ff", "#07f700", "#ffff00", "#ff4d48"]);
    a.replaceFile =
        null;
    a.dirty = !1;
    a.show3dTables = g.getForCurrUser("show3dTables", !1);
    a.search = !1;
    a.reloadMaps();
    a.reloadFreeMaps();
    a.loadTuners();
    a.reloadTuneReqs();
    g.pauseGauges();
    a.map ? f.loadData(!1) : a.open(null)
}]).filter("reverse", function() {
    return function(b) {
        if (b) return b.slice().reverse()
    }
}).controller("RequestTuneCtrl", ["$scope", "$mdDialog", "UI", "SweetAlert", "$http", "$ionicHistory", "$state", function(b, a, d, c, k, g, l) {
    function h(a) {
        var b = angular.lowercase(a);
        return function(a) {
            return a.name && -1 < a.name.toLowerCase().indexOf(b) ||
                a.companyName && -1 < a.companyName.toLowerCase().indexOf(b)
        }
    }
    var e = this;
    b.selectedTuner ? (e.tuners = [], e.tuners.push(b.selectedTuner)) : e.tuners = b.tuners;
    e.querySearch = function(a) {
        return a ? b.tuners.filter(h(a)) : b.tuners
    };
    b.mapName && (e.mapName = b.mapName);
    e.cancel = function(b) {
        a.hide()
    };
    e.finish = function(h) {
        e.mapName && 0 !== e.mapName.trim().length ? e.mapRequestDetail && 0 !== e.mapRequestDetail.trim().length ? (!e.selectedItem && b.selectedTuner && (e.selectedItem = b.selectedTuner), e.selectedItem ? (a.hide(), e.selectedItem.mapRequestDetail =
            e.mapRequestDetail, b.map && (e.selectedItem.mapId = b.map.id), e.selectedItem.name = e.mapName, c.swal({
                title: "Requesting..",
                text: "Please wait, sending tune request..",
                type: "warning",
                showCancelButton: !0,
                showConfirmButton: !1
            }), k({
                method: "POST",
                url: WS_BASE_URL + "/requestmap",
                data: e.selectedItem
            }).then(function(a) {
                b.reloadMaps && b.reloadMaps();
                c.swal({
                    title: "Success",
                    text: "Your tune request has been sent to your selected tuner. You will see the pending map request as a map under the My Maps listing.",
                    type: "success",
                    showCancelButton: !1,
                    showConfirmButton: !0
                }, function() {
                    g.clearCache().then(function() {
                        g.nextViewOptions({
                            disableBack: !0
                        });
                        l.go("bootmod3.maps", {}, {
                            reload: !0
                        })
                    })
                })
            }, function(a) {
                c.swal({
                    title: "Error",
                    text: "Failed to send tune request.",
                    type: "error"
                })
            })) : d.toast("You need to choose a tuner")) : d.toast("Comments cannot be blank") : d.toast("Map name cannot be blank")
    }
}]).controller("RequestSupportCtrl", ["$scope", "$mdDialog", "UI", "SweetAlert", "$http", "$ionicHistory", "$state", function(b, a, d, c, k, g, l) {
    function h(a) {
        var b =
            angular.lowercase(a);
        return function(a) {
            return a.name && -1 < a.name.toLowerCase().indexOf(b) || a.companyName && -1 < a.companyName.toLowerCase().indexOf(b)
        }
    }
    var e = this;
    b.selectedTuner ? (e.tuners = [], e.tuners.push(b.selectedTuner)) : e.tuners = b.tuners;
    e.querySearch = function(a) {
        return a ? b.tuners.filter(h(a)) : b.tuners
    };
    b.mapName && (e.mapName = b.mapName);
    e.cancel = function(b) {
        a.hide()
    };
    e.finish = function(h) {
        e.mapName && 0 !== e.mapName.trim().length ? e.mapRequestDetail && 0 !== e.mapRequestDetail.trim().length ? (!e.selectedItem &&
            b.selectedTuner && (e.selectedItem = b.selectedTuner), e.selectedItem = {}, a.hide(), e.selectedItem.mapRequestDetail = e.mapRequestDetail, e.selectedItem.mapId = b.map.id, e.selectedItem.name = e.mapName, c.swal({
                title: "Please wait..",
                text: "Sending support request to bootmod3 Tech Support at support@protuningfreaks.com",
                type: "warning",
                showCancelButton: !1,
                showConfirmButton: !1
            }), k({
                method: "POST",
                url: WS_BASE_URL + "/requestsupport",
                data: e.selectedItem
            }).then(function(a) {
                b.reloadMaps && b.reloadMaps();
                c.swal({
                    title: "Success",
                    text: "Your support request has now been sent to tech support. We'll review and be in touch shortly using your account's email address.",
                    type: "success",
                    showCancelButton: !1,
                    showConfirmButton: !0
                }, function() {
                    g.clearCache().then(function() {
                        g.nextViewOptions({
                            disableBack: !0
                        });
                        l.go("bootmod3.maps", {}, {
                            reload: !0
                        })
                    })
                })
            }, function(a) {
                c.swal({
                    title: "Error",
                    text: "Failed to send support request.",
                    type: "error"
                })
            })) : d.toast("Comments cannot be blank") : d.toast("Map name cannot be blank")
    }
}]).controller("RequestTunerSupportCtrl", ["$scope", "$mdDialog", "UI", "SweetAlert", "$http", "$ionicHistory", "$state", function(b, a, d, c, k, g, l) {
    var h = this;
    h.cancel = function(b) {
        a.hide()
    };
    h.finish = function(e) {
        h.editorRequestDetail && 0 !== h.editorRequestDetail.trim().length ? (!h.selectedItem && b.selectedTuner && (h.selectedItem = b.selectedTuner), h.selectedItem = {}, a.hide(), e = b.map.id, b.tuneReq && (e = b.tuneReq.map.id), h.selectedItem.editorRequestDetail = h.editorRequestDetail, h.selectedItem.mapId = e, h.selectedItem.name = b.map.name, c.swal({
            title: "Please wait..",
            text: "Sending support request to bootmod3 Tech Support at support@protuningfreaks.com",
            type: "warning",
            showCancelButton: !1,
            showConfirmButton: !1
        }), k({
            method: "POST",
            url: WS_BASE_URL + "/requesteditorsupport",
            data: h.selectedItem
        }).then(function(a) {
            c.swal({
                title: "Success",
                text: "Your editor support request has now been sent to tech support. We'll review and be in touch shortly using your account's email address.",
                type: "success",
                showCancelButton: !1,
                showConfirmButton: !0
            })
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed to send support request. Please try again or email us directly at support@protuningfreaks.com with the vehicle's VIN number or ROM version of the map you're working on.",
                type: "error"
            })
        })) : d.toast("Comments cannot be blank")
    }
}]).controller("ReleaseTuneCtrl", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", "$state", function(b, a, d, c, k, g, l) {
    b.releaseNotes = null;
    b.blockEditor = !0;
    b.blockExport = !0;
    b.skipNotify = !1;
    b.newDesc = b.map.desc;
    this.cancel = function() {
        g.hide()
    };
    this.release =
        function(c, d) {
            g.hide();
            a.swal({
                title: "Releasing..",
                text: "Please wait, releasing map for flash..",
                type: "warning",
                allowOutsideClick: !1,
                clickOutsideToClose: !1,
                showCancelButton: !1,
                showConfirmButton: !1
            });
            k({
                method: "POST",
                url: WS_BASE_URL + "/releasemap",
                data: {
                    mapId: b.map.id,
                    mapRequestId: b.map.mapRequestId,
                    description: b.releaseNotes,
                    blockEditor: b.blockEditor,
                    blockExport: b.blockExport,
                    newMapDesc: b.newDesc,
                    status: d ? "COMPLETED" : "FLASH_READY",
                    skipNotify: b.skipNotify
                }
            }).then(function(c) {
                b.reloadTuneReqs();
                a.swal({
                    title: "Success",
                    text: "Tune has been released back to the end user and they're now able to flash and test the map.",
                    type: "success"
                })
            }, function(b) {
                a.swal({
                    title: "Error",
                    text: "Failed to release tune request. Please try again or if the error persists contact support@protuningfreaks.com for assistance.",
                    type: "error"
                })
            })
        }
}]).controller("GenerateTuneCtrl", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", "$state", "$rootScope", function(b, a, d, c, k, g, l, h) {
    b.tuneReq = {
        name: "",
        vin: "",
        mapRequest: {
            mapRequestDetail: ""
        }
    };
    this.cancel = function() {
        g.hide()
    };
    b.$watch("VIN", function(a, c) {
        b.tuneReq.vin = h.VIN
    });
    this.generate = function(c, d) {
        g.hide();
        a.swal({
            title: "Requesting..",
            text: "Please wait, generating tune request to self for vin " + b.tuneReq.vin,
            type: "warning",
            showCancelButton: !1,
            showConfirmButton: !1
        });
        k({
            method: "POST",
            url: WS_BASE_URL + "/gentunereq",
            data: b.tuneReq
        }).then(function(c) {
            b.reloadMaps && b.reloadMaps();
            a.swal({
                title: "Success",
                text: "Tune request generated and notification sent to customer over email. Once they approve it in their email you'll see the Tune Request show up under the Tune Requests tab and you can get started..",
                type: "success",
                showCancelButton: !1,
                showConfirmButton: !0
            })
        }, function(b) {
            a.swal({
                title: "Error",
                text: "Failed to generate tune request.",
                type: "error"
            })
        });
        k({
            method: "POST",
            url: WS_BASE_URL + "/releasemap",
            data: {
                mapId: b.map.id,
                mapRequestId: b.map.mapRequestId,
                description: b.releaseNotes,
                blockEditor: b.blockEditor,
                blockExport: b.blockExport,
                newMapDesc: b.newDesc,
                status: d ? "COMPLETED" : "FLASH_READY",
                skipNotify: b.skipNotify
            }
        }).then(function(c) {
            b.reloadTuneReqs();
            a.swal({
                title: "Success",
                text: "Tune has been released back to the end user and they're now able to flash and test the map.",
                type: "success"
            })
        }, function(b) {
            a.swal({
                title: "Error",
                text: "Failed to release tune request. Please try again or if the error persists contact support@protuningfreaks.com for assistance.",
                type: "error"
            })
        })
    }
}]).controller("ReleaseTuneWithBinCtrl", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", "$state", function(b, a, d, c, k, g, l) {
    b.releaseNotes = null;
    b.blockEditor = !0;
    b.blockExport = !0;
    b.skipNotify = !1;
    b.binData = null;
    b.fileName = null;
    b.newDesc = b.map.desc;
    b.readFile = function(a) {
        a.file(function(a) {
            var c =
                new FileReader;
            c.onload = function(a) {
                b.binData = "base64," + encode(a.target.result);
                d.toast("File is ready for upload");
                b.$apply()
            };
            c.readAsArrayBuffer(a)
        }, function(a) {})
    };
    b.selectFile = function() {
        window.cordova && "iOS" === device.platform ? window.FilePicker.pickFile(function(a) {
                d.toast("Reading selected file..");
                var c = a.lastIndexOf("/"),
                    c = a.substring(c + 1);
                b.fileName = c;
                b.$apply();
                window.resolveLocalFileSystemURL("file://" + a, b.readFile, function(a) {
                    d.toast("Failed reading file " + a)
                })
            }, function(a) {}, "public.data") :
            document.getElementsByName("binFile") && document.getElementsByName("binFile")[0].click()
    };
    b.fileNameChanged = function(a) {
        var c = new FileReader;
        c.onload = function() {
            b.binData = c.result;
            b.$apply()
        };
        b.fileName = a.files[0].name;
        c.readAsDataURL(a.files[0])
    };
    this.cancel = function() {
        g.hide()
    };
    this.release = function(c, d) {
        g.hide();
        a.swal({
            title: "Releasing..",
            text: "Please wait, replacing tune request data with raw BIN file contents...",
            type: "warning",
            allowOutsideClick: !1,
            clickOutsideToClose: !1,
            showCancelButton: !1,
            showConfirmButton: !1
        });
        k({
            method: "POST",
            url: WS_BASE_URL + "/releasebinmap",
            data: {
                mapId: b.map.id,
                mapRequestId: b.map.mapRequestId,
                description: b.releaseNotes,
                blockEditor: b.blockEditor,
                blockExport: b.blockExport,
                newMapDesc: b.newDesc,
                status: d ? "COMPLETED" : "FLASH_READY",
                skipNotify: b.skipNotify,
                binData: b.binData
            }
        }).then(function(c) {
            a.swal({
                title: "Success",
                text: "Tune has been released back to the end user and they're now able to flash it. Would you like to reload editor with changes in the BIN you loaded on this tune request?",
                type: "success",
                confirmButtonText: "Yes, Reload",
                showCancelButton: !0
            }, function(a) {
                a && b.doOpenTuneReq()
            })
        }, function(b) {
            406 === b.status ? a.swal({
                title: "Error",
                text: "Engine type in the BIN file selected doesn't match engine type of the map you're responding on. Please ensure you've selected the correct BIN file.",
                type: "error"
            }) : 415 === b.status ? a.swal({
                title: "Error",
                text: "Map BIN file not recognized. Ensure it is a full file, not just the calibration area.",
                type: "error"
            }) : a.swal({
                title: "Error",
                text: "Failed to release map back to user.",
                type: "error"
            })
        })
    }
}]).controller("ReplaceTuneWithBinCtrl", ["$scope", "SweetAlert", "UI", "$ionicHistory", "$http", "$mdDialog", "$state", "$timeout", function(b, a, d, c, k, g, l, h) {
    b.binData = null;
    b.fileName = null;
    b.readFile = function(a) {
        a.file(function(a) {
            var c = new FileReader;
            c.onload = function(a) {
                b.binData = "base64," + encode(a.target.result);
                d.toast("File is ready for upload");
                b.$apply()
            };
            c.readAsArrayBuffer(a)
        }, function(a) {})
    };
    b.selectFile = function() {
        window.cordova && "iOS" === device.platform ? window.FilePicker.pickFile(function(a) {
            d.toast("Reading selected file..");
            var c = a.lastIndexOf("/"),
                c = a.substring(c + 1);
            b.fileName = c;
            b.$apply();
            window.resolveLocalFileSystemURL("file://" + a, b.readFile, function(a) {
                d.toast("Failed reading file " + a)
            })
        }, function(a) {}, "public.data") : document.getElementsByName("binFile") && document.getElementsByName("binFile")[0].click()
    };
    b.fileNameChanged = function(a) {
        var c = new FileReader;
        c.onload = function() {
            b.binData = c.result;
            b.$apply()
        };
        b.fileName = a.files[0].name;
        c.readAsDataURL(a.files[0])
    };
    this.cancel = function() {
        g.hide()
    };
    this.replace = function(c,
        d) {
        g.hide();
        a.swal({
            title: "Replacing..",
            text: "Please wait, replacing map data with raw BIN file contents...",
            type: "warning",
            allowOutsideClick: !1,
            clickOutsideToClose: !1,
            showCancelButton: !1,
            showConfirmButton: !1
        });
        k({
            method: "POST",
            url: WS_BASE_URL + "/map/replace",
            data: {
                mapId: b.map.id,
                binData: b.binData
            }
        }).then(function(c) {
            b.reloadMaps && b.reloadMaps();
            a.swal({
                    title: "Success",
                    text: "Current map has been replaced with the contents of the raw BIN file selected.",
                    type: "success",
                    confirmButtonText: "Ok",
                    showCancelButton: !0
                },
                function(a) {
                    a && h(function() {
                        b.doOpen()
                    }, 1E3)
                })
        }, function(b) {
            406 === b.status ? a.swal({
                title: "Error",
                text: "Engine type in the BIN file selected doesn't match engine type of the map you're replacing. Please ensure you've selected the correct BIN file.",
                type: "error"
            }) : 415 === b.status ? a.swal({
                title: "Error",
                text: "Map BIN file not recognized. Ensure it is a full file, not just the calibration area.",
                type: "error"
            }) : a.swal({
                title: "Error",
                text: "Failed to replace map with contents of the raw BIN file.",
                type: "error"
            })
        })
    }
}]).controller("ConfirmOpenCtrl", ["$scope", "$mdDialog", function(b, a) {
    b.hide = function() {
        a.hide()
    };
    b.cancel = function() {
        b.hide()
    };
    b.confirmOpenMap = function(a, c) {
        b.hide();
        b.doOpen(null, c)
    };
    b.confirmOpenTuneReq = function(a, c) {
        b.hide();
        b.doOpenTuneReq(null, c)
    }
}]).controller("encryptAndFlashMapCtrl", ["$scope", "$log", "SweetAlert", "$state", "$ionicHistory", "UI", "$http", "$rootScope", "$bmd", "$timeout", function(b, a, d, c, k, g, l, h, e, q) {
    window.cordova && "iOS" === device.platform && (b.platform = "iOS");
    b.binMap = {
        version: 1,
        stock: !1
    };
    b.readFileNative = function(a,
        c) {
        a.file(function(a) {
            var d = new FileReader;
            d.onload = function(a) {
                b.binMap.fileContent = "base64," + encode(a.target.result);
                g.toast("File is ready for upload");
                b.$apply();
                b.encryptAndFlash(c)
            };
            d.readAsArrayBuffer(a)
        }, function(a) {})
    };
    b.selectFile = function(a) {
        window.cordova && "iOS" === device.platform ? window.FilePicker.pickFile(function(c) {
            g.toast("Reading selected file..");
            var d = c.lastIndexOf("/"),
                d = c.substring(d + 1);
            b.binMap = {};
            b.binMap.fileName = d;
            b.$apply();
            window.resolveLocalFileSystemURL("file://" + c, function(c) {
                b.readFileNative(c,
                    a)
            }, function(a) {
                a && g.toast("Failed reading file " + a)
            })
        }, function(a) {}, "public.data") : document.getElementsByName("mapFile") && document.getElementsByName("mapFile")[0].click()
    };
    b.fileNameChanged = function(a, c) {
        var d = new FileReader;
        b.binMap = {};
        b.binMap.fileName = a.files[0].name;
        d.onload = function() {
            b.binMap.fileContent = d.result;
            b.$apply();
            b.encryptAndFlash(c)
        };
        d.readAsDataURL(a.files[0])
    };
    b.encryptAndFlash = function(a) {
        d.swal({
            title: "Confirm",
            text: "Proceed with flashing \x3cb\x3e" + b.binMap.fileName + "\x3c/b\x3e to the connected vehicle?",
            type: "info",
            html: !0,
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(c) {
            c && q(b.doEncryptAndFlash, 0, !0, a)
        })
    };
    b.doEncryptAndFlash = function(a) {
        h.clientSession ? h.clientSession.webTuner && "REGULAR" !== h.clientSession.webTuner.tunerLevel ? b.binMap.fileName && b.binMap.fileContent ? k.clearCache().then(function() {
            b.binMap.name && 0 !== b.binMap.name.trim().length || (b.binMap.name = b.binMap.fileName);
            b.encryptMap = {
                id: b.binMap.fileName,
                desc: b.binMap.desc,
                name: b.binMap.name,
                vin: h.VIN,
                version: b.binMap.version,
                agentVersion: h.agentVersion,
                agentOS: h.agentOS,
                agentOSVersion: h.agentOSVersion,
                data: {
                    data: b.binMap.fileContent
                }
            };
            var c = {
                method: "POST",
                url: WS_BASE_URL + "/map/encryptoffline",
                responseType: "arraybuffer",
                data: b.encryptMap
            };
            d.swal({
                title: "Please wait",
                text: "Encrypting map for flash, please wait ..",
                type: "warning",
                confirmButtonClass: "btn-warning",
                showConfirmButton: !1,
                showCancelButton: !1
            });
            l(c).then(function(c) {
                c = base64ArrayBuffer(c.data);
                d.swal({
                    title: "Please wait",
                    text: "Map ready to flash, initializing..",
                    type: "warning",
                    confirmButtonClass: "btn-warning",
                    showConfirmButton: !1,
                    showCancelButton: !1
                });
                c = {
                    id: b.encryptMap.id,
                    data: c,
                    type: a,
                    force: !0,
                    offline: h.offlineMode,
                    editor: !0
                };
                window.cordova && window.plugins.insomnia.keepAwake();
                h.pbar = document.getElementById("pbar");
                if (!h.pbar) {
                    var g = document.getElementsByClassName("sweet-alert")[0];
                    h.pbar = document.createElement("div");
                    h.pbar.setAttribute("id", "pbar");
                    g.insertBefore(h.pbar, g.firstChild)
                }
                h.progressbar.setHeight("8px");
                h.progressbar.setParent(pbar);
                h.progressbar.setColor("yellow");
                h.progressbar.set(0);
                h.progressbar.start();
                h.flashingMapId = b.encryptMap.id;
                h.flashing = !0;
                e.send("/app/flash", c, {
                    jwt: h.get("token")
                })
            }, function(a) {
                var b = "Failed encrypting file.";
                console.error(a);
                401 === a.status ? b = "BIN file encryption feature is only available to authorized tuners and shops. To register as an authorized bootmod3 tuner please contact support@protuningfreaks.com." : 415 === a.status ? b = "Invalid file provided. Ensure only full BINs are uploaded, not just the calibration area." : 422 === a.status && (b = "File provided not recognized, may be a bad file. Ensure only full BINs are uploaded, not just the calibration area.");
                d.swal({
                    title: "Error",
                    text: b,
                    type: "error",
                    showConfirmButton: !0,
                    showCancelButton: !1
                })
            })
        }) : d.swal({
            title: "Error",
            text: "Select a raw BIN file first to use this flash option.",
            type: "warning"
        }) : d.swal({
            title: "Tuner Authorization",
            text: "Raw BIN file encryption is an advanced feature for authorized tuners. If you're a professional tuner or shop setting up as a tuner using the Tuners screen in bootmod3 is free. To authorize your account please contact support@protuningfreaks.com.",
            type: "error",
            showConfirmButton: !1,
            showCancelButton: !1
        }) : g.toast("Loading account details, please wait..")
    }
}]);
angular.module("app.version", []).controller("versionCtrl", ["$scope", function(b) {}]);
angular.module("app.about", []).controller("aboutCtrl", ["$scope", "$bmd", "UI", "SweetAlert", "$rootScope", "store", "$http", "$mdDialog", "$timeout", function(b, a, d, c, k, g, l, h, e) {
    b.AGENT_IP_ADDR = AGENT_IP_ADDR;
    b.AGENT_PORT = AGENT_PORT;
    b.resetDash = function() {
        k.offlineMode ? c.swal({
            title: "Error",
            text: "Cannot reset dash in offline mode.",
            type: "error"
        }) : l({
            method: "GET",
            url: WS_BASE_URL + "/dashconfigreset"
        }).then(function(a) {
            d.toast("All locally stored settings cleared.");
            document.location.href = "index.html"
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed reset settings.",
                type: "error"
            })
        })
    };
    b.resetLogging = function() {
        k.offlineMode ? c.swal({
            title: "Error",
            text: "Cannot reset logging in offline mode.",
            type: "error"
        }) : l({
            method: "GET",
            url: WS_BASE_URL + "/logconfigreset"
        }).then(function(a) {
            b.resetDash()
        }, function(a) {
            document.location.href = "index.html"
        })
    };
    b.dmeUnlocked = function() {
        k.VIN ? c.swal({
            title: "Confirm",
            text: "Only use this feature if instructed by Tech Support. Are you sure your DME is unlocked for programming over OBD and you'd like to override this setting? ",
            type: "warning",
            html: !0,
            confirmButtonText: "Yes, DME IS UNLOCKED",
            showConfirmButton: !0,
            showCancelButton: !0
        }, function(b) {
            b && (a.send("/app/confirmunlock", {}, {
                jwt: k.get("token")
            }), k.set("unlockDone", !0), c.swal({
                title: "Please wait",
                text: "Overriding the DME unlock verification check...",
                type: "warning",
                allowOutsideClick: !1,
                clickOutsideToClose: !1
            }))
        }) : c.swal({
            title: "Error",
            text: "Vehicle not detected. Ensure OBD Agent is running and you're connected to the OBD port.",
            type: "error"
        })
    };
    b.clearCaches = function() {
        k.offlineMode ?
            c.swal({
                title: "Error",
                text: "Cannot clear caches in offline mode.",
                type: "error"
            }) : c.swal({
                title: "Confirm",
                text: "Are you sure you want to clear your local settings? Once cleared you'll be logged out.",
                type: "warning",
                html: !0,
                confirmButtonText: "Clear",
                showConfirmButton: !0,
                showCancelButton: !0
            }, function(a) {
                a && (window.localStorage.clear(), b.resetLogging())
            })
    };
    b.changeEmail = function(a) {
        k.offlineMode ? c.swal({
            title: "Error",
            text: "Cannot update contact email in offline mode.",
            type: "error"
        }) : h.show({
            controller: "DialogController",
            controllerAs: "ctrl",
            templateUrl: "templates/about-emailChange.tmpl.html",
            parent: angular.element(document.body),
            targetEvent: a,
            preserveScope: !0,
            clickOutsideToClose: !0,
            scope: b,
            fullscreen: !0
        })
    };
    b.doChangeEmail = function(a) {
        l({
            method: "POST",
            url: WS_BASE_URL + "/updateEmail",
            data: {
                email: b.contactEmail
            }
        }).then(function(a) {
            d.toast("Email updated to " + b.contactEmail)
        }, function(a) {
            c.swal({
                title: "Error",
                text: "Failed to update email, please try again.",
                type: "error"
            })
        })
    };
    !k.offlineMode && k.clientSession && k.clientSession.webUser &&
        (b.contactEmail = k.clientSession.webUser.contactEmail)
}]).controller("DialogController", ["$scope", "$mdDialog", function(b, a) {
    b.hide = function() {
        a.hide()
    };
    b.cancel = function() {
        a.hide("cancel")
    };
    b.answer = function(b) {
        a.hide(b)
    }
}]);
angular.module("app.logout", []).controller("logoutCtrl", ["$http", "lock", "SweetAlert", "$rootScope", "$location", "$scope", "$ionicHistory", "$timeout", "$bmd", function(b, a, d, c, k, g, l, h, e) {
    g.logout = function() {
        d.swal({
            title: "Confirm",
            text: "Exit and clear all login info?",
            type: "warning",
            showCancelButton: !0,
            confirmButtonClass: "btn-warning",
            confirmButtonText: "Clear Login Info",
            cancelButtonText: "Keep Login Info"
        }, function(a) {
            a ? b({
                method: "GET",
                url: WS_BASE_URL + "/logout"
            }).then(function() {
                c.clearAuth();
                c.clearCache();
                location.href = "index.html"
            }, function() {
                c.clearAuth();
                c.clearCache();
                location.href = "index.html"
            }) : (l.nextViewOptions({
                disableBack: !0
            }), k.path("/login"))
        })
    }
}]);
angular.module("app.mapswitch", []).controller("liveAdjustCtrl", ["$scope", "SweetAlert", "$rootScope", "$state", "$log", "UI", "$http", "$timeout", "$bmd", "$ionicHistory", "$mdBottomSheet", "$interval", "$ionicScrollDelegate", "$ionicSideMenuDelegate", "$mdDialog", function(b, a, d, c, k, g, l, h, e, q, n, v, r, x, t) {
    b.currentMapSlot = d.mapSlot;
    b.burbleOverride = d.burbleOverride;
    b.flexOverride = d.flexOverride;
    var p = null,
        C = null,
        y = null,
        B = null,
        A = null,
        w = null;
    b.hide = function() {
        t.hide()
    };
    b.registerEvents = function() {
        p || (r.freezeAllScrolls(!0),
            x.canDragContent(!1), p && v.cancel(p), p = v(function() {
                d.VIN && e.send("/app/mapsw", {
                    slot: ""
                }, {
                    jwt: d.get("token")
                })
            }, 1E3), C = d.$watch("mapSlot", function() {
                b.currentMapSlot = d.mapSlot
            }), y = d.$watch("burbleOverride", function() {
                b.burbleOverride = d.burbleOverride
            }), B = d.$watch("flexOverride", function() {
                b.flexOverride = d.flexOverride
            }), A = d.$watch("antitheft", function() {
                b.currentAntitheft = d.antitheft
            }), w = d.$on("VIN", function() {
                d.VIN ? b.readValues() : b.resetValues();
                b.currentMapSlot = d.mapSlot;
                b.flexOverride = d.flexOverride;
                b.burbleOverride = d.burbleOverride
            }))
    };
    b.registerEvents = _.debounce(b.registerEvents, 300, !0);
    b.$on("$ionicView.loaded", function() {
        b.registerEvents()
    });
    b.$on("$destroy", function() {
        b.destroyHandlers()
    });
    b.registerEvents();
    b.boolValues = [{
        val: !0,
        label: "YES"
    }, {
        val: !1,
        label: "NO"
    }];
    b.updateFlexBlendOverride = function() {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? d.VIN && e.send("/app/flex", d.flexOverride, {
            jwt: d.get("token")
        }) : a.swal({
            title: "Failed",
            text: "Registered vehicle not detected.",
            type: "error"
        })
    };
    b.updateBurbleOverride = function() {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? d.VIN && e.send("/app/burble", d.burbleOverride, {
            jwt: d.get("token")
        }) : a.swal({
            title: "Failed",
            text: "Registered vehicle not detected.",
            type: "error"
        })
    };
    b.mapSwitch = function(b) {
        d.isRegisteredDeviceConnected() || d.isAuthorizedTuner() ? e.send("/app/mapsw", {
            slot: String(b)
        }, {
            jwt: d.get("token")
        }) : a.swal({
            title: "Failed",
            text: "Registered vehicle not detected.",
            type: "error"
        })
    };
    b.antitheftEnable = function(b) {
        d.isRegisteredDeviceConnected() ||
            d.isAuthorizedTuner() ? e.send("/app/antitheft", {
                enable: b
            }, {
                jwt: d.get("token")
            }) : a.swal({
                title: "Failed",
                text: "Registered vehicle not detected.",
                type: "error"
            })
    };
    b.destroyHandlers = function() {
        r.freezeAllScrolls(!1);
        x.canDragContent(!0);
        v.cancel(p);
        C();
        y();
        B();
        A();
        w()
    };
    b.$on("$destroy", function() {
        b.destroyHandlers()
    });
    b.resetValues = function() {
        d.burbleOverride = {
            enabled: !1,
            agg: 0,
            dur: 0
        };
        d.mapSlot = -1;
        d.flexOverride = {
            blendPercent: 0,
            enabled: !1
        }
    };
    b.readValues = function() {
        e.send("/app/mapsw", {
            slot: ""
        }, {
            jwt: d.get("token")
        });
        e.send("/app/rburble", {}, {
            jwt: d.get("token")
        });
        e.send("/app/rflex", {}, {
            jwt: d.get("token")
        })
    };
    b.readValues()
}]);
angular.module("app.routes", []).config(["$stateProvider", "$urlRouterProvider", function(b, a) {
    b.state("bootmod3", {
        url: "/drawer",
        templateUrl: "templates/bootmod3.html",
        abstract: !0
    }).state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "loginCtrl"
    }).state("tab", {
        url: "/tab",
        abstract: !0,
        templateUrl: "templates/logconftabs.html"
    }).state("bootmod3.configlogs", {
        url: "/configlogs",
        views: {
            drawer: {
                templateUrl: "templates/datalogconfig-tabs.html",
                controller: "datalogConfigCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.logmeout", {
        url: "/logout",
        views: {
            drawer: {
                controller: "logoutCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.dashboard", {
        url: "/dash",
        views: {
            drawer: {
                templateUrl: "templates/dashboard.html",
                controller: "dashboardCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.liveadjust", {
        url: "/liveadjust",
        views: {
            drawer: {
                templateUrl: "templates/liveadjust.html",
                controller: "liveAdjustCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.dashboard2", {
        url: "/dash2",
        views: {
            drawer: {
                templateUrl: "templates/dashboard2.html",
                controller: "dashboardCtrl2",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.dashboard3", {
        url: "/dash3",
        views: {
            drawer: {
                templateUrl: "templates/dashboard3.html",
                controller: "dashboardCtrl3",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.tunerconfig", {
        url: "/tunerconfig",
        views: {
            drawer: {
                templateUrl: "templates/tunerconfig.html",
                controller: "tunerConfigCtrl",
                parent: "bootmod3.tuners",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.datalogs", {
        url: "/logs",
        views: {
            drawer: {
                templateUrl: "templates/datalogs.html",
                controller: "datalogsCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.datalogsOffline", {
        url: "/offlinelogs",
        views: {
            drawer: {
                templateUrl: "templates/datalogs.html",
                controller: "datalogsOfflineCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.maps", {
        url: "/maps",
        views: {
            drawer: {
                templateUrl: "templates/maps.html",
                controller: "mapsCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.tuneRequests", {
        url: "/tuneRequests",
        views: {
            drawer: {
                templateUrl: "templates/tuneRequests.html",
                controller: "tuneRequestsCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.tuners", {
        url: "/tuners",
        views: {
            drawer: {
                templateUrl: "templates/tuners.html",
                controller: "tunersCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.otsmaps", {
        url: "/otsmaps",
        views: {
            drawer: {
                templateUrl: "templates/otsmaps.html",
                controller: "otsMapsCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.transmission", {
        url: "/transmission",
        views: {
            drawer: {
                templateUrl: "templates/transmission.html",
                controller: "transmissionCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.transmissionDescription", {
        url: "/transmissiondetail",
        views: {
            drawer: {
                templateUrl: "templates/transmissionDescription.html",
                controller: "transmissionDescriptionCtrl",
                parent: "bootmod3.transmission",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.transmissionCSDescription", {
        url: "/transmissioncsdetail",
        views: {
            drawer: {
                templateUrl: "templates/transmissionCSDescription.html",
                controller: "transmissionDescriptionCtrl",
                parent: "bootmod3.transmission",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.transmissionStockDescription", {
        url: "/transmissionstockdetail",
        views: {
            drawer: {
                templateUrl: "templates/transmissionStockDescription.html",
                controller: "transmissionDescriptionCtrl",
                parent: "bootmod3.transmission",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.mapDescription", {
        url: "/mapdetail",
        views: {
            drawer: {
                templateUrl: "templates/mapDescription.html",
                controller: "mapDescriptionCtrl",
                parent: "bootmod3.maps",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.mapconfig", {
        url: "/mapconfig",
        views: {
            drawer: {
                templateUrl: "templates/mapConfig.html",
                controller: "mapConfigCtrl",
                parent: "bootmod3.mapDescription",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.otsMapDescription", {
        url: "/otsmapdetail",
        views: {
            drawer: {
                templateUrl: "templates/otsMapDescription.html",
                controller: "otsMapDescriptionCtrl",
                parent: "bootmod3.otsmaps",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.tunerDescription", {
        url: "/tunerDescription",
        views: {
            drawer: {
                templateUrl: "templates/tunerDescription.html",
                controller: "tunerDescriptionCtrl",
                parent: "bootmod3.tuners",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.tuneReqDescription", {
        url: "/tuneReqDescription",
        views: {
            drawer: {
                templateUrl: "templates/tuneReqDescription.html",
                controller: "tuneReqDescriptionCtrl",
                parent: "bootmod3.tuneRequests",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.editor", {
        url: "/editor",
        views: {
            drawer: {
                templateUrl: "templates/mapEdit.html",
                controller: "mapEditCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.mapEdit", {
        url: "/mapedit",
        views: {
            drawer: {
                templateUrl: "templates/mapEdit.html",
                controller: "mapEditCtrl",
                parent: "bootmod3.mapDescription",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.diagnostics", {
        url: "/diagnostics",
        views: {
            drawer: {
                templateUrl: "templates/diagnostics.html",
                controller: "diagnosticsCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.diagAdaptResets", {
        url: "/diagadaptresets",
        views: {
            drawer: {
                templateUrl: "templates/diagAdaptResets.html",
                controller: "diagnosticsCtrl",
                parent: "bootmod3.diagnostics",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.support", {
        url: "/support",
        views: {
            drawer: {
                templateUrl: "templates/support.html",
                controller: "supportCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.codes", {
        url: "/codes",
        views: {
            drawer: {
                templateUrl: "templates/codeListing.html",
                controller: "codesCtrl",
                parent: "bootmod3.diagnostics",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.helpSec", {
        url: "/help",
        views: {
            drawer: {
                templateUrl: "templates/help.html",
                controller: "helpCtrl",
                data: {
                    requiresLogin: !1
                }
            }
        }
    }).state("bootmod3.help", {
        url: "/help",
        views: {
            drawer: {
                templateUrl: "templates/help.html",
                controller: "helpCtrl",
                parent: "login",
                data: {
                    requiresLogin: !1
                }
            }
        }
    }).state("bootmod3.about", {
        url: "/about",
        views: {
            drawer: {
                templateUrl: "templates/about.html",
                controller: "aboutCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.devices", {
        url: "/devices",
        views: {
            drawer: {
                templateUrl: "templates/devices.html",
                controller: "devicesCtrl",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.deviceDetails", {
        url: "/deviceDetails",
        views: {
            drawer: {
                templateUrl: "templates/deviceDetails.html",
                controller: "deviceDetailsCtrl",
                parent: "bootmod3.devices",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.deviceVinDetails", {
        url: "/deviceVinDetails",
        views: {
            drawer: {
                templateUrl: "templates/deviceVinDetails.html",
                controller: "deviceVinDetailsCtrl",
                parent: "bootmod3.devices",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.deviceReg", {
        url: "/deviceReg",
        views: {
            drawer: {
                templateUrl: "templates/deviceReg.html",
                controller: "deviceRegCtrl",
                parent: "bootmod3.devices",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.obdagent", {
        url: "/updateAgent",
        views: {
            drawer: {
                templateUrl: "templates/obdagent.html",
                controller: "obdAgentCtrl",
                parent: "bootmod3.obdagent",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.addmap", {
        url: "/addmap",
        views: {
            drawer: {
                templateUrl: "templates/addmap.html",
                controller: "addMapCtrl",
                parent: "bootmod3.maps",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.addlog", {
        url: "/addlog",
        views: {
            drawer: {
                templateUrl: "templates/addlog.html",
                controller: "addLogCtrl",
                parent: "bootmod3.datalogs",
                data: {
                    requiresLogin: !0
                }
            }
        }
    }).state("bootmod3.encryptmap", {
        url: "/encryptmap",
        views: {
            drawer: {
                templateUrl: "templates/encryptmap.html",
                controller: "encryptMapCtrl",
                parent: "bootmod3.maps",
                data: {
                    requiresLogin: !0
                }
            }
        }
    });
    a.otherwise("/login")
}]);
angular.module("app.services", []).service("fileUpload", ["$http", function(b) {
    this.uploadFileToUrl = function(a, d, c) {
        var k = new FormData;
        k.append("file", a);
        c && c.forEach(function(a) {
            k.append(a.name, a.val)
        });
        b.post(d, k, {
            transformRequest: angular.identity,
            headers: {
                "Content-Type": void 0
            }
        }).success(function() {}).error(function() {})
    }
}]).service("UI", ["$mdToast", function(b) {
    this.toast = function(a, d) {
        a = "long" === d ? b.simple().textContent(a).hideDelay(5E3).position("top right") : b.simple().textContent(a);
        b.show(a)
    };
    this.hide = function(a, d) {
        b.hide()
    }
}]).service("authService", ["lock", "$location", "$state", "$rootScope", "UI", "$http", "$ionicHistory", "SweetAlert", "jwtHelper", "$route", function(b, a, d, c, k, g, l, h, e, q) {
    function n(a, b) {
        c.clearCache(!0);
        var d = JSON.stringify(1E3 * a.expiresIn + (new Date).getTime());
        g.defaults.headers.common.jwt = a.accessToken;
        g.defaults.headers.common.client = window.cordova ? "app" : "web";
        c.set("access_token", a.accessToken);
        c.set("refresh_token", a.refreshToken);
        c.set("id_token", a.idToken);
        c.set("token",
            a.idToken);
        c.set("expires_in", a.expiresIn);
        c.set("expires_at", d);
        JWT = a.accessToken;
        c.authToken = a.idToken;
        c.authenticated = !0;
        l.clearCache();
        b ? b() : c.getClientSession()
    }

    function v(a) {
        var b = c.get("access_token");
        g.defaults.headers.common.jwt = b;
        g.defaults.headers.common.client = window.cordova ? "app" : "web";
        JWT = b;
        c.authenticated = !0;
        a && a()
    }

    function r() {
        var a = !1,
            b = c.get("token");
        b && (e.isTokenExpired(b) || (a = !0));
        a || c.clearAuth();
        return a
    }
    return {
        login: function() {
            c.get("access_token") ? v(function() {
                c.getClientSession(function() {
                    l.nextViewOptions({
                        disableBack: !0
                    });
                    d.go("bootmod3.devices")
                })
            }) : window.electron && !window.cordova || window.cordova ? (new Auth0Cordova({
                domain: "bootmod3.auth0.com",
                clientId: "EByLqKWDz21GhkbSAX8I2Z3to32AOl0G",
                packageIdentifier: "com.bootmod3.mobile"
            })).authorize({
                scope: "openid profile email",
                responseType: "token id_token",
                audience: "https://bootmod3.auth0.com/userinfo"
            }, function(a, b) {
                !a && b ? (console.log("Native Auth success"), n(b, function() {
                    l.nextViewOptions({
                        disableBack: !0
                    });
                    d.go("bootmod3.devices")
                })) : v(function() {
                    l.nextViewOptions({
                        disableBack: !0
                    });
                    d.go("bootmod3.devices")
                })
            }) : (console.log("Starting web auth"), b.show({
                initialScreen: "login"
            }))
        },
        logout: function() {
            c.kick()
        },
        signup: function() {
            c.clearCache();
            c.clearAuth();
            window.electron && !window.cordova || window.cordova ? (new Auth0Cordova({
                domain: "bootmod3.auth0.com",
                clientId: "EByLqKWDz21GhkbSAX8I2Z3to32AOl0G",
                packageIdentifier: "com.bootmod3.mobile"
            })).authorize({
                scope: "openid profile email",
                responseType: "token id_token",
                audience: "https://bootmod3.auth0.com/userinfo"
            }, function(a, b) {
                if (a) return console.error(a),
                    k.toast("Invalid username/password provided."), !1;
                n(b, function() {
                    l.nextViewOptions({
                        disableBack: !0
                    });
                    d.go("bootmod3.devices")
                })
            }) : b.show({
                initialScreen: "signUp"
            })
        },
        handleAuthentication: function(a) {
            c.authInit || (b.interceptHash(), b.on("authenticated", function(a) {
                a && a.accessToken && a.idToken && (c.offlineMode = !1, c.serverConnected = !0, c.authenticated = !0, c.set("offlineMode", !1), c.getClientSession(), n(a, function() {
                    l.nextViewOptions({
                        disableBack: !0
                    });
                    d.go("bootmod3.devices")
                }))
            }), b.on("authorization_error",
                function(a) {
                    c.offlineMode = !1;
                    c.authenticated = !1;
                    k.toast("Error in authorization.")
                }), c.authInit = !0);
            r() ? (c.authenticated = !0, g.defaults.headers.common.jwt = c.get("access_token"), n({
                accessToken: c.get("access_token"),
                refreshToken: c.get("refresh_token"),
                idToken: c.get("id_token"),
                expiresIn: c.get("expires_in")
            }, a)) : (c.authenticated = !1, c.kick())
        },
        isAuthenticated: r
    }
}]).factory("myHttpInterceptor", ["$q", "$rootScope", "$injector", function(b, a, d) {
    a.loading = !1;
    a.http = null;
    return {
        request: function(c) {
            a.loading = !0;
            return c || b.when(c)
        },
        requestError: function(c) {
            a.http = a.http || d.get("$http");
            1 > a.http.pendingRequests.length && (a.loading = !1);
            return b.reject(c)
        },
        response: function(c) {
            a.http = a.http || d.get("$http");
            1 > a.http.pendingRequests.length && (a.loading = !1);
            return c || b.when(c)
        },
        responseError: function(c) {
            a.http = a.http || d.get("$http");
            1 > a.http.pendingRequests.length && (a.loading = !1);
            return b.reject(c)
        }
    }
}]).factory("SweetAlert", ["$rootScope", function(b) {
    var a = window.swal;
    return {
        swal: function(d, c, k) {
            b.$evalAsync(function() {
                "function" ===
                typeof c ? a(d, function(a) {
                    b.$evalAsync(function() {
                        c(a)
                    })
                }, k) : a(d, c, k)
            })
        },
        success: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "success")
            })
        },
        error: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "error")
            })
        },
        warning: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "warning")
            })
        },
        info: function(d, c) {
            b.$evalAsync(function() {
                a(d, c, "info")
            })
        },
        close: function() {
            b.$evalAsync(function() {
                a.close()
            })
        }
    }
}]);
angular.module("chips", ["ngMessages"]).config(["$mdIconProvider", function(b) {
    b.icon("md-close", "img/icons/ic_close_24px.svg", 24)
}]);
angular.module("app.filters", []).filter("htmlToPlaintext", function() {
    return function(b) {
        return b ? String(b).replace(/<[^>]+>/gm, "") : ""
    }
});
angular.module("app.directives", []).directive("dynamic", ["$compile", function(b) {
    return {
        restrict: "A",
        replace: !0,
        link: function(a, d, c) {
            a.$watch(c.dynamic, function(c) {
                d.html(c);
                b(d.contents())(a)
            })
        }
    }
}]).directive("fileModel", ["$parse", function(b) {
    return {
        restrict: "A",
        link: function(a, d, c) {
            var k = b(c.fileModel).assign;
            d.bind("change", function() {
                a.$apply(function() {
                    k(a, d[0].files[0])
                })
            })
        }
    }
}]).directive("resizer", ["$document", function(b) {
    return function(a, d, c) {
        function k(a) {
            "vertical" === c.resizer ? (a = a.pageX,
                c.resizerMax && a > c.resizerMax && (a = parseInt(c.resizerMax)), d.css({
                    left: a + "px"
                }), $(c.resizerLeft).css({
                    width: a + "px"
                }), $(c.resizerRight).css({
                    left: a + parseInt(c.resizerWidth) + "px"
                })) : (a = window.innerHeight - a.pageY, d.css({
                bottom: a + "px"
            }), $(c.resizerTop).css({
                bottom: a + parseInt(c.resizerHeight) + "px"
            }), $(c.resizerBottom).css({
                height: a + "px"
            }))
        }

        function g() {
            b.unbind("mousemove", k);
            b.unbind("mouseup", g)
        }
        d.on("mousedown", function(a) {
            a.preventDefault();
            b.on("mousemove", k);
            b.on("mouseup", g)
        })
    }
}]).directive("myEnter",
    function() {
        return function(b, a, d) {
            a.bind("keydown keypress", function(a) {
                13 === a.which && (b.$apply(function() {
                    b.$eval(d.myEnter)
                }), a.preventDefault())
            })
        }
    }).directive("sglclick", ["$parse", function(b) {
    return {
        restrict: "A",
        link: function(a, d, c) {
            var k = b(c.sglclick),
                g = 0,
                l = null;
            d.on("click", function(b) {
                g++;
                1 === g ? l = setTimeout(function() {
                    a.$apply(function() {
                        k(a, {
                            $event: b
                        })
                    });
                    g = 0
                }, 300) : (clearTimeout(l), g = 0)
            })
        }
    }
}]);
webApp && "serviceWorker" in navigator && navigator.serviceWorker.getRegistrations().then(function(b) {
    b = $jscomp.makeIterator(b);
    for (var a = b.next(); !a.done; a = b.next()) a.value.unregister()
});