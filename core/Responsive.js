("use strict");

import { EWindow } from "../behaviors/BWindow.js";

export let responsiveSizes = {
  // none: {
  //   name: EWindow.NONE,
  //   min: undefined,
  //   max: undefined,
  //   containerWidth: "",
  //   containerPadding: 0
  // },
  xsmall: {
    name: EWindow.XSMALL,
    min: 1,
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

export function responsive() {
  let meta = document.createElement("meta");
  let style = document.createElement("style");

  document.head.appendChild(meta);
  document.head.appendChild(style);

  style.innerHTML = "";
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", "width=device-width, initial-scale=1.0");

  // forEach(responsiveSizes, (sizeInfo, sizeName) => {
  for (let sizeName in responsiveSizes) {
    let sizeInfo = responsiveSizes[sizeName];
    let limit = "";

    if (sizeInfo.min) {
      limit = `(min-width: ${sizeInfo.min}px)`;
    }
    if (sizeInfo.max) {
      if (limit !== "") {
        limit += " and ";
      }
      limit += `(max-width: ${sizeInfo.max}px)`;
    }
    let mediaQuery = `@media only screen and ${limit} {\n`;

    let sizeNames = Object.keys(responsiveSizes);
    sizeNames.splice(sizeNames.indexOf(sizeName), 1);
    for (let col = 1; col <= 12; col++) {
      mediaQuery += `\t[${sizeName}-column="${col}"],\n`;
      for (let j = 0; j < sizeNames.length; j++) {
        if (j > 0) {
          mediaQuery += ",\n";
        }
        mediaQuery += `\t[${sizeName}-column="${sizeNames[j]}"][${sizeNames[j]}-column="${col}"]`;
      }
      mediaQuery += ` {\n\t\twidth: ${(col * 100) / 12}%;\n\t}\n\n`;
    }

    mediaQuery += `\t[element-name="container"][hide-on-${sizeName}="true"] {\n`;
    mediaQuery += "\t\tdisplay: none;\n\t}\n\n";

    mediaQuery += '\t[element-type="Container"][element-name="container"] {\n';
    mediaQuery += `\t\tmax-width: ${sizeInfo.containerWidth};\n`;

    mediaQuery += "\t\tmargin-left: auto;\n";
    mediaQuery += "\t\tmargin-right: auto;\n";
    mediaQuery += `\t\tpadding: var(--padding-v) ${sizeInfo.containerPadding}px;\n`;
    mediaQuery += "\t\tdisplay: block;\n";
    mediaQuery += "\t}\n\n";

    mediaQuery += "}\n\n";
    style.innerHTML += mediaQuery;
  }
}
