"use client"

import * as React from "react"
import { Bell, Search, Menu, Plus, User, Settings, LogOut, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/layout/sidebar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  collapsed: boolean;
  onOpenNewModal: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export function Header({
  collapsed,
  onOpenNewModal,
  activeItem,
  setActiveItem,
}: HeaderProps) {
  const { user, logout, switchRole } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <header
      className={`sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-6 backdrop-blur-md transition-all duration-300 ${
        collapsed ? "md:pl-22" : "md:pl-68"
      }`}
    >
      {/* Left side: Mobile drawer trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden size-9 rounded-lg"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>

        {/* Mobile Drawer Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SidebarContent
            collapsed={false}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            onNavigate={() => setMobileOpen(false)}
          />
        </Sheet>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes, facturas o proyectos... (Ctrl+K)"
            className="w-full pl-9 pr-12 bg-muted/30 hover:bg-muted/50 focus:bg-background rounded-lg text-sm border-border/60 transition-colors"
          />
          <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right side: Quick Action, Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => switchRole("user")}
          className="hidden sm:inline-flex text-xs gap-1.5 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium"
          title="Ver cómo lo ve un cliente"
        >
          <UserCheck className="size-3.5" />
          <span>Ver Portal Cliente</span>
        </Button>

        {/* Create New Button */}
        <Button
          onClick={onOpenNewModal}
          size="sm"
          className="hidden md:inline-flex gap-1.5 rounded-lg shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm"
        >
          <Plus className="size-4" />
          <span>Nuevo Cliente</span>
        </Button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative size-9 rounded-lg transition-colors hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            <span className="sr-only">Notificaciones</span>
          </Button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-border/60 bg-popover p-3 text-popover-foreground shadow-xl animate-in fade-in-80 zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-semibold">Notificaciones</span>
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  3 Nuevas
                </span>
              </div>
              <div className="flex flex-col gap-2 pt-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Pago de TechCorp completado</p>
                    <p className="text-[10px] text-muted-foreground">Hace 10 minutos • $12,500.00 USD</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                  <User className="size-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Nuevo registro: Nexus Labs</p>
                    <p className="text-[10px] text-muted-foreground">Hace 1 hora</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-9 rounded-full p-0 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
              <Avatar className="size-9">
                <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt={user?.name || "Usuario"} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "JM"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="right" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{user?.name || "Joain Monroy"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@slate.io"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => switchRole("user")} className="gap-2">
              <UserCheck className="size-4 text-primary" />
              <span>Ver Portal Cliente</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="size-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:bg-destructive/10">
              <LogOut className="size-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
