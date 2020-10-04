"use strict";

import {
  Control
} from "../core/Control.js";
import {
  EResponsive
} from "../core/Responsive.js";
import {
  ContainerColumn
} from "./ContainerColumn.js";

export class ContainerRow extends Control {
  constructor(parent, columnCount = 12) {
    super(parent);

    this.elementName = "container";

    this.attribute("xsmallColumnCount", Number, columnCount, (method, value) => {
      if (method === "set") {
        this.style[EResponsive.XSMALL].setProperty("--column-count", value);
      }

      return value;
    });
    this.attribute("smallColumnCount", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.SMALL].setProperty("--column-count", value);
        } else {
          this.style[EResponsive.SMALL].removeProperty("--column-count");
        }
      }

      return value;
    });
    this.attribute("mediumColumnCount", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.MEDIUM].setProperty("--column-count", value);
        } else {
          this.style[EResponsive.MEDIUM].removeProperty("--column-count");
        }
      }

      return value;
    });
    this.attribute("largeColumnCount", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.LARGE].setProperty("--column-count", value);
        } else {
          this.style[EResponsive.LARGE].removeProperty("--column-count");
        }
      }

      return value;
    });
    this.attribute("xlargeColumnCount", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.XLARGE].setProperty("--column-count", value);
        } else {
          this.style[EResponsive.XLARGE].removeProperty("--column-count");
        }
      }

      return value;
    });

    this.addColumn = (column = columnCount) => new ContainerColumn(this, column);

    this.style[EResponsive.XSMALL].setProperty("--column-count", columnCount);
  }
}