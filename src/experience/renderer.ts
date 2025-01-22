import { WebGLRenderer, Scene } from "three";
import Sizes from "./utils/sizes";
import Camera from "./camera";
import IUpdatable from "./interfaces/iupdatable";

export default class Renderer implements IUpdatable {
  private canvas: HTMLCanvasElement;
  private sizes: Sizes;
  private scene: Scene;
  private camera: Camera;
  private renderer: WebGLRenderer;

  constructor(
    canvas: HTMLCanvasElement,
    sizes: Sizes,
    scene: Scene,
    camera: Camera
  ) {
    this.canvas = canvas;
    this.sizes = sizes;
    this.scene = scene;
    this.camera = camera;
    this.renderer = new WebGLRenderer({ canvas: this.canvas });

    this.renderer.setSize(this.sizes.width, this.sizes.height);
  }

  onResize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onTick() {
    this.renderer.render(this.scene, this.camera.camera);
  }
}
