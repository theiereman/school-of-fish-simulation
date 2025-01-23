import {
  AxesHelper,
  ConeGeometry,
  Euler,
  Mesh,
  MeshStandardMaterial,
  Scene,
  Vector3,
} from "three";
import IUpdatable from "../interfaces/iupdatable";
import App from "../app";
import gsap from "gsap";

export default class Fish implements IUpdatable {
  model: Mesh;
  speed: number;
  direction: Vector3;

  isTurning: boolean;
  targetTurnDirection: Vector3;

  constructor() {
    this.model = new Mesh(
      new ConeGeometry(0.5, 1, 32),
      new MeshStandardMaterial({ color: "white" })
    );

    const axesHelper = new AxesHelper();
    this.model.add(axesHelper);

    this.speed = 0.01;
    this.direction = new Vector3(1, 0, 0);
    this.targetTurnDirection = this.direction.clone();
  }

  adjustDirection(): void {
    this.direction.x += Math.random() * 0.1 - 0.05;
    this.direction.y += Math.random() * 0.1 - 0.05;

    // Normalize the direction vector to maintain consistent speed
    this.direction.normalize();
  }

  triggerTurn(): void {
    if (this.isTurning) return;

    const randomDirection = new Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();

    this.isTurning = true; // Mark as turning

    // Smoothly interpolate to the new direction over 2 seconds
    gsap.to(this.direction, {
      x: randomDirection.x,
      y: randomDirection.y,
      duration: 2, // Duration of the turn in seconds
      onUpdate: () => {
        this.direction.normalize(); // Keep the direction normalized during the turn
      },
      onComplete: () => {
        this.isTurning = false; // Reset the turning flag
      },
    });
  }

  moveForward() {
    this.model.position.add(this.direction.clone().multiplyScalar(this.speed));

    const angle = Math.atan2(this.direction.y, this.direction.x);
    this.model.rotation.z = angle - Math.PI / 2;

    this.model.rotation.y = Math.sin(App.Instance.time.current * 0.02) * 0.05; //fish wiggle effect
  }

  onTick(): void {
    if (Math.random() < 0.01) {
      this.triggerTurn();
    }
    this.moveForward();
  }
}
