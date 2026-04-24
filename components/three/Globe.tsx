"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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
  const theta = ((90 - lng) * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function Starfield() {
  const count = 1600;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Stars on a larger sphere behind the globe
      const r = 14 + Math.random() * 10;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#C9D1DE"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
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
        <sphereGeometry args={[R * 1.06, 64, 48]} />
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
          opacity={0.07}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function Arcs({ points }: { points: GlobePoint[] }) {
  const { tubes, particleCurves } = useMemo(() => {
    const home = points.find((p) => p.home);
    if (!home) return { tubes: [], particleCurves: [] };
    const homeVec = latLngToVec3(home.lat, home.lng, R);

    const ts: { geom: THREE.TubeGeometry; mat: THREE.MeshBasicMaterial }[] = [];
    const curves: THREE.QuadraticBezierCurve3[] = [];

    points.forEach((p) => {
      if (p.home) return;
      const end = latLngToVec3(p.lat, p.lng, R);
      const angle = homeVec.angleTo(end);
      const arcHeight = R + angle * 0.55;
      const mid = homeVec
        .clone()
        .add(end)
        .normalize()
        .multiplyScalar(arcHeight);
      const curve = new THREE.QuadraticBezierCurve3(homeVec, mid, end);
      const tube = new THREE.TubeGeometry(curve, 96, 0.01, 8, false);
      const mat = new THREE.MeshBasicMaterial({
        color: "#FF6B35",
        transparent: true,
        opacity: 0.5,
        toneMapped: false,
      });
      ts.push({ geom: tube, mat });
      curves.push(curve);
    });

    return { tubes: ts, particleCurves: curves };
  }, [points]);

  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particleCurves.forEach((curve, i) => {
      const mesh = particleRefs.current[i];
      if (!mesh) return;
      // Each particle travels home → distributor in 2 s, staggered by pin index
      const cycle = 2.4;
      const phase = ((t + i * 0.25) % cycle) / cycle;
      const pos = curve.getPointAt(phase);
      mesh.position.copy(pos);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      // fade in at start, fade out at end
      mat.opacity = Math.sin(phase * Math.PI);
      mesh.scale.setScalar(0.03 + Math.sin(phase * Math.PI) * 0.025);
    });
  });

  return (
    <>
      {tubes.map((t, i) => (
        <mesh key={`t${i}`} geometry={t.geom} material={t.mat} />
      ))}
      {particleCurves.map((_, i) => (
        <mesh
          key={`p${i}`}
          ref={(el) => {
            particleRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color="#FFD0B5"
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

function Pins({
  points,
  activeRef,
}: {
  points: GlobePoint[];
  activeRef: React.MutableRefObject<number | null>;
}) {
  const haloRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pillarRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const active = activeRef.current;
    const t = state.clock.elapsedTime;

    haloRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      // pulse even when not active
      const pulse = isActive ? 0.14 : 0.06 + Math.sin(t * 2 + i) * 0.01;
      mesh.scale.setScalar(mesh.scale.x + (pulse - mesh.scale.x) * 0.15);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const tOp = isActive ? 0.7 : 0.3;
      mat.opacity += (tOp - mat.opacity) * 0.14;
    });
    coreRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const target = isActive ? 0.075 : 0.045;
      mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.14);
    });
    pillarRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i === active;
      const targetY = isActive ? 1 : 0.6;
      mesh.scale.y += (targetY - mesh.scale.y) * 0.14;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const tOp = isActive ? 0.9 : 0.55;
      mat.opacity += (tOp - mat.opacity) * 0.14;
    });
  });

  return (
    <>
      {points.map((p, i) => {
        const surface = latLngToVec3(p.lat, p.lng, R);
        const normal = surface.clone().normalize();
        const pillarLength = p.home ? 0.22 : 0.14;
        const pillarMid = surface
          .clone()
          .add(normal.clone().multiplyScalar(pillarLength / 2));
        const tipPos = surface
          .clone()
          .add(normal.clone().multiplyScalar(pillarLength + 0.02));

        // Rotation for cylinder to align with surface normal
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

        return (
          <group key={i}>
            <mesh
              ref={(el) => {
                pillarRefs.current[i] = el;
              }}
              position={pillarMid}
              quaternion={quat}
              scale={[1, 0.6, 1]}
            >
              <cylinderGeometry args={[0.006, 0.006, pillarLength, 8]} />
              <meshBasicMaterial
                color={p.home ? "#FFFFFF" : "#FF6B35"}
                transparent
                opacity={0.55}
                toneMapped={false}
              />
            </mesh>
            <group position={tipPos}>
              <mesh
                ref={(el) => {
                  haloRefs.current[i] = el;
                }}
              >
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                  color={p.home ? "#FFD0B5" : "#FF6B35"}
                  transparent
                  opacity={0.3}
                  toneMapped={false}
                  depthWrite={false}
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
                />
              </mesh>
              {p.home && (
                <Html
                  center
                  distanceFactor={10}
                  position={[0, 0.25, 0]}
                  style={{ pointerEvents: "none" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono), ui-monospace, monospace",
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.9)",
                      whiteSpace: "nowrap",
                      padding: "2px 6px",
                      background: "rgba(5,7,13,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "2px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    HORTEN · HQ
                  </span>
                </Html>
              )}
            </group>
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
      <Starfield />
      <group ref={group}>
        <Earth />
        <Arcs points={points} />
        <Pins points={points} activeRef={activeRef} />
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
