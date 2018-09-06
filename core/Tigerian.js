"use strict";

var Tigerian = {};

(function () {
    var scripts = {};
    var checkedElements = false;

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
                    scripts[scriptElements[i].src.trim()] = scriptElements[i];
                }
            }
        }

        if ((typeof file === "string") && (file !== "") && (scripts[file] === undefined)) {
            file = window.location.origin + window.location.pathname + file;
            while (/\/\.\//g.exec(file)) {
                file = file.replace(/\/\.\//g, "/");
            }

            var ext = file.split(".").pop();
            var fileTag;
            switch (ext) {
                case "js":
                    fileTag = document.createElement("script");
                    fileTag.src = file;
                    fileTag.type = "text/javascript";
                    break;

                case "css":
                    fileTag = document.createElement("link");
                    fileTag.rel = "stylesheet";
                    fileTag.href = file;
                    break;

                default:
            }

            scripts[file] = fileTag;
            document.head.appendChild(fileTag);
        }
    };

    window.addEventListener("load", function (e) {
        Tigerian.import();
    }, true);
})();
