import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import type { MutableRefObject } from "react";

type ScrollRef = MutableRefObject<{ progress: number }>;

function CoreShape({ scrollRef }: { scrollRef: ScrollRef }) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = scrollRef.current.progress;
    if (group.current) {
      group.current.rotation.y = t * 0.14 + p * Math.PI * 1.2;
      group.current.rotation.x = Math.sin(t * 0.07) * 0.12 + p * 0.28;
    }
    if (mesh.current) {
      mesh.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} scale={1.52}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#132a26"
          emissive="#063028"
          emissiveIntensity={0.55}
          roughness={0.38}
          metalness={0.55}
        />
      </mesh>
      <mesh scale={1.58}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene({ scrollRef }: { scrollRef: ScrollRef }) {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8, 22]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.05} color="#c8fff4" />
      <pointLight position={[-3, -1, 2]} intensity={0.55} color="#7cf0d6" />
      <CoreShape scrollRef={scrollRef} />
    </>
  );
}

export function BackgroundScene({ scrollRef }: { scrollRef: ScrollRef }) {
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 4.85], fov: 42 }}
        gl={{ alpha: false, antialias: true, powerPreference: "default" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 1);
        }}
      >
        <Scene scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}