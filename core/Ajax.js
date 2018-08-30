'use strict';

/**
 * @class
 * @function
 * @param {string} url
 * @property {function} success
 * @property {function} unsuccess
 */
Tigerian.Ajax = Tigerian.Class.extend({
    init: function (url) {
        var httpRequest;
        var success = function (responseText, responseXml, responseJson) {};
        var unsuccess = function (readyState, status, statusText) {};

        if (window.XMLHttpRequest) {
            // code for modern browsers
            httpRequest = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        httpRequest.onreadystatechange = changeState;

        function jsonToQuery(params) {
            return encodeURI(Object.keys(params).map(function (key) {
                var json = JSON.stringify(params[key]);
                return key + "=" + (json !== "\"" + params[key] + "\"" ? json : params[key]);
            }).join("&"));
        }

        function changeState() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    var jsonObject;
                    try {
                        jsonObject = JSON.parse(this.responseText);
                    } catch (e) {}
                    success(this.responseText, this.responseXML, jsonObject);
                } else {
                    unsuccess(this.readyState, this.status, this.statusText);
                }
            }
        }

        function request(method, params) {
            httpRequest.open(method, url + ((method == "GET") ? "?" + jsonToQuery(params) : ""), true);
            // httpRequest.open(method, url, true);
            // httpRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            httpRequest.send(JSON.stringify(params));
        }

        this.addHeader = function (label, value) {
            httpRequest.setRequestHeader(label, value);
        };

        this.abort = function () {
            httpRequest.abort();
        };

        this.get = function (parameters) {
            request("GET", parameters);
        };

        this.post = function (parameters) {
            request("POST", parameters);
        };

        this.put = function (parameters) {
            request("PUT", parameters);
        };

        this.delete = function (parameters) {
            request("DELETE", parameters);
        };

        Object.defineProperty(this, "success", {
            enumerable: false,
            configurable: true,
            get: function () {
                return success;
            },
            set: function (value) {
                if (value instanceof Function) {
                    success = value;
                }
            },
        });

        Object.defineProperty(this, "unsuccess", {
            enumerable: false,
            configurable: true,
            get: function () {
                return unsuccess;
            },
            set: function (value) {
                if (value instanceof Function) {
                    unsuccess = value;
                }
            },
        });

        Object.defineProperty(this, "url", {
            enumerable: false,
            configurable: false,
            get: function () {
                return url;
            },
            set: function (value) {
                if (typeof value === "string") {
                    url = value;
                }
            },
        });
    },
});