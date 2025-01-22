import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import Environment from "./environment";
import IUpdatable from "../interfaces/iupdatable";
import Fish from "./fish";

export default class World implements IUpdatable {
  environment: Environment;
  scene: Scene;
  fish: Fish;

  constructor(scene: Scene) {
    this.scene = scene;
    const box = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: "white" })
    );
    // this.scene.add(box);
    this.environment = new Environment(this.scene);

    this.fish = new Fish(scene);
  }

  onTick(delta) {
    this.fish.onTick(delta);
  }
}
