import Behavior from "../core/Behavior.js";
import Router from "../core/Router.js";

export default class extends Behavior {
  #elRouter = document.createElement("div");
  #changeRoute = (route, path) => {
    this.#elRouter.innerHTML = "";
    route.appendTo(this.#elRouter);
  };

  #view(router) {
    if (!(router instanceof Router)) {
      throw "Router is not correct instance";
    }

    router.onChangeRoute = this.#changeRoute;

    window.addEventListener('popstate', router.checkRoute.bind(router));
    const route = router.checkRoute();

    return this.#elRouter;
  }

  config(that) {
    that.view = this.#view.bind(this);
  }
}
