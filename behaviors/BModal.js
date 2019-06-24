("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
BModal = Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("modal");

        var status = BModal.EClose;

        this.showModal = function () {
            status = BModal.EModal;
        };

        this.show = function () {
            status = BModal.EShow;
        };

        this.close = function () {
            status = BModal.EClose;
        };

        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            get: function () {
                return status;
            },
            set: function (v) {
                if (Class.isInstance(v, "string")) {
                    switch (v) {
                        case BModal.EShow:
                        case BModal.EClose:
                        case BModal.EModal:
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
     * @param {UI} ctrlParent
     * @param {Control} ctrlModal
     */
    config: function (behavior, ctrlParent, ctrlModal) {
        if ((behavior === "modal") && Class.isInstance(ctrlParent, UI)) {
            if (!(Class.isInstance(ctrlModal, Control) && ctrlModal["Behavior:modal"])) {
                ctrlModal = this;
            }

            if (Class.isInstance(ctrlModal, Control) && ctrlModal["Behavior:modal"]) {
                var lastStatus = this.status;

                var initStatus = Object.getOwnPropertyDescriptor(ctrlModal, "status");
                var superVisible = Object.getOwnPropertyDescriptor(this, "visible");
                // var superAddControl = this.addControl;

                // var elmBody = new Control(this, this.theme);
                // var elmCoverage = document.createElement("div");
                var elmCoverage = new Control(ctrlParent, this.theme);
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
                    ctrlModal.status = BModal.EShow;
                };

                this.close = function () {
                    ctrlModal.status = BModal.EClose;
                };

                this.showModal = function () {
                    ctrlModal.status = BModal.EModal;
                };

                /**
                 * @param {Control} control 
                 */

                this.addControl = ctrlModal.addControl.bind(this);

                Object.defineProperty(this, "status", {
                    enumerable: true,
                    configurable: true,
                    get: initStatus.get.bind(this),
                    set: function (v) {
                        initStatus.set.bind(this)(v);

                        switch (v) {
                            case BModal.EShow:
                                if (this !== ctrlModal) {
                                    ctrlModal.show();
                                } else {
                                    superVisible.set.bind(this)(true);
                                    elmCoverage.setAttribute("status", "show");
                                    elmCoverage.setAttribute("visible", "true");
                                    ctrlParent.setAttribute("hide-overflow", "false");
                                }

                                break;

                            case BModal.EModal:
                                if (this !== ctrlModal) {
                                    ctrlModal.modal();
                                } else {
                                    superVisible.set.bind(this)(true);
                                    elmCoverage.setAttribute("status", "modal");
                                    elmCoverage.setAttribute("visible", "true");
                                    ctrlParent.setAttribute("hide-overflow", "true");
                                }

                                break;

                            case BModal.EClose:
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
                        if (Class.isInstance(v, "boolean")) {
                            this.status = (v ? BModal.EShow : BModal.EClose);
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