"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const DOT_RINGS = [
  {
    count: 40,
    radius: 3.1,
    tilt: [0, 0, 0] as const,
    size: 0.022,
    scrollSpin: 4.2,
    idleSpin: 0.18,
  },
  {
    count: 32,
    radius: 3.8,
    tilt: [Math.PI / 2.3, 0, 0] as const,
    size: 0.018,
    scrollSpin: -3.0,
    idleSpin: -0.12,
  },
  {
    count: 26,
    radius: 4.5,
    tilt: [0, Math.PI / 4, Math.PI / 3] as const,
    size: 0.014,
    scrollSpin: 2.4,
    idleSpin: 0.08,
  },
];

function DotRing({
  ring,
  progressRef,
}: {
  ring: (typeof DOT_RINGS)[number];
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z =
      t * ring.idleSpin + progressRef.current * ring.scrollSpin;
  });

  const dots = [];
  for (let i = 0; i < ring.count; i++) {
    const a = (i / ring.count) * Math.PI * 2;
    dots.push(
      <mesh key={i} position={[Math.cos(a) * ring.radius, Math.sin(a) * ring.radius, 0]}>
        <sphereGeometry args={[ring.size, 10, 10]} />
        <meshStandardMaterial
          color="#FF6B35"
          emissive="#FF6B35"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
    );
  }

  return (
    <group ref={group} rotation={ring.tilt}>
      {dots}
    </group>
  );
}

const CENTER_CIRCLES: [number, number, number, number][] = [
  // [x, y, z, size]
  [0, 0, 0, 0.16],
  [0.55, 0.3, 0.2, 0.09],
  [-0.45, 0.48, -0.1, 0.07],
  [0.35, -0.5, 0.15, 0.08],
  [-0.55, -0.25, -0.2, 0.06],
  [0.05, 0.7, -0.3, 0.05],
  [-0.15, -0.75, 0.25, 0.055],
];

function Sculpture({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    if (group.current) {
      group.current.rotation.y = t * 0.12 + p * 0.9;
      group.current.rotation.x = Math.sin(t * 0.08) * 0.08 + p * 0.25;
    }
  });

  return (
    <group ref={group}>
      <Float speed={0.7} rotationIntensity={0.3} floatIntensity={0.35}>
        <group>
          {CENTER_CIRCLES.map(([x, y, z, size], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial
                color="#FF6B35"
                emissive="#FF6B35"
                emissiveIntensity={1.8}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {DOT_RINGS.map((ring, i) => (
        <DotRing key={i} ring={ring} progressRef={progressRef} />
      ))}
    </group>
  );
}

function Stage({ progressRef, mouseRef }: { progressRef: React.MutableRefObject<number>; mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const p = progressRef.current;
    const targetX = mx * 0.6;
    const targetY = 0.2 + my * 0.4 - p * 0.4;
    const targetZ = 6.8 - p * 1.5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#05070D"]} />
      <fog attach="fog" args={["#05070D", 9, 22]} />

      <ambientLight intensity={0.15} />
      <directionalLight
        position={[-5, 6, 4]}
        intensity={3.2}
        color="#fff2d4"
      />
      <pointLight position={[6, 2, -2]} intensity={2.5} color="#FF6B35" distance={14} />
      <pointLight position={[-5, -3, 5]} intensity={1.6} color="#2BD4B4" distance={12} />
      <spotLight
        position={[0, 8, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.8}
        color="#ffffff"
      />

      <Environment preset="city" environmentIntensity={0.7} />

      <Sculpture progressRef={progressRef} />

      <EffectComposer multisampling={2}>
        <Bloom
          intensity={0.65}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.25}
          mipmapBlur
          kernelSize={KernelSize.MEDIUM}
        />
        <Noise
          opacity={0.02}
          blendFunction={BlendFunction.OVERLAY}
          premultiply
        />
        <Vignette eskil={false} offset={0.2} darkness={0.88} />
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
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 6.8], fov: 34, near: 0.1, far: 40 }}
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
