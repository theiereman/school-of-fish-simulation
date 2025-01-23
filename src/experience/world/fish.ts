import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector3,
} from "three";
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

    //raycaster for collision detection
    // const raycaster = new Raycaster();
    // raycaster.set(this.model.position.clone(), this.direction.clone());
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
        this.model.lookAt(this.getForwardDirection());
      },
      onComplete: () => {
        this.isTurning = false;
      },
    });
  }

  getForwardDirection(distance: number = 1) {
    return this.model.position
      .clone()
      .add(this.direction.clone().multiplyScalar(distance));
  }

  moveForward() {
    const forwardDirection = this.getForwardDirection(this.speed);
    this.model.position.set(
      forwardDirection.x,
      forwardDirection.y,
      forwardDirection.z
    );
  }

  onTick(): void {
    if (Math.random() < 0.1) {
      this.turn();
    }
    this.moveForward();
  }
}
