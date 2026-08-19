"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Presentation,
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  Zap,
  Check,
  Star,
  ArrowRight,
  Copy,
  Download,
  CheckCircle2,
  Clock,
  Plus,
  Play,
  Share2,
  Wand2,
  LayoutTemplate,
  Trash2,
  MoreHorizontal,
  Pencil,
  X,
  RotateCcw,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SAMPLE_DECKS } from "@/lib/initial-decks"
import { usePresentationStore } from "@/store/usePresentationStore"
import { type PresentationDeck, createDefaultStyle } from "@/types/presentation"

export default function UserPortalPage() {
  const { user, logout, switchRole } = useAuth();
  const router = useRouter();
  const setDeck = usePresentationStore((s) => s.setDeck);
  const setPresenting = usePresentationStore((s) => s.setPresenting);

  // Decks state (empty initially or loaded from localStorage)
  const [decks, setDecks] = React.useState<PresentationDeck[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("slate_decks");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return []; // Empty by default so the user sees the empty state illustration requested!
  });

  // Create presentation modal
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [createTab, setCreateTab] = React.useState<"templates" | "ai">("templates");
  const [newTitle, setNewTitle] = React.useState("");
  const [newTheme, setNewTheme] = React.useState<"dark-velvet" | "cyberpunk" | "minimal" | "sunset">("dark-velvet");
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Modern Alert / Notification Toast state
  const [toastMessage, setToastMessage] = React.useState<{ title: string; desc?: string; type?: "success" | "info" } | null>(null);

  const showToast = (title: string, desc?: string, type: "success" | "info" = "success") => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save decks to localStorage
  const saveDecks = (updated: PresentationDeck[]) => {
    setDecks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("slate_decks", JSON.stringify(updated));
    }
  };

  // Action: Open in Canvas Editor
  const handleEditDeck = (deck: PresentationDeck) => {
    setDeck(deck);
    if (typeof window !== "undefined") {
      localStorage.setItem("slate_active_deck", JSON.stringify(deck));
    }
    showToast("Abriendo editor...", `Cargando "${deck.title}" en el lienzo`, "info");
    setTimeout(() => {
      router.push(`/editor/${deck.id}`);
    }, 400);
  };

  // Action: Start Presentation Mode
  const handlePlayDeck = (deck: PresentationDeck) => {
    setDeck(deck);
    setPresenting(true);
    router.push(`/editor/${deck.id}`);
  };

  // Action: Duplicate Deck
  const handleDuplicateDeck = (deck: PresentationDeck) => {
    const clone: PresentationDeck = {
      ...deck,
      id: `deck-${Date.now()}`,
      title: `${deck.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [clone, ...decks];
    saveDecks(updated);
    showToast("¡Presentación duplicada!", `Se creó una copia de "${deck.title}"`);
  };

  // Action: Delete Deck
  const handleDeleteDeck = (id: string) => {
    const target = decks.find((d) => d.id === id);
    const updated = decks.filter((d) => d.id !== id);
    saveDecks(updated);
    showToast("Presentación eliminada", `Se removió "${target?.title || "la presentación"}"`, "info");
  };

  // Action: Share Deck Link
  const handleShareDeck = (deck: PresentationDeck) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/editor/${deck.id}`);
      showToast("¡Enlace copiado!", "El enlace para compartir tu presentación está en tu portapapeles.");
    }
  };

  // Action: Load Sample Decks (Convenience)
  const handleLoadSampleDecks = () => {
    saveDecks(SAMPLE_DECKS);
    showToast("Plantillas cargadas", "Se cargaron presentaciones de ejemplo con éxito");
  };

  // Action: Create Deck from Template or AI
  const handleCreateFromTemplate = (templateType: string) => {
    let title = newTitle.trim() || "Nueva Presentación";
    let bgGradient = "linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #09090b 100%)";
    let themeValue = newTheme;

    if (templateType === "pitch") {
      title = newTitle.trim() || "Pitch Deck para Inversores 2026";
      bgGradient = "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #09090b 100%)";
    } else if (templateType === "product") {
      title = newTitle.trim() || "Lanzamiento de Producto & Keynote";
      bgGradient = "linear-gradient(135deg, #18181b 0%, #2e1065 50%, #09090b 100%)";
    } else if (templateType === "minimal") {
      title = newTitle.trim() || "Portafolio Editorial Minimalista";
      bgGradient = "linear-gradient(135deg, #18181b 0%, #27272a 100%)";
    }

    const newDeck: PresentationDeck = {
      id: `deck-${Date.now()}`,
      title,
      theme: themeValue,
      aspectRatio: "16:9",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: [
        {
          id: `s-${Date.now()}-1`,
          layout: "freeform",
          background: { type: "gradient", value: bgGradient },
          elements: [
            {
              id: `el-1`,
              type: "badge",
              content: "SLATE OPEN SOURCE",
              style: createDefaultStyle({
                y: -100,
                fontSize: 12,
                fontFamily: "Inter",
                fontWeight: "600",
                color: "#a78bfa",
                textAlign: "center",
                letterSpacing: 3,
              }),
              animation: "fade-in",
            },
            {
              id: `el-2`,
              type: "heading",
              content: title,
              style: createDefaultStyle({
                y: -20,
                fontSize: 56,
                fontFamily: "Inter",
                fontWeight: "800",
                color: "#ffffff",
                textAlign: "center",
                letterSpacing: -1,
              }),
              animation: "cinematic-reveal",
            },
            {
              id: `el-3`,
              type: "subheading",
              content: "Diseñada con tipografía editorial y animaciones fluidas",
              style: createDefaultStyle({
                y: 55,
                fontSize: 20,
                fontFamily: "Inter",
                fontWeight: "400",
                color: "#94a3b8",
                textAlign: "center",
              }),
              animation: "slide-up",
            },
          ],
        },
      ],
    };

    const updated = [newDeck, ...decks];
    saveDecks(updated);
    setCreateModalOpen(false);
    setNewTitle("");
    showToast("¡Presentación creada!", `"${newDeck.title}" ha sido agregada a tus proyectos`);
    handleEditDeck(newDeck);
  };

  // Action: AI Generation Mock
  const handleGenerateWithAi = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      handleCreateFromTemplate("pitch");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col selection:bg-primary/20 transition-colors duration-300">
      
      {/* ───── MODERN TOAST ALERT FLOATING NOTIFICATION ───── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 right-6 z-50 flex items-start gap-3 rounded-2xl bg-card border border-border p-4 shadow-2xl backdrop-blur-xl max-w-sm"
          >
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div className="space-y-0.5 flex-1 pr-2">
              <h4 className="text-sm font-semibold text-foreground">{toastMessage.title}</h4>
              {toastMessage.desc && (
                <p className="text-xs text-muted-foreground">{toastMessage.desc}</p>
              )}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-lg"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── MINIMALIST TOP NAVBAR ───── */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-8 backdrop-blur-md">
        
        {/* Left: Clean Minimal Typography Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-extrabold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Slate
            </span>
            <span className="size-1.5 rounded-full bg-primary" />
          </button>

          {/* Open Source GitHub Badge */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-muted/60 hover:bg-muted border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
          >
            <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Open Source</span>
            <span className="text-[10px] text-amber-500 font-semibold">★ Star</span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchRole("admin")}
            className="text-xs gap-1.5 border-border bg-card hover:bg-muted font-medium rounded-xl"
          >
            <ShieldCheck className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Modo Creador •</span> Cambiar a Admin
          </Button>

          <div className="p-1 rounded-xl bg-card border border-border">
            <ThemeToggle />
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* User Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1 rounded-full hover:bg-muted">
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} alt={user?.name || "Usuario"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "CM"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold leading-tight">{user?.name || "Carlos Mendoza"}</span>
                  <span className="text-[10px] text-muted-foreground">Creador Open Source</span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="right" className="w-56 rounded-2xl">
              <div className="p-2">
                <p className="text-sm font-semibold text-foreground">{user?.name || "Carlos Mendoza"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "carlos@nexuslabs.co"}</p>
                <Badge variant="outline" className="mt-1.5 text-[10px] rounded-md">
                  Acceso Gratuito & Ilimitado
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchRole("admin")} className="gap-2 cursor-pointer">
                <ShieldCheck className="size-4 text-primary" />
                <span>Panel Administrador</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="size-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ───── MAIN CONTENT ───── */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Welcome & Create Button Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Hola, {user?.name ? user.name.split(" ")[0] : "Carlos"} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Estudio abierto para crear, diseñar y presentar pitch decks y diapositivas hiperestéticas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {decks.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSampleDecks}
                className="gap-1.5 text-xs rounded-xl border-border bg-card"
              >
                <RotateCcw className="size-3.5" />
                <span>Cargar Ejemplos</span>
              </Button>
            )}

            <Button
              onClick={() => setCreateModalOpen(true)}
              size="sm"
              className="gap-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-md active:scale-95 transition-transform"
            >
              <Plus className="size-4" />
              <span>Crear Presentación</span>
            </Button>
          </div>
        </div>

        {/* Summary Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 rounded-2xl border-border bg-card/60 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Presentaciones Creadas</span>
              <Presentation className="size-4 text-primary" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-foreground">{decks.length}</span>
              <span className="text-xs text-muted-foreground"> Decks activos</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
              <CheckCircle2 className="size-3.5" />
              <span>Almacenamiento Ilimitado</span>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl border-border bg-card/60 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Modo Presentador</span>
              <Play className="size-4 text-indigo-500" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-foreground">4K Ultra HD</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Animaciones Cinematográficas</span>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl border-border bg-card/60 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Generación con IA</span>
              <Wand2 className="size-4 text-primary" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-foreground">100% Libre</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
              <Zap className="size-3.5" />
              <span>Sin límites ni restricciones</span>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl border-border bg-card/60 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Editor de Diapositivas</span>
              <LayoutTemplate className="size-4 text-primary" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-foreground">Lienzo Libre</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>Tipografía editorial & animaciones</span>
            </div>
          </Card>
        </div>

        {/* ───── SECCIÓN: MIS PRESENTACIONES ───── */}
        <section className="space-y-4 pt-2">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Mis Presentaciones</span>
              {decks.length > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  {decks.length}
                </span>
              )}
            </h2>
          </div>

          {decks.length === 0 ? (
            /* ───── ESTADO VACÍO (CON LA ILUSTRACIÓN DE CARPETA Y BOTÓN CON BORDE DISCONTINUO) ───── */
            <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-6 rounded-[2.5rem] border border-border/80 bg-card/40 backdrop-blur-sm p-8">
              
              {/* Cute Folder SVG Illustration */}
              <div className="relative size-44 sm:size-52 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 160"
                  className="w-full h-full drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Back Papers */}
                  <rect x="35" y="10" width="130" height="90" rx="8" fill="currentColor" className="text-muted/40" />
                  <rect x="45" y="18" width="110" height="4" rx="2" fill="currentColor" className="text-muted-foreground/30" />
                  <rect x="45" y="28" width="80" height="4" rx="2" fill="currentColor" className="text-muted-foreground/30" />
                  <rect x="45" y="38" width="95" height="4" rx="2" fill="currentColor" className="text-muted-foreground/30" />

                  {/* Folder Body */}
                  <path
                    d="M20 40C20 33.3726 25.3726 28 32 28H75C78.7101 28 82.2036 29.7214 84.4565 32.6652L90.5435 40.3348C92.7964 43.2786 96.2899 45 100 45H168C174.627 45 180 50.3726 180 57V132C180 138.627 174.627 144 168 144H32C25.3726 144 20 138.627 20 132V40Z"
                    fill="currentColor"
                    className="text-card stroke-border"
                    strokeWidth="2"
                  />

                  {/* Cute Face: Eyes and Flat Mouth */}
                  <circle cx="85" cy="92" r="3.5" fill="currentColor" className="text-muted-foreground" />
                  <circle cx="115" cy="92" r="3.5" fill="currentColor" className="text-muted-foreground" />
                  <line x1="95" y1="102" x2="105" y2="102" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-muted-foreground" />
                </svg>
              </div>

              {/* Subtitle Message */}
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-foreground">
                  Oops.. No hay presentaciones creadas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sé el primero en crear una presentación hiperestética o pitch deck profesional.
                </p>
              </div>

              {/* Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="rounded-full px-6 py-2.5 h-auto text-xs font-semibold gap-1.5 border border-dashed border-border bg-card hover:bg-muted text-foreground transition-all shadow-xs active:scale-95"
                >
                  <Plus className="size-4" />
                  <span>Crear mi primera presentación</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadSampleDecks}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Cargar Plantillas de Ejemplo</span>
                </Button>
              </div>
            </div>
          ) : (
            /* ───── GRID DE PRESENTACIONES ───── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {decks.map((deck) => {
                const firstSlide = deck.slides[0];
                const bgStyle =
                  firstSlide?.background.type === "gradient"
                    ? { background: firstSlide.background.value }
                    : { backgroundColor: firstSlide?.background.value || "#09090b" };

                return (
                  <motion.div
                    key={deck.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="rounded-[2rem] border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all group flex flex-col justify-between h-full">
                      
                      {/* Slide Mini-Preview Banner */}
                      <div
                        onClick={() => handleEditDeck(deck)}
                        style={bgStyle}
                        className="aspect-video w-full p-4 flex flex-col justify-between relative cursor-pointer overflow-hidden border-b border-border/40"
                      >
                        <div className="flex items-center justify-between z-10">
                          <span className="rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white/90 border border-white/10 uppercase tracking-wider">
                            {deck.theme.replace(/-/g, " ")}
                          </span>
                          <span className="rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px] text-white/80 border border-white/10 font-mono">
                            {deck.slides.length} {deck.slides.length === 1 ? "slide" : "slides"}
                          </span>
                        </div>

                        <div className="text-center my-auto z-10 px-2">
                          <p className="font-extrabold text-white text-base leading-tight drop-shadow-md line-clamp-2">
                            {deck.title}
                          </p>
                        </div>

                        {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs z-20">
                          <Pencil className="size-4 text-primary" />
                          <span>Abrir en Editor</span>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                            {deck.title}
                          </CardTitle>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 rounded-xl">
                              <DropdownMenuItem onClick={() => handleEditDeck(deck)} className="gap-2 cursor-pointer text-xs">
                                <Pencil className="size-3.5" />
                                <span>Editar Diapositivas</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateDeck(deck)} className="gap-2 cursor-pointer text-xs">
                                <Copy className="size-3.5" />
                                <span>Duplicar Deck</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShareDeck(deck)} className="gap-2 cursor-pointer text-xs">
                                <Share2 className="size-3.5" />
                                <span>Copiar Enlace</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteDeck(deck.id)} className="gap-2 text-destructive focus:text-destructive cursor-pointer text-xs">
                                <Trash2 className="size-3.5" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <CardDescription className="text-xs line-clamp-1">
                          Última edición {deck.updatedAt ? new Date(deck.updatedAt).toLocaleDateString() : "Recientemente"}
                        </CardDescription>
                      </CardHeader>

                      {/* Card Footer Actions */}
                      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-border/40">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePlayDeck(deck)}
                          className="gap-1.5 text-xs font-semibold rounded-xl"
                        >
                          <Play className="size-3 text-primary" />
                          <span>Presentar</span>
                        </Button>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareDeck(deck)}
                            className="size-8 p-0 rounded-xl text-muted-foreground hover:text-foreground"
                            title="Compartir enlace"
                          >
                            <Share2 className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditDeck(deck)}
                            className="gap-1.5 text-xs font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90"
                          >
                            <Pencil className="size-3" />
                            <span>Editar</span>
                          </Button>
                        </div>
                      </CardFooter>

                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ───── MODAL DE CREACIÓN DE PRESENTACIÓN ───── */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Presentation className="size-5 text-primary" />
              <span>Crear Nueva Presentación</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Elige una plantilla de autor o genera tus diapositivas con Inteligencia Artificial.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={createTab} onValueChange={(v) => setCreateTab(v as any)} className="mt-4 space-y-4">
            <TabsList className="grid grid-cols-2 h-10 rounded-xl">
              <TabsTrigger value="templates" className="text-xs font-semibold gap-1.5 rounded-lg">
                <LayoutTemplate className="size-3.5" />
                <span>Plantillas de Autor</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs font-semibold gap-1.5 rounded-lg">
                <Wand2 className="size-3.5 text-primary" />
                <span>Generar con IA</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB: PLANTILLAS */}
            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="deck-title" className="text-xs font-medium">Título de la Presentación</Label>
                <Input
                  id="deck-title"
                  placeholder="Ej: Pitch Deck Serie A 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { id: "pitch", title: "Pitch Deck Startups", desc: "Para rondas de inversión", gradient: "from-slate-900 to-indigo-950" },
                  { id: "product", title: "Keynote de Producto", desc: "Lanzamientos visuales", gradient: "from-zinc-900 to-purple-950" },
                  { id: "minimal", title: "Editorial Minimal", desc: "Tipografía limpia y sobria", gradient: "from-zinc-900 to-zinc-950" },
                  { id: "blank", title: "Lienzo en Blanco", desc: "Empieza desde cero", gradient: "from-neutral-900 to-slate-900" },
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleCreateFromTemplate(tmpl.id)}
                    className="p-3.5 rounded-2xl border border-border bg-gradient-to-br hover:border-primary/50 text-left space-y-1.5 transition-all group active:scale-[0.98]"
                  >
                    <div className={`h-12 w-full rounded-xl bg-gradient-to-tr ${tmpl.gradient} border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white transition-colors`}>
                      <Presentation className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{tmpl.title}</p>
                      <p className="text-[10px] text-muted-foreground">{tmpl.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* TAB: GENERADOR IA */}
            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ai-prompt" className="text-xs font-medium">Prompt o Idea de la Presentación</Label>
                <textarea
                  id="ai-prompt"
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe el tema... ej: 'Pitch deck de 5 diapositivas para una startup open source de IA con métricas de tracción y roadmap 2026'"
                  className="w-full rounded-xl border border-border bg-card p-3 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <Button
                onClick={handleGenerateWithAi}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="size-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                    <span>Generando diapositivas con IA...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4 text-primary" />
                    <span>Generar Diapositivas con IA</span>
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

    </div>
  );
}
