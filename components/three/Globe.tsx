"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

export type GlobePoint = {
  name: string;
  region: string;
  lat: number; // degrees
  lng: number; // degrees
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

function BaseSphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[R, 48, 32]} />
        <meshBasicMaterial color="#0F1B2E" transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 1.002, 48, 32]} />
        <meshBasicMaterial color="#2A3A52" wireframe transparent opacity={0.25} />
      </mesh>
    </>
  );
}

function Meridians() {
  // Draw a few prominent latitude rings (equator, tropics) for an atlas feel.
  const rings = useMemo(() => {
    const list: { lat: number; opacity: number }[] = [
      { lat: 0, opacity: 0.35 },
      { lat: 23.5, opacity: 0.18 },
      { lat: -23.5, opacity: 0.18 },
      { lat: 60, opacity: 0.15 },
      { lat: -60, opacity: 0.15 },
    ];
    return list;
  }, []);

  return (
    <>
      {rings.map((ring, i) => {
        const phi = ((90 - ring.lat) * Math.PI) / 180;
        const r = R * Math.sin(phi);
        const y = R * Math.cos(phi);
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.003, r + 0.003, 128]} />
            <meshBasicMaterial
              color="#C9D1DE"
              transparent
              opacity={ring.opacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </>
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
      const target = isActive ? 0.1 : 0.045;
      mesh.scale.setScalar(
        mesh.scale.x + (target - mesh.scale.x) * 0.15
      );
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const tOp = isActive ? 0.45 : 0.12;
      mat.opacity += (tOp - mat.opacity) * 0.15;
    });
    coreRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const target = isActive ? 0.055 : 0.03;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.15);
    });
  });

  return (
    <>
      {points.map((p, i) => {
        const pos = latLngToVec3(p.lat, p.lng, R * 1.005);
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
                opacity={0.15}
                toneMapped={false}
              />
            </mesh>
            <mesh
              ref={(el) => {
                coreRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial
                color={p.home ? "#FFFFFF" : "#FF6B35"}
                toneMapped={false}
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
  const camera = useThree((s) => s.camera);
  const activeRef = useRef<number | null>(null);
  const lastReportedRef = useRef<number | null>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += 0.0035;

    // Which distributor is currently closest to the camera (highest z after
    // rotation). The camera sits at z=+5 looking at origin, so the front of
    // the globe is the front hemisphere. Skip the home-point marker when
    // picking the active contact.
    const worldPos = new THREE.Vector3();
    let best: number | null = null;
    let bestZ = -Infinity;
    group.current.children.forEach((child, childIndex) => {
      // child is a group per point (from DistributorDots), BaseSphere (meshes)
      // and Meridians (meshes). We only iterate the first <points.length>
      // groups — but to keep this safe, reparse via names/types:
    });
    // Simpler: compute directly from each point's rotated lat/lng.
    const q = group.current.quaternion;
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
      <ambientLight intensity={0.4} />
      <group ref={group}>
        <BaseSphere />
        <Meridians />
        <DistributorDots points={points} activeRef={activeRef} />
      </group>
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
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 5.2], fov: 36 }}
      className="!absolute inset-0 !h-full !w-full"
    >
      <Suspense fallback={null}>
        <Scene points={points} onActiveChange={onActiveChange} />
      </Suspense>
    </Canvas>
  );
}
