import {
  Behavior
} from "../core/Behavior.js";
import {
  Events
} from "../core/Events.js";

export class BTransition extends Behavior {
  constructor() {
    super();

    /**
     * 
     * @param {Tigerian} that 
     * @param {Control} control 
     */
    this.config = (that, control) => {
      control.setAttribute("transition-name", "");
      control.setAttribute("transition-status", "");

      let transitions = {};
      let start = -1;
      let status = ETransition.NONE;
      let lastTime = 0;

      const changeAttribute = () => {
        switch (status) {
          case ETransition.NONE:
            break;

          case ETransition.START:
            control.setAttribute("transition-status", "start");
            start = new Date();
            break;

          case ETransition.INPROGRESS:
            control.setAttribute("transition-status", "inprogress");
            break;

          case ETransition.FINNISH:
            control.setAttribute("transition-status", "finnish");
            break;

          default:
        }
      }

      const event = (time) => {
        that.dispatchEvent(Events.onTransition, {
          status,
          time,
          deltaTime: time - lastTime,
          percent: Math.min(100, 100 * time / transitions[name]),
          roundPercent: Math.min(100, Math.round(100 * time / transitions[name]))
        });
      }

      const callback = async () => {
        let name = that.transitionName;

        let now;
        let time;
        let newStatus;

        await changeAttribute();
        // switch (status) {
        //   case ETransition.NONE:
        //     break;

        //   case ETransition.START:
        //     control.setAttribute("transition-status", "start");
        //     start = new Date();
        //     break;

        //   case ETransition.INPROGRESS:
        //     control.setAttribute("transition-status", "inprogress");
        //     break;

        //   case ETransition.FINNISH:
        //     control.setAttribute("transition-status", "finnish");
        //     break;

        //   default:
        // }

        now = new Date();
        time = Math.min(transitions[name], now - start);
        newStatus = (time < transitions[name] ? ETransition.INPROGRESS : ETransition.FINNISH);

        await event(time);

        if (status !== ETransition.FINNISH) {
          requestAnimationFrame(callback);
          lastTime = time;
        } else {
          status = ETransition.FINNISH;
          start = -1;
          lastTime = 0;
          that.transitionName = "";
        }

        status = newStatus;
      }

      // Note Public Methods
      /**
       * 
       * @param {String} name 
       * @param {Number} duration 
       */
      that.setTransition = (name, duration = 1000) => {
        transitions[name] = duration;
      };

      /**
       * 
       * @param {String} name 
       */
      that.getTransition = (name) => {
        return transitions[name];
      };

      /**
       * 
       * @param {String} name 
       */
      that.removeTransition = (name) => {
        if (transitions.hasOwnProperty(name)) {
          delete transitions[name];
        }
      };

      /**
       * 
       * @param {String} name 
       */
      that.startTransition = (name) => {
        control.setAttribute("transition-name", name);
        if ((name !== "") && transitions[name]) {
          status = ETransition.START;
          requestAnimationFrame(callback);
        } else {
          control.setAttribute("transition-status", "");
        }
      };

      that.stopTransition = () => {
        that.transitionName = "";
      };


      //Note Properties
      Object.defineProperty(that, "transitionName", {
        enumerable: true,
        configurable: true,
        get() {
          return control.getAttribute("transition-name");
        },
        set(v) {
          that.startTransition(v);
        }
      });

      Object.defineProperty(that, "transitionStatus", {
        enumerable: true,
        configurable: true,
        get() {
          return status;
        }
      });
    };
  }
}

export const ETransition = Object.freeze({
  NONE: Symbol("none"),
  START: Symbol("start"),
  INPROGRESS: Symbol("inprogress"),
  FINNISH: Symbol("finnish")
});