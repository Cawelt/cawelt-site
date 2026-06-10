"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useEffect, useRef, Suspense, useState } from "react";
import * as THREE from "three";

function MorphSphere({ detail = 64 }: { detail?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColorA: { value: new THREE.Color("#ff6b3d") },
    uColorB: { value: new THREE.Color("#5b8def") },
    uColorC: { value: new THREE.Color("#0a0a0c") },
  });

  useFrame((state, delta) => {
    if (!ref.current) return;
    uniforms.current.uTime.value += delta;
    const m = state.pointer;
    uniforms.current.uMouse.value.lerp(
      new THREE.Vector2(m.x, m.y),
      0.06,
    );
    ref.current.rotation.y += delta * 0.1;
    ref.current.rotation.x += delta * 0.04;
  });

  return (
    <mesh ref={ref} scale={2.4}>
      <icosahedronGeometry args={[1, detail]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms.current}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          varying vec3 vNormal;
          varying vec3 vPos;
          varying float vDist;

          // simplex noise
          vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
          vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
          vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
          float snoise(vec3 v){
            const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
            vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
            vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
            vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
            i=mod289(i);
            vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
            float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
            vec4 j=p-49.0*floor(p*ns.z*ns.z);
            vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
            vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
            vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
            vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
            vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
            vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
            vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
            p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
            vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
            m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
          }

          void main(){
            vec3 pos = position;
            float t = uTime * 0.35;
            float n = snoise(pos * 0.9 + vec3(t, t*0.7, -t*0.5));
            float n2 = snoise(pos * 1.8 + vec3(-t*0.4, t*0.6, t*0.3));
            float disp = n * 0.32 + n2 * 0.12;
            disp += (uMouse.x + uMouse.y) * 0.08;
            pos += normal * disp;

            vNormal = normalize(normalMatrix * normal);
            vPos = pos;
            vDist = disp;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPos;
          varying float vDist;
          void main(){
            float fres = pow(1.0 - dot(normalize(vNormal), vec3(0.0,0.0,1.0)), 2.0);
            float mixv = smoothstep(-0.2, 0.5, vDist);
            vec3 base = mix(uColorC, uColorA, mixv);
            base = mix(base, uColorB, fres * 0.85);
            base += fres * 0.4;
            // subtle banding
            float band = sin(vPos.y * 6.0 + uTime * 0.4) * 0.04;
            base += band;
            gl_FragColor = vec4(base, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function GlassRings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.05;
    ref.current.rotation.x += delta * 0.02;
  });
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.6, 0]}>
          <torusGeometry args={[3.4 + i * 0.25, 0.005, 8, 200]} />
          <meshBasicMaterial color="#f5f5f3" transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function Particles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 4 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#f5f5f3"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Canvas
      dpr={isMobile ? [1, 1.2] : [1, 1.6]}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: "low-power" }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Environment preset="night" />
        <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.6}>
          <MorphSphere detail={isMobile ? 24 : 64} />
        </Float>
        <GlassRings />
        <Particles count={isMobile ? 80 : 220} />
      </Suspense>
    </Canvas>
  );
}

