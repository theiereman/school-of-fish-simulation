import { AmbientLight, DirectionalLight, Scene } from "three";
import App from "../app";

export default class Environment {
  constructor() {
    this.setSunlight();
    this.setAmbientlight();
  }

  setAmbientlight() {
    const ambientLight = new AmbientLight("white", 0.2);
    App.Instance.scene.add(ambientLight);
  }

  setSunlight() {
    const directionalLight = new DirectionalLight("#ffffff", 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(3.5, 2, -1.25);
    App.Instance.scene.add(directionalLight);
  }
}
