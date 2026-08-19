"use client"

import * as React from "react"
import Link from "next/link"
import {
  Layers,
  Sparkles,
  CreditCard,
  Key,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  User,
  LogOut,
  Copy,
  Check,
  HelpCircle,
  BarChart2,
  FileText,
  LifeBuoy,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

export default function UserPortalPage() {
  const { user, logout, switchRole } = useAuth();
  const [copiedKey, setCopiedKey] = React.useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText("slate_key_demo_99482018a7b649c2");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Layers className="size-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-foreground">Slate Portal</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-muted-foreground">
              Portal de Cliente • Nexus Labs
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchRole("admin")}
            className="text-xs gap-1.5 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium"
          >
            <ShieldCheck className="size-3.5" />
            <span className="hidden sm:inline">Modo Cliente •</span> Cambiar a Admin
          </Button>

          <ThemeToggle />

          <div className="h-4 w-px bg-border mx-1" />

          {/* User Profile Info */}
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={user?.avatar} alt={user?.name || "Usuario"} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                CM
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight">{user?.name || "Carlos Mendoza"}</span>
              <span className="text-[10px] text-muted-foreground">{user?.email || "carlos@nexuslabs.co"}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="size-8 text-muted-foreground hover:text-destructive"
              title="Cerrar Sesión"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner de Bienvenida del Cliente */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-background p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> Plan Pro Activo
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Bienvenido de nuevo, {user?.name || "Carlos Mendoza"} 👋
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aquí puedes monitorear el consumo de tu API, descargar tus facturas mensuales y gestionar los miembros de tu equipo en <strong className="text-foreground">Nexus Labs</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button size="sm" className="gap-1.5 shadow-xs">
                <CreditCard className="size-4" />
                <span>Mejorar a Enterprise</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 bg-card">
                <LifeBuoy className="size-4" />
                <span>Solicitar Soporte</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Consumo & Métricas de Servicio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Consumo API */}
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Consumo de API Mensual
                </CardTitle>
                <Activity className="size-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground">74,250</span>
                <span className="text-xs text-muted-foreground">de 100,000 llamadas</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[74%] transition-all" />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>74% utilizado</span>
                <span>Renueva el 01 de Septiembre</span>
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Almacenamiento */}
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Almacenamiento Cloud
                </CardTitle>
                <BarChart2 className="size-4 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground">14.2 GB</span>
                <span className="text-xs text-muted-foreground">de 50 GB incluidos</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[28.4%]" />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>28.4% utilizado</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Capacidad OK</span>
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Claves de API & Seguridad */}
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Clave de API Producción
                </CardTitle>
                <Key className="size-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg border border-border/50 font-mono text-xs">
                <span className="truncate max-w-[200px]">slate_key_demo_99482018a7b649c2</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyKey}
                  className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  {copiedKey ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Último acceso: Hace 12 minutos desde 190.45.120.4
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tablas de Facturación & Historial de Pagos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Facturas */}
          <Card className="lg:col-span-2 border-border/60 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4 text-primary" /> Historial de Facturación
                </CardTitle>
                <CardDescription>
                  Descarga tus facturas en PDF y revisa el historial de pagos de tu cuenta.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <Download className="size-3.5" /> Descargar Todo
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Factura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs font-semibold">INV-2024-008</TableCell>
                    <TableCell className="text-xs">01 Ago 2024</TableCell>
                    <TableCell className="font-semibold text-xs">$4,800.00 USD</TableCell>
                    <TableCell>
                      <Badge variant="success">Pagado</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <Download className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs font-semibold">INV-2024-007</TableCell>
                    <TableCell className="text-xs">01 Jul 2024</TableCell>
                    <TableCell className="font-semibold text-xs">$4,800.00 USD</TableCell>
                    <TableCell>
                      <Badge variant="success">Pagado</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <Download className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs font-semibold">INV-2024-006</TableCell>
                    <TableCell className="text-xs">01 Jun 2024</TableCell>
                    <TableCell className="font-semibold text-xs">$3,200.00 USD</TableCell>
                    <TableCell>
                      <Badge variant="success">Pagado</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <Download className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Método de Pago Activo */}
          <Card className="border-border/60 bg-card/80">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="size-4 text-indigo-500" /> Método de Pago
              </CardTitle>
              <CardDescription>Tarjeta asociada a la facturación recurrente.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="rounded-xl border border-border/60 bg-gradient-to-tr from-slate-900 to-indigo-900 p-4 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Visa Corporate</span>
                  <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white">Principal</span>
                </div>
                <div className="font-mono text-lg font-bold tracking-widest pt-2">
                  •••• •••• •••• 4242
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span>EXP: 12/28</span>
                  <span>CARLOS MENDOZA</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs bg-card">
                Cambiar Tarjeta de Crédito
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        Slate SaaS Portal v2.0 • Diseñado para Nexus Labs • Soporte 24/7 disponible
      </footer>
    </div>
  );
}
