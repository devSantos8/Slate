"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { Slide, SlideElement } from "@/types/presentation";

/* ────────────────────────────────────────────────────────── */
/*  Single Element Renderer                                   */
/* ────────────────────────────────────────────────────────── */

function CanvasElement({
  element,
  slideId,
  isSelected,
}: {
  element: SlideElement;
  slideId: string;
  isSelected: boolean;
}) {
  const setSelectedElement = usePresentationStore((s) => s.setSelectedElement);
  const updateElementContent = usePresentationStore((s) => s.updateElementContent);
  const updateElementStyle = usePresentationStore((s) => s.updateElementStyle);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const { style } = element;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type !== "image" && element.type !== "shape") {
      setIsEditing(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element.id);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    const newContent = e.currentTarget.textContent ?? element.content;
    if (newContent !== element.content) {
      updateElementContent(slideId, element.id, newContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      (e.target as HTMLElement).blur();
    }
  };

  // Mouse drag for repositioning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(element.id);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: style.x,
      origY: style.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      // Apply to DOM directly for performance
      if (elementRef.current) {
        elementRef.current.style.transform = `translate(${dragRef.current.origX + dx}px, ${dragRef.current.origY + dy}px) rotate(${style.rotation}deg)`;
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      updateElementStyle(slideId, element.id, {
        x: dragRef.current.origX + dx,
        y: dragRef.current.origY + dy,
      });
      setIsDragging(false);
      dragRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, slideId, element.id, style.rotation, updateElementStyle]);

  // Gradient text support
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

  if (element.type === "image") {
    return (
      <div
        ref={elementRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        className={`relative cursor-move ${isSelected ? "selection-box" : ""}`}
        style={{
          transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotation}deg)`,
          opacity: style.opacity,
          zIndex: style.zIndex,
        }}
      >
        <img
          src={element.content}
          alt=""
          className="max-w-full max-h-[300px] rounded-lg object-cover"
          draggable={false}
        />
      </div>
    );
  }

  if (element.type === "shape") {
    return (
      <div
        ref={elementRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        className={`relative cursor-move ${isSelected ? "selection-box" : ""}`}
        style={{
          transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotation}deg)`,
          opacity: style.opacity,
          zIndex: style.zIndex,
          width: "200px",
          height: "120px",
          backgroundColor: style.color,
          borderRadius: element.content === "circle" ? "50%" : "12px",
        }}
      />
    );
  }

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      className={`relative transition-shadow ${
        isSelected ? "selection-box" : ""
      } ${isDragging ? "cursor-grabbing" : "cursor-move"}`}
      style={textStyle}
    >
      {isEditing ? (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="outline-none min-w-[60px] whitespace-pre-wrap"
          style={{ caretColor: "#a78bfa" }}
        >
          {element.content}
        </div>
      ) : (
        <div className="whitespace-pre-wrap select-none">
          {element.content}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Slide Canvas                                              */
/* ────────────────────────────────────────────────────────── */

export function SlideCanvas() {
  const activeSlide = usePresentationStore((s) => s.getActiveSlide());
  const selectedElementId = usePresentationStore((s) => s.selectedElementId);
  const setSelectedElement = usePresentationStore((s) => s.setSelectedElement);
  const deleteElement = usePresentationStore((s) => s.deleteElement);
  const zoom = usePresentationStore((s) => s.zoom);
  const aspectRatio = usePresentationStore((s) => s.aspectRatio);

  // Calculate dimensions based on aspect ratio
  const getAspectDimensions = () => {
    switch (aspectRatio) {
      case "4:3":
        return { width: 960, height: 720 };
      case "9:16":
        return { width: 540, height: 960 };
      default:
        return { width: 960, height: 540 };
    }
  };

  const { width, height } = getAspectDimensions();

  // Delete selected element on Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElementId && activeSlide) {
        // Don't delete if editing text
        if ((e.target as HTMLElement).contentEditable === "true") return;
        deleteElement(activeSlide.id, selectedElementId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, activeSlide, deleteElement]);

  if (!activeSlide) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600">
        <p className="text-sm">No hay diapositiva seleccionada</p>
      </div>
    );
  }

  const bg = activeSlide.background;
  const bgStyle: React.CSSProperties =
    bg.type === "gradient" || bg.type === "mesh-glow"
      ? { background: bg.value }
      : bg.type === "solid"
        ? { backgroundColor: bg.value }
        : bg.type === "image"
          ? {
              backgroundImage: `url(${bg.value})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "#09090b" };

  if (bg.blur) {
    bgStyle.filter = `blur(${bg.blur}px)`;
  }

  return (
    <div className="flex-1 flex items-center justify-center overflow-auto bg-zinc-950/30 p-6 lg:p-10">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/[0.06]"
        style={{
          width: `${width * zoom}px`,
          height: `${height * zoom}px`,
          transform: `scale(${zoom > 1 ? 1 : 1})`,
        }}
      >
        {/* Background layer */}
        <div className="absolute inset-0" style={bgStyle}>
          {/* Overlay */}
          {bg.overlayOpacity && bg.overlayOpacity > 0 && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: bg.overlayOpacity }}
            />
          )}
        </div>

        {/* Elements layer */}
        <div
          className="relative w-full h-full flex flex-col items-center justify-center gap-2 p-10"
          onClick={() => setSelectedElement(null)}
        >
          {activeSlide.elements.map((el) => (
            <CanvasElement
              key={el.id}
              element={el}
              slideId={activeSlide.id}
              isSelected={el.id === selectedElementId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
