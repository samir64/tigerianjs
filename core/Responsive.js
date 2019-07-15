import {
  EWindow
} from "../behaviors/BWindow.js";

export let responsiveSizes = {
  xsmall: {
    name: EWindow.XSMALL,
    min: undefined,
    max: 575.98,
    containerWidth: "100%",
    containerPadding: 0
  },
  small: {
    name: EWindow.SMALL,
    min: 576,
    max: 767.98,
    containerWidth: "575px",
    containerPadding: 15
  },
  medium: {
    name: EWindow.MEDIUM,
    min: 768,
    max: 991.98,
    containerWidth: "750px",
    containerPadding: 15
  },
  large: {
    name: EWindow.LARGE,
    min: 992,
    max: 1199.98,
    containerWidth: "970px",
    containerPadding: 15
  },
  xlarge: {
    name: EWindow.XLARGE,
    min: 1200,
    max: undefined,
    containerWidth: "1170px",
    containerPadding: 15
  }
};

(function () {
  ("use strict");

  var style = document.createElement("style");

  document.head.appendChild(style);

  style.innerHTML = "";

  // forEach(responsiveSizes, (sizeInfo, sizeName) => {
  for (var sizeName in responsiveSizes) {
    var sizeInfo = responsiveSizes[sizeName];
    var limit = "";

    if (sizeInfo.min) {
      limit = `(min-width: ${sizeInfo.min}px)`;
    }
    if (sizeInfo.max) {
      if (limit !== "") {
        limit += " and ";
      }
      limit += `(max-width: ${sizeInfo.max}px)`;
    }
    var mediaQuery = `@media only screen and ${limit} {\n`;

    var sizeNames = Object.keys(responsiveSizes);
    sizeNames.splice(sizeNames.indexOf(sizeName), 1);
    for (var col = 1; col <= 12; col++) {
      mediaQuery += `\t[${sizeName}-column="${col}"],\n`;
      for (var j = 0; j < sizeNames.length; j++) {
        if (j > 0) {
          mediaQuery += ",\n";
        }
        mediaQuery += `\t[${sizeName}-column="${
          sizeNames[j]
        }"][{that}-column="${col}"]`;
      }
      mediaQuery += ` {\n\t\twidth: ${(col * 100) / 12}% !important;\n\t}\n\n`;
    }

    mediaQuery += `\t[element-name="container"][hide-on-${sizeName}="true"] {\n`;
    mediaQuery += "\t\tdisplay: none;\n\t}\n\n";

    mediaQuery += '\t[element-type="Container"][element-name="container"] {\n';
    mediaQuery += `\t\twidth: ${sizeInfo.containerWidth} !important;\n`;

    mediaQuery += "\t\tmargin-left: auto !important;\n";
    mediaQuery += "\t\tmargin-right: auto !important;\n";
    mediaQuery += `\t\tpadding-left: ${
      sizeInfo.containerPadding
    }px !important;\n`;
    mediaQuery += `\t\tpadding-right: ${
      sizeInfo.containerPadding
    }px !important;\n`;
    mediaQuery += "\t\tdisplay: block;\n";
    mediaQuery += "\t}\n\n";

    mediaQuery += "}\n\n";
    style.innerHTML += mediaQuery;
  }
})();