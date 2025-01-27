import { Vector3 } from "three";
import Fish from "../world/fish";
import App from "../app";

class BoidBehavior {
  private fish: Fish;

  constructor(fish: Fish) {
    this.fish = fish;
  }

  private cohesionDistance: number = 5;
  private separationDistance: number = 2;

  private getCohesionNeighbours(): Fish[] {
    return App.Instance.world.fishes.filter(
      (otherFish) =>
        otherFish !== this.fish &&
        this.fish.position.distanceTo(otherFish.position) <
          this.cohesionDistance
    );
  }

  private computeSeparationVector(neighbours: Fish[]): Vector3 {
    const separation = new Vector3();
    neighbours.forEach((neighbour) => {
      const distance = this.fish.position.distanceTo(neighbour.position);
      if (distance < this.separationDistance) {
        const diff = this.fish.position
          .clone()
          .sub(neighbour.position)
          .normalize();
        separation.add(diff.divideScalar(distance));
      }
    });
    return separation;
  }

  private computeAlignmentVector(neighbours: Fish[]): Vector3 {
    const alignment = new Vector3();
    neighbours.forEach((neighbour) => {
      alignment.add(neighbour.direction);
    });
    if (neighbours.length > 0) {
      alignment.divideScalar(neighbours.length).normalize();
    }
    return alignment;
  }

  private computeCohesionVector(neighbours: Fish[]): Vector3 {
    const cohesion = new Vector3();
    neighbours.forEach((neighbour) => {
      cohesion.add(neighbour.position);
    });
    if (neighbours.length > 0) {
      cohesion
        .divideScalar(neighbours.length)
        .sub(this.fish.position)
        .normalize();
    }
    return cohesion;
  }

  public update(): void {
    const neighbours = this.getCohesionNeighbours();
    const separation = this.computeSeparationVector(neighbours);
    const alignment = this.computeAlignmentVector(neighbours);
    const cohesion = this.computeCohesionVector(neighbours);

    const direction = this.fish.direction
      .add(separation)
      .add(alignment)
      .add(cohesion)
      .normalize();

    this.fish.direction = this.fish.direction.lerp(direction, 0.1);
    this.fish.moveTowardsCurrentDirection();
  }
}

export default BoidBehavior;
