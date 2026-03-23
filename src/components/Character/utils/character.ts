import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
loader.setDRACOLoader(dracoLoader);

let cachedGltf: GLTF | null = null;
let loadPromise: Promise<GLTF | null> | null = null;

// Start loading the model immediately as soon as the module is imported
export const preloadCharacter = () => {
  if (cachedGltf) return Promise.resolve(cachedGltf);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<GLTF | null>(async (resolve, reject) => {
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc?v=2",
        "MyCharacter12"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      loader.load(
        blobUrl,
        (gltf) => {
          cachedGltf = gltf;
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              const mesh = child as THREE.Mesh;
              if (mesh.material) {
                if (mesh.name === "BODY.SHIRT") {
                  const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color("#8B4513");
                  mesh.material = newMat;
                } else if (mesh.name === "Pant") {
                  const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color("#000000");
                  mesh.material = newMat;
                }
              }
              child.castShadow = true;
              child.receiveShadow = true;
              mesh.frustumCulled = true;
            }
          });
          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
          loadPromise = null;
          reject(error);
        }
      );
    } catch (err) {
      console.error(err);
      loadPromise = null;
      reject(err);
    }
  });

  return loadPromise;
};

// Auto-trigger preload
preloadCharacter();

const setCharacter = (
  _renderer: THREE.WebGLRenderer,
  _scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loadCharacter = () => {
    return preloadCharacter().then((gltf) => {
      if (gltf) {
        const character = gltf.scene;
        setCharTimeline(character, camera);
        setAllTimeline();
        character.getObjectByName("footR")!.position.y = 3.36;
        character.getObjectByName("footL")!.position.y = 3.36;
      }
      return gltf;
    });
  };

  return { loadCharacter };
};

export default setCharacter;
