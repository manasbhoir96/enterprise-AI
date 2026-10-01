import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Maximize2, RefreshCw, Cpu, Layers } from "lucide-react";

export const Interactive3DHologram: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(true);
  const [activeGeo, setActiveGeo] = useState<"polyhedron" | "torus" | "matrix">("polyhedron");
  const [fps, setFps] = useState<number>(60);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight || 260;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3D Geometry Core
    let geometry: THREE.BufferGeometry;
    if (activeGeo === "polyhedron") {
      geometry = new THREE.IcosahedronGeometry(1.6, 1);
    } else if (activeGeo === "torus") {
      geometry = new THREE.TorusKnotGeometry(1.1, 0.35, 80, 16);
    } else {
      geometry = new THREE.OctahedronGeometry(1.8, 2);
    }

    const material = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: wireframeMode,
      transparent: true,
      opacity: 0.85,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Orbiting holographic particle cloud
    const particlesCount = 350;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = (Math.random() - 0.5) * 5;
      posArray[i + 2] = (Math.random() - 0.5) * 5;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00ffa3,
      transparent: true,
      opacity: 0.75,
    });
    const particleCloud = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleCloud);
    pointsRef.current = particleCloud;

    // Outer quantum ring
    const ringGeo = new THREE.RingGeometry(2.3, 2.34, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7000ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // FPS calculation
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mesh.rotation.y += 0.008;
      mesh.rotation.x += 0.005;
      mesh.rotation.x += targetY * 0.03;
      mesh.rotation.y += targetX * 0.03;

      particleCloud.rotation.y -= 0.003;
      particleCloud.rotation.z += 0.002;
      ring.rotation.z += 0.004;

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 260;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [activeGeo, wireframeMode]);

  return (
    <div className="relative w-full rounded-2xl glass-panel p-4 overflow-hidden border border-[#00E5FF]/25 shadow-[0_0_30px_rgba(0,229,255,0.12)]">
      {/* Laser Sweep Beam */}
      <div className="absolute inset-0 hologram-laser-sweep pointer-events-none" />

      {/* Header telemetry */}
      <div className="flex items-center justify-between relative z-10 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-ping" />
          <span className="text-xs font-quant font-bold tracking-wider text-[#00FFA3] uppercase">
            3D QUANTIS HOLOGRAPHIC CORE
          </span>
          <span className="text-[10px] font-quant text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
            {fps} FPS | WEBGL 2.0
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveGeo("polyhedron")}
            className={`px-2 py-0.5 text-[10px] font-quant rounded transition-all ${
              activeGeo === "polyhedron"
                ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_8px_rgba(0,229,255,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Icosahedron
          </button>
          <button
            onClick={() => setActiveGeo("torus")}
            className={`px-2 py-0.5 text-[10px] font-quant rounded transition-all ${
              activeGeo === "torus"
                ? "bg-[#7000FF]/25 text-[#C084FC] border border-[#7000FF]/50 shadow-[0_0_8px_rgba(112,0,255,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Torus Knot
          </button>
          <button
            onClick={() => setActiveGeo("matrix")}
            className={`px-2 py-0.5 text-[10px] font-quant rounded transition-all ${
              activeGeo === "matrix"
                ? "bg-[#00FFA3]/20 text-[#00FFA3] border border-[#00FFA3]/50 shadow-[0_0_8px_rgba(0,255,163,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Octahedron
          </button>
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className="p-1 text-slate-400 hover:text-[#00E5FF] transition-colors"
            title="Toggle Wireframe Mesh"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-56 cursor-grab active:cursor-grabbing relative z-10 flex items-center justify-center"
      />

      {/* Floating HUD telemetry overlay */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
        <div className="bg-black/40 rounded-lg p-1.5 border border-white/5">
          <p className="text-[10px] font-quant text-slate-400">TENSOR NODES</p>
          <p className="text-xs font-quant font-bold text-[#00E5FF]">350 PARTICLES</p>
        </div>
        <div className="bg-black/40 rounded-lg p-1.5 border border-white/5">
          <p className="text-[10px] font-quant text-slate-400">LATENCY</p>
          <p className="text-xs font-quant font-bold text-[#00FFA3]">1.4ms (PARALLEL)</p>
        </div>
        <div className="bg-black/40 rounded-lg p-1.5 border border-white/5">
          <p className="text-[10px] font-quant text-slate-400">MODEL ENCRYPT</p>
          <p className="text-xs font-quant font-bold text-[#C084FC]">AES-256 GCM</p>
        </div>
      </div>
    </div>
  );
};
