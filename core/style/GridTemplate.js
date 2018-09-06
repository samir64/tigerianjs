/**
 * Created by samir on 8/31/18.
 */

'use strict';

/**
 * @property {string} name
 * @property {Element} element
 * @property {Tigerian.GridTemplateAreas} smallTemplate
 * @property {Tigerian.GridTemplateAreas} mediumTemplate
 * @property {Tigerian.GridTemplateAreas} normalTemplate
 * @property {Tigerian.GridTemplateAreas} largeTemplate
 * @property {Tigerian.GridTemplateAreas} xlargeTemplate
 *
 * @extends Class
 * @constructor
 */
Tigerian.GridTemplate = Tigerian.Class.extend({
    /**
     * @param {string} name
     */
    init: function (name) {
        if (Tigerian.Class.isInstance(name, "string")) {
            this.super();

            var elm = document.createElement("style");
            /**
             * @var {Tigerian.GridTemplateAreas}
             */
            var smallTemplate;
            /**
             * @var {Tigerian.GridTemplateAreas}
             */
            var mediumTemplate;
            /**
             * @var {Tigerian.GridTemplateAreas}
             */
            var normalTemplate;
            /**
             * @var {Tigerian.GridTemplateAreas}
             */
            var largeTemplate;
            /**
             * @var {Tigerian.GridTemplateAreas}
             */
            var xlargeTemplate;

            var smallTextNode = document.createTextNode("@media only screen and (max-width: 600px) {\n{template}\n}");
            var mediumTextNode = document.createTextNode("@media only screen and (min-width: 600px) {\n{template}\n}");
            var normalTextNode = document.createTextNode("@media only screen and (min-width: 768px) {\n{template}\n}");
            var largeTextNode = document.createTextNode("@media only screen and (min-width: 992px) {\n{template}\n}");
            var xlargeTextNode = document.createTextNode("@media only screen and (min-width: 1200px) {\n{template}\n}");

            this.setSmallTemplate = function (colCount, rowCount) {
                if (!smallTemplate) {
                    smallTemplate = new Tigerian.GridTemplateAreas(smallTextNode, name, colCount, rowCount);
                    elm.appendChild(smallTextNode);
                }
            };

            this.setMediumTemplate = function (colCount, rowCount) {
                if (!mediumTemplate) {
                    mediumTemplate = new Tigerian.GridTemplateAreas(mediumTextNode, name, colCount, rowCount);
                    elm.appendChild(mediumTextNode);
                }
            };

            this.setNormalTemplate = function (colCount, rowCount) {
                if (!normalTemplate) {
                    normalTemplate = new Tigerian.GridTemplateAreas(normalTextNode, name, colCount, rowCount);
                    elm.appendChild(normalTextNode);
                }
            };

            this.setLargeTemplate = function (colCount, rowCount) {
                if (!largeTemplate) {
                    largeTemplate = new Tigerian.GridTemplateAreas(largeTextNode, name, colCount, rowCount);
                    elm.appendChild(largeTextNode);
                }
            };

            this.setXlargeTemplate = function (colCount, rowCount) {
                if (!xlargeTemplate) {
                    xlargeTemplate = new Tigerian.GridTemplateAreas(xlargeTextNode, name, colCount, rowCount);
                    elm.appendChild(xlargeTextNode);
                }
            };

            Object.defineProperty(this, "name", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return name;
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, "string")) {
                        name = v;
                    }
                },
            });

            Object.defineProperty(this, "element", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return elm;
                },
            });

            Object.defineProperty(this, "smallTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {Tigerian.GridTemplateAreas}
                 */
                get: function () {
                    return smallTemplate;
                },
            });

            Object.defineProperty(this, "mediumTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {Tigerian.GridTemplateAreas}
                 */
                get: function () {
                    return mediumTemplate;
                },
            });

            Object.defineProperty(this, "normalTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {Tigerian.GridTemplateAreas}
                 */
                get: function () {
                    return normalTemplate;
                },
            });

            Object.defineProperty(this, "largeTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {Tigerian.GridTemplateAreas}
                 */
                get: function () {
                    return largeTemplate;
                },
            });

            Object.defineProperty(this, "xlargeTemplate", {
                enumerable: true,
                configurable: false,
                /**
                 * @returns {Tigerian.GridTemplateAreas}
                 */
                get: function () {
                    return xlargeTemplate;
                },
            });
        }
    }
});
