"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type JoystickProps = {
  position?: [number, number, number];
  scale?: number;
  colorAccent?: string;
};

export function Joystick({ position = [0, 0, 0], scale = 1, colorAccent = "#FF6B35" }: JoystickProps) {
  const group = useRef<THREE.Group>(null);
  const grip = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const target = useRef({ x: 0, y: 0 });

  const gripProfile = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0, 0.0));
    pts.push(new THREE.Vector2(0.52, 0.0));
    pts.push(new THREE.Vector2(0.52, 0.08));
    pts.push(new THREE.Vector2(0.58, 0.12));
    pts.push(new THREE.Vector2(0.60, 0.22));
    pts.push(new THREE.Vector2(0.55, 0.5));
    pts.push(new THREE.Vector2(0.40, 0.9));
    pts.push(new THREE.Vector2(0.35, 1.15));
    pts.push(new THREE.Vector2(0.38, 1.35));
    pts.push(new THREE.Vector2(0.46, 1.55));
    pts.push(new THREE.Vector2(0.52, 1.75));
    pts.push(new THREE.Vector2(0.55, 1.95));
    pts.push(new THREE.Vector2(0.52, 2.12));
    pts.push(new THREE.Vector2(0.42, 2.22));
    pts.push(new THREE.Vector2(0.0, 2.22));
    return pts;
  }, []);

  const basePlateGeom = useMemo(() => {
    const g = new THREE.CylinderGeometry(1.2, 1.4, 0.22, 64, 1, false);
    return g;
  }, []);

  const neckGeom = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0, 0.0));
    pts.push(new THREE.Vector2(0.85, 0.0));
    pts.push(new THREE.Vector2(0.9, 0.05));
    pts.push(new THREE.Vector2(0.72, 0.6));
    pts.push(new THREE.Vector2(0.58, 1.1));
    pts.push(new THREE.Vector2(0.0, 1.1));
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  const gripGeom = useMemo(() => new THREE.LatheGeometry(gripProfile, 72), [gripProfile]);

  const topRingGeom = useMemo(() => new THREE.TorusGeometry(0.45, 0.035, 16, 72), []);

  useFrame((state, dt) => {
    if (!group.current || !grip.current) return;
    const mx = state.pointer.x;
    const my = state.pointer.y;
    target.current.x += (my * 0.22 - target.current.x) * Math.min(1, dt * 3);
    target.current.y += (mx * 0.35 - target.current.y) * Math.min(1, dt * 3);
    grip.current.rotation.z = -target.current.y;
    grip.current.rotation.x = target.current.x;
    group.current.rotation.y += dt * 0.05;
    if (screen.current) {
      const t = state.clock.elapsedTime;
      screen.current.emissiveIntensity = 1.4 + Math.sin(t * 1.4) * 0.25;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh geometry={basePlateGeom} position={[0, -1.05, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#1A2030"
          metalness={0.9}
          roughness={0.35}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
        />
      </mesh>

      <mesh position={[0, -1.19, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.04, 64]} />
        <meshStandardMaterial color="#0D1220" metalness={0.6} roughness={0.7} />
      </mesh>

      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 1.15;
        return (
          <mesh key={i} position={[Math.cos(a) * r, -1.05, Math.sin(a) * r]}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
            <meshStandardMaterial color="#0A0E1A" metalness={0.8} roughness={0.3} />
          </mesh>
        );
      })}

      <group ref={grip}>
        <mesh geometry={neckGeom} position={[0, -0.95, 0]} castShadow>
          <meshPhysicalMaterial
            color="#2A3244"
            metalness={0.85}
            roughness={0.28}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>

        <mesh geometry={gripGeom} position={[0, 0.15, 0]} castShadow>
          <meshPhysicalMaterial
            color="#0E1422"
            metalness={0.15}
            roughness={0.85}
            clearcoat={0.25}
            sheen={0.6}
            sheenColor="#1a1f2b"
          />
        </mesh>

        {Array.from({ length: 18 }).map((_, i) => {
          const y = 0.4 + i * 0.07;
          return (
            <mesh key={i} position={[0, y, 0]}>
              <torusGeometry args={[0.53 - Math.abs(i - 9) * 0.008, 0.01, 8, 64]} />
              <meshStandardMaterial color="#05070D" metalness={0.2} roughness={0.9} />
            </mesh>
          );
        })}

        <mesh position={[0, 2.16, 0]} castShadow>
          <cylinderGeometry args={[0.52, 0.46, 0.12, 64]} />
          <meshPhysicalMaterial
            color="#1E2634"
            metalness={0.95}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>

        <mesh position={[0, 2.22, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.01, 64]} />
          <meshStandardMaterial
            ref={screen}
            color="#000814"
            emissive={colorAccent}
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0}
          />
        </mesh>

        <mesh geometry={topRingGeom} position={[0, 2.225, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#3A4556" metalness={0.9} roughness={0.25} />
        </mesh>

        <mesh position={[0.22, 1.7, 0.45]}>
          <boxGeometry args={[0.06, 0.16, 0.04]} />
          <meshStandardMaterial color="#0A0E1A" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh position={[-0.22, 1.7, 0.45]}>
          <boxGeometry args={[0.06, 0.16, 0.04]} />
          <meshStandardMaterial color="#0A0E1A" metalness={0.3} roughness={0.8} />
        </mesh>

        <mesh position={[0, 1.42, 0.54]}>
          <circleGeometry args={[0.04, 24]} />
          <meshStandardMaterial color={colorAccent} emissive={colorAccent} emissiveIntensity={2.2} />
        </mesh>
      </group>

      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 64]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}
