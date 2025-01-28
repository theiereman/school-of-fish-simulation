import {
  Mesh,
  PlaneGeometry,
  Group,
  MeshBasicMaterial,
  BackSide,
  MeshStandardMaterial,
} from "three";

class FishTank {
  tank: Group;

  constructor(width: number, height: number, depth: number) {
    this.tank = this.createTank(width, height, depth);
  }

  private createTank(width: number, height: number, depth: number): Group {
    const botAndTopPanel = new PlaneGeometry(depth, width);
    const sidePanels = new PlaneGeometry(depth, height);
    const frontAndBackPanels = new PlaneGeometry(width, height);

    const material = new MeshStandardMaterial({
      color: 0x00aaff,
      side: 2,
      transparent: true,
      opacity: 0.5,
    });

    const bottom = new Mesh(botAndTopPanel, material);
    bottom.position.set(0, -height / 2, 0);
    bottom.rotation.x = Math.PI / 2;
    bottom.rotation.z = Math.PI / 2;

    const top = new Mesh(botAndTopPanel, material);
    top.position.set(0, height / 2, 0);
    top.rotation.x = -Math.PI / 2;
    top.rotation.z = Math.PI / 2;

    const left = new Mesh(sidePanels, material);
    left.position.set(-width / 2, 0, 0);
    left.rotation.y = Math.PI / 2;

    const right = new Mesh(sidePanels, material);
    right.position.set(width / 2, 0, 0);
    right.rotation.y = -Math.PI / 2;

    const front = new Mesh(frontAndBackPanels, material);
    front.position.set(0, 0, depth / 2);

    const back = new Mesh(frontAndBackPanels, material);
    back.position.set(0, 0, -depth / 2);

    const tank = new Group();
    tank.add(bottom);
    tank.add(top);
    tank.add(left);
    tank.add(right);
    tank.add(front);
    tank.add(back);

    return tank;
  }
}

export default FishTank;
