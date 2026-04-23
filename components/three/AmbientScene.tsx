"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

type Intensity = "hero" | "section" | "whisper";

type Config = {
  particleCount: number;
  particleSize: number;
  particleOpacity: number;
  gridOpacity: number;
  sweepStrength: number;
  lightIntensity: number;
};

const PROFILES: Record<Intensity, Config> = {
  hero: {
    particleCount: 520,
    particleSize: 0.03,
    particleOpacity: 0.75,
    gridOpacity: 0.45,
    sweepStrength: 0.6,
    lightIntensity: 1.2,
  },
  section: {
    particleCount: 320,
    particleSize: 0.028,
    particleOpacity: 0.55,
    gridOpacity: 0.32,
    sweepStrength: 0.4,
    lightIntensity: 0.8,
  },
  whisper: {
    particleCount: 180,
    particleSize: 0.022,
    particleOpacity: 0.35,
    gridOpacity: 0.18,
    sweepStrength: 0.22,
    lightIntensity: 0.5,
  },
};

function Particles({ count, size, opacity, accent }: { count: number; size: number; opacity: number; accent: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const a = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      a[i * 3 + 1] += dt * (0.08 + (i % 7) * 0.012);
      a[i * 3] += Math.sin(state.clock.elapsedTime * 0.3 + i) * dt * 0.02;
      if (a[i * 3 + 1] > 5.2) a[i * 3 + 1] = -5.2;
    }
    pos.needsUpdate = true;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={accent}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function PerspectiveGrid({ opacity, sweep, accent }: { opacity: number; sweep: number; accent: string }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uSweep: { value: sweep },
      uAccent: { value: new THREE.Color(accent) },
    }),
    [opacity, sweep, accent]
  );

  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.4, -1]}>
      <planeGeometry args={[28, 18, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uOpacity;
          uniform float uSweep;
          uniform vec3 uAccent;
          void main(){
            vec2 g = fract(vUv * vec2(48.0, 28.0));
            float line = min(g.x, g.y);
            float edge = smoothstep(0.02, 0.0, line);
            float sweep = smoothstep(0.05, 0.0, abs(fract(vUv.x - uTime * 0.06) - 0.5));
            float fall = smoothstep(0.0, 0.9, 1.0 - vUv.y);
            vec3 col = mix(vec3(0.03,0.05,0.10), uAccent, sweep * 0.35);
            float a = edge * fall * uOpacity;
            a = max(a, sweep * uSweep * 0.14 * fall);
            gl_FragColor = vec4(col, a);
          }
        `}
      />
    </mesh>
  );
}

function LightField({ intensity, accent }: { intensity: number; accent: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 * intensity + Math.sin(t * 0.6) * 0.025 * intensity;
  });
  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <planeGeometry args={[22, 14, 1, 1]} />
      <meshBasicMaterial color={accent} transparent opacity={0.08 * intensity} depthWrite={false} />
    </mesh>
  );
}

export function AmbientScene({
  intensity = "section",
  accent = "#FF6B35",
  className,
}: {
  intensity?: Intensity;
  accent?: string;
  className?: string;
}) {
  const cfg = PROFILES[intensity];

  return (
    <div className={"absolute inset-0 pointer-events-none " + (className ?? "")}>
      <Canvas
        dpr={[1, 1.4]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 7], fov: 40 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <LightField intensity={cfg.lightIntensity} accent={accent} />
          <PerspectiveGrid opacity={cfg.gridOpacity} sweep={cfg.sweepStrength} accent={accent} />
          <Particles
            count={cfg.particleCount}
            size={cfg.particleSize}
            opacity={cfg.particleOpacity}
            accent={accent}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
