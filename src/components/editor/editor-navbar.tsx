"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Undo2,
  Redo2,
  Play,
  Download,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  ArrowLeft,
  FileJson,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { AspectRatio } from "@/types/presentation";

const ASPECT_RATIOS: { label: string; value: AspectRatio; icon: React.ReactNode }[] = [
  { label: "16:9", value: "16:9", icon: <Monitor className="size-3.5" /> },
  { label: "4:3", value: "4:3", icon: <Tablet className="size-3.5" /> },
  { label: "9:16", value: "9:16", icon: <Smartphone className="size-3.5" /> },
];

export function EditorNavbar() {
  const currentDeck = usePresentationStore((s) => s.currentDeck);
  const updateDeckTitle = usePresentationStore((s) => s.updateDeckTitle);
  const setPresenting = usePresentationStore((s) => s.setPresenting);
  const setAspectRatio = usePresentationStore((s) => s.setAspectRatio);
  const aspectRatio = usePresentationStore((s) => s.aspectRatio);
  const undo = usePresentationStore((s) => s.undo);
  const redo = usePresentationStore((s) => s.redo);
  const historyIndex = usePresentationStore((s) => s.historyIndex);
  const historyLength = usePresentationStore((s) => s.history.length);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDeck?.title ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentDeck?.title) setTitleValue(currentDeck.title);
  }, [currentDeck?.title]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const handleTitleSubmit = () => {
    if (titleValue.trim()) {
      updateDeckTitle(titleValue.trim());
    } else {
      setTitleValue(currentDeck?.title ?? "Sin título");
    }
    setIsEditingTitle(false);
  };

  const handleExportJSON = () => {
    if (!currentDeck) return;
    const blob = new Blob([JSON.stringify(currentDeck, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentDeck.title.toLowerCase().replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex h-12 items-center justify-between border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl px-3 shrink-0">
      {/* Left: Back + Logo + Title */}
      <div className="flex items-center gap-2 min-w-0">
        <Tooltip>
          <Link href="/">
            <TooltipTrigger className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors">
              <ArrowLeft className="size-4" />
            </TooltipTrigger>
          </Link>
          <TooltipContent side="bottom" className="text-xs">
            Volver al Dashboard
          </TooltipContent>
        </Tooltip>

        <div className="size-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
          <Layers className="size-3.5 text-violet-400" />
        </div>

        {isEditingTitle ? (
          <input
            ref={inputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSubmit();
              if (e.key === "Escape") {
                setTitleValue(currentDeck?.title ?? "");
                setIsEditingTitle(false);
              }
            }}
            className="bg-transparent border-b border-violet-500/40 text-sm font-semibold text-zinc-100 outline-none px-1 py-0.5 min-w-[120px] max-w-[300px]"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-sm font-semibold text-zinc-200 hover:text-white truncate max-w-[250px] transition-colors"
          >
            {currentDeck?.title ?? "Sin título"}
          </button>
        )}
      </div>

      {/* Center: Undo/Redo + Aspect Ratio */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            onClick={undo}
            disabled={historyIndex <= 0}
            className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Deshacer (Ctrl+Z)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            onClick={redo}
            disabled={historyIndex >= historyLength - 1}
            className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Rehacer (Ctrl+Y)
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-1 bg-white/[0.06]" />

        {/* Aspect Ratio Picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors">
              {ASPECT_RATIOS.find((r) => r.value === aspectRatio)?.icon}
              <span>{aspectRatio}</span>
              <ChevronDown className="size-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-white/[0.08]">
            {ASPECT_RATIOS.map((r) => (
              <DropdownMenuItem
                key={r.value}
                onClick={() => setAspectRatio(r.value)}
                className="gap-2 text-xs"
              >
                {r.icon}
                {r.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Present + Export */}
      <div className="flex items-center gap-2">
        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg text-xs border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] h-8"
            >
              <Download className="size-3.5" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-white/[0.08]">
            <DropdownMenuItem onClick={handleExportJSON} className="gap-2 text-xs">
              <FileJson className="size-3.5" />
              JSON
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-2 text-xs">
              <FileText className="size-3.5" />
              PDF (próximamente)
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-2 text-xs">
              <ImageIcon className="size-3.5" />
              PPTX (próximamente)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Present */}
        <Button
          onClick={() => setPresenting(true)}
          size="sm"
          className="gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-500/20 h-8 text-xs"
        >
          <Play className="size-3.5" />
          Presentar
        </Button>
      </div>
    </header>
  );
}
