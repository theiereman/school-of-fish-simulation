import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import IUpdatable from "../interfaces/iupdatable";
import App from "../app";

export default class Fish implements IUpdatable {
  model: Mesh;

  private minSpeed: number = 0.05;
  private maxSpeed: number = 0.1;

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

  isTurning: boolean = false;

  viewDistance: number = 3; //distance at which the fish sees another fish
  avoidingDistance: number = 1; //distance at which the fish avoids another fish

  constructor() {
    this.model = new Mesh(
      new BoxGeometry(0.3, 0.8, 1),
      new MeshStandardMaterial({ color: "white" })
    );

    this.position.set(
      Math.random() * 5 * (Math.random() < 0.5 ? 1 : -1),
      Math.random() * 5 * (Math.random() < 0.5 ? 1 : -1),
      Math.random() * 5 * (Math.random() < 0.5 ? 1 : -1)
    );

    this.direction = this.generateRandomDirection();
  }

  getNeighbours(fishes: Fish[]): Fish[] {
    return fishes.filter(
      (otherFish) =>
        otherFish !== this &&
        this.position.distanceTo(otherFish.position) < this.viewDistance
    );
  }

  computeSeparationVector(neighbours: Fish[]): Vector3 {
    const separationVector = new Vector3(0, 0, 0);

    neighbours.forEach((neighbour) => {
      const distance = this.position.distanceTo(neighbour.position);

      if (distance < this.avoidingDistance) {
        separationVector.add(
          this.position
            .clone()
            .sub(neighbour.position)
            .normalize()
            .divideScalar(distance)
        );
      }
    });

    return separationVector;
  }

  computeAlignementVector(neighbours: Fish[]): Vector3 {
    const alignementVector = new Vector3(0, 0, 0);

    neighbours.forEach((neighbour) => {
      alignementVector.add(neighbour.direction);
    });

    return alignementVector;
  }

  computeCohesionVector(neighbours: Fish[]): Vector3 {
    let cohesionVector = this.position.clone();

    neighbours.forEach((neighbour) => {
      cohesionVector.add(neighbour.position);
    });

    cohesionVector =
      neighbours.length > 0
        ? cohesionVector.clone().divideScalar(neighbours.length)
        : cohesionVector;

    return cohesionVector.sub(this.position);
  }

  //TODO : generate random rotation starting from model position, avoids putting 1000 as an arbitrary value
  generateRandomDirection(): Vector3 {
    const x = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);
    const y = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);
    const z = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);

    return new Vector3(x, y, z);
  }

  onTick(): void {
    const neighbours = this.getNeighbours(App.Instance.world.fishes);
    const separationVector = this.computeSeparationVector(neighbours);
    const cohesionVector = this.computeCohesionVector(neighbours);
    const alignementVector = this.computeAlignementVector(neighbours);

    const targetVector3 = separationVector
      .add(cohesionVector)
      .add(alignementVector);

    this.direction = targetVector3;

    const speed = Math.min(
      Math.max(targetVector3.length(), this.minSpeed),
      this.maxSpeed
    );

    const newPosition = this.direction.normalize().multiplyScalar(speed);

    this.position.add(newPosition);
  }
}
