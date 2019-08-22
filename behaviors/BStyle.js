import {
  Behavior
} from "../core/Behavior.js";
import {
  strSplitCapital,
  forEach,
  Tigerian,
  instanceOf,
} from "../core/Tigerian.js";
import {
  responsiveSizes
} from "../core/Responsive.js";
import {
  EWindow
} from "./BWindow.js";

("use strict");

/* var allStylesList = [];

forEach(document.body.style, (prop, propName) => {
  allStylesList.push(propName);
});

allStylesList = allStylesList.filter((item) => {
  return ((parseInt(item) != item)) && (item[0] < "A" || item[0] > "Z") && !allStylesList.some((it) => {
    return (it !== item) && (it.replace(/-/g, "") === item.toLowerCase());
  });
});
console.log(allStylesList); */

/**
 * @constructor
 * @extends {Behavior}
 */
export class BStyle extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.defineMethod("config", (that, mainElement) => {
      var specificClass = `control-${Math.round(Date.now() * Math.random())}`;
      var styleElement = document.createElement("style");
      var styleProperty = {};
      var nodeStyles = {};
      var fragment = document.createDocumentFragment();
      var emptyNode = document.createTextNode("");
      var cloneNode = (text) => {
        var result = emptyNode.cloneNode(false);
        result.data = text;

        return result;
      };
      var style = mainElement.style;
      var allStylesList = ["align-content", "align-items", "align-self", "backface-visibility", "border-collapse", "border-image-repeat", "box-decoration-break", "box-sizing", "break-inside", "caption-side", "clear", "color-adjust", "color-interpolation", "color-interpolation-filters", "column-count", "column-fill", "direction", "display", "dominant-baseline", "empty-cells", "flex-direction", "flex-wrap", "cssFloat", "float", "font-kerning", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-weight", "grid-auto-flow", "hyphens", "image-orientation", "image-rendering", "ime-mode", "isolation", "justify-content", "justify-items", "justify-self", "list-style-position", "mask-type", "mix-blend-mode", "-moz-appearance", "-moz-box-align", "-moz-box-direction", "-moz-box-orient", "-moz-box-pack", "-moz-float-edge", "-moz-force-broken-image-icon", "-moz-orient", "-moz-stack-sizing", "-moz-text-size-adjust", "-moz-user-focus", "-moz-user-input", "-moz-user-modify", "-moz-user-select", "-moz-window-dragging", "object-fit", "outline-style", "overflow-anchor", "overflow-wrap", "paint-order", "pointer-events", "position", "resize", "ruby-align", "ruby-position", "scroll-behavior", "scroll-snap-align", "scroll-snap-type", "scrollbar-width", "shape-rendering", "stroke-linecap", "stroke-linejoin", "table-layout", "text-align", "text-align-last", "text-anchor", "text-combine-upright", "text-decoration-line", "text-decoration-style", "text-emphasis-position", "text-justify", "text-orientation", "text-rendering", "text-transform", "touch-action", "transform-box", "transform-style", "unicode-bidi", "vector-effect", "visibility", "-webkit-line-clamp", "white-space", "word-break", "writing-mode", "z-index", "break-after", "break-before", "clip-rule", "fill-rule", "-moz-box-ordinal-group", "order", "overflow-x", "overflow-y", "overscroll-behavior-x", "overscroll-behavior-y", "fill-opacity", "stroke-opacity", "flex-grow", "flex-shrink", "-moz-box-flex", "stroke-miterlimit", "flood-opacity", "opacity", "shape-image-threshold", "stop-opacity", "border-block-end-style", "border-block-start-style", "border-bottom-style", "border-inline-end-style", "border-inline-start-style", "border-left-style", "border-right-style", "border-top-style", "column-rule-style", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "background-attachment", "background-blend-mode", "background-clip", "background-image", "background-origin", "background-position-x", "background-position-y", "background-repeat", "background-size", "border-image-outset", "border-image-slice", "border-image-source", "border-image-width", "border-spacing", "box-shadow", "caret-color", "clip-path", "color", "column-width", "content", "counter-increment", "cursor", "filter", "flex-basis", "font-family", "font-feature-settings", "font-language-override", "font-size", "font-variant-alternates", "grid-template-areas", "letter-spacing", "line-height", "list-style-image", "list-style-type", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position-x", "mask-position-y", "mask-repeat", "mask-size", "-moz-tab-size", "perspective", "quotes", "scrollbar-color", "shape-outside", "stroke-dasharray", "stroke-dashoffset", "stroke-width", "text-emphasis-style", "text-indent", "text-overflow", "text-shadow", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "vertical-align", "will-change", "word-spacing", "clip", "-moz-image-region", "grid-template-columns", "grid-template-rows", "fill", "stroke", "grid-auto-columns", "grid-auto-rows", "transform-origin", "counter-reset", "counter-set", "transform", "column-gap", "row-gap", "object-position", "perspective-origin", "grid-column-end", "grid-column-start", "grid-row-end", "grid-row-start", "max-block-size", "max-height", "max-inline-size", "max-width", "marker-end", "marker-mid", "marker-start", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "block-size", "height", "inline-size", "min-block-size", "min-height", "min-inline-size", "min-width", "width", "outline-offset", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "shape-margin", "border-block-end-width", "border-block-start-width", "border-bottom-width", "border-inline-end-width", "border-inline-start-width", "border-left-width", "border-right-width", "border-top-width", "column-rule-width", "outline-width", "-webkit-text-stroke-width", "border-bottom-left-radius", "border-bottom-right-radius", "border-end-end-radius", "border-end-start-radius", "border-start-end-radius", "border-start-start-radius", "border-top-left-radius", "border-top-right-radius", "-moz-outline-radius-bottomleft", "-moz-outline-radius-bottomright", "-moz-outline-radius-topleft", "-moz-outline-radius-topright", "bottom", "inset-block-end", "inset-block-start", "inset-inline-end", "inset-inline-start", "left", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "right", "top", "background-color", "border-block-end-color", "border-block-start-color", "border-bottom-color", "border-inline-end-color", "border-inline-start-color", "border-left-color", "border-right-color", "border-top-color", "column-rule-color", "flood-color", "lighting-color", "outline-color", "stop-color", "text-decoration-color", "text-emphasis-color", "-webkit-text-fill-color", "-webkit-text-stroke-color", "background", "background-position", "border-color", "border-style", "border-width", "border-top", "border-right", "border-bottom", "border-left", "border-block-start", "border-block-end", "border-inline-start", "border-inline-end", "border", "border-radius", "border-image", "border-block-width", "border-block-style", "border-block-color", "border-inline-width", "border-inline-style", "border-inline-color", "border-block", "border-inline", "overflow", "transition", "animation", "overscroll-behavior", "page-break-before", "page-break-after", "columns", "column-rule", "font", "font-variant", "text-emphasis", "-webkit-text-stroke", "marker", "list-style", "margin", "margin-block", "margin-inline", "scroll-margin", "scroll-margin-block", "scroll-margin-inline", "outline", "-moz-outline-radius", "padding", "padding-block", "padding-inline", "scroll-padding", "scroll-padding-block", "scroll-padding-inline", "flex-flow", "flex", "gap", "grid-row", "grid-column", "grid-area", "grid-template", "grid", "place-content", "place-self", "place-items", "inset", "inset-block", "inset-inline", "text-decoration", "mask", "mask-position", "all", "-webkit-background-clip", "-webkit-background-origin", "-webkit-background-size", "-moz-border-start-color", "-moz-border-start-style", "-moz-border-start-width", "-moz-border-end-color", "-moz-border-end-style", "-moz-border-end-width", "-webkit-border-top-left-radius", "-webkit-border-top-right-radius", "-webkit-border-bottom-right-radius", "-webkit-border-bottom-left-radius", "-moz-transition-duration", "-webkit-transition-duration", "-moz-transition-timing-function", "-webkit-transition-timing-function", "-moz-transition-property", "-webkit-transition-property", "-moz-transition-delay", "-webkit-transition-delay", "-moz-animation-name", "-webkit-animation-name", "-moz-animation-duration", "-webkit-animation-duration", "-moz-animation-timing-function", "-webkit-animation-timing-function", "-moz-animation-iteration-count", "-webkit-animation-iteration-count", "-moz-animation-direction", "-webkit-animation-direction", "-moz-animation-play-state", "-webkit-animation-play-state", "-moz-animation-fill-mode", "-webkit-animation-fill-mode", "-moz-animation-delay", "-webkit-animation-delay", "-moz-transform", "-webkit-transform", "page-break-inside", "-moz-perspective", "-webkit-perspective", "-moz-perspective-origin", "-webkit-perspective-origin", "-moz-backface-visibility", "-webkit-backface-visibility", "-moz-transform-style", "-webkit-transform-style", "-moz-transform-origin", "-webkit-transform-origin", "-webkit-appearance", "-moz-column-width", "-moz-column-count", "-moz-column-fill", "-moz-column-rule-width", "-moz-column-rule-color", "-moz-column-rule-style", "-webkit-box-shadow", "-webkit-filter", "-moz-font-feature-settings", "-moz-font-language-override", "-moz-hyphens", "-webkit-text-size-adjust", "word-wrap", "-moz-margin-start", "-moz-margin-end", "-moz-padding-start", "-moz-padding-end", "-webkit-flex-direction", "-webkit-flex-wrap", "-webkit-justify-content", "-webkit-align-content", "-webkit-align-items", "-webkit-flex-grow", "-webkit-flex-shrink", "-webkit-align-self", "-webkit-order", "-webkit-flex-basis", "-moz-box-sizing", "-webkit-box-sizing", "grid-column-gap", "-moz-column-gap", "grid-row-gap", "-webkit-user-select", "-webkit-mask-repeat", "-webkit-mask-position-x", "-webkit-mask-position-y", "-webkit-mask-clip", "-webkit-mask-origin", "-webkit-mask-size", "-webkit-mask-composite", "-webkit-mask-image", "-webkit-box-align", "-webkit-box-direction", "-webkit-box-flex", "-webkit-box-orient", "-webkit-box-pack", "-webkit-box-ordinal-group", "-moz-border-start", "-moz-border-end", "-webkit-border-radius", "-moz-border-image", "-webkit-border-image", "-moz-transition", "-webkit-transition", "-moz-animation", "-webkit-animation", "-moz-columns", "-moz-column-rule", "-webkit-flex-flow", "-webkit-flex", "grid-gap", "-webkit-mask", "-webkit-mask-position", "item", "getPropertyValue", "getPropertyPriority", "setProperty", "removeProperty", "cssText", "length", "parentRule"]

      var addPageSizes = (getter, setter, propName, result = {}) => {
        forEach(responsiveSizes, (size, sizeName) => {
          Object.defineProperty(result, size.name, {
            get() {
              var re = /\s*[\w-]+\s*:\s*([\w-'"\(\)\.%\s]+);/;
              var result = re.exec(nodeStyles[size.name][propName].data);
              return ((result !== null) ? result[1].trim() : "");
            },
            set(v) {
              if (instanceOf(v, String)) {
                if (v === "") {
                  nodeStyles[size.name][propName].data = "";
                } else {
                  nodeStyles[size.name][propName].data = `\t\t${propName}: ${v};\n`;
                }
              } else if (instanceOf(v, Symbol)) {}
            },
            enumerable: true,
            configurable: true
          });
        });

        Object.defineProperty(result, EStyle.INLINE, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });

        return result;
      };

      var defineAttribute = (root, attributes, getter, setter, propName) => {
        if (attributes.length === 1) {
          if (attributes[0] in root) {
            var descriptor = Object.getOwnPropertyDescriptor(root, attributes[0]);

            Object.defineProperty(root, attributes[0], {
              enumerable: true,
              configurable: true,
              get() {
                return addPageSizes(getter, setter, propName, descriptor.get());
              },
              set: setter
            });
          } else {
            Object.defineProperty(root, attributes[0], {
              enumerable: true,
              configurable: true,
              get() {
                return addPageSizes(getter, setter, propName);
              },
              set: setter
            });
          }
        } else {
          var res;
          if (attributes[0] in root) {
            res = Object.getOwnPropertyDescriptor(root, attributes[0]).get();
            if (instanceOf(res, String)) {
              res = {};
            }
          } else {
            res = {};
          }

          Object.defineProperty(root, attributes[0], {
            enumerable: true,
            configurable: true,
            get() {
              return res;
            }
          });

          defineAttribute(res, attributes.slice(1), getter, setter, propName);
        }
      };

      forEach(allStylesList, (propName) => {
        // if (parseInt(propName) != propName) {
        // if ((propName.indexOf("-") === -1) && ((propName[0] < "A") || (propName[0] > "Z"))) {
        var propNameClear = propName.replace(/^-*(\w[\w-]*\w)-*$/, "$1");
        var attrs = propNameClear.split("-");
        // console.log(propName, propNameClear, attrs);

        // var propDashName = attrs.join("-");

        forEach(responsiveSizes, (size, sizeName) => {
          if (nodeStyles[size.name] === undefined) {
            nodeStyles[size.name] = {};
          }

          nodeStyles[size.name][propNameClear] = cloneNode("");
        });

        defineAttribute(styleProperty, attrs, () => {
          return style[propName];
        }, (v) => {
          style[propName] = v;
        }, propNameClear);
        // }
        // }
      });

      // mainElement.classList.add(specificClass);
      mainElement.id = specificClass;

      forEach(responsiveSizes, (size, sizeName) => {
        if (size.min) {
          fragment.appendChild(cloneNode(`@media only screen and (min-width: ${size.min}px) {\n`));
        } else {
          fragment.appendChild(cloneNode(`@media only screen and (max-width: ${size.max}px) {\n`));
        }
        fragment.appendChild(cloneNode(`\t#${specificClass}[element-type][element-name="container"] {\n`));

        forEach(nodeStyles[size.name], (prop, propName) => {
          fragment.appendChild(prop);
        });

        fragment.appendChild(cloneNode(`\t}\n`));
        fragment.appendChild(cloneNode(`}\n\n`));
      });

      styleElement.appendChild(fragment);
      document.head.appendChild(styleElement);

      Object.defineProperty(that, "style", {
        enumerable: true,
        configurable: true,
        get: function () {
          return styleProperty;
        }
      });
    }, [Tigerian, [Element, DocumentFragment]]);
  }
}

export const EStyle = Object.freeze({
  INLINE: Symbol("inline"),
  // INHERIT: Symbol("inherit"),
  // INITIAL: Symbol("initial"),
  // UNSET: Symbol("unset")
});