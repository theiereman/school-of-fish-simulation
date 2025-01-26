import { EventDispatcher } from "three";
import { EventType } from "../types/event-type";

export default class Time extends EventDispatcher<EventType> {
  start: number;
  current: number;
  elapsed: number;
  interval: number;

  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.interval = 1000 / 60; // 60 times per second (60 FPS)

    this.tick();
  }

  private tick() {
    this.current = Date.now();
    this.elapsed = this.current - this.start;

    this.dispatchEvent({
      type: "tick",
      current: this.current,
    });

    setTimeout(() => {
      this.tick();
    }, this.interval);
  }
}
