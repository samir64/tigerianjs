"use strict";

/**
 * @param {*} ...params
 */
String.prototype.format = function (params) {
    params = Array.from(arguments);
    var str = this;

    if ((params.length == 1) && (typeof params[0] == "object")) {
        return str.replace(/{(\w+)}/g, function (match, name, offset, mainStr) {
            return params[0][name];
        });
    } else {
        for (var i = 0, pat = /{}/g; pat.exec(str) != null; i++) {
            str = str.substr(0, pat.lastIndex - 2) + "{" + i.toString() + "}" + str.substr(pat.lastIndex);
        }
        return str.replace(/{(\d+)}/g, function (match, number) {
            return typeof params[number] != 'undefined' ? params[number] : match;
        });
    }
};