("use strict");
/**
 * @return {boolean}
 * @param {*} that
 */
Object.defineProperty(Object.prototype, "compare", {
  enumerable: false,
  configurable: true,
  writable: true,
  value(that) {
    if (typeof this !== typeof that) {
      return false;
    }

    if (this instanceof Array && that instanceof Array) {
      if (this.length === that.length) {
        return this.every(function(value, index) {
          if (value instanceof Array) {
            if (that[index] instanceof Array) {
              return compare(value, that[index]);
            } else {
              return false;
            }
          } else {
            return compare(value, that[index]);
          }
        });
      } else {
        return false;
      }
    } else if (typeof this === "object" && typeof that === "object") {
      var result = true;

      var key;
      for (key in this) {
        if (result) {
          if (key in that) {
            result = compare(this[key], that[key]);
          } else {
            result = false;
          }
        }
      }

      for (key in that) {
        result = result && key in this;
      }

      return result;
    } else {
      return this === that;
    }
  }
});

Object.defineProperty(Object.prototype, "instanceof", {
  enumerable: false,
  configurable: true,
  writable: false,
  value(type) {
    if (typeof type === "string") {
      return typeof this === type;
    } else if (typeof type === "function") {
      return this instanceof type;
    } else {
      return false;
    }
  }
});

Object.defineProperty(Object.prototype, "clone", {
  enumerable: false,
  configurable: true,
  writable: true,
  value(appendTo) {
    var result = {};

    this.forEach((item, name, that) => {
      var member = Object.getOwnPropertyDescriptor(that, name);
      if (appendTo !== undefined) {
        if ("value" in member) {
          Object.defineProperty(appendTo, name, {
            enumerable: member.enumerable,
            configurable: member.configurable,
            value: member.value
          });
        } else {
          Object.defineProperty(appendTo, name, {
            enumerable: member.enumerable,
            configurable: member.configurable,
            get: member.get,
            set: member.set
          });
        }
      }
      if ("value" in member) {
        Object.defineProperty(result, name, {
          enumerable: member.enumerable,
          configurable: member.configurable,
          value: member.value
        });
      } else {
        Object.defineProperty(result, name, {
          enumerable: member.enumerable,
          configurable: member.configurable,
          get: member.get,
          set: member.set
        });
      }
    });

    return result;
  }
});

/**
 * @param {Function(item, index, list)} callback
 */
Object.defineProperty(Object.prototype, "forEach", {
  value(callback) {
    if (callback instanceof Function) {
      for (var index in this) {
        callback(this[index], index, this);
      }
    }
  },
  writable: true,
  configurable: true,
  enumerable: false
});
