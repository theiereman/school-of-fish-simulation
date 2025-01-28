import { Intersection, Mesh, Raycaster, Vector3 } from "three";
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
  private obstacleRepulsionStrength: number = 5; // Strength of the repulsion force

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
      const topRay = new Raycaster();
      const botRay = new Raycaster();
      const rightRay = new Raycaster();
      const leftRay = new Raycaster();
      const frontRay = new Raycaster();
      const backRay = new Raycaster();

      topRay.set(this.fish.position, new Vector3(0, 1, 0));
      botRay.set(this.fish.position, new Vector3(0, -1, 0));
      rightRay.set(this.fish.position, new Vector3(1, 0, 0));
      leftRay.set(this.fish.position, new Vector3(-1, 0, 0));
      frontRay.set(this.fish.position, new Vector3(0, 0, 1));
      backRay.set(this.fish.position, new Vector3(0, 0, -1));

      const rays = [topRay, botRay, rightRay, leftRay, frontRay, backRay];

      rays.forEach((ray) => {
        const intersections: Intersection = ray.intersectObject(
          obstacle,
          true
        )[0];

        const distanceToObstacle: number = intersections?.distance;
        const pointOfIntersection: Vector3 = intersections?.point;

        if (distanceToObstacle > this.obstacleAvoidanceDistance)
          return repulsion;

        if (distanceToObstacle < this.obstacleAvoidanceDistance) {
          const diff = this.fish.position
            .clone()
            .sub(pointOfIntersection)
            .normalize();
          repulsion.add(
            diff.multiplyScalar(
              this.obstacleRepulsionStrength / distanceToObstacle
            )
          );
        }
      });
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
