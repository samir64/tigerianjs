import {
  Tigerian,
  instanceOf
} from "./Tigerian.js";

("use strict");

/**
 * @class
 * @extends {Class}
 */
export class Ajax extends Tigerian {
  /**
   * @constructs
   * @param {string} url
   */
  constructor(url) {
    super();

    let httpRequest;
    let success = function (responseText, responseXml, responseJson) {};
    let unsuccess = function (readyState, status, statusText) {};
    let progress = function (percent, loaded, total) {};
    let async = true;

    if (window.XMLHttpRequest) {
      // code for modern browsers
      httpRequest = new XMLHttpRequest();
    } else {
      // code for old IE browsers
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    httpRequest.onreadystatechange = changeState;
    httpRequest.onprogress = function (e) {
      if (e.lengthComputable) {
        progress(100 * e.loaded / e.total, e.loaded, e.total);
      } else {
        progress(-1);
      }
    };

    function jsonToQuery(params = {}) {
      if (!instanceOf(params, Object)) {
        params = {};
      }

      return encodeURI(Object.keys(params).map(function (key) {
        let json = JSON.stringify(params[key]);
        return key + "=" + (json !== "\"" + params[key] + "\"" ? json : params[key]);
      }).join("&"));
    }

    function changeState() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          let jsonObject;
          try {
            jsonObject = JSON.parse(this.responseText);
          } catch (e) {}
          success(this.responseText, this.responseXML, jsonObject);
        } else {
          unsuccess(this.readyState, this.status, this.statusText);
        }
      }
    }

    function request(method, params) {
      let connector = (url.indexOf("?") > 0) ? "&" : "?";
      httpRequest.open(method, url + ((method == "GET") ? connector + jsonToQuery(params) : ""), async);
      // httpRequest.open(method, url, true);
      // httpRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

      if ((httpRequest.status !== 0) && (httpRequest.status !== 200)) {
        httpRequest.abort();
      }
      httpRequest.send(JSON.stringify(params));
    }

    this.defineMethod("addHeader", (label, value) => {
      httpRequest.setREquestHeader(label, value);
    }, [String, String]);
    /**
     * @param {string} label
     * @param {string} value
     */
    /* this.addHeader = function (label, value) {
        httpRequest.setRequestHeader(label, value);
    }; */

    this.defineMethod("abort", () => {
      httpRequest.abort();
    });
    /* this.abort = function () {
        httpRequest.abort();
    }; */

    this.defineMethod("get", (parameters) => {
      request("GET", parameters);
    }, [Object]);
    /**
     * @param {Object} parameters
     */
    /* this.get = function (parameters) {
        request("GET", parameters);
    }; */

    this.defineMethod("post", (parameters) => {
      request("POST", parameters);
    }, [Object]);
    /**
     * @param {Object} parameters
     */
    /* this.post = function (parameters) {
        request("POST", parameters);
    }; */

    this.defineMethod("put", (parameters) => {
      request("PUT", parameters);
    }, [Object]);
    /**
     * @param {Object} parameters
     */
    /* this.put = function (parameters) {
        request("PUT", parameters);
    }; */

    this.defineMethod("delete", (parameters) => {
      request("DELETE", parameters);
    }, [Object]);
    /**
     * @param {Object} parameters
     */
    /* this.delete = function (parameters) {
        request("DELETE", parameters);
    }; */

    this.defineProperty("async", {
      get() {
        return async;
      },
      set(v) {
        async = v;
      },
      type: Boolean
    });
    /**
     * @member {boolean}
     */
    /* Object.defineProperty(this, "async", {
        enumerable: false,
        configurable: true,
        get() {
            return async;
        },
        set(v) {
            if (instanceOf(v, "boolean")) {
                async = v;
            }
        },
    }); */

    this.defineProperty("success", {
      get() {
        return success;
      },
      set(v) {
        success = v;
      },
      type: Function
    });
    /**
     * @member {Function}
     */
    /* Object.defineProperty(this, "success", {
        enumerable: false,
        configurable: true,
        get() {
            return success;
        },
        set(v) {
            if (v instanceof Function) {
                success = v;
            }
        },
    }); */

    this.defineProperty("unsuccess", {
      get() {
        return unsuccess;
      },
      set(v) {
        unsuccess = v;
      },
      type: Function
    });
    /**
     * @member {Function}
     */
    /* Object.defineProperty(this, "unsuccess", {
        enumerable: false,
        configurable: true,
        get() {
            return unsuccess;
        },
        set(v) {
            if (v instanceof Function) {
                unsuccess = v;
            }
        },
    }); */

    this.defineProperty("progress", {
      get() {
        return progress;
      },
      set(v) {
        progress = v;
      },
      type: Function
    });
    /**
     * @member {Function}
     */
    /* Object.defineProperty(this, "progress", {
        enumerable: false,
        configurable: true,
        get() {
            return progress;
        },
        set(v) {
            if (v instanceof Function) {
                progress = v;
            }
        },
    }); */

    this.defineProperty("url", {
      get() {
        return url;
      },
      set(v) {
        url = v;
      },
      type: String
    });
  }
};