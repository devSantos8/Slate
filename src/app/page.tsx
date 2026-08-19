"use client"

import * as React from "react"
import { INITIAL_METRICS, INITIAL_CUSTOMERS, Customer } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { CustomerTable } from "@/components/dashboard/customer-table"
import { CustomerModal, CustomerFormValues } from "@/components/dashboard/customer-modal"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Plus, Sparkles, Activity, ShieldCheck, ArrowUpRight, TrendingUp } from "lucide-react"

export default function DashboardPage() {
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
    downloadAnchor.setAttribute("download", `reporte_clientes_${new Date().toISOString().split("T")[0]}.json`);
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Panel de Control
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Activity className="size-3 animate-pulse" /> Sistema En Línea
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen general de métricas, rendimiento y lista activa de clientes de la plataforma.
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
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Métricas Clave del Mes
        </h2>
        <KPICards metrics={metrics} />
      </section>

      {/* Grid for Quick Stats & Insights Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner 1: Activity Overview */}
        <Card className="lg:col-span-2 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <h3 className="font-semibold text-base text-foreground">
                  Optimización de Conversión de Cuentas Pro
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tus suscripciones Enterprise crecieron un <strong className="text-foreground">+14.2%</strong> esta semana. Te recomendamos configurar notificaciones automatizadas.
              </p>
            </div>
            <Button size="sm" variant="secondary" className="shrink-0 gap-1 text-xs">
              Ver Análisis <ArrowUpRight className="size-3.5" />
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
                Copias de seguridad al día y SSL activo.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-foreground">99.9%</span>
              <p className="text-[10px] text-muted-foreground">Uptime API</p>
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
                Gestión de Clientes y Cuentas
              </CardTitle>
              <CardDescription>
                Lista detallada de clientes activos, estado de sus planes y facturación recurrente (MRR).
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
