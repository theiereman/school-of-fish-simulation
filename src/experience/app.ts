import { Scene } from "three";
import Debug from "./utils/debug";
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import Camera from "./camera";
import Renderer from "./renderer";
import World from "./world/world";
import Environment from "./world/environment";

declare global {
  interface Window {
    app: App;
  }
}

export default class App {
  canvas: HTMLCanvasElement | undefined;
  debug: Debug;
  sizes: Sizes;
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  time: Time;
  world: World;
  environment: Environment;

  constructor() {
    window.app = this; //from quick debug from browser console

    this.canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.scene = new Scene();
    this.camera = new Camera(this.sizes, this.scene, this.canvas);
    this.renderer = new Renderer(
      this.canvas,
      this.sizes,
      this.scene,
      this.camera
    );
    this.time = new Time();
    this.world = new World(this.scene);

    //event listeners
    this.sizes.addEventListener("resize", () => {
      this.resize();
    });

    this.time.addEventListener("tick", (e) => {
      this.tick(e.delta);
    });
  }

  resize() {
    this.camera.onResize();
    this.renderer.onResize();
  }

  tick(delta) {
    this.camera.onTick();
    this.renderer.onTick();

    if (this.world) {
      this.world.onTick(delta);
    }
  }
}
