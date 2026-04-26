"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import config from "@/config.json";

/* ── Service Data ──────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: "🏠", title: "Home Loan", desc: "Own your dream home with easy EMIs",
    benefits: ["Up to 90% funding", "Tenure up to 30 years", "Doorstep service"],
    color: 0x1565c0, hex: "#1565c0",
  },
  {
    icon: "👤", title: "Personal Loan", desc: "Instant funds for any need, no collateral",
    benefits: ["No collateral required", "Disbursal in 48 hours", "Flexible repayment"],
    color: 0x6a1b9a, hex: "#6a1b9a",
  },
  {
    icon: "🏢", title: "Business Loan", desc: "Scale your business with dedicated financing",
    benefits: ["Minimal documentation", "Competitive interest rates", "Working capital support"],
    color: 0xe65100, hex: "#e65100",
  },
  {
    icon: "🎓", title: "Education Loan", desc: "Invest in your future with smart financing",
    benefits: ["Covers tuition & living costs", "Moratorium period available", "India & abroad"],
    color: 0x1b5e20, hex: "#1b5e20",
  },
  {
    icon: "🏗️", title: "Loan Against Property", desc: "Unlock equity from your property",
    benefits: ["Up to 75% of property value", "Lower interest rates", "Long tenure options"],
    color: 0x004d40, hex: "#004d40",
  },
  {
    icon: "💼", title: "Project Funding", desc: "End-to-end support for large-scale projects",
    benefits: ["Infrastructure & SME/MSME", "Government scheme tie-ups", "Expert advisory"],
    color: 0x1a237e, hex: "#1a237e",
  },
  {
    icon: "🌍", title: "NRI Services", desc: "Specialized services for non-resident Indians",
    benefits: ["Home loans in India", "NRE/NRO account advisory", "Repatriation support"],
    color: 0x006064, hex: "#006064",
  },
  {
    icon: "🛡️", title: "Insurance", desc: "Protect your assets and secure your family",
    benefits: ["Life & health coverage", "Loan protection plans", "Best premium rates"],
    color: 0xb71c1c, hex: "#b71c1c",
  },
];

/* ── Maths ─────────────────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const smooth = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };
const inv = (a: number, b: number, v: number) => clamp((v - a) / (b - a), 0, 1);

/* ── Camera keyframe layout ────────────────────────────────────── */
// Desk pair z-positions in world (HS=6 start, pairs every 14 units)
const DESK_Z = [-3, -17, -31, -45] as const; // z per pair

// Per-service: which side, which pair, camera look-at info
const SVC_STOPS = SERVICES.map((svc, i) => {
  const pair = Math.floor(i / 2);
  const isLeft = i % 2 === 0;
  const dz = DESK_Z[pair];
  // Camera positions while facing each desk
  const camX = isLeft ? 1.8 : -1.8;
  const tgtX = isLeft ? -4.8 : 4.8;
  // Vary look-at Y slightly per service for natural head movement
  const tgtY = [3.6, 3.3, 4.0, 3.2, 3.8, 3.4, 3.9, 3.5][i];
  return { ...svc, pair, isLeft, dz, camPos: [camX, 3.8, dz + 2.5] as const, tgtPos: [tgtX, tgtY, dz - 0.5] as const };
});

// Full camera keyframes (t=progress, p=position, lk=lookAt, fog=fogDensity)
const KF = [
  // City & approach
  { t: 0.00, p: [0, 72, 95],   lk: [0, 12, 0],  fog: 0.006 },
  { t: 0.18, p: [0, 42, 68],   lk: [0, 8, 0],   fog: 0.008 },
  { t: 0.35, p: [0, 16, 36],   lk: [0, 5, 0],   fog: 0.010 },
  { t: 0.47, p: [0, 5, 19],    lk: [0, 4.5, 0], fog: 0.012 },
  { t: 0.57, p: [0, 4, 11],    lk: [0, 4, -2],  fog: 0.018 },
  { t: 0.62, p: [0, 3.8, 4.5], lk: [0, 3.8, -8],fog: 0.020 },
  // Pair 0 – Home Loan (left) & Personal Loan (right) at z=−3
  { t: 0.648, p: [1.8, 3.8, -0.5],  lk: [-4.8, 3.6, -3],  fog: 0.022 },
  { t: 0.685, p: [-1.8, 3.8, -0.5], lk: [4.8,  3.3, -3],  fog: 0.022 },
  // Walk
  { t: 0.710, p: [0, 4, -5.5],  lk: [0, 4, -18], fog: 0.024 },
  // Pair 1 – Business (left) & Education (right) at z=−17
  { t: 0.730, p: [1.8, 3.8, -14.5], lk: [-4.8, 4.0, -17], fog: 0.024 },
  { t: 0.762, p: [-1.8, 3.8,-14.5], lk: [4.8,  3.2, -17], fog: 0.024 },
  // Walk
  { t: 0.785, p: [0, 4, -20],   lk: [0, 4, -32], fog: 0.026 },
  // Pair 2 – Property (left) & Project (right) at z=−31
  { t: 0.805, p: [1.8, 3.8, -28.5], lk: [-4.8, 3.8, -31], fog: 0.026 },
  { t: 0.838, p: [-1.8, 3.8,-28.5], lk: [4.8,  3.4, -31], fog: 0.026 },
  // Walk
  { t: 0.862, p: [0, 4, -34],   lk: [0, 4, -46], fog: 0.028 },
  // Pair 3 – NRI (left) & Insurance (right) at z=−45
  { t: 0.882, p: [1.8, 3.8, -42.5], lk: [-4.8, 3.9, -45], fog: 0.028 },
  { t: 0.915, p: [-1.8, 3.8,-42.5], lk: [4.8,  3.5, -45], fog: 0.028 },
  // Walk to CTA
  { t: 0.945, p: [0, 4.2, -49],  lk: [0, 4.5, -64], fog: 0.030 },
  { t: 1.000, p: [0, 5.5, -58],  lk: [0, 4.2, -72], fog: 0.034 },
];

// Active service range per index
const SVC_RANGE = [
  [0.635, 0.685], [0.685, 0.710],
  [0.718, 0.762], [0.762, 0.785],
  [0.793, 0.838], [0.838, 0.862],
  [0.870, 0.915], [0.915, 0.945],
] as const;

/* ═══════════════════════════════════════════════════════════════ */
export default function CityScene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProg, setScrollProg] = useState(0);
  const scrollRef   = useRef(0);

  /* Service overlay state */
  const [activeSvc, setActiveSvc] = useState<number | null>(null);
  const [svcFade,   setSvcFade]   = useState(0);

  const scrollToNext = useCallback((currentSvcIdx: number) => {
    const nextRange = SVC_RANGE[currentSvcIdx + 1];
    if (!nextRange) return;
    const targetProg = nextRange[0] + 0.01;
    const targetScroll = targetProg * window.innerHeight * 8;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ─────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* ── Scene / Camera ───────────────────────────────────────── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010610);
    scene.fog = new THREE.FogExp2(0x010610, 0.006);

    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 700);

    /* ── Lights ───────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x0a1428, 3));
    const moon = new THREE.DirectionalLight(0x5878a8, 0.9);
    moon.position.set(-50, 90, 60);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.near = 0.5;
    moon.shadow.camera.far = 400;
    moon.shadow.camera.left = -120;
    moon.shadow.camera.right = 120;
    moon.shadow.camera.top = 120;
    moon.shadow.camera.bottom = -120;
    scene.add(moon);

    /* ══════════════════════════════════════════════════════════
       TEXTURE GENERATORS
    ══════════════════════════════════════════════════════════ */

    /** Realistic building facade: dark glass with floor bands + lit windows */
    function facadeTex(floors: number, bays: number, tint: number): THREE.CanvasTexture {
      const W = 256, H = 512;
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const cx = cv.getContext("2d")!;
      // Base: deep blue-gray glass color
      const r = (tint >> 16) & 0xff, g = (tint >> 8) & 0xff, b = tint & 0xff;
      cx.fillStyle = `rgb(${r},${g},${b})`;
      cx.fillRect(0, 0, W, H);
      const fh = H / floors, bw = W / bays;
      for (let f = 0; f < floors; f++) {
        const y0 = f * fh;
        // Spandrel band (dark strip at top of each floor)
        cx.fillStyle = `rgba(${Math.max(0,r-20)},${Math.max(0,g-20)},${Math.max(0,b-20)},0.9)`;
        cx.fillRect(0, y0, W, fh * 0.22);
        // Window panes per bay
        for (let bx = 0; bx < bays; bx++) {
          const x0 = bx * bw + 2;
          const wy = y0 + fh * 0.25;
          const wh2 = fh * 0.68;
          const ww2 = bw - 4;
          const rnd = Math.random();
          if (rnd > 0.25) {
            // Lit window
            const warm = Math.random();
            if (warm > 0.65)      cx.fillStyle = `rgba(255,235,155,${0.5+Math.random()*0.45})`;
            else if (warm > 0.35) cx.fillStyle = `rgba(140,200,255,${0.4+Math.random()*0.45})`;
            else                  cx.fillStyle = `rgba(200,180,255,${0.35+Math.random()*0.4})`;
          } else {
            // Dark / reflective glass
            cx.fillStyle = `rgba(${r+8},${g+12},${b+18},0.3)`;
          }
          cx.fillRect(x0, wy, ww2, wh2);
          // Mullion line
          cx.fillStyle = `rgba(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b-30)},0.9)`;
          cx.fillRect(x0 + ww2 / 2 - 0.5, wy, 1, wh2);
        }
      }
      return new THREE.CanvasTexture(cv);
    }

    /** Dark polished stone floor */
    function floorTex(): THREE.CanvasTexture {
      const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512;
      const cx = cv.getContext("2d")!;
      cx.fillStyle = "#1c1a16"; cx.fillRect(0, 0, 512, 512);
      cx.strokeStyle = "rgba(60,54,46,0.45)"; cx.lineWidth = 0.7;
      for (let i = 0; i < 12; i++) {
        cx.beginPath(); cx.moveTo(Math.random()*512, 0);
        cx.bezierCurveTo(Math.random()*512,160,Math.random()*512,360,Math.random()*512,512);
        cx.stroke();
      }
      cx.strokeStyle = "rgba(90,84,74,0.7)"; cx.lineWidth = 2;
      [0,128,256,384,512].forEach(v => {
        cx.beginPath(); cx.moveTo(v,0); cx.lineTo(v,512); cx.stroke();
        cx.beginPath(); cx.moveTo(0,v); cx.lineTo(512,v); cx.stroke();
      });
      cx.strokeStyle = "rgba(50,46,40,0.35)"; cx.lineWidth = 1;
      for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) cx.strokeRect(x*128+3,y*128+3,122,122);
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 10);
      return t;
    }

    /** Wood panel wainscoting */
    function woodTex(): THREE.CanvasTexture {
      const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256;
      const cx = cv.getContext("2d")!;
      cx.fillStyle = "#3a2515"; cx.fillRect(0, 0, 256, 256);
      // Grain
      cx.strokeStyle = "rgba(75,50,28,0.45)"; cx.lineWidth = 1;
      for (let i = 0; i < 22; i++) {
        cx.beginPath(); cx.moveTo(0, i*12+Math.random()*4); cx.lineTo(256, i*12+Math.random()*4); cx.stroke();
      }
      // Panel divisions
      cx.fillStyle = "#2e1d0e";
      [64,128,192].forEach(x => cx.fillRect(x-1, 0, 2, 256));
      cx.fillRect(0, 127, 256, 2);
      // Subtle highlight on panel edges
      cx.strokeStyle = "rgba(100,70,40,0.35)"; cx.lineWidth = 1;
      [64,128,192].forEach(x => {
        cx.strokeRect(x+3, 4, 58, 118); cx.strokeRect(x+3, 134, 58, 118);
      });
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1.2);
      return t;
    }

    /** Coffered ceiling pattern */
    function cofferTex(): THREE.CanvasTexture {
      const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512;
      const cx = cv.getContext("2d")!;
      cx.fillStyle = "#d4d0c8"; cx.fillRect(0, 0, 512, 512);
      const cell = 64, rim = 8;
      cx.fillStyle = "#bebab2";
      for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++)
        cx.fillRect(x*cell+rim, y*cell+rim, cell-rim*2, cell-rim*2);
      // Rib grid
      cx.strokeStyle = "#a8a49c"; cx.lineWidth = 2;
      for (let i = 0; i <= 8; i++) {
        cx.beginPath(); cx.moveTo(i*cell,0); cx.lineTo(i*cell,512); cx.stroke();
        cx.beginPath(); cx.moveTo(0,i*cell); cx.lineTo(512,i*cell); cx.stroke();
      }
      // Inner shadow lines
      cx.strokeStyle = "rgba(140,136,130,0.6)"; cx.lineWidth = 1;
      for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) {
        cx.strokeRect(x*cell+rim+2,y*cell+rim+2, cell-rim*2-4, cell-rim*2-4);
      }
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.5, 8);
      return t;
    }

    /** Concrete / stone texture */
    function concreteTex(): THREE.CanvasTexture {
      const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256;
      const cx = cv.getContext("2d")!;
      cx.fillStyle = "#2a3040"; cx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 200; i++) {
        const x = Math.random()*256, y = Math.random()*256;
        cx.fillStyle = `rgba(${40+Math.random()*15},${48+Math.random()*15},${60+Math.random()*15},0.4)`;
        cx.fillRect(x, y, 2+Math.random()*4, 2+Math.random()*4);
      }
      return new THREE.CanvasTexture(cv);
    }

    /* ══════════════════════════════════════════════════════════
       SHARED MATERIALS
    ══════════════════════════════════════════════════════════ */
    const goldMat  = new THREE.MeshStandardMaterial({ color: 0xc8a535, emissive: 0xc8a535, emissiveIntensity: 0.5, metalness: 0.92, roughness: 0.12 });
    const cncMat   = new THREE.MeshStandardMaterial({ map: concreteTex(), roughness: 0.72, metalness: 0.1 });
    const roadMat  = new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 1 });
    const sidewMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.9 });

    /* ══════════════════════════════════════════════════════════
       BUILDING GENERATOR
    ══════════════════════════════════════════════════════════ */
    interface TowerCfg {
      podW: number; podD: number; podH: number;
      towW: number; towD: number; towH: number;
      topW?: number; topD?: number; topH?: number;
      tint: number; style: "glass" | "concrete" | "mixed";
      fins?: boolean; spire?: boolean;
    }

    function buildTower(x: number, z: number, cfg: TowerCfg): THREE.Group {
      const g = new THREE.Group();
      const { podW, podD, podH, towW, towD, towH, tint, style } = cfg;
      const topH = cfg.topH ?? 0;
      const topW = cfg.topW ?? towW * 0.75;
      const topD = cfg.topD ?? towD * 0.75;

      /* Podium */
      const podMesh = new THREE.Mesh(new THREE.BoxGeometry(podW, podH, podD), cncMat.clone());
      podMesh.position.y = podH / 2;
      podMesh.castShadow = true;
      g.add(podMesh);

      /* Main tower */
      const floors  = Math.round(towH / 3.5);
      const baysW   = Math.max(2, Math.round(towW / 2));
      const towTex  = facadeTex(floors, baysW, tint);
      const towMat  = style === "glass"
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(tint), roughness: 0.08, metalness: 0.55,
            envMapIntensity: 1.2, emissiveMap: towTex, emissive: 0xffffff, emissiveIntensity: 0.55,
          })
        : new THREE.MeshStandardMaterial({
            color: new THREE.Color(tint), roughness: 0.6, metalness: 0.15,
            emissiveMap: towTex, emissive: 0xffffff, emissiveIntensity: 0.45,
          });
      const towMesh = new THREE.Mesh(new THREE.BoxGeometry(towW, towH, towD), towMat);
      towMesh.position.y = podH + towH / 2;
      towMesh.castShadow = true;
      g.add(towMesh);

      /* Horizontal spandrel bands every ~3.5 units */
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x101828, metalness: 0.7, roughness: 0.3 });
      for (let fl = 1; fl < floors; fl++) {
        const band = new THREE.Mesh(new THREE.BoxGeometry(towW + 0.14, 0.18, towD + 0.14), bandMat);
        band.position.y = podH + fl * 3.5;
        g.add(band);
      }

      /* Setback upper section */
      if (topH > 0) {
        const upTex = facadeTex(Math.round(topH / 3.5), Math.max(2, Math.round(topW / 2)), tint);
        const upMat = towMat.clone() as THREE.MeshStandardMaterial;
        upMat.emissiveMap = upTex; upMat.emissive = new THREE.Color(0xffffff); upMat.emissiveIntensity = 0.5;
        const upMesh = new THREE.Mesh(new THREE.BoxGeometry(topW, topH, topD), upMat);
        upMesh.position.y = podH + towH + topH / 2;
        upMesh.castShadow = true;
        g.add(upMesh);
        for (let fl = 1; fl < Math.round(topH / 3.5); fl++) {
          const band2 = new THREE.Mesh(new THREE.BoxGeometry(topW + 0.12, 0.16, topD + 0.12), bandMat.clone());
          band2.position.y = podH + towH + fl * 3.5;
          g.add(band2);
        }
      }

      /* Corner fins (glass towers) */
      if (cfg.fins) {
        const finMat = goldMat.clone();
        const totalH = towH + (topH > 0 ? topH : 0);
        [[towW/2, towD/2], [-towW/2, towD/2], [towW/2, -towD/2], [-towW/2, -towD/2]].forEach(([fx, fz]) => {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(0.45, totalH + 2, 0.45), finMat);
          fin.position.set(fx, podH + totalH / 2, fz);
          g.add(fin);
        });
      }

      /* Rooftop mechanical box */
      const mechMat = new THREE.MeshStandardMaterial({ color: 0x1e2a38, roughness: 0.8 });
      const mech = new THREE.Mesh(new THREE.BoxGeometry(towW * 0.4, 1.8, towD * 0.4), mechMat);
      const totalTop = podH + towH + topH;
      mech.position.set(towW * 0.2, totalTop + 0.9, -towD * 0.2);
      g.add(mech);

      /* Water tank */
      if (Math.random() > 0.4) {
        const tankMat = new THREE.MeshStandardMaterial({ color: 0x28384a, roughness: 0.7 });
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 2.8, 10), tankMat);
        tank.position.set(-towW * 0.25, totalTop + 1.4, towD * 0.25);
        g.add(tank);
      }

      /* Antenna / Spire */
      if (cfg.spire) {
        const spireMat = new THREE.MeshStandardMaterial({ color: 0xc8a535, metalness: 0.95, roughness: 0.08 });
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.5, 14, 6), spireMat);
        spire.position.y = totalTop + 7;
        g.add(spire);
      } else if (Math.random() > 0.45) {
        const antMat = new THREE.MeshStandardMaterial({ color: 0x8090a0, metalness: 0.9, roughness: 0.15 });
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 9, 5), antMat);
        ant.position.y = totalTop + 4.5;
        g.add(ant);
      }

      g.position.set(x, 0, z);
      return g;
    }

    /* ══════════════════════════════════════════════════════════
       CITY GROUND: roads + sidewalks
    ══════════════════════════════════════════════════════════ */
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Ground base
    const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), roadMat);
    groundMesh.rotation.x = -Math.PI / 2;
    cityGroup.add(groundMesh);

    // Road grid strips
    const roadStrips = [
      { axis: "x", pos: 0,   w: 12, len: 280 },
      { axis: "z", pos: -30, w: 10, len: 280 },
      { axis: "z", pos: -60, w: 10, len: 280 },
    ];
    roadStrips.forEach(({ axis, pos, w, len }) => {
      const rg = new THREE.Mesh(
        new THREE.PlaneGeometry(axis === "x" ? len : w, axis === "x" ? w : len),
        sidewMat
      );
      rg.rotation.x = -Math.PI / 2;
      rg.position.set(axis === "x" ? 0 : pos, 0.02, axis === "x" ? pos : -len / 2);
      cityGroup.add(rg);
    });

    // Sidewalk areas next to VSR building
    [-1, 1].forEach(side => {
      const sw = new THREE.Mesh(new THREE.PlaneGeometry(10, 30), sidewMat.clone());
      sw.rotation.x = -Math.PI / 2;
      sw.position.set(side * 12, 0.01, -5);
      cityGroup.add(sw);
    });

    /* ══════════════════════════════════════════════════════════
       VSR FINTECH TOWER (hero building)
    ══════════════════════════════════════════════════════════ */
    const vsrGroup = new THREE.Group();
    cityGroup.add(vsrGroup);

    // Main tower body
    const vsrTowH = 72, vsrTopH = 28, vsrPodH = 8;
    const vsrTex = facadeTex(22, 7, 0x071830);
    const vsrMat = new THREE.MeshPhysicalMaterial({
      color: 0x071830, roughness: 0.06, metalness: 0.6, envMapIntensity: 1.5,
      emissiveMap: vsrTex, emissive: 0xffffff, emissiveIntensity: 0.7,
    });

    // Podium
    const vsrPod = new THREE.Mesh(new THREE.BoxGeometry(16, vsrPodH, 16), cncMat.clone());
    vsrPod.position.y = vsrPodH / 2;
    vsrGroup.add(vsrPod);

    // Podium glass cladding
    const podGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1f40, roughness: 0.05, metalness: 0.5, transmission: 0.12, transparent: true, opacity: 0.9,
    });
    [[0, 8.05, 0], [0, -8.05, 0]].forEach(([,, dz]) => {
      // front/back podium face panels
    });
    const podFront = new THREE.Mesh(new THREE.PlaneGeometry(15, vsrPodH - 0.4), podGlassMat);
    podFront.position.set(0, vsrPodH / 2, 8.02);
    vsrGroup.add(podFront);
    const podBack = podFront.clone(); podBack.position.z = -8.02; podBack.rotation.y = Math.PI;
    vsrGroup.add(podBack);
    const podLeft = new THREE.Mesh(new THREE.PlaneGeometry(15, vsrPodH - 0.4), podGlassMat);
    podLeft.rotation.y = Math.PI / 2; podLeft.position.set(-8.02, vsrPodH / 2, 0);
    vsrGroup.add(podLeft);
    const podRight = podLeft.clone(); podRight.position.set(8.02, vsrPodH / 2, 0); podRight.rotation.y = -Math.PI / 2;
    vsrGroup.add(podRight);

    // Main tower
    const vsrTower = new THREE.Mesh(new THREE.BoxGeometry(13, vsrTowH, 13), vsrMat);
    vsrTower.position.y = vsrPodH + vsrTowH / 2;
    vsrTower.castShadow = true;
    vsrGroup.add(vsrTower);

    // Upper setback
    const vsrTopTex = facadeTex(9, 5, 0x071830);
    const vsrTopMat = vsrMat.clone(); vsrTopMat.emissiveMap = vsrTopTex;
    const vsrTop = new THREE.Mesh(new THREE.BoxGeometry(9, vsrTopH, 9), vsrTopMat);
    vsrTop.position.y = vsrPodH + vsrTowH + vsrTopH / 2;
    vsrGroup.add(vsrTop);

    // Gold spandrel bands on main tower
    const vsrBandMat = new THREE.MeshStandardMaterial({ color: 0xc8a535, emissive: 0xc8a535, emissiveIntensity: 0.6, metalness: 0.92, roughness: 0.1 });
    for (let fl = 1; fl < vsrTowH / 3.5; fl++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.22, 13.2), vsrBandMat);
      b.position.y = vsrPodH + fl * 3.5;
      vsrGroup.add(b);
    }

    // Corner fins full height
    [[6.5, 6.5], [-6.5, 6.5], [6.5, -6.5], [-6.5, -6.5]].forEach(([fx, fz]) => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.55, vsrTowH + vsrTopH + 4, 0.55), goldMat.clone());
      fin.position.set(fx, vsrPodH + (vsrTowH + vsrTopH) / 2 + 2, fz);
      vsrGroup.add(fin);
    });

    // Crown cap
    const crownGeo = new THREE.CylinderGeometry(3, 5.5, 5, 6);
    const crownMesh = new THREE.Mesh(crownGeo, goldMat.clone());
    crownMesh.position.y = vsrPodH + vsrTowH + vsrTopH + 2.5;
    vsrGroup.add(crownMesh);
    const spireMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.6, 18, 6), goldMat.clone());
    spireMesh.position.y = vsrPodH + vsrTowH + vsrTopH + 14;
    vsrGroup.add(spireMesh);

    // Building glow
    const vsrGlow = new THREE.PointLight(0xc8a535, 5, 80);
    vsrGlow.position.y = vsrPodH + vsrTowH + vsrTopH + 20;
    vsrGroup.add(vsrGlow);

    // VSR Sign (mounted on podium facade)
    function buildingSignTex(): THREE.CanvasTexture {
      const cv = document.createElement("canvas"); cv.width = 512; cv.height = 128;
      const cx = cv.getContext("2d")!;
      cx.fillStyle = "#04101e"; cx.fillRect(0, 0, 512, 128);
      cx.strokeStyle = "#c8a535"; cx.lineWidth = 3; cx.strokeRect(4, 4, 504, 120);
      cx.fillStyle = "#c8a535";
      cx.font = "bold 56px 'Georgia', serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.fillText("VSR FINTECH", 256, 46);
      cx.fillStyle = "#7aaccc"; cx.font = "22px sans-serif";
      cx.fillText("Financial Solutions  |  Est. 2020", 256, 96);
      return new THREE.CanvasTexture(cv);
    }
    const signTex2 = buildingSignTex();
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(13, 3.2),
      new THREE.MeshStandardMaterial({ map: signTex2, emissiveMap: signTex2, emissive: 0xffffff, emissiveIntensity: 1.0 })
    );
    signMesh.position.set(0, vsrPodH - 1.5, 8.06);
    vsrGroup.add(signMesh);

    /* ══════════════════════════════════════════════════════════
       SURROUNDING CITY BUILDINGS
    ══════════════════════════════════════════════════════════ */
    const cityBuildings: (TowerCfg & { x: number; z: number })[] = [
      // Near flanking (glass towers)
      { x:-17, z:-8,  podW:7, podD:8, podH:5,  towW:6, towD:7, towH:46, tint:0x0c1e38, style:"glass", fins:false, spire:false },
      { x: 17, z:-8,  podW:7, podD:8, podH:5,  towW:6, towD:7, towH:46, tint:0x0c1e38, style:"glass", fins:false, spire:false },
      { x:-26, z:-6,  podW:9, podD:9, podH:6,  towW:7, towD:8, towH:62, topW:5, topD:6, topH:22, tint:0x0e2040, style:"glass", fins:true, spire:true },
      { x: 26, z:-6,  podW:9, podD:9, podH:6,  towW:7, towD:8, towH:62, topW:5, topD:6, topH:22, tint:0x0e2040, style:"glass", fins:true, spire:true },
      // Mid-distance concrete
      { x:-40, z:-20, podW:10, podD:10, podH:5, towW:8, towD:9, towH:38, tint:0x1e2a3a, style:"concrete" },
      { x: 40, z:-20, podW:10, podD:10, podH:5, towW:8, towD:9, towH:38, tint:0x1e2a3a, style:"concrete" },
      { x:-32, z:-45, podW:8,  podD:9,  podH:5, towW:7, towD:8, towH:52, topW:5, topD:6, topH:18, tint:0x101e30, style:"glass", fins:false },
      { x: 32, z:-45, podW:8,  podD:9,  podH:5, towW:7, towD:8, towH:52, topW:5, topD:6, topH:18, tint:0x101e30, style:"glass", fins:false },
      // Far background
      { x:-55, z:-30, podW:11, podD:11, podH:6, towW:9, towD:10, towH:48, tint:0x0c1828, style:"concrete" },
      { x: 55, z:-30, podW:11, podD:11, podH:6, towW:9, towD:10, towH:48, tint:0x0c1828, style:"concrete" },
      { x:-48, z:-60, podW:9,  podD:10, podH:5, towW:7, towD:9,  towH:66, topW:5, topD:7, topH:24, tint:0x080e1c, style:"glass", fins:false, spire:true },
      { x: 48, z:-60, podW:9,  podD:10, podH:5, towW:7, towD:9,  towH:66, topW:5, topD:7, topH:24, tint:0x080e1c, style:"glass", fins:false, spire:true },
      // Wide low commercial
      { x:-22, z:-55, podW:14, podD:12, podH:4, towW:12, towD:10, towH:28, tint:0x182030, style:"mixed" },
      { x: 22, z:-55, podW:14, podD:12, podH:4, towW:12, towD:10, towH:28, tint:0x182030, style:"mixed" },
      // Slender residential
      { x:-65, z:-18, podW:7,  podD:7,  podH:4, towW:5,  towD:5,  towH:44, tint:0x101820, style:"concrete" },
      { x: 65, z:-18, podW:7,  podD:7,  podH:4, towW:5,  towD:5,  towH:44, tint:0x101820, style:"concrete" },
    ];

    cityBuildings.forEach(({ x, z, ...cfg }) => cityGroup.add(buildTower(x, z, cfg)));

    /* Street lights */
    function streetLight(x: number, z: number) {
      const g = new THREE.Group();
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a3a4a, metalness: 0.7 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 9, 7), poleMat);
      pole.position.y = 4.5; g.add(pole);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2, 0.12, 0.12), poleMat);
      arm.position.set(1, 9.1, 0); g.add(arm);
      const lampMat = new THREE.MeshStandardMaterial({ color: 0xfff0c0, emissive: 0xfff0c0, emissiveIntensity: 2 });
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), lampMat);
      lamp.position.set(2, 8.9, 0); g.add(lamp);
      const pl = new THREE.PointLight(0xfff0c0, 1.5, 22); pl.position.copy(lamp.position); g.add(pl);
      g.position.set(x, 0, z);
      return g;
    }
    [[-10,8],[10,8],[-10,-25],[10,-25],[-10,-50],[10,-50],[-35,-15],[35,-15]].forEach(([x,z]) => cityGroup.add(streetLight(x!, z!)));

    /* Trees */
    function tree(x: number, z: number) {
      const g = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 });
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x0d3a1a, roughness: 1 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3, 7), trunkMat);
      trunk.position.y = 1.5; g.add(trunk);
      const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.8, 10, 8), leafMat);
      leaves.position.y = 4.5; leaves.scale.y = 1.3; g.add(leaves);
      g.position.set(x, 0, z);
      return g;
    }
    [[-12,5],[12,5],[-12,-12],[12,-12],[-38,5],[38,5]].forEach(([x,z]) => cityGroup.add(tree(x!, z!)));

    /* Moon + stars */
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xddd6c0, emissive: 0xddd6c0, emissiveIntensity: 0.55 })
    );
    moonMesh.position.set(-130, 150, -220);
    scene.add(moonMesh);

    const starGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      sPos[i*3]   = (Math.random() - 0.5) * 450;
      sPos[i*3+1] = 30 + Math.random() * 120;
      sPos[i*3+2] = (Math.random() - 0.5) * 450;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const starMesh = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.45, transparent: true, opacity: 0.9 }));
    scene.add(starMesh);

    /* ══════════════════════════════════════════════════════════
       ENTRANCE DOORS
    ══════════════════════════════════════════════════════════ */
    const doorGroup = new THREE.Group();
    doorGroup.position.set(0, 0, 8.1);
    vsrGroup.add(doorGroup);

    const glassDoorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a2040, roughness: 0.04, metalness: 0.1,
      transmission: 0.55, transparent: true, opacity: 0.8, reflectivity: 0.85,
    });
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0xb8962e, metalness: 0.95, roughness: 0.1 });

    const leftPivot = new THREE.Group(); leftPivot.position.set(-0.06, 4, 0);
    const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(2.85, 8, 0.07), glassDoorMat);
    leftDoor.position.x = -1.42; leftPivot.add(leftDoor);
    doorGroup.add(leftPivot);

    const rightPivot = new THREE.Group(); rightPivot.position.set(0.06, 4, 0);
    const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(2.85, 8, 0.07), glassDoorMat);
    rightDoor.position.x = 1.42; rightPivot.add(rightDoor);
    doorGroup.add(rightPivot);

    // Door frame
    [[0, 8.24, 0, 6.6, 0.3], [-3.3, 4, 0, 0.2, 8.5], [3.3, 4, 0, 0.2, 8.5]].forEach(([px, py, pz, w, h]) => {
      const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.22), doorFrameMat);
      f.position.set(px, py, pz); doorGroup.add(f);
    });

    // Entrance steps
    for (let s = 0; s < 3; s++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(11 - s * 1.5, 0.25, 1.2), sidewMat.clone());
      step.position.set(0, s * 0.25, 8.8 + s * 1.2);
      vsrGroup.add(step);
    }

    /* ══════════════════════════════════════════════════════════
       OFFICE INTERIOR
    ══════════════════════════════════════════════════════════ */
    const officeGroup = new THREE.Group();
    scene.add(officeGroup);

    const HW = 12, HH = 8.5, HL = 66, HS = 7.5; // width, height, length, start-z
    const ceilHeight = HH;

    /* Lobby (wider, different ceiling) */
    const lobbyDepth = 8;
    const lobbyFloor = new THREE.Mesh(new THREE.PlaneGeometry(14, lobbyDepth), new THREE.MeshStandardMaterial({ map: floorTex(), roughness: 0.18, metalness: 0.08, envMapIntensity: 0.6 }));
    lobbyFloor.rotation.x = -Math.PI / 2;
    lobbyFloor.position.set(0, 0.01, HS - lobbyDepth / 2);
    officeGroup.add(lobbyFloor);

    /* Main corridor floor */
    const corridorFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(HW, HL - lobbyDepth),
      new THREE.MeshStandardMaterial({ map: floorTex(), roughness: 0.15, metalness: 0.1, envMapIntensity: 0.7 })
    );
    corridorFloor.rotation.x = -Math.PI / 2;
    corridorFloor.position.set(0, 0.01, HS - lobbyDepth - (HL - lobbyDepth) / 2);
    officeGroup.add(corridorFloor);

    /* Coffered ceiling */
    const ceilMat = new THREE.MeshStandardMaterial({ map: cofferTex(), roughness: 0.9, metalness: 0 });
    const ceilMesh = new THREE.Mesh(new THREE.PlaneGeometry(HW, HL), ceilMat);
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.set(0, ceilHeight, HS - HL / 2);
    officeGroup.add(ceilMesh);

    /* Walls */
    const upperWallMat = new THREE.MeshStandardMaterial({ color: 0xece8e0, roughness: 0.88 });
    const lowerWallMat = new THREE.MeshStandardMaterial({ map: woodTex(), roughness: 0.72, metalness: 0.05 });
    const woodH = 1.6; // wainscoting height

    // Left wall — upper part
    const lwUp = new THREE.Mesh(new THREE.PlaneGeometry(HL, ceilHeight - woodH), upperWallMat);
    lwUp.rotation.y = Math.PI / 2;
    lwUp.position.set(-HW / 2, woodH + (ceilHeight - woodH) / 2, HS - HL / 2);
    officeGroup.add(lwUp);
    // Left wall — wood lower panel
    const lwLo = new THREE.Mesh(new THREE.PlaneGeometry(HL, woodH), lowerWallMat);
    lwLo.rotation.y = Math.PI / 2;
    lwLo.position.set(-HW / 2 + 0.01, woodH / 2, HS - HL / 2);
    officeGroup.add(lwLo);

    // Right wall upper
    const rwUp = lwUp.clone(); rwUp.rotation.y = -Math.PI / 2; rwUp.position.set(HW / 2, woodH + (ceilHeight - woodH) / 2, HS - HL / 2);
    officeGroup.add(rwUp);
    // Right wall wood lower
    const rwLo = new THREE.Mesh(new THREE.PlaneGeometry(HL, woodH), lowerWallMat.clone());
    rwLo.rotation.y = -Math.PI / 2;
    rwLo.position.set(HW / 2 - 0.01, woodH / 2, HS - HL / 2);
    officeGroup.add(rwLo);

    // End wall
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(HW, ceilHeight), upperWallMat.clone());
    endWall.position.set(0, ceilHeight / 2, HS - HL);
    officeGroup.add(endWall);

    /* Gold base strips */
    const goldStripMat = goldMat.clone(); goldStripMat.emissiveIntensity = 0.25;
    [-HW / 2 + 0.05, HW / 2 - 0.05].forEach(wx => {
      const bs = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, HL), goldStripMat);
      bs.position.set(wx, woodH + 0.06, HS - HL / 2);
      officeGroup.add(bs);
    });

    /* Ceiling light fixtures */
    const fixtureGeoSmall = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 14);
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0xfff8e0, emissive: 0xfff8e0, emissiveIntensity: 2 });
    for (let i = 0; i < 9; i++) {
      const lz = HS - 4 - i * 7;
      const pt = new THREE.PointLight(0xfff5e0, 0.95, 12);
      pt.position.set(0, ceilHeight - 0.25, lz);
      officeGroup.add(pt);
      const disc = new THREE.Mesh(fixtureGeoSmall, fixtureMat.clone());
      disc.position.set(0, ceilHeight - 0.04, lz);
      officeGroup.add(disc);
    }

    /* Wall art panels */
    function wallArtTex(service?: typeof SERVICES[0]): THREE.CanvasTexture {
      const cv = document.createElement("canvas"); cv.width = 256; cv.height = 180;
      const cx = cv.getContext("2d")!;
      const hue = service ? service.hex : "#0a1f40";
      const grd = cx.createLinearGradient(0, 0, 256, 180);
      grd.addColorStop(0, hue + "cc");
      grd.addColorStop(1, "#01060f");
      cx.fillStyle = grd; cx.fillRect(0, 0, 256, 180);
      if (service) {
        cx.font = "48px serif"; cx.fillText(service.icon, 16, 60);
        cx.fillStyle = "#c8a535"; cx.font = "bold 22px sans-serif"; cx.textBaseline = "top";
        cx.fillText(service.title, 16, 70);
      } else {
        // Abstract geometric pattern
        cx.strokeStyle = "rgba(200,165,53,0.4)"; cx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          cx.beginPath();
          cx.arc(128, 90, 20 + i * 16, 0, Math.PI * 2 * (0.4 + i * 0.12));
          cx.stroke();
        }
      }
      return new THREE.CanvasTexture(cv);
    }

    // Place wall art between counter zones
    [HS - 5, HS - 13, HS - 27, HS - 41].forEach((az, ai) => {
      const svc = SERVICES[ai * 2];
      const artMat = new THREE.MeshStandardMaterial({ map: wallArtTex(svc), emissiveMap: wallArtTex(svc), emissive: 0xffffff, emissiveIntensity: 0.15 });
      const leftArt = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.8), artMat);
      leftArt.rotation.y = Math.PI / 2; leftArt.position.set(-HW / 2 + 0.05, 4.5, az);
      officeGroup.add(leftArt);
    });

    /* Decorative plants */
    function officePlant(x: number, z: number) {
      const g = new THREE.Group();
      const potMat = new THREE.MeshStandardMaterial({ color: 0x3a2820, roughness: 0.8 });
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.55, 10), potMat);
      pot.position.y = 0.28; g.add(pot);
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 1 });
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 10), soilMat);
      soil.position.y = 0.56; g.add(soil);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x1a4020, roughness: 0.9 });
      const leaves = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), leafMat);
      leaves.scale.set(1, 1.4, 1); leaves.position.y = 1.3; g.add(leaves);
      g.position.set(x, 0, z);
      return g;
    }
    // Plants at hallway corners / near entrance
    officeGroup.add(officePlant(-HW / 2 + 1.0, HS - 1));
    officeGroup.add(officePlant( HW / 2 - 1.0, HS - 1));
    officeGroup.add(officePlant(-HW / 2 + 1.0, HS - HL + 2));
    officeGroup.add(officePlant( HW / 2 - 1.0, HS - HL + 2));

    /* ══════════════════════════════════════════════════════════
       SERVICE COUNTERS
    ══════════════════════════════════════════════════════════ */
    interface CounterRef { light: THREE.PointLight; label: THREE.Mesh; worldZ: number; side: "left" | "right"; }
    const counterRefs: CounterRef[] = [];

    function buildCounter(svc: typeof SERVICES[0], side: "left" | "right", cz: number) {
      const g = new THREE.Group();
      const isLeft = side === "left";
      const wx = isLeft ? -HW / 2 + 2.2 : HW / 2 - 2.2;

      // Service desk (L-shaped approximated with 2 boxes)
      const r = (svc.color >> 16) & 0xff, gC = (svc.color >> 8) & 0xff, b = svc.color & 0xff;
      const deskColor = new THREE.Color(`rgb(${Math.max(0,r-50)},${Math.max(0,gC-50)},${Math.max(0,b-50)})`);
      const deskMat = new THREE.MeshStandardMaterial({ color: deskColor, roughness: 0.28, metalness: 0.58 });
      const mainDesk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1, 1.6), deskMat);
      mainDesk.position.set(0, 0.5, 0); g.add(mainDesk);
      const sideDesk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, 1.6), deskMat.clone());
      sideDesk.position.set(isLeft ? -2.5 : 2.5, 0.5, -0.7); g.add(sideDesk);

      // Gold top edges
      const topEdge = new THREE.Mesh(new THREE.BoxGeometry(3.62, 0.07, 1.62), goldMat.clone());
      topEdge.position.set(0, 1.04, 0); g.add(topEdge);
      const topEdge2 = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.07, 1.62), goldMat.clone());
      topEdge2.position.set(isLeft ? -2.5 : 2.5, 1.04, -0.7); g.add(topEdge2);

      // Glass partition / sneeze guard
      const guardMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a2040, roughness: 0.04, metalness: 0.05, transmission: 0.7, transparent: true, opacity: 0.45,
      });
      const guard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.95, 0.04), guardMat);
      guard.position.set(0, 1.53, 0); g.add(guard);
      // Guard frame
      const gfMat = goldMat.clone(); gfMat.emissiveIntensity = 0.2;
      [[0, 1.53, 0.03, 3.44, 0.06, 0.04], [0, 1.06, 0.03, 3.44, 0.06, 0.04],
       [-1.72, 1.53, 0.03, 0.06, 0.95, 0.04], [1.72, 1.53, 0.03, 0.06, 0.95, 0.04]].forEach(([px,py,pz,w,h,d]) => {
        const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), gfMat); f.position.set(px, py, pz); g.add(f);
      });

      // Computer monitor
      const monMat = new THREE.MeshStandardMaterial({ color: 0x0a0e18, roughness: 0.5 });
      const screen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.72, 0.05), monMat);
      screen.position.set(0.4, 1.72, -0.3); g.add(screen);
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.4, 7), monMat.clone());
      stand.position.set(0.4, 1.36, -0.3); g.add(stand);
      // Screen glow
      const screenGlowMat = new THREE.MeshStandardMaterial({ color: 0x1a8fff, emissive: 0x1a8fff, emissiveIntensity: 0.5 });
      const screenFill = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.6), screenGlowMat);
      screenFill.position.set(0.4, 1.72, -0.26); g.add(screenFill);

      // Chair
      const chairMat = new THREE.MeshStandardMaterial({ color: 0x141424, roughness: 0.6 });
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.44, 0.12, 12), chairMat);
      seat.position.set(0, 0.92, isLeft ? 1.3 : -1.3); g.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.85, 0.08), chairMat.clone());
      back.position.set(0, 1.42, isLeft ? 0.76 : -0.76); g.add(back);
      // Chair gas cylinder
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.48, 7), chairMat.clone());
      cyl.position.set(0, 0.58, isLeft ? 1.3 : -1.3); g.add(cyl);

      // Service label on wall above counter
      function labelTex(): THREE.CanvasTexture {
        const cv = document.createElement("canvas"); cv.width = 512; cv.height = 300;
        const cx = cv.getContext("2d")!;
        const grad = cx.createLinearGradient(0, 0, 512, 300);
        grad.addColorStop(0, `rgba(${r},${gC},${b},0.97)`);
        grad.addColorStop(1, `rgba(${Math.max(0,r-60)},${Math.max(0,gC-60)},${Math.max(0,b-60)},0.97)`);
        cx.fillStyle = grad; cx.fillRect(0, 0, 512, 300);
        cx.strokeStyle = "#c8a535"; cx.lineWidth = 3; cx.strokeRect(5, 5, 502, 290);
        cx.font = "52px serif"; cx.fillText(svc.icon, 16, 72);
        cx.fillStyle = "#f0ece4"; cx.font = "bold 44px sans-serif"; cx.textBaseline = "top";
        cx.fillText(svc.title, 20, 82);
        cx.fillStyle = "rgba(255,255,255,0.7)"; cx.font = "20px sans-serif";
        cx.fillText(svc.desc, 20, 140);
        cx.fillStyle = "#c8a535"; cx.font = "bold 18px sans-serif";
        cx.fillText("✓ " + svc.benefits[0], 20, 180);
        cx.fillText("✓ " + svc.benefits[1], 20, 208);
        cx.fillText("✓ " + svc.benefits[2], 20, 236);
        cx.fillStyle = "#00a86b"; cx.font = "bold 20px sans-serif";
        cx.fillText("Apply via WhatsApp →", 20, 270);
        return new THREE.CanvasTexture(cv);
      }
      const lTex = labelTex();
      const labelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 1.88),
        new THREE.MeshStandardMaterial({ map: lTex, emissiveMap: lTex, emissive: 0xffffff, emissiveIntensity: 0, transparent: true })
      );
      if (isLeft) {
        labelMesh.rotation.y = Math.PI / 2;
        labelMesh.position.set(-HW / 2 + 0.1, 5.0, 0);
      } else {
        labelMesh.rotation.y = -Math.PI / 2;
        labelMesh.position.set(HW / 2 - 0.1, 5.0, 0);
      }
      g.add(labelMesh);

      // Accent counter light
      const counterLight = new THREE.PointLight(new THREE.Color(svc.color), 0, 8);
      counterLight.position.set(0, 2.8, 0);
      g.add(counterLight);

      // Service nameplate (small sign on glass partition)
      function namePlateTex(): THREE.CanvasTexture {
        const cv = document.createElement("canvas"); cv.width = 256; cv.height = 64;
        const cx = cv.getContext("2d")!;
        cx.fillStyle = "#0a1020"; cx.fillRect(0, 0, 256, 64);
        cx.strokeStyle = "#c8a535"; cx.lineWidth = 2; cx.strokeRect(2, 2, 252, 60);
        cx.fillStyle = "#c8a535"; cx.font = "bold 26px sans-serif";
        cx.textAlign = "center"; cx.textBaseline = "middle";
        cx.fillText(svc.title, 128, 32);
        return new THREE.CanvasTexture(cv);
      }
      const np = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55), new THREE.MeshStandardMaterial({ map: namePlateTex(), emissiveMap: namePlateTex(), emissive: 0xffffff, emissiveIntensity: 0.8 }));
      np.position.set(0, 2.25, 0.04); g.add(np);

      g.position.set(wx, 0, cz);
      officeGroup.add(g);

      counterRefs.push({ light: counterLight, label: labelMesh, worldZ: cz, side });
    }

    SERVICES.forEach((svc, i) => {
      const side = i % 2 === 0 ? "left" : "right";
      buildCounter(svc, side as "left" | "right", DESK_Z[Math.floor(i / 2)]);
    });

    /* End wall CTA */
    function ctaTex(): THREE.CanvasTexture {
      const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 512;
      const cx = cv.getContext("2d")!;
      const grd = cx.createLinearGradient(0, 0, 0, 512);
      grd.addColorStop(0, "#050f24"); grd.addColorStop(1, "#0a1f3a");
      cx.fillStyle = grd; cx.fillRect(0, 0, 1024, 512);
      cx.strokeStyle = "#c8a535"; cx.lineWidth = 4; cx.strokeRect(8, 8, 1008, 496);
      cx.fillStyle = "#c8a535"; cx.font = "bold 72px Georgia,serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.fillText("Begin Your", 512, 140);
      cx.fillStyle = "#f0ece4"; cx.font = "bold 76px Georgia,serif";
      cx.fillText("Financial Journey", 512, 240);
      cx.fillStyle = "#8ab4d4"; cx.font = "28px sans-serif";
      cx.fillText("500+ Happy Clients · Trusted by Families across India", 512, 330);
      cx.fillStyle = "#00a86b"; cx.font = "bold 34px sans-serif";
      cx.fillText("Contact: +91 9391300146", 512, 400);
      cx.fillStyle = "#c8a535"; cx.font = "24px sans-serif";
      cx.fillText("Mon–Sat  ·  9 AM – 7 PM IST", 512, 455);
      return new THREE.CanvasTexture(cv);
    }
    const ctaMap = ctaTex();
    const ctaSign = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 5),
      new THREE.MeshStandardMaterial({ map: ctaMap, emissiveMap: ctaMap, emissive: 0xffffff, emissiveIntensity: 0 })
    );
    ctaSign.position.set(0, 5.5, HS - HL + 0.18);
    officeGroup.add(ctaSign);
    const ctaLight = new THREE.PointLight(0x00a86b, 0, 18);
    ctaLight.position.set(0, 5.5, HS - HL + 2);
    officeGroup.add(ctaLight);

    /* Reception desk in lobby */
    const recepMat = new THREE.MeshStandardMaterial({ color: 0x1a0e05, roughness: 0.3, metalness: 0.5 });
    [[0, 0.6, HS - 5]] .forEach(([rx, ry, rz]) => {
      const rDesk = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.2, 1.8), recepMat);
      rDesk.position.set(rx, ry, rz); officeGroup.add(rDesk);
      const rTop = new THREE.Mesh(new THREE.BoxGeometry(6.52, 0.08, 1.82), goldMat.clone());
      rTop.position.set(rx, 1.25, rz); officeGroup.add(rTop);
      const recepSign = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.6),
        new THREE.MeshStandardMaterial({ color: 0xc8a535, emissive: 0xc8a535, emissiveIntensity: 0.5 }));
      recepSign.position.set(rx, 1.5, rz + 0.92); officeGroup.add(recepSign);
    });

    /* ══════════════════════════════════════════════════════════
       CAMERA INTERPOLATION
    ══════════════════════════════════════════════════════════ */
    function applyCamera(p: number) {
      let prev = KF[0], next = KF[KF.length - 1];
      for (let i = 0; i < KF.length - 1; i++) {
        if (p >= KF[i].t && p <= KF[i + 1].t) { prev = KF[i]; next = KF[i + 1]; break; }
      }
      const span = next.t - prev.t;
      const e = smooth(span === 0 ? 0 : (p - prev.t) / span);
      camera.position.set(lerp(prev.p[0], next.p[0], e), lerp(prev.p[1], next.p[1], e), lerp(prev.p[2], next.p[2], e));
      camera.lookAt(lerp(prev.lk[0], next.lk[0], e), lerp(prev.lk[1], next.lk[1], e), lerp(prev.lk[2], next.lk[2], e));
      if (scene.fog instanceof THREE.FogExp2) scene.fog.density = lerp(prev.fog, next.fog, e);
    }

    /* ── Scroll ── */
    const VHFACTOR = 8; // 900vh container
    function onScroll() {
      const p = clamp(window.scrollY / (window.innerHeight * VHFACTOR), 0, 1);
      scrollRef.current = p;
      setScrollProg(p);
      // Determine active service
      const idx = SVC_RANGE.findIndex(([lo, hi]) => p >= lo && p < hi);
      setActiveSvc(idx >= 0 ? idx : null);
      const localFade = idx >= 0 ? smooth(inv(SVC_RANGE[idx][0], SVC_RANGE[idx][0] + 0.015, p)) * (1 - smooth(inv(SVC_RANGE[idx][1] - 0.015, SVC_RANGE[idx][1], p))) : 0;
      setSvcFade(localFade);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    /* ── Render loop ── */
    let raf = 0, time = 0;
    function tick() {
      raf = requestAnimationFrame(tick);
      time += 0.008;
      const p = scrollRef.current;

      applyCamera(p);

      // Door animation
      const dp = smooth(inv(0.46, 0.57, p));
      leftPivot.rotation.y  = -dp * Math.PI * 0.44;
      rightPivot.rotation.y =  dp * Math.PI * 0.44;

      // Visibility
      cityGroup.visible   = p < 0.56;
      officeGroup.visible = p > 0.50;
      starMesh.visible    = p < 0.53;
      moonMesh.visible    = p < 0.53;

      // VSR glow pulse
      vsrGlow.intensity = 4 + Math.sin(time * 1.4) * 0.9;

      // Counter lights — activate as camera nears each desk
      const camZ = camera.position.z;
      counterRefs.forEach(cr => {
        const dist = cr.worldZ - camZ;
        const active = dist > -4 && dist < 14;
        cr.light.intensity += (( active ? 2.8 : 0) - cr.light.intensity) * 0.05;
        const lMat = cr.label.material as THREE.MeshStandardMaterial;
        lMat.emissiveIntensity += ((active ? 0.65 : 0) - lMat.emissiveIntensity) * 0.05;
      });

      // CTA sign
      const ctaP = smooth(inv(0.92, 1.0, p));
      (ctaSign.material as THREE.MeshStandardMaterial).emissiveIntensity = ctaP * 0.9;
      ctaLight.intensity = ctaP * 4;

      renderer.render(scene, camera);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  /* ══════════════════════════════════════════════════════════
     OVERLAY UI
  ══════════════════════════════════════════════════════════ */
  const p = scrollProg;
  const heroAlpha   = 1 - smooth(inv(0.22, 0.36, p));
  const approachAlpha = smooth(inv(0.30, 0.42, p)) * (1 - smooth(inv(0.45, 0.54, p)));
  const scrollHint  = 1 - smooth(inv(0, 0.06, p));

  const svc = activeSvc !== null ? SVC_STOPS[activeSvc] : null;
  const isInHallway = p > 0.635 && p < 0.945;

  return (
    <div id="home" style={{ height: "900vh" }} className="relative">
      <div id="services" style={{ position: "absolute", top: "62%" }} />

      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* ── Hero overlay ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ opacity: heroAlpha }}>
          <div className="text-center px-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-brand-navy shadow-[var(--shadow-solid-sm)] mb-8">
              <span className="w-2 h-2 bg-[#1b5e20] animate-pulse border border-brand-navy" />
              <span className="text-brand-navy font-bold text-xs uppercase tracking-wider">
                Trusted by 500+ clients across India
              </span>
            </div>
            <h1 className="text-[clamp(3rem,7.5vw,5.8rem)] font-bold text-white leading-tight mb-4 uppercase tracking-wider" style={{ textShadow: "4px 4px 0px #0a1f3d" }}>
              Get <span className="text-[#e8c45a]">Instant Loans</span>
              <br />with Minimum<br />Documentation
            </h1>
            <p className="text-white font-bold text-lg mb-8 uppercase tracking-wider bg-brand-navy/80 inline-block px-4 py-1 border-2 border-brand-navy shadow-[var(--shadow-solid-sm)]">
              Fast Approval &bull; Low Interest &bull; Trusted Financial Guidance
            </p>
            <div className="inline-flex items-center gap-3 bg-brand-bg border-2 border-brand-navy shadow-[var(--shadow-solid-sm)] px-5 py-3 mb-10 mx-auto">
              <span className="text-xl">⚡</span>
              <p className="text-brand-navy font-bold text-xs uppercase tracking-wider">
                <span className="text-[#1b5e20]">Low CIBIL score?</span> Still get a loan — we work with all credit profiles.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
              <a href={config.whatsapp.url} target="_blank" rel="noopener noreferrer"
                className="bg-[#1b5e20] border-2 border-brand-navy text-white font-bold py-3 px-8 uppercase tracking-wider shadow-[var(--shadow-solid-sm)] hover:translate-y-[-4px] hover:shadow-[var(--shadow-solid-md)] transition-all">
                Apply Now — It&apos;s Free
              </a>
              <a href={`tel:${config.company.phone}`}
                className="bg-white border-2 border-brand-navy text-brand-navy font-bold py-3 px-8 uppercase tracking-wider shadow-[var(--shadow-solid-sm)] hover:translate-y-[-4px] hover:shadow-[var(--shadow-solid-md)] transition-all">
                📞 {config.company.phone}
              </a>
            </div>
          </div>
        </div>

        {/* ── Approach text ── */}
        <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none" style={{ opacity: approachAlpha }}>
          <div className="text-center bg-brand-navy border-2 border-[#1b5e20] p-4 shadow-[var(--shadow-solid-md)]">
            <p className="text-[#e8c45a] font-bold text-2xl uppercase tracking-wider">
              Welcome to VSR Fintech Solutions
            </p>
            <p className="text-brand-bg font-bold text-xs uppercase tracking-wider mt-2">
              Your dedicated financial partner
            </p>
          </div>
        </div>

        {/* ── Service detail card ── */}
        {svc && activeSvc !== null && (
          <div
            className="absolute top-1/2 pointer-events-auto bg-brand-bg border-4 border-brand-navy shadow-[var(--shadow-solid-md)]"
            style={{
              [svc.isLeft ? "right" : "left"]: "clamp(12px, 3vw, 40px)",
              transform: "translateY(-50%)",
              opacity: svcFade,
              transition: "opacity 0.25s ease",
              width: "min(340px, 88vw)",
            }}
          >
            <div>
              {/* Header strip */}
              <div className="bg-white border-b-2 border-brand-navy p-5 flex items-center gap-4">
                <span className="bg-brand-bg border-2 border-brand-navy w-12 h-12 flex items-center justify-center text-2xl shadow-[var(--shadow-solid-sm)]">{svc.icon}</span>
                <div>
                  <p className="text-brand-navy font-bold text-lg uppercase tracking-wider">{svc.title}</p>
                  <p className="text-brand-text-light font-bold text-[10px] uppercase tracking-wider mt-1">{svc.desc}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-brand-navy font-bold text-xs uppercase tracking-wider mb-4 border-b-2 border-brand-navy pb-2 inline-block">Key Benefits</p>
                <ul className="space-y-3 mb-6">
                  {svc.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[10px] font-bold text-brand-navy uppercase tracking-wider">
                      <span className="bg-[#1b5e20] text-white p-0.5 border border-brand-navy">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Apply button */}
                <a
                  href={`https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(`Hi, I want to apply for a ${svc.title}. Please guide me.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-brand-blue border-2 border-brand-navy text-white font-bold py-3 uppercase tracking-wider shadow-[var(--shadow-solid-sm)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-solid-md)] transition-all mb-4"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Apply via WhatsApp
                </a>

                {/* Next service / counter navigation */}
                <div className="flex gap-2">
                  {activeSvc > 0 && (
                    <button
                      onClick={() => {
                        const r = SVC_RANGE[activeSvc - 1];
                        window.scrollTo({ top: (r[0] + 0.01) * window.innerHeight * 8, behavior: "smooth" });
                      }}
                      className="flex-1 bg-white border-2 border-brand-navy text-brand-navy font-bold text-xs uppercase tracking-wider py-2 shadow-[var(--shadow-solid-sm)] hover:bg-brand-bg transition-colors"
                    >
                      ← Prev
                    </button>
                  )}
                  {activeSvc < SERVICES.length - 1 && (
                    <button
                      onClick={() => scrollToNext(activeSvc)}
                      className="flex-1 bg-brand-navy border-2 border-brand-navy text-white font-bold text-xs uppercase tracking-wider py-2 shadow-[var(--shadow-solid-sm)] hover:bg-[#153a5a] transition-colors"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Counter number */}
            <p className="text-center text-white font-bold text-[10px] uppercase tracking-wider mt-4 drop-shadow-md">
              Counter {activeSvc + 1} of {SERVICES.length}
            </p>
          </div>
        )}

        {/* ── Progress dots (inside hallway) ── */}
        {isInHallway && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 pointer-events-none">
            {SERVICES.map((sv, i) => (
              <div key={i} style={{
                width: i === activeSvc ? "10px" : "5px", height: i === activeSvc ? "10px" : "5px",
                borderRadius: "50%", background: i === activeSvc ? sv.hex : "rgba(255,255,255,0.25)",
                boxShadow: i === activeSvc ? `0 0 8px ${sv.hex}` : "none",
                transition: "all 0.3s", marginLeft: i === activeSvc ? "-2px" : "0",
              }} />
            ))}
          </div>
        )}

        {/* ── Scroll hint ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" style={{ opacity: scrollHint }}>
          <span className="text-white font-bold text-[10px] uppercase tracking-wider drop-shadow-md">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#e8c45a]" style={{ animation: "scrollBob 1.5s ease-in-out infinite" }} />
          </div>
        </div>

        {/* ── MD card ── */}
        <div className="absolute bottom-8 left-6 pointer-events-none" style={{ opacity: heroAlpha }}>
          <div className="flex items-center gap-3 bg-brand-navy border-2 border-[#1b5e20] p-3 shadow-[var(--shadow-solid-sm)]">
            <div className="w-10 h-10 bg-white border-2 border-brand-navy flex items-center justify-center text-brand-navy font-bold text-xl shadow-[var(--shadow-solid-sm)]">S</div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wider">{config.company.managingDirector}</p>
              <p className="text-[#1b5e20] font-bold text-[10px] uppercase tracking-wider mt-0.5">Managing Director &bull; {config.company.qualification}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollBob {
          0%,100%{transform:translateY(0);opacity:1}
          50%{transform:translateY(10px);opacity:0.35}
        }
      `}</style>
    </div>
  );
}
