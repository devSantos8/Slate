"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { usePresentationStore } from "@/store/usePresentationStore";
import { SAMPLE_DECKS } from "@/lib/initial-decks";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { SlideNavigator } from "@/components/editor/slide-navigator";
import { SlideCanvas } from "@/components/editor/slide-canvas";
import { PropertyInspector } from "@/components/editor/property-inspector";
import { PresentationMode } from "@/components/editor/presentation-mode";

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const setDeck = usePresentationStore((s) => s.setDeck);
  const currentDeck = usePresentationStore((s) => s.currentDeck);
  const isPresenting = usePresentationStore((s) => s.isPresenting);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // If we already have a deck loaded with matching id, use it
    if (currentDeck?.id === params.id) return;

    // Try to load from localStorage (deck list)
    try {
      const savedDecks = localStorage.getItem("slate_decks");
      if (savedDecks) {
        const decks = JSON.parse(savedDecks);
        const found = decks.find((d: { id: string }) => d.id === params.id);
        if (found) {
          setDeck(found);
          return;
        }
      }
    } catch {}

    // Try the single active deck
    try {
      const savedActive = localStorage.getItem("slate_active_deck");
      if (savedActive) {
        const deck = JSON.parse(savedActive);
        if (deck.id === params.id) {
          setDeck(deck);
          return;
        }
      }
    } catch {}

    // Fallback to sample
    const sample = SAMPLE_DECKS.find((d) => d.id === params.id) ?? SAMPLE_DECKS[0];
    setDeck(sample);
  }, [params.id, currentDeck?.id, setDeck]);

  if (!currentDeck) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="size-5 rounded-full border-2 border-violet-500/40 border-t-violet-500 animate-spin" />
          <span className="text-sm">Cargando estudio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Top navbar */}
      <EditorNavbar />

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Slide navigator */}
        <SlideNavigator />

        {/* Center: Canvas */}
        <SlideCanvas />

        {/* Right: Property inspector */}
        <PropertyInspector />
      </div>

      {/* Presentation mode overlay */}
      {isPresenting && <PresentationMode />}
    </div>
  );
}
