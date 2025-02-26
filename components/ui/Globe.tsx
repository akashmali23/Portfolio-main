"use client"; // ✅ Ensures this runs only on the client

import { useEffect, useRef } from "react";
import { Color } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

extend({ ThreeGlobe });

// ✅ Define type for globe configuration
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

// ✅ Define type for position data
type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

// ✅ Define props type for Globe component
interface GlobeProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function Globe({ globeConfig, data }: GlobeProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ Prevents SSR errors

    if (!globeRef.current) {
      globeRef.current = new ThreeGlobe();
    }

    _buildMaterial();
    _buildData();
  }, []);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial() as any;
    globeMaterial.color = new Color(globeConfig.globeColor || "#1d072e");
    globeMaterial.emissive = new Color(globeConfig.emissive || "#000000");
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  };

  const _buildData = () => {
    if (!globeRef.current) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(globeConfig.showAtmosphere ?? true)
      .atmosphereColor(globeConfig.atmosphereColor ?? "#ffffff")
      .atmosphereAltitude(globeConfig.atmosphereAltitude ?? 0.1)
      .hexPolygonColor(() => globeConfig.polygonColor ?? "rgba(255,255,255,0.7)");
  };

  return <>{globeRef.current && <primitive object={globeRef.current} />}</>;
}
