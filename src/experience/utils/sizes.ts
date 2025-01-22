import { EventDispatcher } from "three";
import { EventType } from "../types/event-type";

export default class Sizes extends EventDispatcher<EventType> {
  height: number;
  width: number;

  constructor() {
    super();
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    //window resize event
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      //threejs resize custom event dispatcher
      this.dispatchEvent({
        type: "resize",
        height: this.height,
        width: this.width,
      });
    });
  }
}
