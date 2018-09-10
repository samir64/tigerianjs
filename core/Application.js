/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */

'use strict';


/**
 * @param {Element} element
 *
 * @property {boolean} enabled
 * @property {boolean} visible
 * @property {string} style
 *
 * @constructor
 * @extends Tigerian.UI
 */
Tigerian.Application = Tigerian.UI.extend({
    /**
     * @param {Element} [element = document.body]
     * @param {string} [title]
     * @param {string} [theme]
     * @param {string} [charset = "UTF-8"]
     */
    init: function (element, title, theme) {
        this.super(element, null, theme);

        /**
         * @type {Tigerian.GridTemplate[]}
         */
        var templates = [];
        if (Tigerian.Class.isInstance(title, "string")) {
            document.head.getElementsByTagName("title")[0].innerText = title;
        }

        //NOTE Attributes
        this.setAttribute("element-name", "main");
        this.setAttribute("element-type", "Application");

        //NOTE Public Functions
        this.addTemplate = function (templateName) {
            var template = new Tigerian.GridTemplate(templateName);
            templates[templateName] = template;
            document.head.appendChild(template.element);
        };

        /**
         * @param {string} templateName
         * @returns {Tigerian.GridTemplate}
         */
        this.getTemplate = function (templateName) {
            if (templateName in templates) {
                return templates[templateName];
            }
        };

        this.removeTemplate = function (templateName) {
            if (templateName in templates) {
                document.head.removeChild(temlates[templateName].element);
                delete templates[templateName];
            }
        };

        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            get: function () {
                return document.head.getElementsByTagName("title")[0].innerText;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    document.head.getElementsByTagName("title")[0].innerText = v;
                }
            },
        });
    }
});