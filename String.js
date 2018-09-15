"use strict";

/**
 * @this {String}
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
/**
 * @this {String}
 * @param {*} beforeDotCount
 * @param {*} afterDotCount
 */
String.prototype.padNumbers = function (before, after) {
    return this.replace(/(?:(\d+\.\d+)|(\d+)\.[^\d]?|[^\d]?\.(\d+)|(\d+)[^\.\d]?)/g, function (matched, two, left, right, pure) {
        if (two) {
            left = two.split(".")[0];
            right = two.split(".")[1];
        }
        if (pure) {
            left = pure;
        }

        var result = matched;
        var fix = "";
        var i = 0;

        if (left) {
            if (!right) {
                if (result[left.length] !== ".") {
                    fix = ".";
                } else {
                    i = 1;
                }

                fix += "0".repeat(after);

                result = result.substring(0, left.length + i) + fix + result.substring(left.length + i);
            }

            if (before > left.length) {
                result = "0".repeat(before - left.length) + result;
            }
        }

        if (right) {
            if (!left) {
                fix = "0".repeat(before);

                result = result.substring(0, result.length - right.length - 1) + fix + result.substring(result.length - right.length - 1);
            }

            if (after > right.length) {
                result = result + "0".repeat(after - right.length);
            }
        }

        return result;
    });
};

/**
 * @this {string}
 * @param {boolean} addHashSign true
 */
String.prototype.toTag = function (addHashSign) {
    var result = this;
    while (result[0] === "#") {
        addHashSign = true;
        result = result.substring(1);
    }
    return Array.from(result).map(function (ch, index, str) {
        if ((ch >= "A") && (ch <= "Z") && (index > 0)) {
            ch = "_" + ch;
        }
        if ((addHashSign !== false) && (index === 0)) {
            ch = "#" + ch;
        }

        return ch.toLowerCase();
    }).join('').replace(/_{2,}/g, "_");
};