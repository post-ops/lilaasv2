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

// Matches three-globe's coordinate convention, which is what the
// earth-blue-marble.jpg texture from the same package is drawn against.
// With this formula, Greenwich (lng 0) sits at the +Z axis, i.e. directly
// in front of the default camera, so Europe is visible on first render.
function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function Earth() {
  const texture = useLoader(THREE.TextureLoader, "/images/earth/earth-blue-marble.jpg");
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[R, 128, 80]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.85}
        metalness={0.05}
        emissive="#1a2a3e"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[R * 1.055, 64, 48]} />
        <meshBasicMaterial
          color="#FF6B35"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 1.02, 64, 48]} />
        <meshBasicMaterial
          color="#7fb4ff"
          transparent
          opacity={0.06}
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
  const meshes = useMemo(() => {
    if (!home) return [];
    const homeVec = latLngToVec3(home.lat, home.lng, R);
    return points
      .filter((p) => !p.home)
      .map((p) => {
        const end = latLngToVec3(p.lat, p.lng, R);
        const angle = homeVec.angleTo(end);
        const arcHeight = R + angle * 0.5;
        const mid = homeVec
          .clone()
          .add(end)
          .normalize()
          .multiplyScalar(arcHeight);
        const curve = new THREE.QuadraticBezierCurve3(homeVec, mid, end);
        const tube = new THREE.TubeGeometry(curve, 80, 0.012, 8, false);
        const mat = new THREE.MeshBasicMaterial({
          color: "#FF6B35",
          transparent: true,
          opacity: 0.75,
          toneMapped: false,
        });
        return { tube, mat };
      });
  }, [points, home]);

  return (
    <>
      {meshes.map((m, i) => (
        <mesh key={i} geometry={m.tube} material={m.mat} />
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
      const target = isActive ? 0.14 : 0.06;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.14);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const tOp = isActive ? 0.7 : 0.35;
      mat.opacity += (tOp - mat.opacity) * 0.14;
    });
    coreRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const target = isActive ? 0.075 : 0.045;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.14);
    });
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = ((t + i * 0.5) % 3) / 3;
      const scale = 0.06 + phase * 0.22;
      mesh.scale.setScalar(scale);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.6 - phase * 0.6);
    });
  });

  return (
    <>
      {points.map((p, i) => {
        const pos = latLngToVec3(p.lat, p.lng, R * 1.01);
        return (
          <group key={i} position={pos}>
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
                opacity={0.35}
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
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial
                color={p.home ? "#FFFFFF" : "#FFE0C8"}
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
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 2, 5]} intensity={1.2} color="#fff4e0" />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#6a8fc0" />
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
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.25, 5.6], fov: 36 }}
      className="!absolute inset-0 !h-full !w-full"
    >
      <Suspense fallback={null}>
        <Scene points={points} onActiveChange={onActiveChange} />
      </Suspense>
    </Canvas>
  );
}
