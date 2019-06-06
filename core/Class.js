'use strict';

/**
 * @constructor
 */
Tigerian.MainClassDefinition = function () {};

/**
 * @param {Object} properties
 * @param {Function} superClass
 * @param {Behavior[]} behaviors
 */

Tigerian.MainClassDefinition.extend = function (properties, behaviors, superClass) {
    if (!Tigerian.MainClassDefinition.isInstance(properties, "object")) {
        properties = {};
    }
    if (!Tigerian.MainClassDefinition.isInstance(superClass, Function)) {
        superClass = Tigerian.MainClassDefinition;
    }
    // if (!(superInitArgs instanceof Array)) {
    //     superInitArgs = [];
    // }
    if (!Tigerian.MainClassDefinition.isInstance(behaviors, Array)) {
        behaviors = [];
    }

    var result = function () {
        if (!("config" in this)) {
            this.config = function () {};
        }
        /**
         * @type {function[]}
         */
        for (var bhv in behaviors) {
            var bhvCls = behaviors[bhv];
            if (Tigerian.MainClassDefinition.isSubclass(bhvCls, Tigerian.Behavior)) {
                bhvCls.call(this);
            }
        }

        /**
         * @memberOf Tigerian.MainClassDefinition
         */
        Object.defineProperty(this, "super", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function () {
                superClass.apply(this, Array.from(arguments));

                var newSuper = {};
                this.forEach(function (member, name) {
                    switch (name) {
                        case "config":
                        case "constructor":
                            break;

                        default:
                            var getter = Object.getOwnPropertyDescriptor(this, name).get;
                            var setter = Object.getOwnPropertyDescriptor(this, name).set;
                            var hasGetter = (getter !== undefined);
                            var hasSetter = (setter !== undefined);

                            if (hasGetter || hasSetter) {
                                Object.defineProperty(newSuper, name, {
                                    enumerable: true,
                                    configurable: true,
                                    get: getter,
                                    set: setter
                                });
                            } else {
                                newSuper[name] = member;
                            }
                    }
                }.bind(this));

                Object.defineProperty(this, "super", {
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: newSuper
                });
            }.bind(this),
        });

        /*
                Object.defineProperty(this, "implement", {
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: function () {
                        var behaviors = Array.from(arguments);
                        for (var bhv in behaviors) {
                            var bhvCls = behaviors[bhv];
                            if (Tigerian.MainClassDefinition.isSubclass(bhvCls, Tigerian.Behavior)) {
                                bhvCls.call(this);
                            }
                        }
                    },
                });
        */

        if ("enums" in properties) {
            for (var i = 0; i < properties["enums"].length; i++) {
                var enumValue = properties["enums"][i];
                var enumName = "E" + enumValue.charAt(0).toUpperCase() + enumValue.slice(1);
                if (!(enumName in result)) {
                    result[enumName] = Symbol(enumValue);
                }
            }
        }

        if ("init" in properties) {
            properties["init"].apply(this, Array.from(arguments));
        } else {
            superClass.apply(this, Array.from(arguments));
        }
        // superClass.apply(this, superInitArgs.concat(Array.from(arguments)));
        delete this.super;

        for (var prop in properties) {
            if (Tigerian.MainClassDefinition.isSubclass(superClass, Tigerian.Behavior) && (prop === "config")) {
                var thisConfig = this.config;
                this.config = function (behavior) {
                    var params = Array.from(arguments);
                    thisConfig.apply(this, params);
                    properties["config"].apply(this, params);
                }.bind(this);
                // configs.push(properties[prop]);
                // properties["config"].apply(this);
            } else if ((prop !== "init") && (prop !== "enums")) {
                this[prop] = properties[prop];
            }
        }
    };

    if (superClass !== Tigerian.Behavior) {
        /**
         * @param {Object} props
         * @param {Behavior...} behavs
         */
        result.extend = function (props, behaves) {
            if ((behaves !== undefined) && !Tigerian.MainClassDefinition.isInstance(behaves, Array)) {
                behaves = Array.from(arguments).splice(1);
            } else {
                behaves = [];
            }

            // return Tigerian.MainClassDefinition.extend(props, behaviors.concat(behaves), result);
            return Tigerian.MainClassDefinition.extend(props, behaves, result);
        };
    }

    result.prototype = Object.create(superClass.prototype);
    result.prototype.constructor = result;

    return result;
};

/**
 * @param {Function} subClass
 * @param {Function} superClass
 */
Tigerian.MainClassDefinition.isSubclass = function (subClass, superClass) {
    if ((subClass instanceof Function) && (superClass instanceof Function)) {
        return (Object.create(subClass.prototype) instanceof superClass);
        // return this.isInstance(Object.create(subClass.prototype), superClass);
        // return subClass.prototype == superClass.prototype;
    }
};

/**
 * @param {*} instance
 * @param {string|Function} type
 * @returns {boolean}
 */
Tigerian.MainClassDefinition.isInstance = function (instance, type) {
    if (typeof type === "string") {
        return (typeof instance === type);
    } else if (typeof type === "function") {
        return (instance instanceof type);
    } else {
        return false;
    }
};


/**
 * @class
 */
Tigerian.Class = Tigerian.MainClassDefinition.extend();
Tigerian.Class.isSubclass = Tigerian.MainClassDefinition.isSubclass;
Tigerian.Class.isInstance = Tigerian.MainClassDefinition.isInstance;