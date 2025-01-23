import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import IUpdatable from "../interfaces/iupdatable";
import gsap from "gsap";

export default class Fish implements IUpdatable {
  model: Mesh;
  speed: number;
  direction: Vector3;
  isTurning: boolean;

  constructor() {
    this.model = new Mesh(
      new BoxGeometry(0.3, 0.8, 1),
      new MeshStandardMaterial({ color: "white" })
    );

    this.speed = 0.05;
    this.direction = new Vector3(1, 0, 0);
  }

  turn(): void {
    if (this.isTurning) return;

    const randomDirection = new Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();

    this.isTurning = true;

    gsap.to(this.direction, {
      x: randomDirection.x,
      y: randomDirection.y,
      z: randomDirection.z,
      duration: 2,
      onUpdate: () => {
        this.direction.normalize();
        this.model.lookAt(this.model.position.clone().add(this.direction));
      },
      onComplete: () => {
        this.isTurning = false;
      },
    });
  }

  moveForward() {
    this.model.position.add(this.direction.clone().multiplyScalar(this.speed));
  }

  onTick(): void {
    if (Math.random() < 0.1) {
      this.turn();
    }
    this.moveForward();
  }
}
