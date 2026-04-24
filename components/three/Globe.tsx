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
  const texture = useLoader(THREE.TextureLoader, "/images/earth/earth-night.jpg");
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[R, 96, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={1}
        metalness={0}
        emissive="#0c1828"
        emissiveIntensity={0.55}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <>
      {/* Outer atmosphere shell — warm signal glow */}
      <mesh>
        <sphereGeometry args={[R * 1.05, 64, 48]} />
        <meshBasicMaterial
          color="#FF6B35"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      {/* Inner rim light */}
      <mesh>
        <sphereGeometry args={[R * 1.015, 64, 48]} />
        <meshBasicMaterial
          color="#C9D1DE"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function Arcs({ points }: { points: GlobePoint[] }) {
  const home = points.find((p) => p.home);
  const { geometries, dashMats } = useMemo(() => {
    if (!home) return { geometries: [], dashMats: [] };
    const homeVec = latLngToVec3(home.lat, home.lng, R);
    const gs: THREE.BufferGeometry[] = [];
    const mats: THREE.LineBasicMaterial[] = [];

    points.forEach((p) => {
      if (p.home) return;
      const end = latLngToVec3(p.lat, p.lng, R);
      const angle = homeVec.angleTo(end);
      const arcHeight = R + angle * 0.45;
      const mid = homeVec.clone().add(end).normalize().multiplyScalar(arcHeight);
      const curve = new THREE.QuadraticBezierCurve3(homeVec, mid, end);
      const pts = curve.getPoints(80);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      gs.push(g);
      mats.push(
        new THREE.LineBasicMaterial({
          color: "#FF6B35",
          transparent: true,
          opacity: 0.35,
          toneMapped: false,
        })
      );
    });
    return { geometries: gs, dashMats: mats };
  }, [points, home]);

  return (
    <>
      {geometries.map((g, i) => (
        <primitive key={i} object={new THREE.Line(g, dashMats[i])} />
      ))}
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
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const active = activeRef.current;
    const t = state.clock.elapsedTime;

    haloRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const target = isActive ? 0.11 : 0.045;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.14);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const tOp = isActive ? 0.55 : 0.18;
      mat.opacity += (tOp - mat.opacity) * 0.14;
    });
    coreRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const target = isActive ? 0.055 : 0.03;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.14);
    });
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      // each pulse staggered by index
      const phase = ((t + i * 0.5) % 3) / 3;
      const scale = 0.045 + phase * 0.18;
      mesh.scale.setScalar(scale);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.5 - phase * 0.5);
    });
  });

  return (
    <>
      {points.map((p, i) => {
        const pos = latLngToVec3(p.lat, p.lng, R * 1.008);
        return (
          <group key={i} position={pos}>
            {/* pulse ring */}
            {!p.home && (
              <mesh
                ref={(el) => {
                  pulseRefs.current[i] = el;
                }}
              >
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                  color="#FF6B35"
                  transparent
                  opacity={0}
                  toneMapped={false}
                  depthTest={false}
                />
              </mesh>
            )}
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
                color={p.home ? "#FFFFFF" : "#FFD0B5"}
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
    group.current.rotation.y += 0.0028;

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
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 2, 5]} intensity={0.8} color="#fff2d4" />
      <directionalLight position={[-5, -2, -3]} intensity={0.35} color="#5a7aa8" />
      <group ref={group}>
        <Earth />
        <Arcs points={points} />
        <DistributorDots points={points} activeRef={activeRef} />
      </group>
      <Atmosphere />
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
      camera={{ position: [0, 0.25, 5.8], fov: 34 }}
      className="!absolute inset-0 !h-full !w-full"
    >
      <Suspense fallback={null}>
        <Scene points={points} onActiveChange={onActiveChange} />
      </Suspense>
    </Canvas>
  );
}
