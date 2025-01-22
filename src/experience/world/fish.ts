import { ConeGeometry, Euler, Mesh, MeshStandardMaterial, Scene } from "three";
import IUpdatable from "../interfaces/iupdatable";
import App from "../app";
import { easeInOutBack } from "../utils/easing";
import gsap from "gsap";

export default class Fish implements IUpdatable {
  model: Mesh;

  currentSpeed: number;

  currentRotation: Euler;
  lastRotationChangeTime: number;

  constructor() {
    this.model = new Mesh(
      new ConeGeometry(0.5, 1, 32),
      new MeshStandardMaterial({ color: "white" })
    );
    this.updateRotationInfo();
  }

  rotateToTarget() {
    const randomXAngle =
      this.currentRotation.x +
      Math.random() * (Math.PI / 2) * (Math.random() > 0.5 ? -1 : 1);
    const randomZAngle =
      this.currentRotation.x +
      Math.random() * (Math.PI / 2) * (Math.random() > 0.5 ? -1 : 1);
    gsap.to(this.model.rotation, {
      z: randomZAngle,
      x: randomXAngle,
      ease: "expo.inOut",
      duration: 1,
    });
    this.updateRotationInfo();
  }

  private updateRotationInfo() {
    this.currentRotation = this.model.rotation;
    this.lastRotationChangeTime = App.Instance.time.current;
  }

  moveForward() {
    this.model.translateY(0.05);
  }

  onTick(): void {
    const currentTime = App.Instance.time.current;
    if (currentTime - this.lastRotationChangeTime >= 2000) {
      this.rotateToTarget();
    }

    this.moveForward();
  }
}
