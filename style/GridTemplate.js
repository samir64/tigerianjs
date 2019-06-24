/**
 * Created by samir on 8/31/18.
 */

("use strict");

/**
 * @extends {Class}
 * @constructor
 */
GridTemplate = Class.extend({
    /**
     * @constructs
     * @param {string} name
     */
    init: function (name) {
        if (Class.isInstance(name, "string")) {
            this.super();

            var elm = document.createElement("style");
            /**
             * @var {GridTemplateAreas[]}
             */
            var templates = [undefined, undefined, undefined, undefined, undefined];

            var smallTextNode = document.createTextNode("@media only screen and (max-width: 600px) {\n{template}\n}");
            var mediumTextNode = document.createTextNode("@media only screen and (min-width: 600px) {\n{template}\n}");
            var normalTextNode = document.createTextNode("@media only screen and (min-width: 768px) {\n{template}\n}");
            var largeTextNode = document.createTextNode("@media only screen and (min-width: 992px) {\n{template}\n}");
            var xlargeTextNode = document.createTextNode("@media only screen and (min-width: 1200px) {\n{template}\n}");

            /**
             * @param {number} colCount
             * @param {number} rowCount
             */
            this.setSmallTemplate = function (colCount, rowCount) {
                if (!templates[0]) {
                    templates[0] = new GridTemplateAreas(smallTextNode, name, colCount, rowCount);
                    elm.appendChild(smallTextNode);
                }
            };

            /**
             * @param {number} colCount
             * @param {number} rowCount
             */
            this.setMediumTemplate = function (colCount, rowCount) {
                if (!templates[1]) {
                    templates[1] = new GridTemplateAreas(mediumTextNode, name, colCount, rowCount);
                    elm.appendChild(mediumTextNode);
                }
            };

            /**
             * @param {number} colCount
             * @param {number} rowCount
             */
            this.setNormalTemplate = function (colCount, rowCount) {
                if (!templates[2]) {
                    templates[2] = new GridTemplateAreas(normalTextNode, name, colCount, rowCount);
                    elm.appendChild(normalTextNode);
                }
            };

            /**
             * @param {number} colCount
             * @param {number} rowCount
             */
            this.setLargeTemplate = function (colCount, rowCount) {
                if (!templates[3]) {
                    templates[3] = new GridTemplateAreas(largeTextNode, name, colCount, rowCount);
                    elm.appendChild(largeTextNode);
                }
            };

            /**
             * @param {number} colCount
             * @param {number} rowCount
             */
            this.setXlargeTemplate = function (colCount, rowCount) {
                if (!templates[4]) {
                    templates[4] = new GridTemplateAreas(xlargeTextNode, name, colCount, rowCount);
                    elm.appendChild(xlargeTextNode);
                }
            };

            /**
             * @member {string}
             */
            Object.defineProperty(this, "name", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return name;
                },
                set: function (v) {
                    if (Class.isInstance(v, "string")) {
                        name = v;
                    }
                },
            });

            /**
             * @member {Element}
             * @readonly
             */
            Object.defineProperty(this, "element", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return elm;
                },
            });

            /**
             * @member {GridTemplateAreas}
             * @readonly
             */
            Object.defineProperty(this, "smallTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {GridTemplateAreas}
                 */
                get: function () {
                    return templates[0];
                },
            });

            /**
             * @member {GridTemplateAreas}
             * @readonly
             */
            Object.defineProperty(this, "mediumTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {GridTemplateAreas}
                 */
                get: function () {
                    return templates[1];
                },
            });

            /**
             * @member {GridTemplateAreas}
             * @readonly
             */
            Object.defineProperty(this, "normalTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {GridTemplateAreas}
                 */
                get: function () {
                    return templates[2];
                },
            });

            /**
             * @member {GridTemplateAreas}
             * @readonly
             */
            Object.defineProperty(this, "largeTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {GridTemplateAreas}
                 */
                get: function () {
                    return templates[3];
                },
            });

            /**
             * @member {GridTemplateAreas}
             * @readonly
             */
            Object.defineProperty(this, "xlargeTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {GridTemplateAreas}
                 */
                get: function () {
                    return templates[4];
                },
            });
        }
    }
});