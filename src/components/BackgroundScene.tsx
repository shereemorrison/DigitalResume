import { useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Object3D } from "three";
import { useTheme, type ThemeMode } from "../theme";

const heroModelUrl = `${import.meta.env.BASE_URL}Meshy_AI_Purple_Code_Muse_0514125713_texture.glb`;

const HERO_MODEL_MAX_SIZE = 4.65;

const DEFAULT_HERO_ROT_Y = 0.55;
/**
 * Shift mesh in world -Y after centering so the head clears the top of the square viewport
 * (legs may extend toward the bottom — layout / next section can cover them; no GPU leg clip).
 */
const HERO_WORLD_SHIFT_Y = -0.18;

const INITIAL_ORBIT_AZIMUTHAL = 0;

const INITIAL_ORBIT_POLAR = 1.055;

const HERO_CAMERA_DISTANCE = 6.05;
const HERO_CAMERA_FOV = 42;

const SCENE_THEME = {
  dark: {
    bg: "#06040c",
    fog: "#140a22",
    ambient: "#f0e8ff",
    hemiSky: "#f9a8d4",
    hemiGround: "#1a0f28",
    key: "#fff7ed",
    fill: "#fda4af",
    rim: "#fb923c",
    modelTint: "#5c4a78",
    emissiveViolet: "#e879f9",
    emissiveTeal: "#f472b6",
    exposure: 1.34,
  },
  light: {
    bg: "#f0d4ff",
    fog: "#fde8f4",
    ambient: "#fff8fc",
    hemiSky: "#f0abfc",
    hemiGround: "#fde68a",
    key: "#ffffff",
    fill: "#e9d5ff",
    rim: "#ec4899",
    modelTint: "#6b4d8a",
    emissiveViolet: "#a855f7",
    emissiveTeal: "#ec4899",
    exposure: 1.16,
  },
} as const;

/** Hide backdrop meshes sometimes bundled in hero GLBs (name match only — avoids hiding the character). */
function stripEmbeddedBackdrop(root: Object3D) {
  root.traverse((obj) => {
    const name = obj.name.toLowerCase();
    if (/background|backdrop|backplate|shadow.?plane|ground.?plane|studio|pedestal|platform|\bfloor\b/.test(name)) {
      obj.visible = false;
    }
  });
}

function harmonizeResumeMaterials(root: Object3D, theme: ThemeMode) {
  const t = SCENE_THEME[theme];
  const baseTint = new THREE.Color(t.modelTint);
  const emissiveViolet = new THREE.Color(t.emissiveViolet);
  const emissiveTeal = new THREE.Color(t.emissiveTeal);

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat) continue;
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        mat.color.lerp(baseTint, theme === "light" ? 0.05 : 0.07);
        const e = mat.emissive.clone();
        e.lerp(emissiveViolet, theme === "light" ? 0.1 : 0.14).lerp(emissiveTeal, 0.06);
        mat.emissive.copy(e);
        mat.emissiveIntensity = THREE.MathUtils.clamp(
          (mat.emissiveIntensity ?? 0) * 0.92 + (theme === "light" ? 0.05 : 0.08),
          0.06,
          theme === "light" ? 0.45 : 0.65
        );
        mat.roughness = THREE.MathUtils.clamp(mat.roughness * 0.96 + 0.02, 0.2, 0.72);
        mat.metalness = THREE.MathUtils.clamp(mat.metalness * 0.88 + 0.06, 0.06, 0.48);
        mat.envMapIntensity = (mat.envMapIntensity ?? 1) * 1.08;
        mat.needsUpdate = true;
      } else if (mat instanceof THREE.MeshLambertMaterial || mat instanceof THREE.MeshPhongMaterial) {
        mat.color.lerp(baseTint, 0.06);
        mat.emissive?.lerp(emissiveViolet, 0.1);
        mat.needsUpdate = true;
      } else if (mat instanceof THREE.MeshBasicMaterial) {
        mat.color.lerp(baseTint, 0.05);
        mat.toneMapped = true;
        mat.needsUpdate = true;
      } else if (mat instanceof THREE.MeshToonMaterial) {
        mat.color.lerp(baseTint, 0.07);
        mat.emissive?.lerp(emissiveViolet, 0.12);
        mat.needsUpdate = true;
      }
    }
  });
}

function fitAndCenter(root: Object3D, maxSize = 2.35) {
  root.scale.set(1, 1, 1);
  root.position.set(0, 0, 0);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 1e-5);
  const uniform = maxSize / maxDim;
  root.scale.setScalar(uniform);
  root.updateMatrixWorld(true);
  const box2 = new THREE.Box3().setFromObject(root);
  const c = new THREE.Vector3();
  box2.getCenter(c);
  root.position.sub(c);
}

/** Camera position for frame 0 = OrbitControls spherical(r, polar, azimuthal) so there is no “default then snap” flash. */
function heroInitialCameraPosition(): [number, number, number] {
  const sph = new THREE.Spherical(HERO_CAMERA_DISTANCE, INITIAL_ORBIT_POLAR, INITIAL_ORBIT_AZIMUTHAL);
  const v = new THREE.Vector3().setFromSpherical(sph);
  return [v.x, v.y, v.z];
}

function HeroModel({ theme }: { theme: ThemeMode }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(heroModelUrl);
  const { actions } = useAnimations(animations, group);

  useLayoutEffect(() => {
    stripEmbeddedBackdrop(scene);
    harmonizeResumeMaterials(scene, theme);
    fitAndCenter(scene, HERO_MODEL_MAX_SIZE);
    scene.position.y += HERO_WORLD_SHIFT_Y;
  }, [scene, theme]);

  useEffect(() => {
    if (!actions || animations.length === 0) return;
    const names = Object.keys(actions);
    const clipName = names.find((n) => /idle|stand|loop|breath/i.test(n)) ?? names[0];
    const action = clipName ? actions[clipName] : undefined;
    action?.reset().fadeIn(0.35).play();
    return () => {
      action?.fadeOut(0.25);
    };
  }, [actions, animations.length]);

  return (
    <group ref={group} rotation={[0, DEFAULT_HERO_ROT_Y, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(heroModelUrl);

function SceneClearColor({ theme }: { theme: ThemeMode }) {
  const { gl } = useThree();
  const t = SCENE_THEME[theme];

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
    gl.toneMappingExposure = t.exposure;
  }, [gl, t.exposure]);

  return null;
}

function Scene({ theme }: { theme: ThemeMode }) {
  const orbitRef = useRef<{
    target: THREE.Vector3;
    azimuthalAngle: number;
    polarAngle: number;
    update: () => void;
  } | null>(null);
  const t = SCENE_THEME[theme];

  useLayoutEffect(() => {
    const oc = orbitRef.current;
    if (!oc) return;
    oc.target.set(0, 0, 0);
    oc.azimuthalAngle = INITIAL_ORBIT_AZIMUTHAL;
    oc.polarAngle = INITIAL_ORBIT_POLAR;
    oc.update();
  }, []);

  return (
    <>
      <SceneClearColor theme={theme} />
      <ambientLight intensity={theme === "light" ? 0.85 : 0.72} color={t.ambient} />
      <hemisphereLight args={[t.hemiSky, t.hemiGround, theme === "light" ? 0.55 : 0.45]} position={[0, 3, 0]} />
      <directionalLight position={[3.8, 6.2, 4.2]} intensity={theme === "light" ? 1.2 : 1.45} color={t.key} />
      <directionalLight position={[-4.5, 2.5, -2.5]} intensity={theme === "light" ? 0.5 : 0.62} color={t.fill} />
      <pointLight position={[-2.2, 0.2, 2.8]} intensity={theme === "light" ? 0.55 : 0.75} color={t.rim} distance={14} decay={2} />
      <HeroModel theme={theme} />
      <OrbitControls
        ref={orbitRef}
        makeDefault
        enablePan={false}
        enableZoom={false}
        minDistance={HERO_CAMERA_DISTANCE}
        maxDistance={HERO_CAMERA_DISTANCE}
        minPolarAngle={0.32}
        maxPolarAngle={Math.PI - 0.32}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.85}
      />
    </>
  );
}

export function BackgroundScene() {
  const { theme } = useTheme();
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  const sceneTheme = SCENE_THEME[theme];

  return (
    <div style={{ width: "100%", height: "100%", touchAction: "none" }}>
      <Canvas
        dpr={dpr}
        camera={{
          position: heroInitialCameraPosition(),
          fov: HERO_CAMERA_FOV,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "default",
          localClippingEnabled: false,
          premultipliedAlpha: true,
        }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(0, 0, 0);
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = sceneTheme.exposure;
          gl.localClippingEnabled = false;
        }}
      >
        <Scene theme={theme} />
      </Canvas>
    </div>
  );
}
