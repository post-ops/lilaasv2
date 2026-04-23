"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

function Sparks({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 8 - 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const a = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      a[i * 3 + 1] -= dt * (0.4 + (i % 5) * 0.05);
      a[i * 3] += Math.sin(state.clock.elapsedTime + i) * dt * 0.05;
      if (a[i * 3 + 1] < -4) a[i * 3 + 1] = 4;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        color="#FF8A5B"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Grid() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1, -2]}>
      <planeGeometry args={[22, 16, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          void main(){
            vec2 g = fract(vUv * vec2(40.0, 24.0));
            float line = min(g.x, g.y);
            float edge = smoothstep(0.02, 0.0, line) * 0.35;
            float sweep = smoothstep(0.05, 0.0, abs(fract(vUv.x - uTime * 0.08) - 0.5)) * 0.6;
            float fall = smoothstep(0.0, 0.8, 1.0 - vUv.y);
            vec3 col = mix(vec3(0.03,0.05,0.10), vec3(1.0, 0.42, 0.21), sweep * 0.3);
            float a = edge * fall;
            a = max(a, sweep * 0.12 * fall);
            gl_FragColor = vec4(col, a);
          }
        `}
      />
    </mesh>
  );
}

export function CNCBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.6, 6], fov: 40 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Grid />
          <Sparks />
        </Suspense>
      </Canvas>
    </div>
  );
}
