import { type PresentationDeck, createDefaultStyle } from "@/types/presentation";

export const SAMPLE_DECKS: PresentationDeck[] = [
  {
    id: "deck-001",
    title: "Slate — Pitch Deck 2026",
    theme: "dark-velvet",
    aspectRatio: "16:9",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-19T00:00:00Z",
    slides: [
      {
        id: "s1",
        layout: "freeform",
        background: {
          type: "gradient",
          value: "linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #09090b 100%)",
        },
        elements: [
          {
            id: "e1",
            type: "badge",
            content: "PRESENTACIÓN OFICIAL",
            style: createDefaultStyle({
              fontSize: 11,
              fontWeight: "600",
              color: "#a78bfa",
              textAlign: "center",
              letterSpacing: 4,
              y: -120,
            }),
            animation: "fade-in",
          },
          {
            id: "e2",
            type: "heading",
            content: "Slate Platform",
            style: createDefaultStyle({
              fontSize: 72,
              fontWeight: "900",
              textAlign: "center",
              gradientText: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #06b6d4 100%)",
              color: "#ffffff",
              y: -40,
            }),
            animation: "cinematic-reveal",
          },
          {
            id: "e3",
            type: "subheading",
            content: "Crea presentaciones que hipnotizan",
            style: createDefaultStyle({
              fontSize: 24,
              fontWeight: "300",
              color: "#a1a1aa",
              textAlign: "center",
              letterSpacing: 1,
              y: 30,
            }),
            animation: "slide-up",
          },
        ],
      },
      {
        id: "s2",
        layout: "split-hero",
        background: {
          type: "gradient",
          value: "linear-gradient(160deg, #09090b 0%, #18181b 40%, #0c0a09 100%)",
        },
        elements: [
          {
            id: "e4",
            type: "badge",
            content: "EL PROBLEMA",
            style: createDefaultStyle({
              fontSize: 11,
              fontWeight: "600",
              color: "#f87171",
              letterSpacing: 4,
            }),
          },
          {
            id: "e5",
            type: "heading",
            content: "Las herramientas actuales son genéricas",
            style: createDefaultStyle({
              fontSize: 44,
              fontWeight: "800",
              color: "#fafafa",
            }),
            animation: "cinematic-reveal",
          },
          {
            id: "e6",
            type: "paragraph",
            content: "PowerPoint, Canva y Google Slides producen presentaciones que se ven iguales. No hay control tipográfico real, ni animaciones cinemáticas, ni edición visual de alto nivel.",
            style: createDefaultStyle({
              fontSize: 18,
              fontWeight: "300",
              color: "#71717a",
              lineHeight: 1.8,
            }),
            animation: "fade-in",
          },
        ],
      },
      {
        id: "s3",
        layout: "stat-focus",
        background: {
          type: "mesh-glow",
          value: "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.1) 0%, transparent 60%), #09090b",
        },
        elements: [
          {
            id: "e7",
            type: "stat",
            content: "$2.4M",
            style: createDefaultStyle({
              fontSize: 96,
              fontWeight: "900",
              textAlign: "center",
              gradientText: "linear-gradient(135deg, #a78bfa, #06b6d4)",
              color: "#ffffff",
              y: -20,
            }),
            animation: "scale-up",
          },
          {
            id: "e8",
            type: "subheading",
            content: "ARR proyectado para Q4 2026",
            style: createDefaultStyle({
              fontSize: 20,
              fontWeight: "400",
              color: "#71717a",
              textAlign: "center",
              y: 50,
            }),
            animation: "fade-in",
          },
        ],
      },
      {
        id: "s4",
        layout: "editorial-grid",
        background: {
          type: "gradient",
          value: "linear-gradient(180deg, #09090b 0%, #1c1917 100%)",
        },
        elements: [
          {
            id: "e9",
            type: "heading",
            content: "Arquitectura Modular",
            style: createDefaultStyle({
              fontSize: 40,
              fontWeight: "800",
              color: "#fafafa",
            }),
            animation: "cinematic-reveal",
          },
          {
            id: "e10",
            type: "paragraph",
            content: "Next.js App Router · Zustand · Framer Motion · Tailwind CSS · shadcn/ui",
            style: createDefaultStyle({
              fontSize: 16,
              fontWeight: "400",
              fontFamily: "JetBrains Mono",
              color: "#6366f1",
              letterSpacing: 1,
            }),
            animation: "fade-in",
          },
          {
            id: "e11",
            type: "paragraph",
            content: "Cada componente del editor está diseñado como un módulo independiente que se conecta a un store global de Zustand con soporte para undo/redo, persistencia y sincronización en tiempo real.",
            style: createDefaultStyle({
              fontSize: 18,
              fontWeight: "300",
              color: "#a1a1aa",
              lineHeight: 1.8,
            }),
            animation: "slide-up",
          },
        ],
      },
    ],
  },
  {
    id: "deck-002",
    title: "Resultados Q3 — KPIs & Métricas",
    theme: "cyberpunk-neon",
    aspectRatio: "16:9",
    createdAt: "2026-07-15T00:00:00Z",
    updatedAt: "2026-08-18T00:00:00Z",
    slides: [
      {
        id: "s5",
        layout: "freeform",
        background: {
          type: "mesh-glow",
          value: "radial-gradient(ellipse at 20% 80%, rgba(236,72,153,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.1) 0%, transparent 50%), #09090b",
        },
        elements: [
          {
            id: "e12",
            type: "heading",
            content: "Resultados Q3 2026",
            style: createDefaultStyle({
              fontSize: 56,
              fontWeight: "900",
              textAlign: "center",
              gradientText: "linear-gradient(135deg, #ec4899, #22d3ee)",
              color: "#ffffff",
            }),
            animation: "cinematic-reveal",
          },
          {
            id: "e13",
            type: "subheading",
            content: "Métricas de rendimiento y crecimiento",
            style: createDefaultStyle({
              fontSize: 20,
              fontWeight: "300",
              color: "#71717a",
              textAlign: "center",
            }),
            animation: "fade-in",
          },
        ],
      },
    ],
  },
  {
    id: "deck-003",
    title: "Design System — Guía de Componentes",
    theme: "minimal-dark",
    aspectRatio: "16:9",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-08-17T00:00:00Z",
    slides: [
      {
        id: "s6",
        layout: "freeform",
        background: {
          type: "solid",
          value: "#09090b",
        },
        elements: [
          {
            id: "e14",
            type: "heading",
            content: "Design System",
            style: createDefaultStyle({
              fontSize: 64,
              fontWeight: "900",
              fontFamily: "Space Grotesk",
              color: "#fafafa",
              textAlign: "center",
            }),
            animation: "cinematic-reveal",
          },
          {
            id: "e15",
            type: "paragraph",
            content: "Tokens · Tipografía · Colores · Componentes · Spacing",
            style: createDefaultStyle({
              fontSize: 16,
              fontWeight: "400",
              fontFamily: "JetBrains Mono",
              color: "#6366f1",
              textAlign: "center",
              letterSpacing: 2,
            }),
            animation: "fade-in",
          },
        ],
      },
    ],
  },
];
