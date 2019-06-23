("use strict");

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 */
Tigerian.BModal = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("modal");

        var status = Tigerian.BModal.EClose;

        this.showModal = function () {
            status = Tigerian.BModal.EModal;
        };

        this.show = function () {
            status = Tigerian.BModal.EShow;
        };

        this.close = function () {
            status = Tigerian.BModal.EClose;
        };

        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            get: function () {
                return status;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    switch (v) {
                        case Tigerian.BModal.EShow:
                        case Tigerian.BModal.EClose:
                        case Tigerian.BModal.EModal:
                            status = v;
                            break;
                        default:
                    }
                }
            },
        });
    },
    /**
     * @param {string} behavior
     * @param {Tigerian.UI} ctrlParent
     * @param {Tigerian.Control} ctrlModal
     */
    config: function (behavior, ctrlParent, ctrlModal) {
        if ((behavior === "modal") && Tigerian.Class.isInstance(ctrlParent, Tigerian.UI)) {
            if (!(Tigerian.Class.isInstance(ctrlModal, Tigerian.Control) && ctrlModal["Behavior:modal"])) {
                ctrlModal = this;
            }

            if (Tigerian.Class.isInstance(ctrlModal, Tigerian.Control) && ctrlModal["Behavior:modal"]) {
                var lastStatus = this.status;

                var initStatus = Object.getOwnPropertyDescriptor(ctrlModal, "status");
                var superVisible = Object.getOwnPropertyDescriptor(this, "visible");
                // var superAddControl = this.addControl;

                // var elmBody = new Tigerian.Control(this, this.theme);
                // var elmCoverage = document.createElement("div");
                var elmCoverage = new Tigerian.Control(ctrlParent, this.theme);
                // ctrlParent.addControl(elmCoverage);
                if (this === ctrlModal) {
                    elmCoverage.addControl(this);
                }

                // this.addControl(elmBody);
                // this.addControl(elmCoverage);
                elmCoverage.setAttribute("element-type", "Modal");
                elmCoverage.setAttribute("element-name", "coverage");
                elmCoverage.setAttribute("element-situation", "opposite");


                // elmCoverage.setAttribute("element-type", "ModalForm");
                // elmCoverage.setAttribute("element-name", "coverage");

                this.show = function () {
                    ctrlModal.status = Tigerian.BModal.EShow;
                };

                this.close = function () {
                    ctrlModal.status = Tigerian.BModal.EClose;
                };

                this.showModal = function () {
                    ctrlModal.status = Tigerian.BModal.EModal;
                };

                /**
                 * @param {Tigerian.Control} control 
                 */

                this.addControl = ctrlModal.addControl.bind(this);

                Object.defineProperty(this, "status", {
                    enumerable: true,
                    configurable: true,
                    get: initStatus.get.bind(this),
                    set: function (v) {
                        initStatus.set.bind(this)(v);

                        switch (v) {
                            case Tigerian.BModal.EShow:
                                if (this !== ctrlModal) {
                                    ctrlModal.show();
                                } else {
                                    superVisible.set.bind(this)(true);
                                    elmCoverage.setAttribute("status", "show");
                                    elmCoverage.setAttribute("visible", "true");
                                    ctrlParent.setAttribute("hide-overflow", "false");
                                }

                                break;

                            case Tigerian.BModal.EModal:
                                if (this !== ctrlModal) {
                                    ctrlModal.modal();
                                } else {
                                    superVisible.set.bind(this)(true);
                                    elmCoverage.setAttribute("status", "modal");
                                    elmCoverage.setAttribute("visible", "true");
                                    ctrlParent.setAttribute("hide-overflow", "true");
                                }

                                break;

                            case Tigerian.BModal.EClose:
                                if (this !== ctrlModal) {
                                    ctrlModal.close();
                                } else {
                                    superVisible.set.bind(this)(false);
                                    elmCoverage.setAttribute("status", "close");
                                    elmCoverage.setAttribute("visible", "false");
                                    ctrlParent.setAttribute("hide-overflow", "false");
                                }

                                break;
                            default:
                        }
                    },
                });

                Object.defineProperty(this, "visible", {
                    enumerable: true,
                    configurable: true,
                    get: superVisible.get.bind(this),
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "boolean")) {
                            this.status = (v ? Tigerian.BModal.EShow : Tigerian.BModal.EClose);
                        }
                    },
                });

                this.status = lastStatus;
            }
        }
    },
    enums: ["show", "close", "modal"],
    // enum: function () {
    //     var show = Symbol("show");
    //     var modal = Symbol("modal");
    //     var close = Symbol("close");

    //     return {
    //         get EShow() {
    //             return show;
    //         },
    //         get EModal() {
    //             return modal;
    //         },
    //         get EClose() {
    //             return close;
    //         },
    //     };
    // },
});