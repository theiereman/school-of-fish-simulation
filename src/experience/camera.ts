import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PerspectiveCamera } from "three";
import App from "./app";

export default class Camera extends PerspectiveCamera {
  controls: OrbitControls;

  constructor() {
    super(75, App.Instance.sizes.width / App.Instance.sizes.height, 0.1, 1000);
    this.position.set(10, 0, 10);
    App.Instance.scene.add(this);
    this.setOrbitControls();
  }

  private setOrbitControls() {
    this.controls = new OrbitControls(this, App.Instance.canvas);
    this.controls.enableDamping = true;
  }

  onResize() {
    this.aspect = App.Instance.sizes.width / App.Instance.sizes.height;
    this.updateProjectionMatrix();
  }

  onTick() {
    this.controls.update();
  }
}
