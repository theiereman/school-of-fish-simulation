import { ConeGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import IUpdatable from "../interfaces/iupdatable";
import { abs } from "three/tsl";

export default class Fish implements IUpdatable {
  model: Mesh;
  targetXAngle: number;

  deltaTime: any;

  constructor(scene: Scene) {
    this.model = new Mesh(
      new ConeGeometry(0.5, 1, 32),
      new MeshStandardMaterial({ color: "white" })
    );
    // this.model.rotateX(Math.PI / 2);
    scene.add(this.model);
    this.setTargetRotationAngle();
  }

  setTargetRotationAngle() {
    this.targetXAngle = Math.random() * (2 * Math.PI);
  }

  rotateToTargetAngle() {
    const distanceToTargetAngle = this.targetXAngle - this.model.rotation.x;
    console.log(distanceToTargetAngle);
    if (Math.abs(distanceToTargetAngle) < 0.5) {
      this.setTargetRotationAngle();
    }
    const angularVelocity = (this.targetXAngle - this.model.rotation.x) * 0.1;
    this.model.rotation.x += angularVelocity * 0.1;
  }

  //TO use that function : calculate from starting angle (target - starting angle) * easing over time
  easeInOutBack(x: number): number {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }

  moveForward() {
    this.model.translateY(0.01);
  }

  onTick(delta): void {
    this.deltaTime = delta;
    this.rotateToTargetAngle();
    this.moveForward();
  }
}
