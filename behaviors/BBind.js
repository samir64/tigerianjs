Tigerian.BBind = Tigerian.Behavior.extend({
    init: function () {
        this.super("bind");
        var binds = [];

        this.bind = function (srcProp, target, trgProp) {
            if ((typeof srcProp == "string") && (typeof target == "object") && (typeof trgProp == "string")) {
                if (binds[srcProp] == undefined) {
                    binds[srcProp] = {
                        main: undefined,
                        targets: []
                    };
                }
                binds[srcProp].targets.push({
                    trg: target,
                    prop: trgProp,
                });

                if (this.hasOwnProperty(srcProp) && target.hasOwnProperty(trgProp)) {
                    var lastProp = Object.getOwnPropertyDescriptor(this, srcProp);
                    if (binds[srcProp].main == undefined) {
                        binds[srcProp].main = lastProp;
                    }
                    Object.defineProperty(this, srcProp, {
                        enumerable: false,
                        configurable: true,
                        get: function () {
                            if (lastProp.hasOwnProperty("get")) {
                                return lastProp.get();
                            } else if (lastProp.hasOwnProperty("value")) {
                                return lastProp.value;
                            }
                        },
                        set: function (value) {
                            if (lastProp.hasOwnProperty("set")) {
                                lastProp.set(value);
                            } else if (lastProp.hasOwnProperty("value")) {
                                lastProp.value = value;
                            }
                            for (var i in binds[srcProp].targets) {
                                var trg = binds[srcProp].targets[i].trg;
                                var prop = binds[srcProp].targets[i].prop;
                                trg[prop] = value;
                            }
                        },
                    });
                }
            }
        };

        this.unbind = function (srcProp, target, trgProp) {
            if ((typeof srcProp == "string") && (binds[srcProp] != "") && (binds[srcProp] != undefined) && (binds[srcProp] != null)) {
                result = [];
                var main = binds[srcProp].main;
                for (var i in binds[srcProp].targets) {
                    var trg = binds[srcProp].targets[i].trg;
                    var prop = binds[srcProp].targets[i].prop;

                    if (((typeof target == "object") && (target != undefined) && (target != null) && (target != trg)) || ((typeof trgProp == "string") && (trgProp != "") && (trgProp != undefined) && (trgProp != null) && (trgProp != prop))) {
                        result.push(binds[srcProp].targets[i]);
                    }
                }

                binds[srcProp] = result;

                if (binds[srcProp].length == 0) {
                    Object.defineProperty(this, srcProp, main);
                    delete binds[srcProp];
                }
            } else {
                for (var idx in binds) {
                    this.unbind(idx, target, trgProp);
                }
            }
        };
    },
});