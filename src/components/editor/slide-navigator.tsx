"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Copy,
  Trash2,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { Slide, SlideLayout } from "@/types/presentation";

const LAYOUT_OPTIONS: { label: string; value: SlideLayout }[] = [
  { label: "Libre", value: "freeform" },
  { label: "Split Hero", value: "split-hero" },
  { label: "Editorial Grid", value: "editorial-grid" },
  { label: "Stat Focus", value: "stat-focus" },
];

function SlideThumb({
  slide,
  index,
  isActive,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
}) {
  const setActiveSlide = usePresentationStore((s) => s.setActiveSlide);
  const deleteSlide = usePresentationStore((s) => s.deleteSlide);
  const duplicateSlide = usePresentationStore((s) => s.duplicateSlide);
  const slidesCount = usePresentationStore((s) => s.currentDeck?.slides.length ?? 0);

  const bg = slide.background;
  const bgStyle =
    bg.type === "gradient" || bg.type === "mesh-glow"
      ? { background: bg.value }
      : bg.type === "solid"
        ? { backgroundColor: bg.value }
        : bg.type === "image"
          ? { backgroundImage: `url(${bg.value})`, backgroundSize: "cover" }
          : { backgroundColor: "#09090b" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group relative"
    >
      <button
        onClick={() => setActiveSlide(slide.id)}
        className={`w-full rounded-xl overflow-hidden border-2 transition-all ${
          isActive
            ? "border-violet-500/60 shadow-lg shadow-violet-500/10"
            : "border-transparent hover:border-white/[0.1]"
        }`}
      >
        {/* Slide number badge */}
        <div className="absolute top-1.5 left-1.5 z-10 size-5 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <span className="text-[9px] font-bold text-zinc-300">{index + 1}</span>
        </div>

        {/* Mini preview */}
        <div className="aspect-video w-full" style={bgStyle}>
          <div className="flex flex-col items-center justify-center h-full p-2 gap-0.5">
            {slide.elements.slice(0, 2).map((el) => (
              <p
                key={el.id}
                className="text-white/70 text-center leading-tight truncate w-full"
                style={{
                  fontSize: el.type === "heading" || el.type === "stat" ? "7px" : "5px",
                  fontWeight: el.type === "heading" || el.type === "stat" ? 700 : 400,
                }}
              >
                {el.content}
              </p>
            ))}
          </div>
        </div>
      </button>

      {/* Hover actions */}
      <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger
            onClick={(e) => {
              e.stopPropagation();
              duplicateSlide(slide.id);
            }}
            className="size-5 rounded bg-black/60 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <Copy className="size-2.5" />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-[10px]">
            Duplicar
          </TooltipContent>
        </Tooltip>

        {slidesCount > 1 && (
          <Tooltip>
            <TooltipTrigger
              onClick={(e) => {
                e.stopPropagation();
                deleteSlide(slide.id);
              }}
              className="size-5 rounded bg-black/60 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="size-2.5" />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-[10px]">
              Eliminar
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </motion.div>
  );
}

export function SlideNavigator() {
  const slides = usePresentationStore((s) => s.currentDeck?.slides ?? []);
  const activeSlideId = usePresentationStore((s) => s.activeSlideId);
  const addSlide = usePresentationStore((s) => s.addSlide);

  return (
    <div className="w-[180px] border-r border-white/[0.06] bg-zinc-950/50 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          Slides
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className="size-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 hover:bg-violet-500/20 transition-colors">
            <Plus className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-zinc-900 border-white/[0.08]">
            {LAYOUT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => addSlide(opt.value)}
                className="text-xs"
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Slide list */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {slides.map((slide, i) => (
              <SlideThumb
                key={slide.id}
                slide={slide}
                index={i}
                isActive={slide.id === activeSlideId}
              />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
