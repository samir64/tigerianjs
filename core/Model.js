import "./Tigerian.js";

export class Field {
  #type;
  #default;
  #required;
  #target;

  constructor(options = {}) {
    if (options.default !== undefined) {
      if (!!options.type) {
        const typeOfV = toString.call(options.default);
        const typeOfField = toString.call(options.type.prototype);

        if (typeOfV !== typeOfField) {
          throw `value type for ${this.name} is not valid. Expected ${options.type.name}`;
        }
      }
    }

    this.#type = options.type;
    this.#default = options.default;
    this.#required = options.required;
    this.#target = options.target;
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

  get target() {
    return this.#target;
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
  #dataPath = true;

  constructor(baseUrl = "/", dataPath = "") {
    this.#urls.base = baseUrl;
    this.#dataPath = dataPath;
  }

  get dataPath() {
    return this.#dataPath;
  }

  setDataPath(v) {
    this.#dataPath = v;
    return this;
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

  static #getFieldByPath(data, [key, ...others], allOthers = {}) {
    let result = !!key ? data[key] : data;
    if (!allOthers.data) {
      allOthers.data = JSON.parse(JSON.stringify(data));
      allOthers.path = [];
    }
    if (!!key) {
      allOthers.path.push(key);
    }

    if (others.length > 0) {
      return Model.#getFieldByPath(result ?? {}, others, allOthers);
    } else {
      if (!!result) {
        if (!!key) {
          let d = allOthers.data;
          const lastKey = allOthers.path.splice(-1);
          allOthers.path.forEach(k => {
            d = d[k];
          });
          if (lastKey.length > 0) {
            allOthers.path.push(lastKey[0]);
          }

          delete d[key];
        } else {
          Object.keys(allOthers.data).forEach(key => delete allOthers.data[key]);
        }
      }

      return result;
    }
  }

  static #checkApi(customApi = {}) {
    if (customApi instanceof Api) {
      return customApi;
    } else {
      const result = new Api();
      result.setBaseUrl(customApi.baseUrl ?? defaultApi.baseUrl);
      result.setDataPath(customApi.dataPath ?? defaultApi.dataPath);

      result.setGetOneUrl(customApi.getOneUrl ?? defaultApi.getOneUrl);
      result.setGetUrl(customApi.getUrl ?? defaultApi.getUrl);
      result.setEditUrl(customApi.editUrl ?? defaultApi.editUrl);
      result.setAddUrl(customApi.addUrl ?? defaultApi.addUrl);
      result.setDeleteUrl(customApi.deleteUrl ?? defaultApi.deleteUrl);
      
      result.setGetOneMethod(customApi.getOneMethod ?? defaultApi.getOneMethod);
      result.setGetMethod(customApi.getMethod ?? defaultApi.getMethod);
      result.setEditMethod(customApi.editMethod ?? defaultApi.editMethod);
      result.setEditMethod(customApi.editMethod ?? defaultApi.editMethod);
      result.setAddMethod(customApi.addMethod ?? defaultApi.addMethod);
      result.setDeleteMethod(customApi.deleteMethod ?? defaultApi.deleteMethod);

      return result;
    }
  }

  constructor(fields = {}) {
    const allFields = Object.entries({...Model, ...this.constructor})

    allFields.filter(([key, value]) => value instanceof Field).forEach(([name, field]) => {
      let fieldValue;

      const descriptor = {
        get() {
          return fieldValue;
        },
        enumerable: true,
        configurable: false,
      };

      if (name === "id") {
        let value;
        if (!!field.target) {
          value = Model.#getFieldByPath(fields, field.target.split("."));
        } else {
          value = fields[name];
        }
        fieldValue = value;
      } else {
        descriptor.set = v => {
          if ((v === undefined) && !!field.required) {
            throw `Field ${name} is required`;
          }

          if ((v !== undefined) && !!field.type) {
            const typeOfV = toString.call(v);
            const typeOfField = toString.call(field.type.prototype);

            if (typeOfV !== typeOfField) {
              throw `field type for ${name} is not valid. Expected ${field.type.name}`;
            }
          }

          if (field?.type?.prototype instanceof Model) {
            fieldValue = new field.type(v);
          } else {
            if (!!field.type) {
              fieldValue = (v !== undefined) ? field.type(v) : undefined;
            } else {
              fieldValue = v;
            }
          }
        };
      }

      Object.defineProperty(this, name, descriptor);

      let value;
      if (!!field.target) {
        value = Model.#getFieldByPath(fields, field.target.split("."));
      } else {
        value = fields[name];
      }

      if (name !== "id") {
        this[name] = value ?? field.default;
      }
    });
  }

  save() {
    if (!!this.id) {
      this.constructor.edit(this.id, this);
    }
  }

  fetch() {
    if (!!this.id) {
      this.constructor.getOne(this.id);
      // TODO: Reset fields
    }
  }

  toJson() {
    const allFields = Object.entries({...Model, ...this.constructor})
    const result = {};
    allFields.filter(([key, value]) => value instanceof Field).forEach(([name, field]) => {
      if (field.type?.prototype instanceof Model) {
        result[name] = this[name].toJson();
      } else {
        result[name] = this[name];
      }
    });

    return result;
  }

  static json() {
    const allFields = Object.entries({...Model, ...this})
    const result = {};

    allFields.filter(([key, value]) => value instanceof Field).forEach(([name, field]) => {
      let def;
      const type = field.type ?? String;

      if (type.prototype instanceof Model) {
        def = type.json(); 
      } else {
        if (field.default !== undefined) {
          def = field.default;
        } else {
          def = type();
        }
      }
      result[name] = def;
    });

    return result;
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
        resolve(response);
      });
    });
  }

  static async getOne(id, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/").toKebabCase();
    const api = Model.#checkApi(customApi);
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.getOneUrl;
    const method = api.getOneMethod.toUpperCase();

    const response = await this.sendRequest(method, url, { id });
    const allOthers = {};
    const modelData = Model.#getFieldByPath(response, api.dataPath.split("."), allOthers);
    let result = {
      data: new this(modelData),
      ...allOthers.data,
    }

    return result;
  }

  static async get(fields, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.getUrl;
    const method = api.getMethod.toUpperCase();

    const response = await this.sendRequest(method, url, {}, fields);
    let result = response;

    return result;
  }

  static async edit(id, fields, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.editUrl;
    const method = api.editMethod.toUpperCase();

    const response = await this.sendRequest(method, url, { id }, {}, fields);
    let result = response;

    return result;
  }

  static async add(fields, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.addUrl;
    const method = api.addMethod.toUpperCase();

    const response = await this.sendRequest(method, url, {}, {}, fields);
    let result = response;

    return result;
  }

  static async delete(id, path, customApi) {
    const className = /^class (\w+)/.exec(this)[1].replace(/_+/g, "/");
    const api = customApi ?? defaultApi;
    const url = api.baseUrl +"/" + (path ?? className) + "/" + api.deleteUrl;
    const method = api.deleteMethod.toUpperCase();

    const response = await this.sendRequest(method, url, { id });
    let result = response;

    return result;
  }
}

const  defaultApi = new Api();
export default defaultApi;

