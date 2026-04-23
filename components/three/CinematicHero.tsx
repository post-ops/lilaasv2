"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const DOT_RINGS = [
  {
    count: 40,
    radius: 2.4,
    tilt: [0, 0, 0] as const,
    size: 0.02,
    scrollSpin: 4.2,
    idleSpin: 0.18,
  },
  {
    count: 32,
    radius: 3.0,
    tilt: [Math.PI / 2.3, 0, 0] as const,
    size: 0.016,
    scrollSpin: -3.0,
    idleSpin: -0.12,
  },
  {
    count: 26,
    radius: 3.6,
    tilt: [0, Math.PI / 4, Math.PI / 3] as const,
    size: 0.012,
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
        <meshBasicMaterial color="#FF6B35" toneMapped={false} />
      </mesh>
    );
  }

  return (
    <group ref={group} rotation={ring.tilt}>
      {dots}
    </group>
  );
}

function Stage({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    group.current.rotation.y = t * 0.1 + p * 0.7;
    group.current.rotation.x = Math.sin(t * 0.08) * 0.06 + p * 0.2;
  });

  return (
    <>
      <color attach="background" args={["#00000000"]} />
      <ambientLight intensity={0.2} />
      <group ref={group}>
        {DOT_RINGS.map((ring, i) => (
          <DotRing key={i} ring={ring} progressRef={progressRef} />
        ))}
      </group>
    </>
  );
}

export function CinematicHero({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 40 }}
      className="!absolute inset-0 !h-full !w-full"
    >
      <Suspense fallback={null}>
        <Stage progressRef={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
