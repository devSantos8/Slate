"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePresentationStore } from "@/store/usePresentationStore";
import { SAMPLE_DECKS } from "@/lib/initial-decks";

export default function EditorRootPage() {
  const router = useRouter();
  const currentDeck = usePresentationStore((s) => s.currentDeck);
  const setDeck = usePresentationStore((s) => s.setDeck);

  useEffect(() => {
    if (currentDeck) {
      router.replace(`/editor/${currentDeck.id}`);
      return;
    }

    // Try localStorage
    try {
      const savedActive = localStorage.getItem("slate_active_deck");
      if (savedActive) {
        const deck = JSON.parse(savedActive);
        setDeck(deck);
        router.replace(`/editor/${deck.id}`);
        return;
      }
    } catch {}

    // Fallback to sample
    setDeck(SAMPLE_DECKS[0]);
    router.replace(`/editor/${SAMPLE_DECKS[0].id}`);
  }, [currentDeck, router, setDeck]);

  return (
    <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
      <div className="flex items-center gap-3 text-zinc-500">
        <div className="size-5 rounded-full border-2 border-violet-500/40 border-t-violet-500 animate-spin" />
        <span className="text-sm">Abriendo editor de presentaciones...</span>
      </div>
    </div>
  );
}
