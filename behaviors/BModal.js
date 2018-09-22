"use strict";

Tigerian.BModal = Tigerian.Behavior.extend({
    init: function () {
        this.super("modal");

        var status = "close";

        this.showModal = function () {
            status = "modal";
        };

        this.show = function () {
            status = "show";
        };

        this.close = function () {
            status = "close";
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
                        case "show":
                        case "close":
                        case "modal":
                            status = v;
                            break;
                        default:
                    }
                }
            },
        });
    },
    config: function (behavior, ctrlParent, ctrlModal) {
        if ((behavior === "modal") && Tigerian.Class.isInstance(ctrlParent, Tigerian.Application)) {
            if (!(Tigerian.Class.isInstance(ctrlModal, Tigerian.Control) && ctrlModal["Behavior:modal"])) {
                ctrlModal = this;
            }

            if (Tigerian.Class.isInstance(ctrlModal, Tigerian.Control) && ctrlModal["Behavior:modal"]) {
                var lastStatus = this.status;

                var initStatus = Object.getOwnPropertyDescriptor(ctrlModal, "status");
                var superVisible = Object.getOwnPropertyDescriptor(this, "visible");
                // var superAddControl = this.addControl;

                var elmBody = new Tigerian.Control(this, this.theme);
                // var elmBody = document.createElement("div");
                var elmCoverage = document.createElement("div");

                // this.addControl(elmBody);
                this.addControl(elmCoverage);

                elmBody.setAttribute("element-type", "ModalForm");
                elmBody.setAttribute("element-name", "body");

                elmCoverage.setAttribute("element-type", "ModalForm");
                elmCoverage.setAttribute("element-name", "coverage");

                this.show = function () {
                    ctrlModal.status = "show";
                };

                this.close = function () {
                    ctrlModal.status = "close";
                };

                this.showModal = function () {
                    ctrlModal.status = "modal";
                };

                /**
                 * @param {Tigerian.Control} control 
                 */

                this.addControl = elmBody.addControl.bind(this);

                Object.defineProperty(this, "status", {
                    enumerable: true,
                    configurable: true,
                    get: initStatus.get.bind(this),
                    set: function (v) {
                        initStatus.set.bind(this)(v);

                        switch (v) {
                            case "show":
                                if (this !== ctrlModal) {
                                    ctrlModal.show();
                                } else {
                                    superVisible.set.bind(this)(true);
                                    elmCoverage.setAttribute("visible", "false");
                                    ctrlParent.setAttribute("hide-overflow", "false");
                                }

                                break;

                            case "modal":
                                if (this !== ctrlModal) {
                                    ctrlModal.modal();
                                } else {
                                    superVisible.set.bind(this)(true);
                                    elmCoverage.setAttribute("visible", "true");
                                    ctrlParent.setAttribute("hide-overflow", "true");
                                }

                                break;

                            case "close":
                                if (this !== ctrlModal) {
                                    ctrlModal.close();
                                } else {
                                    superVisible.set.bind(this)(false);
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
                            this.status = (v ? "show" : "close");
                        }
                    },
                });

                this.status = lastStatus;
            }
        }
    },
});