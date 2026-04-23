"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Joystick } from "./Joystick";

function SceneContent({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const camera = useThree((s) => s.camera);
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = scrollProgress.current;
    const camZ = 7 - p * 3;
    const camY = 0.4 + p * 2.2;
    const camX = Math.sin(p * Math.PI * 0.7) * 1.5;
    camera.position.x += (camX - camera.position.x) * 0.08;
    camera.position.y += (camY - camera.position.y) * 0.08;
    camera.position.z += (camZ - camera.position.z) * 0.08;
    camera.lookAt(0, 0.5 - p * 0.5, 0);
    if (group.current) {
      group.current.rotation.y = p * Math.PI * 1.2;
    }
  });

  return (
    <>
      <color attach="background" args={["#05070D"]} />
      <fog attach="fog" args={["#05070D", 8, 26]} />

      <ambientLight intensity={0.12} />
      <directionalLight
        position={[-5, 8, 4]}
        intensity={3.2}
        color="#fff2d4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />
      <pointLight position={[5, 2, -3]} intensity={1.2} color="#FF6B35" distance={12} />
      <pointLight position={[-4, 1.5, 5]} intensity={0.9} color="#2BD4B4" distance={10} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.4}
        penumbra={0.7}
        intensity={1.6}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />

      <Environment preset="warehouse" environmentIntensity={0.5} />

      <group ref={group}>
        <Float speed={1.4} rotationIntensity={0.22} floatIntensity={0.35}>
          <Joystick scale={1.15} position={[0, 0.2, 0]} />
        </Float>
      </group>

      <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.22, 128]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -2.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.5, 4.52, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, -2.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 6.02, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>

      <ContactShadows
        position={[0, -2.05, 0]}
        opacity={0.55}
        scale={14}
        blur={2.4}
        far={5}
        resolution={1024}
        color="#000"
      />

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.2}
          mipmapBlur
          kernelSize={KernelSize.LARGE}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0008, 0.0008)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.9} />
      </EffectComposer>
    </>
  );
}

export function HeroScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 7], fov: 32, near: 0.1, far: 60 }}
      className="!absolute inset-0 !h-full !w-full"
    >
      <Suspense fallback={null}>
        <SceneContent scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
