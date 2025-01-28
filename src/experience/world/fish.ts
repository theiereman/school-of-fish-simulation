import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import IUpdatable from "../interfaces/iupdatable";
import BoidBehavior from "../interfaces/boidBehavior";

export default class Fish implements IUpdatable {
  model: Mesh;

  private minSpeed: number = 0.05;
  private maxSpeed: number = 0.1;
  speed: number = this.minSpeed;

  private boidBehavior: BoidBehavior;

  public get direction(): Vector3 {
    return this.model.getWorldDirection(new Vector3());
  }
  public set direction(value: Vector3) {
    this.model.lookAt(this.model.position.clone().add(value));
  }

  public get position(): Vector3 {
    return this.model.position;
  }
  public set position(value: Vector3) {
    this.model.position.add(value);
  }

  constructor() {
    this.model = new Mesh(
      new BoxGeometry(0.3, 0.8, 1),
      new MeshStandardMaterial({ color: "white" })
    );

    this.position.set(
      Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1),
      Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1),
      Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1)
    );

    this.direction = this.generateRandomDirection();
    this.boidBehavior = new BoidBehavior(this);
  }

  generateRandomDirection(): Vector3 {
    const x = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);
    const y = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);
    const z = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);

    return new Vector3(x, y, z);
  }

  //sets the movement vector of the fish (direction and speed)
  setMovementVector(movement: Vector3): void {
    this.direction = movement.normalize();
    this.speed = movement.length();
  }

  //moves forward to the current front direction
  moveTowardsCurrentDirection(): void {
    const v = Math.min(Math.max(this.speed, this.minSpeed), this.maxSpeed);
    const newPosition = this.direction.normalize().multiplyScalar(v);
    this.position.add(newPosition);
  }

  onTick(): void {
    this.moveTowardsCurrentDirection();
    this.boidBehavior.update();
  }
}
