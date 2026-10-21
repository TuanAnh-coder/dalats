"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  isStar?: boolean;
}

interface RibbonPoint {
  x: number;
  y: number;
  time: number;
}

export function DragonflyScrollCompanion() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragonflyWrapperRef = useRef<HTMLDivElement | null>(null);
  const dragonflyModelRef = useRef<HTMLDivElement | null>(null);

  // Flight Physics & Choreography
  const posRef = useRef({ x: 0, y: 0 });
  const basePosRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const angleRef = useRef(-25); // Heading (degrees)
  const pitchRef = useRef(10); // Dive/climb (degrees)
  const rollRef = useRef(0); // Banking into turns (degrees)
  const zDepthRef = useRef(0);

  // Flight state: "hover" | "swoop"
  const flightStateRef = useRef<"hover" | "swoop">("hover");
  const hoverTimeRef = useRef(0);
  const swoopTimerRef = useRef(0);
  const curveDirectionRef = useRef(1); // 1 = right curve, -1 = left curve

  // Luminous Ribbon Trail
  const ribbonPointsRef = useRef<RibbonPoint[]>([]);
  const particlesRef = useRef<StardustParticle[]>([]);

  const animFrameRef = useRef<number | null>(null);
  const autoRoamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);
  const mousePosRef = useRef({ x: -999, y: -999 });

  // Function to launch a poetic, graceful sweeping arc flight to a new destination
  const launchSwoopFlight = useCallback((customTargetX?: number, customTargetY?: number) => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const marginX = w < 640 ? 50 : 100;
    const marginY = 90;

    let nextX = customTargetX ?? Math.random() * (w - marginX * 2) + marginX;
    let nextY = customTargetY ?? Math.random() * (h - marginY * 2) + marginY;

    // Ensure it travels a graceful, noticeable distance across the screen
    const dx = nextX - basePosRef.current.x;
    const dy = nextY - basePosRef.current.y;
    if (Math.hypot(dx, dy) < 160) {
      nextX = nextX > w / 2 ? nextX - 220 : nextX + 220;
    }

    targetRef.current = { x: nextX, y: nextY };
    flightStateRef.current = "swoop";
    swoopTimerRef.current = 0;
    // Alternate curve arcs for organic beauty
    curveDirectionRef.current = Math.random() > 0.5 ? 1 : -1;
  }, []);

  // Spawn ethereal stardust
  const spawnParticle = useCallback((originX: number, originY: number, count = 2, isBurst = false) => {
    const colors = [
      "rgba(244, 162, 97, ", // Sunset Orange
      "rgba(217, 201, 167, ", // Tuscan Sand Gold
      "rgba(107, 143, 88, ",  // Pine Emerald
      "rgba(255, 255, 255, ", // Morning Mist White
      "rgba(250, 247, 241, ", // Cream White
    ];

    for (let i = 0; i < count; i++) {
      const colorBase = colors[Math.floor(Math.random() * colors.length)] ?? "rgba(244, 162, 97, ";
      const angle = isBurst ? Math.random() * Math.PI * 2 : Math.random() * Math.PI + Math.PI / 2;
      const speed = isBurst ? 2 + Math.random() * 4.5 : 0.4 + Math.random() * 1.5;

      particlesRef.current.push({
        x: originX + (Math.random() - 0.5) * 10,
        y: originY + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.25,
        size: isBurst ? 2 + Math.random() * 3.5 : 1.2 + Math.random() * 2.2,
        alpha: 0.95,
        decay: isBurst ? 0.015 + Math.random() * 0.02 : 0.018 + Math.random() * 0.022,
        color: colorBase,
        isStar: Math.random() > 0.55,
      });
    }

    if (particlesRef.current.length > 130) {
      particlesRef.current.splice(0, particlesRef.current.length - 130);
    }
  }, []);

  // Initialize
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const startX = window.innerWidth * 0.82;
      const startY = window.innerHeight * 0.24;
      posRef.current = { x: startX, y: startY };
      basePosRef.current = { x: startX, y: startY };
      targetRef.current = { x: startX, y: startY };
      angleRef.current = -25;
    }
  }, []);

  // Mouse tracking for gentle curiosity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll listener: gracefully swoops to match viewport shifts
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollYRef.current;

      if (Math.abs(delta) > 160 && flightStateRef.current === "hover") {
        lastScrollYRef.current = currentScroll;
        launchSwoopFlight();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, launchSwoopFlight]);

  // Autonomous poetic wandering timer (every 6 - 9 seconds)
  useEffect(() => {
    if (!mounted || !isVisible) return;

    const scheduleNextWander = () => {
      const delay = 6500 + Math.random() * 3000;
      autoRoamTimerRef.current = setTimeout(() => {
        if (flightStateRef.current === "hover") {
          launchSwoopFlight();
        }
        scheduleNextWander();
      }, delay);
    };

    scheduleNextWander();

    return () => {
      if (autoRoamTimerRef.current) clearTimeout(autoRoamTimerRef.current);
    };
  }, [mounted, isVisible, launchSwoopFlight]);

  // Main 60-120FPS Poetic Aerodynamics & Luminous Ribbon Simulation
  useEffect(() => {
    if (!mounted || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const pos = posRef.current;
      const basePos = basePosRef.current;
      const vel = velRef.current;
      const target = targetRef.current;

      let targetAngle = angleRef.current;
      let targetPitch = 0;
      let targetRoll = 0;
      let targetZ = 0;

      // ==========================================
      // FLIGHT STATE CHOREOGRAPHY (Silky smooth, serene gliding)
      // ==========================================
      if (flightStateRef.current === "swoop") {
        // SWOOP FLIGHT: Organic gentle curved trajectory with calm aerodynamic banking
        swoopTimerRef.current += dt;

        const dx = target.x - basePos.x;
        const dy = target.y - basePos.y;
        const totalDist = Math.hypot(dx, dy);

        // Gentle, serene flight velocity (no rush, poetic gliding)
        const maxSpeed = 220;
        const slowingRadius = 220;
        const currentDist = Math.hypot(target.x - pos.x, target.y - pos.y);

        // Soft, natural curved swoop arc
        const curveStrength = Math.sin(Math.min(swoopTimerRef.current * 1.8, Math.PI)) * 55 * curveDirectionRef.current;
        // Perpendicular vector (-dy, dx)
        const perpX = (-dy / (totalDist || 1)) * curveStrength;
        const perpY = (dx / (totalDist || 1)) * curveStrength;

        // Desired velocity vector pointing along the arc
        const targetWithArcX = target.x + perpX * 0.35;
        const targetWithArcY = target.y + perpY * 0.35;

        const steerX = targetWithArcX - pos.x;
        const steerY = targetWithArcY - pos.y;
        const steerDist = Math.hypot(steerX, steerY);

        const desiredSpeed = currentDist < slowingRadius ? Math.max(50, (currentDist / slowingRadius) * maxSpeed) : maxSpeed;
        const desiredVx = steerDist > 2 ? (steerX / steerDist) * desiredSpeed : 0;
        const desiredVy = steerDist > 2 ? (steerY / steerDist) * desiredSpeed : 0;

        // Gentle acceleration & damping (soft inertia)
        vel.x += (desiredVx - vel.x) * 2.8 * dt;
        vel.y += (desiredVy - vel.y) * 2.8 * dt;

        pos.x += vel.x * dt;
        pos.y += vel.y * dt;

        const currentSpeed = Math.hypot(vel.x, vel.y);

        // Smooth heading towards velocity vector (no rapid snapping)
        if (currentSpeed > 20) {
          targetAngle = (Math.atan2(vel.y, vel.x) * 180) / Math.PI + 90;

          let diff = targetAngle - angleRef.current;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;

          // Silky progressive turning rate
          angleRef.current += diff * 4.0 * dt;

          // Gentle banking into the turn (Roll capped to serene angles)
          targetRoll = Math.max(-14, Math.min(14, -diff * 0.6));

          // Subtle pitch: soft lift/dive
          targetPitch = Math.max(-10, Math.min(12, (vel.y / (maxSpeed || 1)) * 16));
          targetZ = 18;
        }

        // Arrival threshold: gently transition into hovering
        if (currentDist < 24) {
          flightStateRef.current = "hover";
          basePos.x = pos.x;
          basePos.y = pos.y;
          hoverTimeRef.current = 0;
        }
      } else {
        // HOVER MODE: Hypnotic Figure-8 (∞) Lissajous Skimming
        hoverTimeRef.current += dt;
        const t = hoverTimeRef.current;

        // Smooth Infinity Curve: serene, slow swaying
        const figure8X = Math.sin(t * 1.2) * 18;
        const figure8Y = Math.sin(t * 2.4) * 8;

        // Subtle mountain breeze drift
        const windX = Math.cos(t * 0.6) * 3;
        const windY = Math.sin(t * 0.8) * 2.5;

        pos.x = basePos.x + figure8X + windX;
        pos.y = basePos.y + figure8Y + windY;

        // Heading smoothly tracks the tangent of the curve
        const tangentX = Math.cos(t * 1.2) * 1.2 * 18;
        const tangentY = Math.cos(t * 2.4) * 2.4 * 8;
        const hoverTargetAngle = (Math.atan2(tangentY, tangentX) * 180) / Math.PI + 90;

        let diff = hoverTargetAngle - angleRef.current;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        angleRef.current += diff * 3.0 * dt;

        targetRoll = Math.sin(t * 1.2) * 8; // Gentle wing tilt
        targetPitch = 6 + Math.cos(t * 2.4) * 4; // Gentle floating breath
        targetZ = Math.sin(t * 1.0) * 8;

        // Occasional gentle floating stardust drop
        if (Math.random() < 0.04) {
          spawnParticle(pos.x, pos.y + 14, 1);
        }
      }

      // Smooth interpolation of Euler angles
      pitchRef.current += (targetPitch - pitchRef.current) * 4.5 * dt;
      rollRef.current += (targetRoll - rollRef.current) * 4.5 * dt;
      zDepthRef.current += (targetZ - zDepthRef.current) * 4.0 * dt;

      // Apply GPU-accelerated transforms
      if (dragonflyWrapperRef.current) {
        dragonflyWrapperRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      if (dragonflyModelRef.current) {
        dragonflyModelRef.current.style.transform = `translate3d(0, 0, ${zDepthRef.current}px) rotateZ(${angleRef.current}deg) rotateX(${pitchRef.current}deg) rotateY(${rollRef.current}deg)`;
      }

      // ==========================================
      // LUMINOUS RIBBON TRAIL & STARDUST PARTICLES
      // ==========================================
      // Compute accurate tail coordinates
      const rad = ((angleRef.current - 90) * Math.PI) / 180;
      const tailX = pos.x - Math.cos(rad) * 28;
      const tailY = pos.y - Math.sin(rad) * 28;

      // Add point to ribbon trail
      ribbonPointsRef.current.push({ x: tailX, y: tailY, time: now });

      // Keep only points within last 0.65s
      while (
        ribbonPointsRef.current.length > 0 &&
        now - ribbonPointsRef.current[0]!.time > 650
      ) {
        ribbonPointsRef.current.shift();
      }

      // Spawn stardust while swooping
      if (flightStateRef.current === "swoop") {
        spawnParticle(tailX, tailY, 1);
      }

      // Render Luminous Ribbon on Canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pts = ribbonPointsRef.current;
        if (pts.length > 2) {
          ctx.save();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // 1. Ethereal Outer Glow Ribbon
          ctx.beginPath();
          ctx.moveTo(pts[0]!.x, pts[0]!.y);
          for (let i = 1; i < pts.length - 1; i++) {
            const xc = (pts[i]!.x + pts[i + 1]!.x) / 2;
            const yc = (pts[i]!.y + pts[i + 1]!.y) / 2;
            ctx.quadraticCurveTo(pts[i]!.x, pts[i]!.y, xc, yc);
          }

          const grad = ctx.createLinearGradient(
            pts[0]!.x,
            pts[0]!.y,
            pts[pts.length - 1]!.x,
            pts[pts.length - 1]!.y
          );
          grad.addColorStop(0, "rgba(244, 162, 97, 0)");
          grad.addColorStop(0.4, "rgba(217, 201, 167, 0.45)");
          grad.addColorStop(1, "rgba(244, 162, 97, 0.85)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 4;
          ctx.shadowColor = "#F4A261";
          ctx.shadowBlur = 10;
          ctx.stroke();

          // 2. Pure White Core Filament
          ctx.beginPath();
          ctx.moveTo(pts[0]!.x, pts[0]!.y);
          for (let i = 1; i < pts.length - 1; i++) {
            const xc = (pts[i]!.x + pts[i + 1]!.x) / 2;
            const yc = (pts[i]!.y + pts[i + 1]!.y) / 2;
            ctx.quadraticCurveTo(pts[i]!.x, pts[i]!.y, xc, yc);
          }
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 4;
          ctx.stroke();
          ctx.restore();
        }

        // Render Stardust Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i]!;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowColor = `${p.color}0.85)`;
          ctx.shadowBlur = p.size * 2;

          if (p.isStar && p.size > 2) {
            ctx.beginPath();
            const s = p.size * 1.5;
            ctx.moveTo(p.x, p.y - s);
            ctx.lineTo(p.x + s * 0.25, p.y - s * 0.25);
            ctx.lineTo(p.x + s, p.y);
            ctx.lineTo(p.x + s * 0.25, p.y + s * 0.25);
            ctx.lineTo(p.x, p.y + s);
            ctx.lineTo(p.x - s * 0.25, p.y + s * 0.25);
            ctx.lineTo(p.x - s, p.y);
            ctx.lineTo(p.x - s * 0.25, p.y - s * 0.25);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mounted, isVisible, spawnParticle]);

  // Click interaction: Burst of stardust, recite poetry, and gently glide away (no 360 spin)
  const handleDragonflyClick = () => {
    spawnParticle(posRef.current.x, posRef.current.y, 24, true);

    const poeticQuotes = [
      "Giọt sương sớm đọng trên nhành thông biếc 🌲",
      "Nắng hoàng hôn rọi ấm tường gạch Tuscany ✨",
      "Nghe tiếng gió ngàn thì thầm qua thung lũng 🍃",
      "Một tách cà phê thơm giữa sương mờ phố núi ☕",
      "Bình yên là khi tâm hồn tìm về với tự nhiên 🤍",
      "M_Dalats - Nơi những ký ức ngọt ngào bắt đầu 🌸",
      "Hít một hơi thật sâu trong lành khí trời cao nguyên 🌿",
    ];
    const randomQuote =
      poeticQuotes[Math.floor(Math.random() * poeticQuotes.length)] ??
      "Stay close to nature ✨";
    setSpeechBubble(randomQuote);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeechBubble(null);
      // Glide smoothly to another spot after reciting
      launchSwoopFlight();
    }, 3200);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Fullscreen Canvas for Luminous Ribbon & Stardust Trail */}
      {isVisible && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-30"
          style={{ willChange: "transform" }}
        />
      )}

      {/* 3D Flight Stage */}
      {isVisible && (
        <div
          className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          {/* Position Wrapper (Smooth X, Y position without rotating UI) */}
          <div
            ref={dragonflyWrapperRef}
            className="absolute top-0 left-0 will-change-transform pointer-events-auto"
            style={{
              transformStyle: "preserve-3d",
              marginLeft: "-40px",
              marginTop: "-40px",
            }}
          >
            {/* Horizontal Billboard Speech Bubble (Always stays level & readable!) */}
            {speechBubble && (
              <div
                className="absolute left-1/2 -top-14 -translate-x-1/2 whitespace-nowrap bg-gradient-to-b from-white/95 to-[#FAF9F6]/95 backdrop-blur-md border border-[#D9C9A7]/80 text-[#367156] px-4 py-2 rounded-2xl shadow-[0_12px_28px_rgba(27,48,47,0.18)] pointer-events-none flex items-center gap-2 animate-fadeIn"
              >
                <div className="w-4 h-4 rounded-full bg-[#F4A261]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-[#F4A261] animate-spin" />
                </div>
                <div className="flex flex-col">
                  <span className="font-script text-base sm:text-lg text-[#367156] leading-tight">
                    {speechBubble}
                  </span>
                  <span className="text-[8px] font-sans uppercase tracking-[0.2em] text-[#367156]/80 font-semibold">
                    M_Dalats • Spirit of Nature
                  </span>
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FAF9F6] border-b border-r border-[#D9C9A7]/80 rotate-45" />
              </div>
            )}

            {/* 3D Aerodynamic Rotating Model (Yaw, Pitch, Roll & Banking) */}
            <div
              ref={dragonflyModelRef}
              onClick={handleDragonflyClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer select-none transition-transform duration-200 hover:scale-115 will-change-transform"
              style={{
                transformStyle: "preserve-3d",
              }}
              title="Chạm vào chú chuồn chuồn M_Dalats để thưởng thức thơ & lượn cánh hoàng hôn!"
            >
              {/* Ethereal Glow Aura */}
              <div
                className="absolute inset-0 -m-4 rounded-full bg-radial from-[#F4A261]/30 via-[#367156]/10 to-transparent blur-md pointer-events-none"
                style={{ transform: "translateZ(-10px)" }}
              />

              {/* Museum-Grade Stained-Glass Art Nouveau Dragonfly */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="artForewingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="25%" stopColor="#FAF7F1" stopOpacity="0.85" />
                    <stop offset="55%" stopColor="#D9C9A7" stopOpacity="0.65" />
                    <stop offset="85%" stopColor="#F4A261" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#367156" stopOpacity="0.75" />
                  </linearGradient>

                  <linearGradient id="artHindwingGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#F4A261" stopOpacity="0.6" />
                    <stop offset="75%" stopColor="#D9C9A7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#367156" stopOpacity="0.5" />
                  </linearGradient>

                  <linearGradient id="artCarapaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2A5445" />
                    <stop offset="50%" stopColor="#367156" />
                    <stop offset="100%" stopColor="#584636" />
                  </linearGradient>

                  <linearGradient id="artAbdomenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#367156" />
                    <stop offset="35%" stopColor="#367156" />
                    <stop offset="70%" stopColor="#F4A261" />
                    <stop offset="100%" stopColor="#367156" />
                  </linearGradient>

                  <filter id="wingSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="0.6" floodColor="#FAF7F1" floodOpacity="0.9" />
                  </filter>
                </defs>

                {/* LEFT FOREWING (Cánh trước trái - Rung đập cánh sinh học) */}
                <g className="origin-[50px_41px] animate-wing-flap-left" filter="url(#wingSoftGlow)">
                  <path
                    d="M 50 41 C 28 20, 4 25, 2 32 C 8 43, 30 45, 50 42 Z"
                    fill="url(#artForewingGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.75"
                  />
                  <path d="M 50 41 C 26 21, 5 26, 2 32" stroke="#D9C9A7" strokeWidth="0.8" fill="none" opacity="0.9" />
                  <path d="M 50 41 Q 20 32 3 32" stroke="#FFFFFF" strokeWidth="0.45" fill="none" opacity="0.8" />
                  <path d="M 40 37 Q 24 40 10 41" stroke="#D9C9A7" strokeWidth="0.35" fill="none" opacity="0.7" />
                  <path d="M 30 33 Q 18 36 8 36" stroke="#FFFFFF" strokeWidth="0.3" fill="none" opacity="0.6" />
                  <path d="M 22 28 Q 15 34 5 35" stroke="#FFFFFF" strokeWidth="0.3" fill="none" opacity="0.5" />
                  <path d="M 35 34 L 33 41 M 26 31 L 23 39 M 18 29 L 15 37 M 12 28 L 9 35" stroke="#FAF7F1" strokeWidth="0.25" opacity="0.6" />
                  <rect x="7" y="27.5" width="4.5" height="1.6" rx="0.5" fill="#F4A261" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.95" />
                </g>

                {/* RIGHT FOREWING (Cánh trước phải) */}
                <g className="origin-[50px_41px] animate-wing-flap-right" filter="url(#wingSoftGlow)">
                  <path
                    d="M 50 41 C 72 20, 96 25, 98 32 C 92 43, 70 45, 50 42 Z"
                    fill="url(#artForewingGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.75"
                  />
                  <path d="M 50 41 C 74 21, 95 26, 98 32" stroke="#D9C9A7" strokeWidth="0.8" fill="none" opacity="0.9" />
                  <path d="M 50 41 Q 80 32 97 32" stroke="#FFFFFF" strokeWidth="0.45" fill="none" opacity="0.8" />
                  <path d="M 60 37 Q 76 40 90 41" stroke="#D9C9A7" strokeWidth="0.35" fill="none" opacity="0.7" />
                  <path d="M 70 33 Q 82 36 92 36" stroke="#FFFFFF" strokeWidth="0.3" fill="none" opacity="0.6" />
                  <path d="M 78 28 Q 85 34 95 35" stroke="#FFFFFF" strokeWidth="0.3" fill="none" opacity="0.5" />
                  <path d="M 65 34 L 67 41 M 74 31 L 77 39 M 82 29 L 85 37 M 88 28 L 91 35" stroke="#FAF7F1" strokeWidth="0.25" opacity="0.6" />
                  <rect x="88.5" y="27.5" width="4.5" height="1.6" rx="0.5" fill="#F4A261" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.95" />
                </g>

                {/* LEFT HINDWING (Cánh sau trái) */}
                <g className="origin-[50px_46px] animate-wing-flap-left-hind" filter="url(#wingSoftGlow)">
                  <path
                    d="M 50 46 C 33 34, 10 42, 8 50 C 18 57, 36 54, 50 47 Z"
                    fill="url(#artHindwingGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.65"
                  />
                  <path d="M 50 46 Q 24 45 10 50" stroke="#FAF7F1" strokeWidth="0.35" fill="none" opacity="0.7" />
                  <path d="M 40 48 Q 28 52 16 54" stroke="#D9C9A7" strokeWidth="0.3" fill="none" opacity="0.6" />
                  <path d="M 32 46 L 28 53 M 24 45 L 20 52 M 16 46 L 13 51" stroke="#FAF7F1" strokeWidth="0.2" opacity="0.5" />
                  <rect x="12" y="44.5" width="3.5" height="1.4" rx="0.4" fill="#367156" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.9" />
                </g>

                {/* RIGHT HINDWING (Cánh sau phải) */}
                <g className="origin-[50px_46px] animate-wing-flap-right-hind" filter="url(#wingSoftGlow)">
                  <path
                    d="M 50 46 C 67 34, 90 42, 92 50 C 82 57, 64 54, 50 47 Z"
                    fill="url(#artHindwingGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.65"
                  />
                  <path d="M 50 46 Q 76 45 90 50" stroke="#FAF7F1" strokeWidth="0.35" fill="none" opacity="0.7" />
                  <path d="M 60 48 Q 72 52 84 54" stroke="#D9C9A7" strokeWidth="0.3" fill="none" opacity="0.6" />
                  <path d="M 68 46 L 72 53 M 76 45 L 80 52 M 84 46 L 87 51" stroke="#FAF7F1" strokeWidth="0.2" opacity="0.5" />
                  <rect x="84.5" y="44.5" width="3.5" height="1.4" rx="0.4" fill="#367156" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.9" />
                </g>

                {/* BODY ANATOMY */}
                <path
                  d="M 48.2 48 C 48.2 65, 48.8 88, 50 97 C 51.2 88, 51.8 65, 51.8 48 Z"
                  fill="url(#artAbdomenGrad)"
                  stroke="#367156"
                  strokeWidth="0.5"
                />
                <path d="M 49.2 97 L 48 99.5 M 50.8 97 L 52 99.5" stroke="#D9C9A7" strokeWidth="0.6" strokeLinecap="round" />

                {/* Gold Rings */}
                <line x1="48.2" y1="54" x2="51.8" y2="54" stroke="#D9C9A7" strokeWidth="0.75" />
                <line x1="48.4" y1="60" x2="51.6" y2="60" stroke="#F4A261" strokeWidth="0.75" />
                <line x1="48.6" y1="66" x2="51.4" y2="66" stroke="#D9C9A7" strokeWidth="0.75" />
                <line x1="48.8" y1="72" x2="51.2" y2="72" stroke="#F4A261" strokeWidth="0.75" />
                <line x1="49.0" y1="78" x2="51.0" y2="78" stroke="#D9C9A7" strokeWidth="0.75" />
                <line x1="49.2" y1="84" x2="50.8" y2="84" stroke="#F4A261" strokeWidth="0.75" />
                <line x1="49.5" y1="90" x2="50.5" y2="90" stroke="#D9C9A7" strokeWidth="0.75" />

                {/* Thorax Carapace */}
                <ellipse cx="50" cy="43.5" rx="4" ry="6" fill="url(#artCarapaceGrad)" stroke="#D9C9A7" strokeWidth="0.6" />
                <ellipse cx="50" cy="43" rx="1.8" ry="3.2" fill="#F4A261" opacity="0.85" className="animate-pulse" />
                <ellipse cx="50" cy="43" rx="0.8" ry="1.6" fill="#FFFFFF" opacity="0.9" />

                {/* Head */}
                <ellipse cx="50" cy="36.5" rx="3.4" ry="2.6" fill="#367156" stroke="#D9C9A7" strokeWidth="0.5" />

                {/* Antennae */}
                <path d="M 48.5 35 Q 45 32 44 29" stroke="#D9C9A7" strokeWidth="0.5" fill="none" strokeLinecap="round" />
                <circle cx="44" cy="29" r="0.9" fill="#F4A261" stroke="#FFFFFF" strokeWidth="0.3" />
                <path d="M 51.5 35 Q 55 32 56 29" stroke="#D9C9A7" strokeWidth="0.5" fill="none" strokeLinecap="round" />
                <circle cx="56" cy="29" r="0.9" fill="#F4A261" stroke="#FFFFFF" strokeWidth="0.3" />

                {/* Faceted Emerald Eyes */}
                <circle cx="46.5" cy="36" r="2.5" fill="#367156" stroke="#D9C9A7" strokeWidth="0.5" />
                <circle cx="46.5" cy="36" r="1.8" fill="#367156" />
                <circle cx="45.8" cy="35.3" r="0.8" fill="#FFFFFF" />
                <circle cx="53.5" cy="36" r="2.5" fill="#367156" stroke="#D9C9A7" strokeWidth="0.5" />
                <circle cx="53.5" cy="36" r="1.8" fill="#367156" />
                <circle cx="54.2" cy="35.3" r="0.8" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
