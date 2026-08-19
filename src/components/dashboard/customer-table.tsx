"use client"

import * as React from "react"
import { Search, Filter, MoreHorizontal, Edit2, Trash2, UserPlus, RefreshCw } from "lucide-react"
import { Customer } from "@/lib/mock-data"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onAddNew,
}: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredCustomers = React.useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || cust.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const getStatusBadge = (status: Customer["status"]) => {
    switch (status) {
      case "Active":
        return <Badge variant="success">Activo</Badge>;
      case "Pending":
        return <Badge variant="warning">Pendiente</Badge>;
      case "Paused":
        return <Badge variant="info">Pausado</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: Customer["plan"]) => {
    switch (plan) {
      case "Enterprise":
        return <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">Enterprise</Badge>;
      case "Pro":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Pro</Badge>;
      default:
        return <Badge variant="secondary">Starter</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: Search, Filters & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por nombre, empresa o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs sm:text-sm bg-card"
            />
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 text-xs sm:text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="pending">Pendientes</option>
              <option value="paused">Pausados</option>
              <option value="cancelled">Cancelados</option>
            </Select>
          </div>

          {(searchTerm || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="h-9 px-2 text-xs text-muted-foreground"
              title="Restablecer filtros"
            >
              <RefreshCw className="size-3.5 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <Button onClick={onAddNew} size="sm" className="h-9 gap-1.5 shadow-xs">
          <UserPlus className="size-4" />
          <span>Agregar Registro</span>
        </Button>
      </div>

      {/* Table Container */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente / Empresa</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Ingreso (MRR)</TableHead>
            <TableHead>Fecha Ingreso</TableHead>
            <TableHead className="w-[60px] text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Filter className="size-8 text-muted-foreground/50" />
                  <p className="font-medium text-sm">No se encontraron clientes que coincidan</p>
                  <p className="text-xs">Prueba ajustando el término de búsqueda o filtro de estado.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                {/* Cliente */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-sm leading-tight">
                        {customer.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {customer.company} • {customer.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Plan */}
                <TableCell>{getPlanBadge(customer.plan)}</TableCell>

                {/* Estado */}
                <TableCell>{getStatusBadge(customer.status)}</TableCell>

                {/* MRR */}
                <TableCell className="text-right font-semibold text-foreground">
                  ${customer.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </TableCell>

                {/* Fecha */}
                <TableCell className="text-xs text-muted-foreground">
                  {customer.joinedDate}
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-md hover:bg-accent">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="right" className="w-40">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(customer)} className="gap-2">
                        <Edit2 className="size-3.5 text-primary" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(customer.id)}
                        className="gap-2 text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Table Footer Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Mostrando <strong className="text-foreground">{filteredCustomers.length}</strong> de{" "}
          <strong className="text-foreground">{customers.length}</strong> registros
        </span>
        <span className="hidden sm:inline">Sistema de Gestión de Clientes • Slate Next.js App Router</span>
      </div>
    </div>
  );
}
