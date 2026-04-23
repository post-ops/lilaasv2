"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Sculpture({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const ring = useRef<THREE.Mesh>(null);
  const torus = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    if (group.current) {
      group.current.rotation.y = t * 0.18 + p * 1.4;
      group.current.rotation.x = Math.sin(t * 0.12) * 0.15 + p * 0.4;
    }
    if (ring.current) ring.current.rotation.z = t * 0.08;
    if (torus.current) {
      torus.current.rotation.x = t * 0.22;
      torus.current.rotation.y = t * 0.13;
    }
    if (inner.current) {
      inner.current.rotation.x = -t * 0.3;
      inner.current.rotation.z = t * 0.2;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.5}>
        <mesh ref={torus} castShadow>
          <torusKnotGeometry args={[1.6, 0.44, 220, 32, 2, 3]} />
          <meshPhysicalMaterial
            color="#eef1f7"
            metalness={1}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.6}
          />
        </mesh>
      </Float>

      <mesh ref={ring} position={[0, 0, 0]}>
        <torusGeometry args={[3.2, 0.015, 8, 180]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[3.8, 0.008, 8, 200]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[4.4, 0.005, 8, 220]} />
        <meshBasicMaterial color="#2BD4B4" transparent opacity={0.18} />
      </mesh>

      <Float speed={2.2} rotationIntensity={0.8} floatIntensity={0.2}>
        <mesh ref={inner} position={[2.2, 1.1, 0.8]}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#FF6B35"
            emissive="#FF6B35"
            emissiveIntensity={1.4}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh position={[-2.4, -1.4, 0.4]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#2BD4B4"
            emissive="#2BD4B4"
            emissiveIntensity={1.2}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Float>
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
          intensity={1.4}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.22}
          mipmapBlur
          kernelSize={KernelSize.LARGE}
        />
        <Noise
          opacity={0.025}
          blendFunction={BlendFunction.OVERLAY}
          premultiply
        />
        <Vignette eskil={false} offset={0.18} darkness={0.92} />
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
