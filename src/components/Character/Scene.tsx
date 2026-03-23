import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { initialFX } from "../utils/initialFX";
import { debounce } from "../utils/debounce";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  let characterObj: THREE.Object3D | null = null;

  const debouncedResize = useMemo(
    () =>
      debounce((renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, canvasDiv: React.RefObject<HTMLDivElement>, character: THREE.Object3D) => {
        handleResize(renderer, camera, canvasDiv, character);
      }, 250),
    []
  );

  useEffect(() => {
    if (canvasDiv.current) {
      if (!sceneRef.current) {
        sceneRef.current = new THREE.Scene();
      }
      const scene = sceneRef.current;
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width || window.innerWidth, height: rect.height || window.innerHeight };
      const aspect = container.width / container.height;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounceTimeout: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounceTimeout = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      let lastTime = 0;
      const FPS_LIMIT = 30;
      const FRAME_INTERVAL = 1000 / FPS_LIMIT;
      let animFrameId: number;
      let isPageVisible = !document.hidden;

      const animate = (time: number) => {
        animFrameId = requestAnimationFrame(animate);
        if (!isPageVisible) return;
        const delta30 = time - lastTime;
        if (delta30 < FRAME_INTERVAL) return;
        lastTime = time - (delta30 % FRAME_INTERVAL);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
      };

      const onVisibilityChange = () => {
        isPageVisible = !document.hidden;
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      const onResize = () => {
        if (characterObj) {
          debouncedResize(renderer, camera, canvasDiv, characterObj);
        }
      };

      // Start the intro animation immediately, don't wait for character
      initialFX();

      loadCharacter()
        .then((gltf) => {
          if (gltf) {
            const animations = setAnimations(gltf);
            hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
            mixer = animations.mixer;
            characterObj = gltf.scene;
            scene.add(characterObj);
            headBone = characterObj.getObjectByName("spine006") || null;
            screenLight = characterObj.getObjectByName("screenlight") || null;
            light.turnOnLights();
            animations.startIntro();
            window.addEventListener("resize", onResize);
            // Only start render loop after model is ready
            animFrameId = requestAnimationFrame(animate);
          }
        })
        .catch((err) => {
          console.error("Failed to load character:", err);
        });

      return () => {
        clearTimeout(debounceTimeout);
        cancelAnimationFrame(animFrameId);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        document.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        scene.clear();
        renderer.dispose();
        if (canvasDiv.current && renderer.domElement.parentNode === canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, [debouncedResize]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
