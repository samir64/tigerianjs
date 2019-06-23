("use strict");

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 */
Tigerian.BStyle = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("style");
    },
    /**
     * @param {string} behavior
     * @param {Element} mainElement
     */
    config: function (behavior, mainElement) {
        if ((behavior === "style") && Tigerian.Class.isInstance(this, Tigerian.UI) && Tigerian.Class.isInstance(mainElement, Element)) {
            var defineAttribute = function (root, attribute, getter, setter) {
                if (!(attribute[0] in root)) {
                    root[attribute[0]] = {};
                }

                if (attribute.length > 1) {
                    defineAttribute(root[attribute[0]], attribute.slice(1), getter, setter);
                }
            };

            var optimizeAttributes = function (root) {
                var result = {};

                for (var attr in root) {
                    var keys = Object.keys(root[attr]);
                    if (keys.length === 0) {
                        result[attr] = root[attr];
                    } else if (keys.length === 1) {
                        var nextNode = keys[0];
                        result[attr + keys[0].charAt(0).toUpperCase() + keys[0].slice(1)] = root[attr][keys[0]];
                    } else {
                        result[attr] = optimizeAttributes(root[attr]);
                    }
                }

                return result;
            };

            var defineDescriptors = function (root, key, source) {
                for (var attr in root) {
                    var keys = Object.keys(root[attr]);
                    var styleAttr = ((key === "") ? attr : key + attr.charAt(0).toUpperCase() + attr.slice(1))
                    if (keys.length === 0) {
                        (function (styleAttr) {
                            Object.defineProperty(root, attr, {
                                enumerable: true,
                                configurable: true,
                                get: function () {
                                    return source[styleAttr];
                                },
                                set: function (v) {
                                    source[styleAttr] = v;
                                },
                            });
                        })(styleAttr);
                    } else {
                        defineDescriptors(root[attr], styleAttr, source);
                    }
                }
            };

            var result = {};

            for (var prop in mainElement.style) {
                var p = prop;
                if (p.indexOf("-") === -1) {
                    var attrs = prop.splitCapital();

                    defineAttribute(result, attrs, function () {
                        return mainElement.style[prop];
                    }, function (v) {
                        mainElement.style[prop] = v;
                    });
                }
            }

            result = optimizeAttributes(result);
            defineDescriptors(result, "", mainElement.style);

            Object.defineProperty(this, "style", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return result;
                }
            });
        }
    },
    enums: ["inherit", "initial", "unset"],
});