import { WebGLRenderer } from "three";
import App from "./app";

export default class Renderer extends WebGLRenderer {
  constructor() {
    super({ canvas: App.Instance.canvas });
    this.setSize(App.Instance.sizes.width, App.Instance.sizes.height);
  }

  onResize() {
    this.setSize(App.Instance.sizes.width, App.Instance.sizes.height);
    this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onTick() {
    this.render(App.Instance.scene, App.Instance.camera);
  }
}
