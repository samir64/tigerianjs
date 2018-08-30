
'use strict';

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
        Object.defineProperty(this, "super", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function () {
                return superClass.apply(this, Array.from(arguments));
            },
        });

        if ("init" in properties) {
            properties["init"].apply(this, Array.from(arguments));
        } else {
            superClass.apply(this, Array.from(arguments));
        }
        // superClass.apply(this, superInitArgs.concat(Array.from(arguments)));
        delete this.super;

        for (var bhv in behaviors) {
            if (Tigerian.MainClassDefinition.isSubclass(behaviors[bhv], Tigerian.Behavior)) {
                var bhvCls = behaviors[bhv];
                bhvCls.call(this);
            }
        }

        for (var prop in properties) {
            if (prop !== "init") {
                this[prop] = properties[prop];
            }
        }
    };

    /**
     * @param {Object} props
     * @param {Behavior...} behavs
     */
    result.extend = function (props, behavs) {
        if (!Tigerian.MainClassDefinition.isInstance(behavs, Array)) {
            behavs = Array.from(arguments).splice(1);
        }
        return Tigerian.MainClassDefinition.extend(props, behaviors.concat(behavs), result);
    };
    // result.extend = function (props, superArgs, behaviors) {
    //     return Tigerian.Class.extend(props, superArgs, behaviors, result);
    // };

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
        var result = (instance instanceof type);

        return result;
    } else {
        return false;
    }
};


Tigerian.Class = Tigerian.MainClassDefinition.extend();
Tigerian.Class.isSubclass = Tigerian.MainClassDefinition.isSubclass;
Tigerian.Class.isInstance = Tigerian.MainClassDefinition.isInstance;
