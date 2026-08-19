"use client";

import { create } from "zustand";
import {
  type PresentationDeck,
  type Slide,
  type SlideElement,
  type SlideBackground,
  type ElementStyle,
  type ElementType,
  type SlideLayout,
  type AspectRatio,
  createDefaultStyle,
} from "@/types/presentation";

/* ────────────────────────────────────────────────────────── */
/*  State shape                                               */
/* ────────────────────────────────────────────────────────── */

interface PresentationState {
  // Data
  currentDeck: PresentationDeck | null;
  activeSlideId: string | null;
  selectedElementId: string | null;
  aspectRatio: AspectRatio;
  isPresenting: boolean;
  zoom: number;

  // History (undo/redo)
  history: PresentationDeck[];
  historyIndex: number;

  // Computed
  getActiveSlide: () => Slide | null;
  getSelectedElement: () => SlideElement | null;

  // Deck
  setDeck: (deck: PresentationDeck) => void;
  updateDeckTitle: (title: string) => void;
  setAspectRatio: (ratio: AspectRatio) => void;

  // Slides
  setActiveSlide: (id: string) => void;
  addSlide: (layout: SlideLayout) => void;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  reorderSlides: (newOrder: string[]) => void;

  // Elements
  setSelectedElement: (id: string | null) => void;
  addElement: (slideId: string, type: ElementType) => void;
  deleteElement: (slideId: string, elementId: string) => void;
  updateElementStyle: (slideId: string, elementId: string, style: Partial<ElementStyle>) => void;
  updateElementContent: (slideId: string, elementId: string, content: string) => void;

  // Background
  updateSlideBackground: (slideId: string, bg: Partial<SlideBackground>) => void;

  // Presentation mode
  setPresenting: (val: boolean) => void;
  setZoom: (val: number) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

/* ────────────────────────────────────────────────────────── */
/*  Helpers                                                   */
/* ────────────────────────────────────────────────────────── */

const MAX_HISTORY = 50;

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultElementForType(type: ElementType): SlideElement {
  switch (type) {
    case "heading":
      return {
        id: uid(),
        type: "heading",
        content: "Título Principal",
        style: createDefaultStyle({ fontSize: 56, fontWeight: "800", textAlign: "center" }),
        animation: "cinematic-reveal",
      };
    case "subheading":
      return {
        id: uid(),
        type: "subheading",
        content: "Subtítulo Elegante",
        style: createDefaultStyle({ fontSize: 32, fontWeight: "400", color: "#a1a1aa" }),
        animation: "fade-in",
      };
    case "paragraph":
      return {
        id: uid(),
        type: "paragraph",
        content: "Escribe aquí el contenido principal de tu diapositiva. Haz clic para editar directamente.",
        style: createDefaultStyle({ fontSize: 20, fontWeight: "300", color: "#d4d4d8", lineHeight: 1.7 }),
        animation: "fade-in",
      };
    case "stat":
      return {
        id: uid(),
        type: "stat",
        content: "+98.4%",
        style: createDefaultStyle({
          fontSize: 72,
          fontWeight: "900",
          textAlign: "center",
          gradientText: "linear-gradient(135deg, #a78bfa, #06b6d4)",
        }),
        animation: "scale-up",
      };
    case "quote":
      return {
        id: uid(),
        type: "quote",
        content: '"El diseño no es solo cómo se ve, es cómo funciona." — Steve Jobs',
        style: createDefaultStyle({
          fontSize: 28,
          fontWeight: "300",
          fontFamily: "Playfair Display",
          textAlign: "center",
          color: "#e4e4e7",
        }),
        animation: "slide-up",
      };
    case "badge":
      return {
        id: uid(),
        type: "badge",
        content: "NUEVO",
        style: createDefaultStyle({ fontSize: 12, fontWeight: "600", color: "#a78bfa" }),
      };
    case "image":
      return {
        id: uid(),
        type: "image",
        content: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        style: createDefaultStyle({ opacity: 1 }),
      };
    case "shape":
      return {
        id: uid(),
        type: "shape",
        content: "rectangle",
        style: createDefaultStyle({ color: "#6366f1", opacity: 0.3 }),
      };
    default:
      return {
        id: uid(),
        type: "paragraph",
        content: "Nuevo elemento",
        style: createDefaultStyle({}),
      };
  }
}

/* ────────────────────────────────────────────────────────── */
/*  Store                                                     */
/* ────────────────────────────────────────────────────────── */

export const usePresentationStore = create<PresentationState>((set, get) => ({
  currentDeck: null,
  activeSlideId: null,
  selectedElementId: null,
  aspectRatio: "16:9",
  isPresenting: false,
  zoom: 1,
  history: [],
  historyIndex: -1,

  /* ── Computed ─────────────────────────────────────────── */

  getActiveSlide: () => {
    const { currentDeck, activeSlideId } = get();
    if (!currentDeck || !activeSlideId) return null;
    return currentDeck.slides.find((s) => s.id === activeSlideId) ?? null;
  },

  getSelectedElement: () => {
    const slide = get().getActiveSlide();
    const { selectedElementId } = get();
    if (!slide || !selectedElementId) return null;
    return slide.elements.find((e) => e.id === selectedElementId) ?? null;
  },

  /* ── Deck ────────────────────────────────────────────── */

  setDeck: (deck) => {
    set({
      currentDeck: deck,
      activeSlideId: deck.slides[0]?.id ?? null,
      selectedElementId: null,
      history: [structuredClone(deck)],
      historyIndex: 0,
    });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(deck));
    } catch {}
  },

  updateDeckTitle: (title) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const updated = { ...currentDeck, title, updatedAt: new Date().toISOString() };
    set({ currentDeck: updated });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  setAspectRatio: (ratio) => {
    const { currentDeck } = get();
    if (!currentDeck) return;
    const updated = { ...currentDeck, aspectRatio: ratio };
    set({ currentDeck: updated, aspectRatio: ratio });
  },

  /* ── Slides ──────────────────────────────────────────── */

  setActiveSlide: (id) => set({ activeSlideId: id, selectedElementId: null }),

  addSlide: (layout) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const newSlide: Slide = {
      id: uid(),
      layout,
      background: { type: "gradient", value: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #1e1b4b 100%)" },
      elements: [
        defaultElementForType("heading"),
        defaultElementForType("paragraph"),
      ],
    };
    const updated = {
      ...currentDeck,
      slides: [...currentDeck.slides, newSlide],
      updatedAt: new Date().toISOString(),
    };
    set({ currentDeck: updated, activeSlideId: newSlide.id });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  deleteSlide: (slideId) => {
    const { currentDeck, activeSlideId, pushHistory } = get();
    if (!currentDeck || currentDeck.slides.length <= 1) return;
    pushHistory();
    const newSlides = currentDeck.slides.filter((s) => s.id !== slideId);
    const newActiveId = activeSlideId === slideId ? newSlides[0].id : activeSlideId;
    const updated = { ...currentDeck, slides: newSlides, updatedAt: new Date().toISOString() };
    set({ currentDeck: updated, activeSlideId: newActiveId, selectedElementId: null });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  duplicateSlide: (slideId) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const source = currentDeck.slides.find((s) => s.id === slideId);
    if (!source) return;
    const newSlide: Slide = {
      ...structuredClone(source),
      id: uid(),
      elements: source.elements.map((el) => ({ ...structuredClone(el), id: uid() })),
    };
    const idx = currentDeck.slides.findIndex((s) => s.id === slideId);
    const newSlides = [...currentDeck.slides];
    newSlides.splice(idx + 1, 0, newSlide);
    const updated = { ...currentDeck, slides: newSlides, updatedAt: new Date().toISOString() };
    set({ currentDeck: updated, activeSlideId: newSlide.id });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  reorderSlides: (newOrder) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const slideMap = new Map(currentDeck.slides.map((s) => [s.id, s]));
    const reordered = newOrder.map((id) => slideMap.get(id)!).filter(Boolean);
    const updated = { ...currentDeck, slides: reordered };
    set({ currentDeck: updated });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  /* ── Elements ────────────────────────────────────────── */

  setSelectedElement: (id) => set({ selectedElementId: id }),

  addElement: (slideId, type) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const newEl = defaultElementForType(type);
    const updated = {
      ...currentDeck,
      slides: currentDeck.slides.map((s) =>
        s.id === slideId ? { ...s, elements: [...s.elements, newEl] } : s
      ),
    };
    set({ currentDeck: updated, selectedElementId: newEl.id });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  deleteElement: (slideId, elementId) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const updated = {
      ...currentDeck,
      slides: currentDeck.slides.map((s) =>
        s.id === slideId
          ? { ...s, elements: s.elements.filter((e) => e.id !== elementId) }
          : s
      ),
    };
    set({ currentDeck: updated, selectedElementId: null });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  updateElementStyle: (slideId, elementId, style) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const updated = {
      ...currentDeck,
      slides: currentDeck.slides.map((s) =>
        s.id === slideId
          ? {
              ...s,
              elements: s.elements.map((e) =>
                e.id === elementId ? { ...e, style: { ...e.style, ...style } } : e
              ),
            }
          : s
      ),
    };
    set({ currentDeck: updated });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  updateElementContent: (slideId, elementId, content) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const updated = {
      ...currentDeck,
      slides: currentDeck.slides.map((s) =>
        s.id === slideId
          ? {
              ...s,
              elements: s.elements.map((e) =>
                e.id === elementId ? { ...e, content } : e
              ),
            }
          : s
      ),
    };
    set({ currentDeck: updated });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  /* ── Background ──────────────────────────────────────── */

  updateSlideBackground: (slideId, bg) => {
    const { currentDeck, pushHistory } = get();
    if (!currentDeck) return;
    pushHistory();
    const updated = {
      ...currentDeck,
      slides: currentDeck.slides.map((s) =>
        s.id === slideId ? { ...s, background: { ...s.background, ...bg } } : s
      ),
    };
    set({ currentDeck: updated });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(updated));
    } catch {}
  },

  /* ── Presentation ────────────────────────────────────── */

  setPresenting: (val) => set({ isPresenting: val }),
  setZoom: (val) => set({ zoom: val }),

  /* ── History (undo/redo) ─────────────────────────────── */

  pushHistory: () => {
    const { currentDeck, history, historyIndex } = get();
    if (!currentDeck) return;
    const cloned = structuredClone(currentDeck);
    const trimmed = history.slice(0, historyIndex + 1);
    const next = [...trimmed, cloned].slice(-MAX_HISTORY);
    set({ history: next, historyIndex: next.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prevIndex = historyIndex - 1;
    const prevDeck = structuredClone(history[prevIndex]);
    set({
      currentDeck: prevDeck,
      historyIndex: prevIndex,
      activeSlideId: prevDeck.slides[0]?.id ?? null,
      selectedElementId: null,
    });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(prevDeck));
    } catch {}
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const nextDeck = structuredClone(history[nextIndex]);
    set({
      currentDeck: nextDeck,
      historyIndex: nextIndex,
      activeSlideId: nextDeck.slides[0]?.id ?? null,
      selectedElementId: null,
    });
    try {
      localStorage.setItem("slate_active_deck", JSON.stringify(nextDeck));
    } catch {}
  },
}));
