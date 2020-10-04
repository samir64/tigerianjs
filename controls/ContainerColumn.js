"use strict";

import { Control } from "../core/Control.js";
import { EResponsive } from "../core/Responsive.js";
import { ContainerRow } from "./ContainerRow.js";

export class ContainerColumn extends Control {
  constructor(parent, column) {
    super(parent);

    this.elementName = "container";

    //NOTE Attributes
    this.attribute("xsmallColumn", Number, column, (method, value) => {
      if (method === "set") {
        this.style[EResponsive.XSMALL].setProperty("--column", value);
      }

      return value;
    });
    this.attribute("smallColumn", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.SMALL].setProperty("--column", value);
        } else {
          this.style[EResponsive.SMALL].removeProperty("--column");
        }
      }

      return value;
    });
    this.attribute("mediumColumn", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.MEDIUM].setProperty("--column", value);
        } else {
          this.style[EResponsive.MEDIUM].removeProperty("--column");
        }
      }

      return value;
    });
    this.attribute("largeColumn", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.LARGE].setProperty("--column", value);
        } else {
          this.style[EResponsive.LARGE].removeProperty("--column");
        }
      }

      return value;
    });
    this.attribute("xlargeColumn", Number, 0, (method, value) => {
      if (method === "set") {
        if (value > 0) {
          this.style[EResponsive.XLARGE].setProperty("--column", value);
        } else {
          this.style[EResponsive.XLARGE].removeProperty("--column");
        }
      }

      return value;
    });

    this.addRow = (xsmallColCount = 12, smallColCount, mediumColCount, largeColCount, xlargeColCount) => new ContainerRow(this, xsmallColCount, smallColCount, mediumColCount, largeColCount, xlargeColCount);

    this.style[EResponsive.XSMALL].setProperty("--column", column);
  }
}