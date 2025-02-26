"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface Position {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [globeData, setGlobeData] = useState<Position[] | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR errors

    if (!globeRef.current) {
      globeRef.current = new ThreeGlobe();
    }

    buildMaterial();
    buildData();
  }, []);

  const buildMaterial = () => {
    if (!globeRef.current) return;
    const globeMaterial = globeRef.current.globeMaterial() as any;
    globeMaterial.color = new Color(globeConfig.globeColor || "#1d072e");
    globeMaterial.emissive = new Color(globeConfig.emissive || "#000000");
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  };

  const buildData = () => {
    if (!data.length) return;
    setGlobeData(data);
  };

  return <>{globeData && globeRef.current && <primitive object={globeRef.current} />}</>;
}

export const World = (props: WorldProps) => {
  const { globeConfig } = props;
  return (
    <Canvas camera={{ fov: 50, aspect, near: 180, far: 1800, position: [0, 0, cameraZ] }}>
      <ambientLight color={globeConfig.ambientLight || "#ffffff"} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight || "#ffffff"} position={[-400, 100, 400]} />
      <directionalLight color={globeConfig.directionalTopLight || "#ffffff"} position={[-200, 500, 200]} />
      <pointLight color={globeConfig.pointLight || "#ffffff"} position={[-200, 500, 200]} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
};

export default World;
