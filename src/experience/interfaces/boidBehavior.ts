import { Box3, BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";
import Fish from "../world/fish";
import App from "../app";

class BoidBehavior {
  private fish: Fish;

  constructor(fish: Fish) {
    this.fish = fish;
  }

  private cohesionDistance: number = 5;
  private separationDistance: number = 2;

  private obstacleAvoidanceDistance: number = 3; // Distance to start avoiding obstacles
  private obstacleRepulsionStrength: number = 10; // Strength of the repulsion force

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

  private computeObstacleRepulsionVector(
    obstaclesBoundingBoxes: Mesh[]
  ): Vector3 {
    const repulsion = new Vector3();
    obstaclesBoundingBoxes.forEach((obstacle) => {
      const distanceFromFishToObstacle = this.fish.position.distanceTo(
        obstacle.position
      );

      if (distanceFromFishToObstacle < this.obstacleAvoidanceDistance) {
        const diff = this.fish.position
          .clone()
          .sub(obstacle.position)
          .normalize();
        repulsion.add(
          diff.multiplyScalar(
            this.obstacleRepulsionStrength / distanceFromFishToObstacle
          )
        );
      }
    });
    return repulsion;
  }

  public update(): void {
    const neighbours = this.getCohesionNeighbours();
    const separation = this.computeSeparationVector(neighbours);
    const alignment = this.computeAlignmentVector(neighbours);
    const cohesion = this.computeCohesionVector(neighbours);
    const obstacleRepulsionVector = this.computeObstacleRepulsionVector(
      App.Instance.world.obstacles
    );

    const newDirection = this.fish.direction
      .add(separation)
      .add(alignment)
      .add(cohesion)
      .add(obstacleRepulsionVector)
      .divideScalar(5); // Diviser par le nombre de vecteurs (4 vecteurs + direction initiale)

    this.fish.direction = this.fish.direction.lerp(newDirection, 0.1);
    this.fish.moveTowardsCurrentDirection();
  }
}

export default BoidBehavior;
