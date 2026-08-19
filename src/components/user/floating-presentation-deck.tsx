"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PresentationDeck } from "@/types/presentation";
import { SAMPLE_DECKS } from "@/lib/initial-decks";
import { useRouter } from "next/navigation";
import { usePresentationStore } from "@/store/usePresentationStore";
import { PresentationMode } from "@/components/editor/presentation-mode";
import {
  Play,
  Edit3,
  Share2,
  Sparkles,
  Layers,
  Star,
  Plus,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FloatingPresentationDeckProps {
  onOpenCreateModal?: () => void;
}

export function FloatingPresentationDeck({ onOpenCreateModal }: FloatingPresentationDeckProps) {
  const router = useRouter();
  const setDeck = usePresentationStore((s) => s.setDeck);
  const setPresenting = usePresentationStore((s) => s.setPresenting);
  const isPresenting = usePresentationStore((s) => s.isPresenting);

  const [decks] = React.useState<PresentationDeck[]>(SAMPLE_DECKS);
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>(["deck-001"]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEdit = (deck: PresentationDeck, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeck(deck);
    router.push(`/editor/${deck.id}`);
  };

  const handlePlay = (deck: PresentationDeck) => {
    setDeck(deck);
    setPresenting(true);
  };

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/editor/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Layers className="size-5 text-indigo-400" /> Presentaciones Flotantes
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selecciona una presentación interactiva para proyectarla en pantalla completa o editar sus elementos.
          </p>
        </div>

        {onOpenCreateModal && (
          <Button
            onClick={onOpenCreateModal}
            size="sm"
            className="gap-1.5 shadow-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            <Plus className="size-4" /> Nueva Presentación
          </Button>
        )}
      </div>

      {/* Presentation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {decks.map((deck, idx) => {
            const firstSlide = deck.slides[0];
            const isFav = favoriteIds.includes(deck.id);

            return (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-card/90 to-card/40 p-5 shadow-xl backdrop-blur-md hover:border-indigo-500/40 hover:shadow-indigo-500/10 transition-all flex flex-col justify-between"
              >
                {/* Floating Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Top Badge & Favorite Star */}
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                    {deck.theme}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => toggleFavorite(deck.id, e)}
                    className="size-7 text-muted-foreground hover:text-amber-400"
                  >
                    <Star className={`size-4 ${isFav ? "text-amber-400 fill-amber-400" : ""}`} />
                  </Button>
                </div>

                {/* Slide Preview Box */}
                <div
                  onClick={() => handlePlay(deck)}
                  className="relative z-10 w-full aspect-[16/9] rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-white/10 p-5 flex flex-col justify-between text-white cursor-pointer shadow-lg overflow-hidden group/canvas transition-transform duration-300 hover:scale-[1.01]"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-indigo-300 tracking-wider">
                      {firstSlide?.layout || "Diapositiva Inicial"}
                    </span>
                    <h4 className="text-base font-bold tracking-tight text-white line-clamp-2">
                      {firstSlide?.elements[0]?.content || deck.title}
                    </h4>
                  </div>

                  <p className="text-xs text-white/70 line-clamp-2">
                    {firstSlide?.elements[1]?.content || deck.title}
                  </p>

                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover/canvas:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xl transform scale-90 group-hover/canvas:scale-100 transition-transform">
                      <Play className="size-4 fill-current" /> Presentar
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Actions Bar */}
                <div className="relative z-10 flex items-center justify-between gap-2 pt-4 mt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    onClick={() => handlePlay(deck)}
                    className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Presentar</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(deck, e)}
                      className="gap-1.5 text-xs border-white/10 hover:bg-white/5"
                    >
                      <Edit3 className="size-3.5" />
                      <span>Editar</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleShare(deck.id, e)}
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === deck.id ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Share2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Presentation Mode Overlay when active */}
      {isPresenting && <PresentationMode />}
    </div>
  );
}
