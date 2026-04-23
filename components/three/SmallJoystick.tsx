"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Float, PresentationControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { Suspense } from "react";
import { Joystick } from "./Joystick";

export function SmallJoystick({
  rotation = 0,
  accent = "#FF6B35",
  height = 420,
}: {
  rotation?: number;
  accent?: string;
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.8, 6.5], fov: 28 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[-4, 6, 3]} intensity={2.8} color="#fff2d4" />
          <pointLight position={[4, 2, -2]} intensity={1.2} color={accent} distance={10} />
          <Environment preset="warehouse" environmentIntensity={0.45} />
          <PresentationControls
            global
            rotation={[0.12, rotation, 0]}
            polar={[-0.2, 0.3]}
            azimuth={[-0.6, 0.6]}
            snap
            speed={1.2}
          >
            <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.25}>
              <Joystick scale={0.95} position={[0, 0.2, 0]} colorAccent={accent} />
            </Float>
          </PresentationControls>
          <ContactShadows
            position={[0, -1.95, 0]}
            opacity={0.5}
            scale={10}
            blur={2.4}
            far={4}
            color="#000"
          />
          <EffectComposer multisampling={2}>
            <Bloom intensity={0.75} luminanceThreshold={0.85} mipmapBlur kernelSize={KernelSize.MEDIUM} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
