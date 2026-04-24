"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

export type GlobePoint = {
  name: string;
  region: string;
  lat: number;
  lng: number;
  home?: boolean;
};

const R = 1.8;

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function Earth() {
  const texture = useLoader(THREE.TextureLoader, "/images/earth/earth-dark.jpg");
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[R, 64, 48]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.95}
        metalness={0.05}
        emissive="#0a1422"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function AtmosphereGlow() {
  return (
    <mesh>
      <sphereGeometry args={[R * 1.04, 48, 32]} />
      <meshBasicMaterial
        color="#FF6B35"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function DistributorDots({
  points,
  activeRef,
}: {
  points: GlobePoint[];
  activeRef: React.MutableRefObject<number | null>;
}) {
  const haloRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const active = activeRef.current;
    haloRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const target = isActive ? 0.09 : 0.04;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.15);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const tOp = isActive ? 0.5 : 0.16;
      mat.opacity += (tOp - mat.opacity) * 0.15;
    });
    coreRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const target = isActive ? 0.05 : 0.028;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.15);
    });
  });

  return (
    <>
      {points.map((p, i) => {
        const pos = latLngToVec3(p.lat, p.lng, R * 1.01);
        return (
          <group key={i} position={pos}>
            <mesh
              ref={(el) => {
                haloRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial
                color={p.home ? "#FFD0B5" : "#FF6B35"}
                transparent
                opacity={0.2}
                toneMapped={false}
                depthTest={false}
              />
            </mesh>
            <mesh
              ref={(el) => {
                coreRefs.current[i] = el;
              }}
              renderOrder={2}
            >
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial
                color={p.home ? "#FFFFFF" : "#FF6B35"}
                toneMapped={false}
                depthTest={false}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function Scene({
  points,
  onActiveChange,
}: {
  points: GlobePoint[];
  onActiveChange: (i: number | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const activeRef = useRef<number | null>(null);
  const lastReportedRef = useRef<number | null>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += 0.003;

    const q = group.current.quaternion;
    let best: number | null = null;
    let bestZ = -Infinity;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.home) continue;
      const local = latLngToVec3(p.lat, p.lng, R);
      const v = local.clone().applyQuaternion(q);
      if (v.z > bestZ) {
        bestZ = v.z;
        best = i;
      }
    }
    activeRef.current = best;
    if (lastReportedRef.current !== best) {
      lastReportedRef.current = best;
      onActiveChange(best);
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 2, 5]} intensity={0.9} color="#fff4e0" />
      <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#6ea0ff" />
      <group ref={group}>
        <Earth />
        <DistributorDots points={points} activeRef={activeRef} />
      </group>
      <AtmosphereGlow />
    </>
  );
}

export function Globe({
  points,
  onActiveChange,
}: {
  points: GlobePoint[];
  onActiveChange: (i: number | null) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 5.8], fov: 34 }}
      className="!absolute inset-0 !h-full !w-full"
    >
      <Suspense fallback={null}>
        <Scene points={points} onActiveChange={onActiveChange} />
      </Suspense>
    </Canvas>
  );
}
