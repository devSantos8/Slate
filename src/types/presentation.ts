export type FontFamily =
  | "Inter"
  | "Playfair Display"
  | "Space Grotesk"
  | "Syne"
  | "JetBrains Mono";

export type ElementType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "stat"
  | "quote"
  | "image"
  | "badge"
  | "shape";

export type FontWeight = "300" | "400" | "600" | "800" | "900";
export type TextAlign = "left" | "center" | "right";
export type AnimationType = "fade-in" | "slide-up" | "scale-up" | "cinematic-reveal";
export type BackgroundType = "solid" | "gradient" | "image" | "mesh-glow";
export type SlideLayout = "freeform" | "split-hero" | "editorial-grid" | "stat-focus";
export type AspectRatio = "16:9" | "4:3" | "9:16";

export interface ElementStyle {
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
  gradientText?: string;
  textAlign: TextAlign;
  letterSpacing: number;
  lineHeight: number;
  opacity: number;
  rotation: number;
  x: number;
  y: number;
  zIndex: number;
}

export interface SlideElement {
  id: string;
  type: ElementType;
  content: string;
  style: ElementStyle;
  animation?: AnimationType;
}

export interface SlideBackground {
  type: BackgroundType;
  value: string;
  blur?: number;
  overlayOpacity?: number;
}

export interface Slide {
  id: string;
  layout: SlideLayout;
  background: SlideBackground;
  elements: SlideElement[];
}

export interface PresentationDeck {
  id: string;
  title: string;
  theme: string;
  slides: Slide[];
  aspectRatio: AspectRatio;
  createdAt: string;
  updatedAt: string;
}

// Default element style factory
export function createDefaultStyle(overrides?: Partial<ElementStyle>): ElementStyle {
  return {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "400",
    color: "#ffffff",
    textAlign: "left",
    letterSpacing: 0,
    lineHeight: 1.5,
    opacity: 1,
    rotation: 0,
    x: 0,
    y: 0,
    zIndex: 1,
    ...overrides,
  };
}
