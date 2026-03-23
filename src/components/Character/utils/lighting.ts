import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

let cachedEnvTexture: THREE.DataTexture | null = null;
let loadPromise: Promise<THREE.DataTexture> | null = null;

export const preloadLighting = () => {
  if (cachedEnvTexture) return Promise.resolve(cachedEnvTexture);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    new RGBELoader()
      .setPath("/models/")
      .load(
        "char_enviorment.hdr?v=2",
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          cachedEnvTexture = texture;
          resolve(texture);
        },
        undefined,
        (err) => {
          console.error("Error loading HDR:", err);
          loadPromise = null;
          reject(err);
        }
      );
  });
  return loadPromise;
};

// Start preloading immediately
preloadLighting();

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0x5eead4, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x22d3ee, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  preloadLighting().then((texture) => {
    scene.environment = texture;
    scene.environmentIntensity = 0;
    scene.environmentRotation.set(5.76, 85.85, 1);
  });

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }
  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
