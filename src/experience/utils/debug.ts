import GUI from "lil-gui";

export default class Debug {
  active: boolean;
  ui: GUI;

  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.init();
    }
  }

  private init() {
    this.ui = new GUI();
    this.ui.open();
    this.ui.title("Debug");
  }

  addIfActive(object: any, propertyName: string) {
    if (!this.active) return;
    return this.ui.add(object, propertyName);
  }
}
