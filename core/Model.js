import "./Tigerian.js";

export class Field {
  #type;
  #default;
  #required;

  constructor(type, def, required = false) {
    if (def !== undefined) {
      if (!!type) {
        const typeOfV = toString.call(def);
        const typeOfField = toString.call(type.prototype);

        if (typeOfV !== typeOfField) {
          throw `Value type for ${this.name} is not valid. Expected ${type.name}`;
        }
      }
    }

    this.#type = type;
    this.#default = def;
    this.#required = required;
  }

  get default() {
    return this.#default;
  }

  get type() {
    return this.#type;
  }

  get required() {
    return this.#required;
  }
}

export class Api {
  #urls = {
    base: "",
    getOne: ":id",
    get: "",
    edit: ":id",
    delete: ":id",
    add: "",
  };
  #methods = {
    getOne: "GET",
    get: "GET",
    add: "POST",
    edit: "PATCH",
    delete: "DELETE",
  };

  constructor(baseUrl = "/") {
    this.#urls.base = baseUrl;
  }

  get baseUrl() {
    return this.#urls.base;
  }

  setBaseUrl(v) {
    this.#urls.base = v;
    return this;
  }

  get getOneUrl() {
    return this.#urls.getOne;
  }

  setGetOneUrl(v) {
    this.#urls.getOne = v;
    return this;
  }

  get getUrl() {
    return this.#urls.get;
  }

  setGetUrl(v) {
    this.#urls.get = v;
    return this;
  }

  get editUrl() {
    return this.#urls.edit;
  }

  setEditUrl(v) {
    this.#urls.edit = v;
    return this;
  }

  get addUrl() {
    return this.#urls.add;
  }

  setAddUrl(v) {
    this.#urls.add = v;
    return this;
  }

  get deleteUrl() {
    return this.#urls.delete;
  }

  setDeleteUrl(v) {
    this.#urls.delete = v;
    return this;
  }

  get getOneMethod() {
    return this.#methods.getOne;
  }

  setGetOneMethod(v) {
    this.#methods.getOne = v;
    return this;
  }

  get getMethod() {
    return this.#methods.get;
  }

  setGetMethod(v) {
    this.#methods.get = v;
    return this;
  }

  get editMethod() {
    return this.#methods.edit;
  }

  setEditMethod(v) {
    this.#methods.edit = v;
    return this;
  }

  get addMethod() {
    return this.#methods.add;
  }

  setAddMethod(v) {
    this.#methods.add = v;
    return this;
  }

  get deleteMethod() {
    return this.#methods.delete;
  }

  setDeleteMethod(v) {
    this.#methods.delete = v;
    return this;
  }
}

export class Model {
  static id = new Field();

  constructor(fields = {}) {
    const allFields = Object.entries(this.constructor)
    allFields.push(["id", Model.id]);

    allFields.filter(([key, value]) => value instanceof Field).forEach(([name, field]) => {
      let fieldValue;

      Object.defineProperty(this, name, {
        get() {
          return fieldValue;
        },
        set(v) {
          if ((v === undefined) && !!field.required) {
            throw `Field ${name} is required`;
          }

          if (!!field.type) {
            const typeOfV = toString.call(v);
            const typeOfField = toString.call(field.type.prototype);

            if (typeOfV !== typeOfField) {
              throw `field type for ${name} is not valid. Expected ${field.type.name}`;
            }
          }

          if (field?.type?.prototype instanceof Model) {
            fieldValue = new field.type(fields[name]);
          } else {
            fieldValue = v;
          }
        },
        enumerable: true,
        configurable: false,
      });

      this[name] = fields[name] ?? field.default;
    });
  }

  static sendRequest(method, url, params = {}, query = {}, body) {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams(query);
      Object.entries(params).forEach(([param, value]) => {
        const re = new RegExp(`(/:${param}\b|/:${param}$)`, "g");
        url = url.replace(re, "/" + value);
      });

      url = url.replace(/\/{2,}/g, "/");

      fetch(url + "?" + queryParams.toString(), {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(response => {
        const model = new this(response);

        resolve(model);
        // console.log({ method, url, params, query, body, model, response});
      });
    });
  }

  static getOne(id, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/").toKebabCase();
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.getOneUrl;
    const method = api.getOneMethod.toUpperCase();

    return this.sendRequest(method, url, { id });
  }

  static get(fields, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.getUrl;
    const method = api.getMethod.toUpperCase();

    return this.sendRequest(method, url, {}, fields);
  }

  static edit(id, fields, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.editUrl;
    const method = api.editMethod.toUpperCase();

    return this.sendRequest(method, url, { id }, {}, fields);
  }

  static add(fields, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.addUrl;
    const method = api.addMethod.toUpperCase();

    return this.sendRequest(method, url, {}, {}, fields);
  }

  static delete(id, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.deleteUrl;
    const method = api.deleteMethod.toUpperCase();

    return this.sendRequest(method, url, { id });
  }
}

const  defaultApi = new Api();
export default defaultApi;

