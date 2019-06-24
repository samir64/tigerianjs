BBind = Behavior.extend({
    init: function () {
        this.super("bind");

        var binds = [];

        /**
         * @param {string} srcProp
         * @param {Object} target
         * @param {string} trgProp
         * @param {Function} changer
         */
        this.bind = function (srcProp, target, trgProp, changer) {
            if (Class.isInstance(srcProp, "string") && Class.isInstance(target, "object") && Class.isInstance(trgProp, "string")) {
                if (!Class.isInstance(changer, "function")) {
                    changer = function (value) {
                        return value;
                    };
                }

                if (binds[srcProp] == undefined) {
                    binds[srcProp] = {
                        main: undefined,
                        targets: [],
                    };
                }
                binds[srcProp].targets.push({
                    trg: target,
                    prop: trgProp,
                    changer: changer,
                });

                if (this.hasOwnProperty(srcProp) && target.hasOwnProperty(trgProp)) {
                    var lastProp = Object.getOwnPropertyDescriptor(this, srcProp);
                    if (binds[srcProp].main === undefined) {
                        binds[srcProp].main = lastProp;
                    }
                    Object.defineProperty(this, srcProp, {
                        enumerable: false,
                        configurable: true,
                        get: function () {
                            if (lastProp.hasOwnProperty("get")) {
                                return lastProp.get.bind(target)();
                            } else if (lastProp.hasOwnProperty("value")) {
                                return lastProp.value;
                            }
                        },
                        set: function (v) {
                            if (lastProp.hasOwnProperty("set")) {
                                // console.log(srcProp, target, trgProp, v, target[trgProp]);
                                lastProp.set.bind(target)(v);
                            } else if (lastProp.hasOwnProperty("value")) {
                                lastProp.value = v;
                            }
                            binds[srcProp].targets.forEach(function (trg) {
                                trg.trg[trg.prop] = changer(v);
                            });
                            /* for (var i in binds[srcProp].targets) {
                                var trg = binds[srcProp].targets[i].trg;
                                var prop = binds[srcProp].targets[i].prop;
                                trg[prop] = changer(v);
                            } */
                        },
                    });
                }
            }
        };

        this.unbind = function (srcProp, target, trgProp) {
            if ((typeof srcProp == "string") && (binds[srcProp] != "") && (binds[srcProp] != undefined) && (binds[srcProp] != null)) {
                result = [];
                var main = binds[srcProp].main;
                binds[srcProp].targets.forEach(function (trg) {
                    if (((typeof target == "object") && (target != undefined) && (target != null) && (target != trg.trg)) || ((typeof trgProp == "string") && (trgProp != "") && (trgProp != undefined) && (trgProp != null) && (trgProp != trg.prop))) {
                        result.push(trg);
                    }
                });
                /* for (var i in binds[srcProp].targets) {
                    var trg = binds[srcProp].targets[i].trg;
                    var prop = binds[srcProp].targets[i].prop;

                    if (((typeof target == "object") && (target != undefined) && (target != null) && (target != trg)) || ((typeof trgProp == "string") && (trgProp != "") && (trgProp != undefined) && (trgProp != null) && (trgProp != prop))) {
                        result.push(binds[srcProp].targets[i]);
                    }
                } */

                binds[srcProp].target = result;

                if (binds[srcProp].target.length == 0) {
                    Object.defineProperty(this, srcProp, main);
                    delete binds[srcProp];
                }
            } else {
                binds.forEach(function (b, idx) {
                    this.unbind(idx, target, trgProp);
                });
                /* for (var idx in binds) {
                    this.unbind(idx, target, trgProp);
                } */
            }
        };
    },
});