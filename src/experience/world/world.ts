import { Box3, BoxGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import Environment from "./environment";
import IUpdatable from "../interfaces/iupdatable";
import Fish from "./fish";
import App from "../app";
import FishTank from "./fish_tank";

export default class World implements IUpdatable {
  environment: Environment;
  scene: Scene;
  fishes: Fish[] = [];
  obstacles: Mesh[] = [];

  constructor() {
    // //obstacles creation
    // for (let i = 0; i < 5; i++) {
    //   const box = new Mesh(
    //     new BoxGeometry(10, 10, 10),
    //     new MeshStandardMaterial({ color: "red" })
    //   );

    //   //add the bounding box to the obstacles for the fishes to avoid
    //   this.obstacles.push(box);

    //   box.position.set(
    //     Math.random() * 20 * (Math.random() < 0.5 ? 1 : -1),
    //     Math.random() * 20 * (Math.random() < 0.5 ? 1 : -1),
    //     Math.random() * 20 * (Math.random() < 0.5 ? 1 : -1)
    //   );
    //   App.Instance.scene.add(box);
    // }

    const fishTank = new FishTank(50, 30, 20).tank;
    App.Instance.scene.add(fishTank);
    fishTank.children.forEach((child) => this.obstacles.push(child as Mesh));

    //fishes creation
    for (let i = 0; i < 100; i++) {
      const fish = new Fish();
      this.fishes.push(fish);
      App.Instance.scene.add(fish.model);
    }

    this.environment = new Environment();
  }

  onTick() {
    this.fishes.forEach((fish) => fish.onTick());
  }
}
