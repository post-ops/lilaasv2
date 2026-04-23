"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

function OceanPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color("#041022") },
      uShallow: { value: new THREE.Color("#0f3450") },
      uFoam: { value: new THREE.Color("#7ba9c7") },
    }),
    []
  );

  useFrame((state) => {
    if (mat.current) (mat.current.uniforms.uTime.value as number) = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1.8, 0]}>
      <planeGeometry args={[40, 22, 220, 110]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        vertexShader={`
          uniform float uTime;
          varying float vH;
          varying vec2 vUv;
          float wave(vec2 p, vec2 dir, float s, float f) {
            return sin(dot(p, dir) * f + uTime * s);
          }
          void main() {
            vec3 p = position;
            float h = 0.0;
            h += wave(p.xy, vec2(1.0, 0.4), 0.8, 0.42) * 0.42;
            h += wave(p.xy, vec2(-0.3, 1.0), 0.6, 0.65) * 0.26;
            h += wave(p.xy, vec2(0.7, -0.6), 1.3, 1.2) * 0.13;
            h += wave(p.xy, vec2(1.2, 0.9), 1.8, 2.4) * 0.06;
            p.z += h;
            vH = h;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          varying float vH;
          varying vec2 vUv;
          uniform vec3 uDeep;
          uniform vec3 uShallow;
          uniform vec3 uFoam;
          void main() {
            float t = smoothstep(-0.6, 0.9, vH);
            vec3 col = mix(uDeep, uShallow, t);
            float foam = smoothstep(0.5, 0.85, vH);
            col = mix(col, uFoam, foam * 0.4);
            float horizon = smoothstep(0.35, 0.0, vUv.y);
            col = mix(col, vec3(0.02, 0.04, 0.08), horizon);
            float edge = smoothstep(0.0, 0.15, vUv.y);
            gl_FragColor = vec4(col, edge);
          }
        `}
      />
    </mesh>
  );
}

export function OceanScene({ height = 520 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }} className="pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 2, 8], fov: 42 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 4]} intensity={1.4} color="#a6c1dd" />
          <OceanPlane />
          <EffectComposer multisampling={2}>
            <Bloom intensity={0.3} luminanceThreshold={0.9} mipmapBlur kernelSize={KernelSize.MEDIUM} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
