import { Scene } from "three";
import Debug from "./utils/debug";
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import World from "./world/world";
import Environment from "./world/environment";
import Camera from "./camera";
import Renderer from "./renderer";

declare global {
  interface Window {
    app: App;
  }
}

export default class App {
  private static _instance: App | null = null;
  canvas: HTMLCanvasElement | undefined;
  debug: Debug;
  sizes: Sizes;
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  time: Time;
  world: World;
  environment: Environment;

  private constructor() {}

  public static get Instance() {
    if (this._instance == null) {
      this._instance = new this();
      this._instance.init();
    }
    return this._instance;
  }

  private init() {
    window.app = this; //from quick debug from browser console

    this.canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.time = new Time();
    this.world = new World();

    //event listeners
    this.sizes.addEventListener("resize", () => {
      this.resize();
    });

    this.time.addEventListener("tick", () => {
      this.tick();
    });
  }

  private resize() {
    this.camera.onResize();
    this.renderer.onResize();
  }

  private tick() {
    this.camera.onTick();
    this.renderer.onTick();

    if (this.world) {
      this.world.onTick();
    }
  }
}
