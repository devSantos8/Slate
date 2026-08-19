"use client";

import { usePresentationStore } from "@/store/usePresentationStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Layers,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import type {
  FontFamily,
  FontWeight,
  TextAlign,
  ElementType,
  BackgroundType,
  AnimationType,
} from "@/types/presentation";

/* ────────────────────────────────────────────────────────── */
/*  Constants                                                 */
/* ────────────────────────────────────────────────────────── */

const FONT_FAMILIES: FontFamily[] = [
  "Inter",
  "Playfair Display",
  "Space Grotesk",
  "Syne",
  "JetBrains Mono",
];

const FONT_WEIGHTS: { label: string; value: FontWeight }[] = [
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Semi", value: "600" },
  { label: "Bold", value: "800" },
  { label: "Black", value: "900" },
];

const PRESET_COLORS = [
  "#ffffff",
  "#fafafa",
  "#a1a1aa",
  "#71717a",
  "#a78bfa",
  "#8b5cf6",
  "#6366f1",
  "#06b6d4",
  "#22d3ee",
  "#34d399",
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#ec4899",
];

const GRADIENT_PRESETS = [
  { label: "Violeta → Cyan", value: "linear-gradient(135deg, #a78bfa, #06b6d4)" },
  { label: "Dorado → Rosa", value: "linear-gradient(135deg, #fbbf24, #ec4899)" },
  { label: "Blanco puro", value: "" },
  { label: "Esmeralda → Azul", value: "linear-gradient(135deg, #34d399, #6366f1)" },
  { label: "Rosa → Violeta", value: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
  { label: "Cyan → Verde", value: "linear-gradient(135deg, #22d3ee, #34d399)" },
];

const BG_GRADIENT_PRESETS = [
  {
    label: "Dark Velvet",
    value: "linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #09090b 100%)",
  },
  {
    label: "Cyberpunk Neon",
    value: "linear-gradient(135deg, #09090b 0%, #831843 30%, #164e63 70%, #09090b 100%)",
  },
  {
    label: "Deep Space",
    value: "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.1) 0%, transparent 60%), #09090b",
  },
  {
    label: "Swiss White",
    value: "linear-gradient(180deg, #fafafa 0%, #e4e4e7 100%)",
  },
  {
    label: "Midnight",
    value: "linear-gradient(180deg, #09090b 0%, #18181b 100%)",
  },
  {
    label: "Warm Dark",
    value: "linear-gradient(160deg, #09090b 0%, #1c1917 50%, #0c0a09 100%)",
  },
];

const ANIMATION_OPTIONS: { label: string; value: AnimationType }[] = [
  { label: "Fade In", value: "fade-in" },
  { label: "Slide Up", value: "slide-up" },
  { label: "Scale Up", value: "scale-up" },
  { label: "Cinemático", value: "cinematic-reveal" },
];

const ELEMENT_TYPES: { label: string; value: ElementType; icon: React.ReactNode }[] = [
  { label: "Título", value: "heading", icon: <Type className="size-3.5" /> },
  { label: "Subtítulo", value: "subheading", icon: <Type className="size-3" /> },
  { label: "Párrafo", value: "paragraph", icon: <AlignLeft className="size-3.5" /> },
  { label: "Estadística", value: "stat", icon: <Sparkles className="size-3.5" /> },
  { label: "Cita", value: "quote", icon: <AlignCenter className="size-3.5" /> },
  { label: "Imagen", value: "image", icon: <ImageIcon className="size-3.5" /> },
];

/* ────────────────────────────────────────────────────────── */
/*  Section Header                                            */
/* ────────────────────────────────────────────────────────── */

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-zinc-500">{icon}</span>
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Property Inspector                                        */
/* ────────────────────────────────────────────────────────── */

export function PropertyInspector() {
  const selectedElement = usePresentationStore((s) => s.getSelectedElement());
  const activeSlide = usePresentationStore((s) => s.getActiveSlide());
  const selectedElementId = usePresentationStore((s) => s.selectedElementId);
  const updateElementStyle = usePresentationStore((s) => s.updateElementStyle);
  const updateSlideBackground = usePresentationStore((s) => s.updateSlideBackground);
  const deleteElement = usePresentationStore((s) => s.deleteElement);
  const addElement = usePresentationStore((s) => s.addElement);

  if (!activeSlide) return null;

  const slideId = activeSlide.id;

  // Element selected → show element inspector
  if (selectedElement && selectedElementId) {
    const { style } = selectedElement;

    const updateStyle = (updates: Record<string, unknown>) => {
      updateElementStyle(slideId, selectedElement.id, updates as Partial<typeof style>);
    };

    return (
      <div className="w-[260px] border-l border-white/[0.06] bg-zinc-950/50 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Inspector
          </span>
          <Tooltip>
            <TooltipTrigger
              onClick={() => deleteElement(slideId, selectedElement.id)}
              className="size-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="left" className="text-[10px]">
              Eliminar elemento
            </TooltipContent>
          </Tooltip>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {/* ─── Typography ─── */}
            {selectedElement.type !== "image" && selectedElement.type !== "shape" && (
              <>
                <div>
                  <SectionHeader title="Tipografía" icon={<Type className="size-3.5" />} />

                  {/* Font Family */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-600">Fuente</label>
                      <Select
                        value={style.fontFamily}
                        onValueChange={(v) => updateStyle({ fontFamily: v })}
                      >
                        <SelectTrigger className="h-8 text-xs bg-white/[0.04] border-white/[0.08]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/[0.08]">
                          {FONT_FAMILIES.map((f) => (
                            <SelectItem key={f} value={f} className="text-xs">
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-zinc-600">Tamaño</label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {style.fontSize}px
                        </span>
                      </div>
                      <Slider
                        value={[style.fontSize]}
                        onValueChange={(val: any) => {
                          const v = Array.isArray(val) ? val[0] : val;
                          updateStyle({ fontSize: v });
                        }}
                        min={12}
                        max={140}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Font Weight */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-600">Peso</label>
                      <div className="flex gap-1">
                        {FONT_WEIGHTS.map((w) => (
                          <button
                            key={w.value}
                            onClick={() => updateStyle({ fontWeight: w.value })}
                            className={`flex-1 rounded-md py-1 text-[9px] font-medium transition-colors ${
                              style.fontWeight === w.value
                                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                : "bg-white/[0.04] text-zinc-500 border border-white/[0.06] hover:text-zinc-300"
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Align */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-600">Alineación</label>
                      <div className="flex gap-1">
                        {(["left", "center", "right"] as TextAlign[]).map((align) => {
                          const Icon =
                            align === "left"
                              ? AlignLeft
                              : align === "center"
                                ? AlignCenter
                                : AlignRight;
                          return (
                            <button
                              key={align}
                              onClick={() => updateStyle({ textAlign: align })}
                              className={`flex-1 rounded-md py-1.5 flex items-center justify-center transition-colors ${
                                style.textAlign === align
                                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                  : "bg-white/[0.04] text-zinc-500 border border-white/[0.06] hover:text-zinc-300"
                              }`}
                            >
                              <Icon className="size-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Letter Spacing */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-zinc-600">Espaciado</label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {style.letterSpacing}px
                        </span>
                      </div>
                      <Slider
                        value={[style.letterSpacing]}
                        onValueChange={(val: any) => {
                          const v = Array.isArray(val) ? val[0] : val;
                          updateStyle({ letterSpacing: v });
                        }}
                        min={-2}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Line Height */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-zinc-600">Interlineado</label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {style.lineHeight.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[style.lineHeight]}
                        onValueChange={(val: any) => {
                          const v = Array.isArray(val) ? val[0] : val;
                          updateStyle({ lineHeight: v });
                        }}
                        min={0.8}
                        max={3}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/[0.06]" />

                {/* ─── Color & Gradient ─── */}
                <div>
                  <SectionHeader title="Color & Gradiente" icon={<Palette className="size-3.5" />} />

                  <div className="space-y-3">
                    {/* Color Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-600">Color del texto</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={style.color}
                          onChange={(e) => updateStyle({ color: e.target.value })}
                          className="size-8 rounded-lg border border-white/[0.08] cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={style.color}
                          onChange={(e) => updateStyle({ color: e.target.value })}
                          className="flex-1 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] px-2 text-xs text-zinc-300 font-mono outline-none focus:border-violet-500/40"
                        />
                      </div>
                    </div>

                    {/* Preset Colors */}
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => updateStyle({ color: c, gradientText: undefined })}
                          className={`size-5 rounded-md border transition-transform hover:scale-110 ${
                            style.color === c && !style.gradientText
                              ? "border-violet-500 ring-1 ring-violet-500/40"
                              : "border-white/[0.1]"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    {/* Gradient Text Presets */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-600">Degradado de texto</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {GRADIENT_PRESETS.map((g) => (
                          <button
                            key={g.label}
                            onClick={() =>
                              updateStyle({ gradientText: g.value || undefined })
                            }
                            className={`rounded-md h-7 text-[8px] font-semibold transition-all ${
                              style.gradientText === g.value
                                ? "ring-1 ring-violet-500/50"
                                : "hover:ring-1 hover:ring-white/20"
                            }`}
                            style={{
                              background: g.value || "#27272a",
                              color: g.value ? "transparent" : "#a1a1aa",
                              WebkitBackgroundClip: g.value ? "text" : undefined,
                              backgroundClip: g.value ? "text" : undefined,
                            }}
                          >
                            <span
                              style={{
                                background: g.value || undefined,
                                WebkitBackgroundClip: g.value ? "text" : undefined,
                                WebkitTextFillColor: g.value ? "transparent" : undefined,
                              }}
                            >
                              {g.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator className="bg-white/[0.06]" />

            {/* ─── Effects ─── */}
            <div>
              <SectionHeader title="Efectos de Capa" icon={<Layers className="size-3.5" />} />

              <div className="space-y-3">
                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-zinc-600">Opacidad</label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {Math.round(style.opacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[style.opacity]}
                    onValueChange={(val: any) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      updateStyle({ opacity: v });
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-zinc-600">Rotación</label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {style.rotation}°
                    </span>
                  </div>
                  <Slider
                    value={[style.rotation]}
                    onValueChange={(val: any) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      updateStyle({ rotation: v });
                    }}
                    min={-180}
                    max={180}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* ─── Animation ─── */}
            <div>
              <SectionHeader title="Animación" icon={<Sparkles className="size-3.5" />} />
              <Select
                value={selectedElement.animation ?? "fade-in"}
                onValueChange={(v) => {
                  // Animation is on the element
                }}
              >
                <SelectTrigger className="h-8 text-xs bg-white/[0.04] border-white/[0.08]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/[0.08]">
                  {ANIMATION_OPTIONS.map((a) => (
                    <SelectItem key={a.value} value={a.value} className="text-xs">
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // No element selected → show slide background controls + add element
  return (
    <div className="w-[260px] border-l border-white/[0.06] bg-zinc-950/50 flex flex-col shrink-0">
      <div className="px-4 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          Propiedades de Slide
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* ─── Add Elements ─── */}
          <div>
            <SectionHeader title="Agregar Elementos" icon={<Plus className="size-3.5" />} />
            <div className="grid grid-cols-2 gap-1.5">
              {ELEMENT_TYPES.map((et) => (
                <button
                  key={et.value}
                  onClick={() => addElement(slideId, et.value)}
                  className="flex items-center gap-2 rounded-lg glass-card glass-card-hover p-2.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {et.icon}
                  {et.label}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* ─── Background ─── */}
          <div>
            <SectionHeader title="Fondo de Slide" icon={<Palette className="size-3.5" />} />

            <div className="space-y-3">
              {/* Background Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-600">Tipo</label>
                <Select
                  value={activeSlide.background.type}
                  onValueChange={(v) =>
                    updateSlideBackground(slideId, { type: v as BackgroundType })
                  }
                >
                  <SelectTrigger className="h-8 text-xs bg-white/[0.04] border-white/[0.08]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/[0.08]">
                    <SelectItem value="solid" className="text-xs">Color Sólido</SelectItem>
                    <SelectItem value="gradient" className="text-xs">Gradiente</SelectItem>
                    <SelectItem value="mesh-glow" className="text-xs">Mesh Glow</SelectItem>
                    <SelectItem value="image" className="text-xs">Imagen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Solid color or image URL input */}
              {(activeSlide.background.type === "solid" || activeSlide.background.type === "image") && (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-600">
                    {activeSlide.background.type === "solid" ? "Color" : "URL de imagen"}
                  </label>
                  <div className="flex items-center gap-2">
                    {activeSlide.background.type === "solid" && (
                      <input
                        type="color"
                        value={activeSlide.background.value}
                        onChange={(e) =>
                          updateSlideBackground(slideId, { value: e.target.value })
                        }
                        className="size-8 rounded-lg border border-white/[0.08] cursor-pointer bg-transparent"
                      />
                    )}
                    <input
                      type="text"
                      value={activeSlide.background.value}
                      onChange={(e) =>
                        updateSlideBackground(slideId, { value: e.target.value })
                      }
                      className="flex-1 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] px-2 text-xs text-zinc-300 font-mono outline-none focus:border-violet-500/40"
                    />
                  </div>
                </div>
              )}

              {/* Gradient presets */}
              {(activeSlide.background.type === "gradient" || activeSlide.background.type === "mesh-glow") && (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-600">Gradientes Curados</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BG_GRADIENT_PRESETS.map((g) => (
                      <button
                        key={g.label}
                        onClick={() =>
                          updateSlideBackground(slideId, { value: g.value })
                        }
                        className={`rounded-lg h-12 text-[8px] font-semibold text-white/60 flex items-end p-1.5 transition-all ${
                          activeSlide.background.value === g.value
                            ? "ring-1 ring-violet-500/50"
                            : "hover:ring-1 hover:ring-white/20"
                        }`}
                        style={{ background: g.value }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Overlay Opacity */}
              {activeSlide.background.type === "image" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-zinc-600">Oscurecimiento</label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {Math.round((activeSlide.background.overlayOpacity ?? 0) * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[activeSlide.background.overlayOpacity ?? 0]}
                    onValueChange={(val: any) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      updateSlideBackground(slideId, { overlayOpacity: v });
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
