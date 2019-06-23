(function() {
  ("use strict");

  var style = document.createElement("style");

  document.head.appendChild(style);

  style.innerHTML = "";

  var sizeList = {
    small: {
      min: null,
      max: 575.98,
      containerWidth: "100%",
      containerPadding: 0
    },
    medium: {
      min: 576,
      max: 767.98,
      containerWidth: "575px",
      containerPadding: 15
    },
    normal: {
      min: 768,
      max: 991.98,
      containerWidth: "750px",
      containerPadding: 15
    },
    large: {
      min: 992,
      max: 1199.98,
      containerWidth: "970px",
      containerPadding: 15
    },
    xlarge: {
      min: 1200,
      max: null,
      containerWidth: "1170px",
      containerPadding: 15
    }
  };

  for (var size in sizeList) {
    var limit = "";
    if (sizeList[size].min) {
      limit = "(min-width: {}px)".format(sizeList[size].min);
    }
    if (sizeList[size].max) {
      if (limit !== "") {
        limit += " and ";
      }
      limit += "(max-width: {}px)".format(sizeList[size].max);
    }
    var mediaQuery = "@media only screen and {} {\n".format(limit);

    var sizeNames = Object.keys(sizeList);
    sizeNames.splice(sizeNames.indexOf(size), 1);
    for (var col = 1; col <= 12; col++) {
      mediaQuery += '\t[{this}-column="{col}"],\n'.format({
        this: size,
        col: col
      });
      for (var j = 0; j < sizeNames.length; j++) {
        if (j > 0) {
          mediaQuery += ",\n";
        }
        mediaQuery += '\t[{this}-column="{that}"][{that}-column="{col}"]'.format(
          {
            this: size,
            that: sizeNames[j],
            col: col
          }
        );
      }
      mediaQuery += " {\n\t\twidth: {width}% !IMPORTANT;\n\t}\n\n".format({
        width: (col * 100) / 12
      });
    }

    mediaQuery += '\t[element-name="container"][hide-on-{}="true"] {\n'.format(
      size
    );
    mediaQuery += "\t\tdisplay: none;\n\t}\n\n";

    mediaQuery += '\t[element-type="Container"][element-name="container"] {\n';
    mediaQuery += "\t\twidth: {} !IMPORTANT;\n".format(
      sizeList[size].containerWidth
    );

    mediaQuery += "\t\tmargin-left: auto !IMPORTANT;\n";
    mediaQuery += "\t\tmargin-right: auto !IMPORTANT;\n";
    mediaQuery += "\t\tpadding-left: {}px !IMPORTANT;\n".format(
      sizeList[size].containerPadding
    );
    mediaQuery += "\t\tpadding-right: {}px !IMPORTANT;\n".format(
      sizeList[size].containerPadding
    );
    mediaQuery += "\t\tdisplay: block;\n";
    mediaQuery += "\t}\n\n";

    mediaQuery += "}\n\n";
    style.innerHTML += mediaQuery;
  }
})();
