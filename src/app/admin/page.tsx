"use client"

import * as React from "react"
import { INITIAL_METRICS, INITIAL_CUSTOMERS, Customer } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { CustomerTable } from "@/components/dashboard/customer-table"
import { CustomerModal, CustomerFormValues } from "@/components/dashboard/customer-modal"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Plus,
  Sparkles,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  CreditCard,
  BarChart3,
  Users,
  Settings,
  CheckCircle2,
  Lock,
  Globe,
  BellRing,
} from "lucide-react"

export default function AdminDashboardPage() {
  const [activeItem, setActiveItem] = React.useState("dashboard");
  const [metrics] = React.useState(INITIAL_METRICS);
  const [customers, setCustomers] = React.useState<Customer[]>(INITIAL_CUSTOMERS);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [customerToEdit, setCustomerToEdit] = React.useState<Customer | null>(null);

  // Opening modal for creation
  const handleOpenCreateModal = () => {
    setCustomerToEdit(null);
    setModalOpen(true);
  };

  // Opening modal for editing
  const handleOpenEditModal = (customer: Customer) => {
    setCustomerToEdit(customer);
    setModalOpen(true);
  };

  // Deleting customer
  const handleDeleteCustomer = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Saving customer (Create or Update)
  const handleSaveCustomer = (values: CustomerFormValues, id?: string) => {
    if (id) {
      // Update
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...values } : c))
      );
    } else {
      // Create
      const newCustomer: Customer = {
        id: `CUST-00${customers.length + 1}`,
        ...values,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }
  };

  // Export report handler
  const handleExportReport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(customers, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `reporte_slate_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <DashboardLayout
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      onOpenNewModal={handleOpenCreateModal}
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {activeItem === "dashboard" && "Panel de Control Administrador"}
              {activeItem === "customers" && "Gestión de Clientes & Cuentas"}
              {activeItem === "billing" && "Facturación & Ingresos Recurrentes"}
              {activeItem === "analytics" && "Analíticas & Métricas del Negocio"}
              {activeItem === "settings" && "Configuración del Sistema Slate"}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Activity className="size-3 animate-pulse" /> Online
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {activeItem === "dashboard" && "Resumen global de KPIs, rendimiento en tiempo real y directorio activo de clientes."}
            {activeItem === "customers" && "Administra cuentas de clientes, estados de suscripción, asignación de planes y accesos."}
            {activeItem === "billing" && "Supervisión de ingresos recurrentes (MRR), pasarelas de pago y proyecciones financieras."}
            {activeItem === "analytics" && "Comportamiento de usuarios, retención de clientes y métricas de conversión de planes."}
            {activeItem === "settings" && "Ajustes globales de la organización, claves de API, webhooks y políticas de seguridad."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            className="gap-1.5 text-xs sm:text-sm bg-card hover:bg-muted"
          >
            <Download className="size-4" />
            <span>Exportar Reporte</span>
          </Button>

          <Button
            onClick={handleOpenCreateModal}
            size="sm"
            className="gap-1.5 text-xs sm:text-sm shadow-xs"
          >
            <Plus className="size-4" />
            <span>Nuevo Registro</span>
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Métricas Clave del Mes
          </h2>
          <span className="text-xs text-muted-foreground">Actualizado hace 3 minutos</span>
        </div>
        <KPICards metrics={metrics} />
      </section>

      {/* ─── CONDITIONAL SECTION RENDERING BASED ON SIDEBAR SELECTION ─── */}
      {activeItem === "dashboard" && (
        <>
          {/* Quick Insights & Security Status Banners */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Banner 1: Activity Overview */}
            <Card className="lg:col-span-2 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    <h3 className="font-semibold text-base text-foreground">
                      Optimización de Cuentas Enterprise
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Tus suscripciones Enterprise crecieron un <strong className="text-foreground">+14.2%</strong> esta semana. Las solicitudes de soporte bajaron un 18%.
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setActiveItem("billing")} className="shrink-0 gap-1 text-xs">
                  Ver Facturación <ArrowUpRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>

            {/* Banner 2: Security & Health Status */}
            <Card className="bg-card border-border/60">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-5" />
                    <span className="font-semibold text-sm">Seguridad 100% OK</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Certificados SSL activos y respaldos diarios.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-foreground">99.98%</span>
                  <p className="text-[10px] text-muted-foreground">Uptime Servidores</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Section: Interactive Customer Table */}
          <section className="space-y-4 pt-2">
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xs">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Directorio de Clientes y Cuentas
                  </CardTitle>
                  <CardDescription>
                    Lista completa de clientes registrados, planes asignados y estado de facturación.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <CustomerTable
                  customers={customers}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteCustomer}
                  onAddNew={handleOpenCreateModal}
                />
              </CardContent>
            </Card>
          </section>
        </>
      )}

      {activeItem === "customers" && (
        <section className="space-y-4">
          <Card className="border border-border/60 bg-card">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
              <div>
                <CardTitle className="text-lg">Gestión Avanzada de Clientes</CardTitle>
                <CardDescription>
                  Visualiza, edita o agrega nuevas organizaciones y asigna roles de administración o cliente.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <CustomerTable
                customers={customers}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteCustomer}
                onAddNew={handleOpenCreateModal}
              />
            </CardContent>
          </Card>
        </section>
      )}

      {activeItem === "billing" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 space-y-2">
              <span className="text-xs text-muted-foreground font-medium uppercase">Ingresos MRR</span>
              <p className="text-2xl font-bold text-foreground">$128,450.00</p>
              <Badge variant="success" className="text-[10px]">+14.2% vs mes pasado</Badge>
            </Card>
            <Card className="p-5 space-y-2">
              <span className="text-xs text-muted-foreground font-medium uppercase">Facturas Pendientes</span>
              <p className="text-2xl font-bold text-foreground">3 Cuentas</p>
              <Badge variant="warning" className="text-[10px]">$4,190 por cobrar</Badge>
            </Card>
            <Card className="p-5 space-y-2">
              <span className="text-xs text-muted-foreground font-medium uppercase">Valor Promedio (ARPU)</span>
              <p className="text-2xl font-bold text-foreground">$820.00</p>
              <Badge variant="info" className="text-[10px]">Crecimiento sostenido</Badge>
            </Card>
          </div>

          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Distribución por Tipo de Plan</CardTitle>
              <CardDescription>Detalle de cuota de mercado en la base de clientes actual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Planes Enterprise ($10k+ /mes)</span>
                  <span className="font-bold">62% ($79,639)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "62%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Planes Pro ($499 /mes)</span>
                  <span className="font-bold">28% ($35,966)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "28%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Planes Starter ($99 /mes)</span>
                  <span className="font-bold">10% ($12,845)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {activeItem === "analytics" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="size-4 text-primary" />
                  Rendimiento y Tráfico Global
                </CardTitle>
                <CardDescription>Peticiones procesadas por la infraestructura.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xs font-medium">Llamadas API Totales</span>
                  <span className="text-sm font-bold font-mono">14,290,400</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xs font-medium">Latencia Promedio</span>
                  <span className="text-sm font-bold text-emerald-500 font-mono">38ms</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xs font-medium">Tasa de Error 5xx</span>
                  <span className="text-sm font-bold text-emerald-500 font-mono">0.002%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Salud de Retención
                </CardTitle>
                <CardDescription>Métricas de lealtad y satisfacción del cliente.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xs font-medium">Net Promoter Score (NPS)</span>
                  <span className="text-sm font-bold text-indigo-500 font-mono">+74 (Excelente)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xs font-medium">Churn Rate Mensual</span>
                  <span className="text-sm font-bold text-emerald-500 font-mono">0.8%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xs font-medium">Soporte Primera Respuesta</span>
                  <span className="text-sm font-bold font-mono">4.2 minutos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {activeItem === "settings" && (
        <section className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="size-4 text-primary" />
                Configuración General de la Organización
              </CardTitle>
              <CardDescription>Datos principales de la instancia de Slate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Nombre de la Organización</label>
                  <input
                    type="text"
                    defaultValue="Slate HQ Inc."
                    className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Dominio Principal</label>
                  <input
                    type="text"
                    defaultValue="slate.io"
                    className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => alert("Configuración guardada.")}>
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Modal Dialog for Create/Edit */}
      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customerToEdit={customerToEdit}
        onSave={handleSaveCustomer}
      />
    </DashboardLayout>
  );
}
