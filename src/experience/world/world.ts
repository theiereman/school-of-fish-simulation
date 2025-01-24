import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import Environment from "./environment";
import IUpdatable from "../interfaces/iupdatable";
import Fish from "./fish";
import App from "../app";

export default class World implements IUpdatable {
  environment: Environment;
  scene: Scene;
  fishes: Fish[] = [];

  activateFollowing: boolean = false;
  fishesSpeed: number = 1;
  constructor() {
    const box = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: "white" })
    );
    this.environment = new Environment();

    //fill the scene with 100 fishes
    for (let i = 0; i < 10; i++) {
      const fish = new Fish();
      this.fishes.push(fish);
      App.Instance.scene.add(fish.model);
    }

    App.Instance.debug
      .addIfActive(this, "activateFollowing")
      ?.onChange((value) => {
        this.fishes.forEach((fish) => (fish.shouldFollow = value));
      });

    App.Instance.debug
      .addIfActive(this, "fishesSpeed")
      ?.onFinishChange((value) =>
        this.fishes.forEach((fish) => (fish.speed = value / 100))
      );
  }

  onTick() {
    this.fishes.forEach((fish) => fish.onTick());
  }
}
