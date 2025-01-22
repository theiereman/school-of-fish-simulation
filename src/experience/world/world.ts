import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import Environment from "./environment";
import IUpdatable from "../interfaces/iupdatable";
import Fish from "./fish";
import App from "../app";

export default class World implements IUpdatable {
  environment: Environment;
  scene: Scene;
  fish: Fish;

  constructor() {
    const box = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: "white" })
    );
    // this.scene.add(box);
    this.environment = new Environment();

    this.fish = new Fish();
    App.Instance.scene.add(this.fish.model);
  }

  onTick() {
    this.fish.onTick();
  }
}
