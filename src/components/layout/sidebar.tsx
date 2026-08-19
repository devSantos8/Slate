"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "customers", label: "Clientes & Proyectos", icon: Users, badge: "12" },
  { id: "billing", label: "Facturación", icon: CreditCard },
  { id: "analytics", label: "Analíticas", icon: BarChart3 },
  { id: "settings", label: "Ajustes", icon: Settings },
];

export function SidebarContent({
  collapsed,
  activeItem,
  setActiveItem,
  onNavigate,
}: {
  collapsed: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between py-4">
      <div className="flex flex-col gap-6">
        {/* Logo / Brand */}
        <div className={cn("flex items-center gap-3 px-4 transition-all duration-300", collapsed && "justify-center px-0")}>
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 shadow-md shadow-primary/25">
            <Layers className="size-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                Slate SaaS
                <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  v2.0
                </span>
              </span>
              <span className="text-xs text-muted-foreground">Plataforma de Gestión</span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="px-2">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase mb-2">
              Menú Principal
            </p>
          )}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                    if (onNavigate) onNavigate();
                  }}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none select-none",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  {/* Active Pill Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
                  )}
                  <Icon className={cn("size-4 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-primary")} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Banner & Support */}
      <div className="px-3 flex flex-col gap-3">
        {!collapsed && (
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-indigo-500/10 p-3.5 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="size-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Plan Pro Activo</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Tienes acceso completo a todas las métricas e integración con API.
            </p>
            <Button size="xs" className="w-full text-xs font-medium shadow-xs">
              Ver Detalles del Plan
            </Button>
          </div>
        )}
        <button
          onClick={() => {}}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <HelpCircle className="size-4 shrink-0" />
          {!collapsed && <span>Soporte y Ayuda</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, setCollapsed, activeItem, setActiveItem }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex fixed left-0 top-0 z-30 h-screen flex-col border-r border-border/60 bg-card transition-all duration-300 ease-in-out shadow-xs",
        collapsed ? "w-18" : "w-64"
      )}
    >
      <SidebarContent
        collapsed={collapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-40 size-6 rounded-full border border-border bg-background shadow-xs hover:bg-accent text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </Button>
    </aside>
  );
}
