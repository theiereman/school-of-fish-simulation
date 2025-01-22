import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Scene, PerspectiveCamera } from "three";
import Sizes from "./utils/sizes";
import IUpdatable from "./interfaces/iupdatable";

export default class Camera implements IUpdatable {
  sizes: Sizes;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: any;
  canvas: HTMLCanvasElement;

  constructor(sizes: Sizes, scene: Scene, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.sizes = sizes;
    this.scene = scene;
    this.camera = new PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    this.camera.position.set(2, 2, 2);
    this.scene.add(this.camera);
    this.setOrbitControls();
  }

  private setOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  onResize() {
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
  }

  onTick() {
    this.controls.update();
  }
}
