import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import IUpdatable from "../interfaces/iupdatable";
import gsap from "gsap";
import App from "../app";

export default class Fish implements IUpdatable {
  model: Mesh;
  speed: number;
  direction: Vector3;
  isTurning: boolean = false;

  followingTriggerDistance: number = 6; //minimal distance at which the fish follows another fish
  avoidingTriggerDistance: number = 0.2; //minimal distance at which the fish avoids another fish

  _shouldFollow = false;

  _currentlyFollowing: boolean = false;

  constructor() {
    this.model = new Mesh(
      new BoxGeometry(0.3, 0.8, 1),
      new MeshStandardMaterial({ color: "white" })
    );

    this.model.position.set(
      Math.random() * 2 * (Math.random() < 0.5 ? 1 : -1),
      Math.random() * 2 * (Math.random() < 0.5 ? 1 : -1),
      Math.random() * 2 * (Math.random() < 0.5 ? 1 : -1)
    );

    this.model.rotation.setFromVector3(this.generateRandomDirection());

    this.speed = 0.01;
    this.direction = new Vector3(1, 0, 0);
  }

  private get currentlyFollowing(): boolean {
    return this._currentlyFollowing;
  }

  private set currentlyFollowing(value: boolean) {
    if (value === true) {
      (this.model.material as MeshStandardMaterial).color.setColorName("red");
    } else {
      (this.model.material as MeshStandardMaterial).color.setColorName("white");
    }
    this._currentlyFollowing = value;
  }

  //-- debug checkbox to trigger following behavior --
  public set shouldFollow(value: boolean) {
    this._shouldFollow = value;
    if (this.shouldFollow === false) this.currentlyFollowing = false;
  }

  public get shouldFollow(): boolean {
    return this._shouldFollow;
  }
  //-- debug checkbox to trigger following behavior --

  checkOtherFishes(fishes: Fish[]) {
    fishes.forEach((otherFish) => {
      if (otherFish === this) return;
      const distance = this.model.position.distanceTo(otherFish.model.position);

      if (
        this.shouldFollow == true &&
        distance < this.followingTriggerDistance
      ) {
        this.rotateSmoothlyToVector3(otherFish.model.position);
        this.currentlyFollowing = true;
      } else {
        this.currentlyFollowing = false;
        //random movements
        if (Math.random() < 0.001) {
          this.rotateSmoothlyToVector3(this.generateRandomDirection());
        }
      }
    });
  }

  //TODO : generate random rotation starting from model position, avoids putting 1000 arbitrary value
  generateRandomDirection(): Vector3 {
    const x = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);
    const y = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);
    const z = Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1);

    return new Vector3(x, y, z);
  }

  rotateSmoothlyToVector3(targetPosition: Vector3): void {
    if (this.isTurning) return;

    this.isTurning = true;

    const directionToTarget = targetPosition
      .clone()
      .sub(this.model.position)
      .normalize();

    gsap.to(this.direction, {
      x: directionToTarget.x,
      y: directionToTarget.y,
      z: directionToTarget.z,
      duration: 0.01 / this.speed,
      onUpdate: () => {
        this.direction.normalize();
      },
      onComplete: () => {
        this.isTurning = false;
      },
    });
  }

  getForwardDirection(): Vector3 {
    return this.direction.clone();
  }

  lookForward() {
    this.model.lookAt(
      this.model.position.clone().add(this.getForwardDirection())
    );
  }

  moveForward() {
    const forwardDirection = this.getForwardDirection();
    let val = this.model.position.add(
      forwardDirection.multiplyScalar(this.speed)
    );
  }

  onTick(): void {
    if (App.Instance.world.fishes) {
      this.checkOtherFishes(App.Instance.world.fishes);
    }

    this.moveForward();
    this.lookForward();
  }
}
