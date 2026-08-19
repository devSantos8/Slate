"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { Slide, SlideElement } from "@/types/presentation";

/* ────────────────────────────────────────────────────────── */
/*  Slide Element Renderer (Presentation)                     */
/* ────────────────────────────────────────────────────────── */

function PresentationElement({ element }: { element: SlideElement }) {
  const { style } = element;

  const textStyle: React.CSSProperties = {
    fontFamily: `"${style.fontFamily}", sans-serif`,
    fontSize: `${style.fontSize}px`,
    fontWeight: Number(style.fontWeight),
    color: style.gradientText ? undefined : style.color,
    textAlign: style.textAlign,
    letterSpacing: `${style.letterSpacing}px`,
    lineHeight: style.lineHeight,
    opacity: style.opacity,
    transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotation}deg)`,
    zIndex: style.zIndex,
    ...(style.gradientText
      ? {
          backgroundImage: style.gradientText,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
  };

  const animVariant = element.animation ?? "fade-in";
  const variants = {
    initial: {
      opacity: 0,
      y: animVariant === "slide-up" || animVariant === "cinematic-reveal" ? 30 : 0,
      scale: animVariant === "scale-up" ? 0.8 : animVariant === "cinematic-reveal" ? 0.95 : 1,
      filter: animVariant === "cinematic-reveal" ? "blur(8px)" : "blur(0px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
  };

  if (element.type === "image") {
    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotation}deg)`,
          opacity: style.opacity,
          zIndex: style.zIndex,
        }}
      >
        <img
          src={element.content}
          alt=""
          className="max-w-full max-h-[60vh] rounded-lg object-cover"
        />
      </motion.div>
    );
  }

  if (element.type === "shape") {
    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
        style={{
          transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotation}deg)`,
          opacity: style.opacity,
          width: "200px",
          height: "120px",
          backgroundColor: style.color,
          borderRadius: element.content === "circle" ? "50%" : "12px",
        }}
      />
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{
        duration: animVariant === "cinematic-reveal" ? 0.8 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={textStyle}
    >
      <div className="whitespace-pre-wrap">{element.content}</div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Presentation Mode                                         */
/* ────────────────────────────────────────────────────────── */

export function PresentationMode() {
  const slides = usePresentationStore((s) => s.currentDeck?.slides ?? []);
  const activeSlideId = usePresentationStore((s) => s.activeSlideId);
  const setPresenting = usePresentationStore((s) => s.setPresenting);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlack, setIsBlack] = useState(false);
  const [showLaser, setShowLaser] = useState(false);
  const laserRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const laserDotRef = useRef<HTMLDivElement>(null);

  // Set initial slide from active
  useEffect(() => {
    if (activeSlideId) {
      const idx = slides.findIndex((s) => s.id === activeSlideId);
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, [activeSlideId, slides]);

  // Fullscreen
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
          setIsBlack(false);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
          setIsBlack(false);
          break;
        case "Escape":
          setPresenting(false);
          break;
        case "f":
          document.documentElement.requestFullscreen?.().catch(() => {});
          break;
        case "b":
          setIsBlack((prev) => !prev);
          break;
        case "l":
          setShowLaser((prev) => !prev);
          break;
      }
    },
    [slides.length, setPresenting]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Laser pointer tracking
  useEffect(() => {
    if (!showLaser) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (laserDotRef.current) {
        laserDotRef.current.style.left = `${e.clientX}px`;
        laserDotRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showLaser]);

  const currentSlide = slides[currentIndex];
  if (!currentSlide) return null;

  const bg = currentSlide.background;
  const bgStyle: React.CSSProperties =
    bg.type === "gradient" || bg.type === "mesh-glow"
      ? { background: bg.value }
      : bg.type === "solid"
        ? { backgroundColor: bg.value }
        : bg.type === "image"
          ? { backgroundImage: `url(${bg.value})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { backgroundColor: "#09090b" };

  return (
    <div className="fixed inset-0 z-[9999] cursor-none">
      {/* Black screen toggle */}
      <AnimatePresence>
        {isBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={bgStyle}
        >
          {/* Overlay */}
          {bg.overlayOpacity && bg.overlayOpacity > 0 && (
            <div className="absolute inset-0 bg-black" style={{ opacity: bg.overlayOpacity }} />
          )}

          {/* Elements */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 p-12 max-w-5xl w-full">
            {currentSlide.elements.map((el, i) => (
              <PresentationElement key={el.id} element={el} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.05] z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-6 z-40 text-xs font-mono text-white/30">
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Laser pointer */}
      {showLaser && (
        <div
          ref={laserDotRef}
          className="fixed z-50 pointer-events-none"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div className="size-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8),0_0_24px_rgba(239,68,68,0.4)]" />
        </div>
      )}

      {/* Exit hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-40 rounded-full bg-black/60 backdrop-blur-sm px-4 py-2 text-[11px] text-white/50 font-mono"
      >
        ESC salir · ← → navegar · B negro · L láser · F fullscreen
      </motion.div>
    </div>
  );
}
