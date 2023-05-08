import { BaseControl } from "./Tigerian.js";
import Router from "./Router.js";
import BWatch from "../behaviors/BWatch.js";
import BView from "../behaviors/BView.js";

const mergeTemplates = templates => {
  if (!Array.isArray(templates)) {
    templates = [templates];
  }

  return that => {
    const result = document.createElement("div");
    templates.forEach(t => {
      const tf = t(that);
      Array.from(tf.childNodes).forEach(child => {
        result.appendChild(child);
      })
    });
    return result;
  };
};

export const template = function (strings, ...keys) {
  return function (that) {
    const nodes = {};

    const result = [strings[0]];
    const el = document.createElement("div");
    const definedProperties = [];
    const defaults = {};

    keys.forEach((key, i) => {
      let value = "";

      if (!key["?"]) {
        if (key instanceof HTMLElement) {
          value = `<tg-replace-node name="${i}"></tg-replace-node>`;
        } else {
          value = key;
        }
      } else {
        value = `<tg-replace-node name="${i}"></tg-replace-node>`;
        keys[i] = key["?"];
      }

      result.push(value, strings[i + 1]);
    });

    el.innerHTML = result.join("");
    replaceNodes(el);

    return el;

    function replaceNodes(root) {
      Array.from(root.children).forEach(node => {
        replaceNodes(node);
      });

      if (root.tagName === "STYLE") {
        const re = /<tg-replace-node\s+name="([\w\.]+)"><\/tg-replace-node>/gm;
        const html = root.innerHTML;
        let lastIndex = 0;
        let nextNode;
        root.innerHTML = "";

        while ((nextNode = re.exec(html)) !== null) {
          const nodeBefore = document.createTextNode(html.substr(lastIndex, nextNode.index));
          lastIndex = nextNode.index + nextNode[0].length;
          const nodeWatch = keys[nextNode[1]];
          root.appendChild(nodeBefore);
          root.appendChild(nodeWatch);
        }
        const nodeLast = document.createTextNode(html.substr(lastIndex));
        root.appendChild(nodeLast);
      } else {
        const tgReplaceNodes = Array.from(root.children ?? []).filter(el => el.tagName === "TG-REPLACE-NODE");

        tgReplaceNodes.forEach(node => {
          const index = parseInt(node.getAttribute("name"));
          root.insertBefore(keys[index], node);
          root.removeChild(node);
        });
      }
    }
  };
};

const ElementControl = Ctrl => class extends HTMLElement {
  constructor() {
    super();

    new Ctrl(this);
  }

  connectedCallback(){
  }
};

export class Control extends BaseControl {
  #el;
  #loaded = false;
  #loadEvents = [];

  get template() {
    return template``;
  }

  get layout() {}

  get data() {
    return {};
  }

  mounted() {}

  #checkAttributes(els) {
    els.forEach(el => {
      const attrs = Array.from(el.attributes);
      const elControl = el.control ?? new BaseControl(el);

      elControl.baseUrl = this.baseUrl;

      attrs.forEach(({name, value}) => {
        switch (name[0]) {
        case "@":
          el.addEventListener(name.substr(1), this[value].bind(this));
          el.addEventListener(name.substr(1), () => elControl.emit(name.substr(1)));
          el.removeAttribute(name);
          // elControl.addEvent(name, this[value].bind(this));
          break;

        case ":":
          name = name.substr(1);

          switch (name) {
          case "class":
            Object.entries(this.data[value]).forEach(([className, val]) => {
              if (!!val) {
                el.classList.add(className);
              } else {
                el.classList.remove(className);
              }

              this.data[value]["@" + className] = v => {
                if (!!v.value) {
                  el.classList.add(className);
                } else {
                  el.classList.remove(className);
                }
              }
            });
            break;

          case "style":
            Object.entries(this.data[value]).forEach(([style, val]) => {
              el.style[style] = val;
              this.data[value]["@" + style] = v => {
                el.style[style] = v.value;
              }
            });
            break;

          default:
            switch (name) {
            // case "for":
            //   console.log("For", this.data[value]);
            //   break;

            // case "in":
            //   console.log("In", this.data[value]);
            //   break;

            case "if":
              elControl.visible = this.data[value];
              this.data["@" + value] = (v) => {
                elControl.visible = v.value;
              }
              // TODO: Bind element `visible` property to `value` variable of `this.data`
              break;

            default:
              elControl.data[name] = this.data[value];
              if (typeof this.data[value] === "string") {
                elControl.data["$" + name] = this.data[value];
              }
            }
          }

          el.removeAttribute(":" + name);
          break;

        default:
          elControl.data[name] = value;
        }
      });

      this.#checkAttributes(Array.from(el.children));
    });
  }

  #init() {
    let templateFormatter = mergeTemplates(this.template);
    // const shadow = this.#el.shadowRoot ?? this.#el.attachShadow({ mode: "open" });
    let shadow;

    if (!!this.layout) {
      // const elLayout = document.createElement("div");
      const ctrlLayout = new this.layout(this.#el);
      if (ctrlLayout instanceof Control) {
        // ctrlLayout.onload = () => {
          // shadow.appendChild(elLayout.shadowRoot);
          // this.#el.appendChild(elLayout);
        // };
      };

      Object.defineProperty(this, "layout", {
        get() {
          return ctrlLayout;
        },
        enumerable: false,
        configurable: false,
      });
    } else {
      shadow = this.#el.shadowRoot ?? this.#el.attachShadow({ mode: "open" });
    }

    customElements.whenDefined("tg-" + this.constructor.name.toKebabCase()).then(() => {
      const elementHtml = templateFormatter(this);

      Array.from(elementHtml.childNodes ?? []).forEach(node => {
        if (!!this.layout) {
          this.#el.appendChild(node);
        } else {
          shadow.appendChild(node);
        }
      });


      this.#checkAttributes(Array.from(this.#el.shadowRoot.children));

      this.mounted();
      this.#onload();
      this.#loaded = true;
    });
  }

  constructor(el) {
    const hasEl = !!el;

    if (!el) {
      el = document.createElement("div");
    }
    super(el);

    this.#el = el;

    el.setAttribute("tg-" + this.constructor.name.toKebabCase(), "");

    this.config(BWatch, this.data);
    this.config(BView);

    this.#init();
  }

  #onload() {
    this.#loadEvents.forEach(event => event());
  }

  set onload(v) {
    if (typeof v !== "function") {
      return;
    }

    this.#loadEvents.push(v);

    if (!!this.#loaded) {
      v();
    }
  }

  static create() {
    customElements.define("tg-" + this.name.toKebabCase(), ElementControl(this));
  }

  getTemplateById(id) {
    const elTemplate = document.body.querySelector("template#" + id);
    const result = eval(`template\`${elTemplate?.innerHTML ?? ""}\``);

    return result;
  }
}
