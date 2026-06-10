"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export type Accent3DVariant = "knot" | "ico" | "octa" | "torus";

function Geometry({ variant }: { variant: Accent3DVariant }) {
  switch (variant) {
    case "ico":
      return <icosahedronGeometry args={[1.3, 1]} />;
    case "octa":
      return <octahedronGeometry args={[1.5, 0]} />;
    case "torus":
      return <torusGeometry args={[1.05, 0.4, 24, 90]} />;
    case "knot":
    default:
      return <torusKnotGeometry args={[1, 0.33, 128, 16]} />;
  }
}

function Obj({
  variant,
  color,
  wireframe,
}: {
  variant: Accent3DVariant;
  color: string;
  wireframe: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.16;
    ref.current.rotation.y += delta * 0.22;
  });

  return (
    <mesh ref={ref}>
      <Geometry variant={variant} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.15}
        emissive={color}
        emissiveIntensity={0.18}
        wireframe={wireframe}
        flatShading={variant === "ico" || variant === "octa"}
      />
    </mesh>
  );
}

export default function Accent3DScene({
  variant,
  color,
  wireframe = false,
}: {
  variant: Accent3DVariant;
  color: string;
  wireframe?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      performance={{ min: 0.5 }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[-4, -2, -3]} intensity={0.7} color={color} />
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.1}>
        <Obj variant={variant} color={color} wireframe={wireframe} />
      </Float>
    </Canvas>
  );
}
