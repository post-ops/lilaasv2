"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const DOT_COUNT = 64;
const DOT_RADIUS = 3.1;
const DOT_SIZE = 0.02;

function DotRing({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = t * 0.22 + progressRef.current * 4.2;
  });

  const dots = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    const a = (i / DOT_COUNT) * Math.PI * 2;
    dots.push(
      <mesh
        key={i}
        position={[Math.cos(a) * DOT_RADIUS, Math.sin(a) * DOT_RADIUS, 0]}
      >
        <sphereGeometry args={[DOT_SIZE, 10, 10]} />
        <meshStandardMaterial
          color="#FF6B35"
          emissive="#FF6B35"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
    );
  }

  return <group ref={group}>{dots}</group>;
}

function Stage({
  progressRef,
  mouseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const p = progressRef.current;
    const targetX = mx * 0.4;
    const targetY = 0.1 + my * 0.3 - p * 0.3;
    const targetZ = 6.8 - p * 1.2;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.25} />

      <DotRing progressRef={progressRef} />

      <EffectComposer multisampling={2}>
        <Bloom
          intensity={0.65}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.25}
          mipmapBlur
          kernelSize={KernelSize.MEDIUM}
        />
        <Noise opacity={0.016} blendFunction={BlendFunction.OVERLAY} premultiply />
      </EffectComposer>
    </>
  );
}

export function CinematicHero({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const mouseRef = useRef({ x: 0, y: 0 });

  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.1, 6.8], fov: 34, near: 0.1, far: 40 }}
      className="!absolute inset-0 !h-full !w-full"
      onPointerMove={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect?.();
        if (!rect) return;
        mouseRef.current.x = (e.clientX - rect.left) / rect.width - 0.5;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <Suspense fallback={null}>
        <Stage progressRef={scrollProgress} mouseRef={mouseRef} />
      </Suspense>
    </Canvas>
  );
}
