import { ConeGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import IUpdatable from "../interfaces/iupdatable";

export default class Fish implements IUpdatable {
  model: Mesh;
  currentTime: number;

  constructor(scene: Scene) {
    this.model = new Mesh(
      new ConeGeometry(0.5, 1, 32),
      new MeshStandardMaterial({ color: "white" })
    );
    this.model.rotateX(Math.PI / 2);
    scene.add(this.model);
  }

  wiggle() {
    const randomFactor = (Math.random() - 0.5) * 0.2; // Random factor between -0.01 and 0.01
    this.model.rotation.x += randomFactor;
  }

  moveForward() {
    this.model.translateY(0.01);
  }

  onTick(currentTime): void {
    this.currentTime = currentTime;
    this.moveForward();
    this.wiggle();
  }
}
