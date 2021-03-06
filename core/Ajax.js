<<<<<<< HEAD
import {
  Tigerian,
  instanceOf
} from "./Tigerian.js";
import {
  Events
} from "./Events.js";
import {
  BEvent
} from "../behaviors/BEvent.js";
=======
import { Tigerian, instanceOf, forEach } from "./Tigerian.js";
import { Events } from "./Events.js";
import { BEvent } from "../behaviors/BEvent.js";
import { BPromise } from "../behaviors/BPromise.js";
>>>>>>> ccd11a1838086e31cc5b9512a074aef87f9c3b53

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
<<<<<<< HEAD
    let that = this;
    // let success = function (responseText, responseXml, responseJson) {};
    // let unsuccess = function (readyState, status, statusText) {};
    // let progress = function (percent, loaded, total) {};
=======
    let headers = {};
    let that = this;
    // let success = (responseText, responseXml, responseJson) => {};
    // let unsuccess = (readyState, status, statusText) => {};
    // let progress = (percent, loaded, total) => {};
>>>>>>> ccd11a1838086e31cc5b9512a074aef87f9c3b53
    let async = true;
    // let method = EAjax.GET;

    if (window.XMLHttpRequest) {
      // code for modern browsers
      httpRequest = new XMLHttpRequest();
    } else {
      // code for old IE browsers
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

<<<<<<< HEAD
    this.config(BEvent, httpRequest);

    httpRequest.onreadystatechange = function () {
      that.dispatchEvent(Events.onChange, {
        state: httpRequest.readyState,
        status: httpRequest.status,
        message: httpRequest.statusText
      });

      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          let jsonObject;
          try {
            jsonObject = JSON.parse(httpRequest.responseText);
          } catch (e) {
            jsonObject = undefined;
          }
          that.dispatchEvent(Events.onSuccess, {
            text: httpRequest.responseText,
            xml: httpRequest.responseXML,
            json: jsonObject
          });
          // success(httpRequest.responseText, httpRequest.responseXML, jsonObject);
        } else {
          that.dispatchEvent(Events.onUnsuccess, {
            state: httpRequest.readyState,
            status: httpRequest.status,
            message: httpRequest.statusText
          });
          // unsuccess(httpRequest.readyState, httpRequest.status, httpRequest.statusText);
        }
      }
    };

    httpRequest.onprogress = function (e) {
      if (e.lengthComputable) {
        that.dispatchEvent(Events.onProgress, {
          percent: 100 * e.loaded / e.total,
          loaded: e.loaded,
          total: e.total
        });
      } else {
        that.dispatchEvent(Events.onProgress, {
          percent: -1,
          loaded: -1,
          total: -1
        });
      }
=======
    let sendGet = (resolve, reject, change, progress, parameters) => {
      request("GET", parameters, resolve, reject, change, progress);
    };

    let sendPost = (resolve, reject, change, progress, parameters) => {
      request("POST", parameters, resolve, reject, change, progress);
    };

    let sendPut = (resolve, reject, change, progress, parameters) => {
      request("PUT", parameters, resolve, reject, change, progress);
    };

    let sendDelete = (resolve, reject, change, progress, parameters) => {
      request("DELETE", parameters, resolve, reject, change, progress);
    };

    let sendRequest = (
      resolve,
      reject,
      change,
      progress,
      method,
      parameters
    ) => {
      request(method, parameters, resolve, reject, change, progress);
>>>>>>> ccd11a1838086e31cc5b9512a074aef87f9c3b53
    };

    this.config(
      BPromise,
      [sendGet, sendPost, sendPut, sendDelete],
      "change",
      "progress"
    );

    function jsonToQuery(params = {}) {
      if (!instanceOf(params, Object)) {
        params = {};
      }

      return encodeURI(
        Object.keys(params)
          .map(key => {
            let json = JSON.stringify(params[key]);
            return (
              key +
              "=" +
              (json !== '"' + params[key] + '"' ? json : params[key])
            );
          })
          .join("&")
      );
    }

<<<<<<< HEAD
    function request(method, params) {
      let connector = (url.indexOf("?") > 0) ? "&" : "?";
      httpRequest.open(method, url + ((method == "GET") ? connector + jsonToQuery(params) : ""), async);
=======
    function request(
      method = "GET",
      params = {},
      resolve = () => {},
      reject = () => {},
      change = () => {},
      progress = () => {}
    ) {
      let connector = url.indexOf("?") > 0 ? "&" : "?";
      httpRequest.open(
        method,
        url + (method == "GET" ? connector + jsonToQuery(params) : ""),
        async
      );

      forEach(headers, (value, label) => {
        httpRequest.setRequestHeader(label, value);
      });

>>>>>>> ccd11a1838086e31cc5b9512a074aef87f9c3b53
      // httpRequest.open(method, url, true);
      // httpRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

      if (httpRequest.status !== 0 && httpRequest.status !== 200) {
        httpRequest.abort();
      }

      httpRequest.onreadystatechange = () => {
        change(
          httpRequest.readyState,
          httpRequest.status,
          httpRequest.statusText
        );
        // that.dispatchEvent(Events.onChange, {
        //   state: httpRequest.readyState,
        //   status: httpRequest.status,
        //   message: httpRequest.statusText
        // });

        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            let jsonObject;
            try {
              jsonObject = () => JSON.parse(httpRequest.responseText);
            } catch (e) {
              jsonObject = () => undefined;
            }

            resolve(
              httpRequest.responseText,
              httpRequest.responseXML,
              jsonObject
            );
            // that.dispatchEvent(Events.onSuccess, {
            //   text: httpRequest.responseText,
            //   xml: httpRequest.responseXML,
            //   json: jsonObject
            // });
            // success(httpRequest.responseText, httpRequest.responseXML, jsonObject);
          } else {
            reject(
              new Error(httpRequest.readyState),
              new Error(httpRequest.status),
              new Error(httpRequest.statusText)
            );
            // that.dispatchEvent(Events.onUnsuccess, {
            //   state: httpRequest.readyState,
            //   status: httpRequest.status,
            //   message: httpRequest.statusText
            // });
            // unsuccess(httpRequest.readyState, httpRequest.status, httpRequest.statusText);
          }
        }
      };

      httpRequest.onprogress = e => {
        if (e.lengthComputable) {
          progress((100 * e.loaded) / e.total, e.loaded, e.total);
          // that.dispatchEvent(Events.onProgress, {
          //   percent: (100 * e.loaded) / e.total,
          //   loaded: e.loaded,
          //   total: e.total
          // });
        } else {
          progress(-1, e.loaded, -1);
          // that.dispatchEvent(Events.onProgress, {
          //   percent: -1,
          //   loaded: -1,
          //   total: -1
          // });
        }
      };

      httpRequest.send(JSON.stringify(params));
    }

    this.defineMethod(
      "addHeader",
      (label, value) => {
        headers[label] = value;
      },
      [String, String]
    );

    this.defineMethod("abort", () => {
      httpRequest.abort();
    });

    this.defineProperty("async", {
      get() {
        return async;
      },
      set(v) {
        async = v;
      },
      type: Boolean
    });

<<<<<<< HEAD
=======
    // this.defineProperty("method", {
    //   get() {
    //     return method;
    //   },
    //   set(v) {
    //     switch (v) {
    //       case EAjax.GET:
    //       case EAjax.POST:
    //       case EAjax.PUT:
    //       case EAjax.DELETE:
    //         method = v;
    //         break;

    //       default:
    //     }
    //   },
    //   type: Symbol
    // });

>>>>>>> ccd11a1838086e31cc5b9512a074aef87f9c3b53
    /* this.defineProperty("success", {
      get() {
        return success;
      },
      set(v) {
        success = v;
      },
      type: Function
    }); */

    /* this.defineProperty("unsuccess", {
      get() {
        return unsuccess;
      },
      set(v) {
        unsuccess = v;
      },
      type: Function
    }); */

    /* this.defineProperty("progress", {
      get() {
        return progress;
      },
      set(v) {
        progress = v;
      },
      type: Function
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
}

// export const EAjax = Object.freeze({
//   GET: Symbol("get"),
//   POST: Symbol("post"),
//   PUT: Symbol("put"),
//   DELETE: Symbol("delete")
// });
