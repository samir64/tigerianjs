"use strict";

/**
 * @global
 */
var Tigerian = {};

(function () {
    var scripts_styles = {};
    var checkedElements = false;

    /**
     * @return {boolean}
     * @param {*} obj1 
     * @param {*} obj2 
     */
    Tigerian.compare = function (obj1, obj2) {
        if ((obj1 instanceof Array) && (obj2 instanceof Array)) {
            if (obj1.length === obj2.length) {
                return obj1.every(function (value, index) {
                    if (value instanceof Array) {
                        if (obj2[index] instanceof Array) {
                            return Tigerian.compare(value, obj2[index]);
                        } else {
                            return false;
                        }
                    } else {
                        return Tigerian.compare(value, obj2[index]);
                    }
                });
            } else {
                return false;
            }
        } else if ((typeof obj1 === "object") && (typeof obj2 === "object")) {
            var result = true;

            var key;
            for (key in obj1) {
                if (result) {
                    if (key in obj2) {
                        result = Tigerian.compare(obj1[key], obj2[key]);
                    } else {
                        result = false;
                    }
                }
            }

            for (key in obj2) {
                result = result && (key in obj1);
            }

            return result;
        } else {
            return obj1 === obj2;
        }
    };

    /**
     * @param {string} file
     */
    Tigerian.import = function (file) {
        if (!checkedElements) {
            var metaElements = document.head.getElementsByTagName("meta");

            if (!("viewport" in metaElements)) {
                var meta = document.createElement("meta");
                document.head.appendChild(meta);
                meta.setAttribute("name", "viewport");
                meta.setAttribute("content", "width=device-width, initial-scale=1.0");
            }

            var scriptElements = document.getElementsByTagName("script");
            for (var i in scriptElements) {
                if ((typeof scriptElements[i] === "object") && ("src" in scriptElements[i])) {
                    scripts_styles[scriptElements[i].src.trim()] = scriptElements[i];
                }
            }

            var styleElements = document.getElementsByTagName("link");
            for (var i in styleElements) {
                if ((typeof styleElements[i] === "object") && ("href" in styleElements[i])) {
                    scripts_styles[styleElements[i].href.trim()] = styleElements[i];
                }
            }

            checkedElements = true;
        }

        if ((typeof file === "string") && (file !== "")) {
            // file = window.location.origin + window.location.pathname + file;
            while (/\/\.\//g.exec(file)) {
                file = file.replace(/\/\.\//g, "/");
            }
            file = file.replace(/^\.\//g, "");

            var ext = file.split(".").pop();
            var scriptContext = "";
            var fileTag;
            if ((scripts_styles[file] === undefined) && (scripts_styles[window.location.origin + window.location.pathname + file] === undefined)) {
                switch (ext) {
                    case "js":
                        fileTag = document.createElement("script");
                        fileTag.src = file;
                        fileTag.type = "text/javascript";
                        fileTag.async = true;
                        fileTag.defer = true;
                        document.head.appendChild(fileTag);
                        fileTag.remove();

                        // var ajax = new Tigerian.Ajax(file);
                        // ajax.async = false;
                        // ajax.success = function (text) {
                        //     eval(text.replace(/var\s+([\w\.]+)\s*=\s*([\w\.]+)\.extend/, "window.$1 = $2.extend"));
                        // };
                        // ajax.get();
                        break;

                    case "css":
                        fileTag = document.createElement("link");
                        fileTag.rel = "stylesheet";
                        fileTag.href = file;
                        document.head.appendChild(fileTag, document.head.firstChild);
                        break;

                    default:
                }

                scripts_styles[file] = fileTag;
            }
        }
    };

    window.addEventListener("load", function (e) {
        Tigerian.import();
    }, true);
})();