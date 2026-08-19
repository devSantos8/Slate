"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Customer } from "@/lib/mock-data"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const customerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  company: z.string().min(2, "La empresa es requerida"),
  plan: z.enum(["Enterprise", "Pro", "Starter"]),
  status: z.enum(["Active", "Pending", "Paused", "Cancelled"]),
  revenue: z.coerce.number().min(0, "El ingreso debe ser un número positivo"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerToEdit?: Customer | null;
  onSave: (values: CustomerFormValues, id?: string) => void;
}

export function CustomerModal({
  open,
  onOpenChange,
  customerToEdit,
  onSave,
}: CustomerModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      plan: "Pro",
      status: "Active",
      revenue: 1000,
    },
  });

  React.useEffect(() => {
    if (customerToEdit) {
      reset({
        name: customerToEdit.name,
        email: customerToEdit.email,
        company: customerToEdit.company,
        plan: customerToEdit.plan,
        status: customerToEdit.status,
        revenue: customerToEdit.revenue,
      });
    } else {
      reset({
        name: "",
        email: "",
        company: "",
        plan: "Pro",
        status: "Active",
        revenue: 1000,
      });
    }
  }, [customerToEdit, reset, open]);

  const onSubmit = (data: CustomerFormValues) => {
    onSave(data, customerToEdit?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>
          {customerToEdit ? "Editar Cliente" : "Nuevo Cliente / Proyecto"}
        </DialogTitle>
        <DialogDescription>
          {customerToEdit
            ? "Actualiza la información del cliente registrado en el sistema."
            : "Ingresa los datos requeridos para registrar un nuevo cliente o cuenta de SaaS."}
        </DialogDescription>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="grid gap-4">
          {/* Nombre */}
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              placeholder="Ej. Mateo Morales"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-1.5">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@empresa.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Empresa */}
          <div className="grid gap-1.5">
            <Label htmlFor="company">Empresa / Organización *</Label>
            <Input
              id="company"
              placeholder="Ej. CloudScale Inc"
              {...register("company")}
            />
            {errors.company && (
              <p className="text-xs text-destructive font-medium">{errors.company.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Plan */}
            <div className="grid gap-1.5">
              <Label htmlFor="plan">Plan</Label>
              <Select id="plan" {...register("plan")}>
                <option value="Enterprise">Enterprise</option>
                <option value="Pro">Pro</option>
                <option value="Starter">Starter</option>
              </Select>
            </div>

            {/* Estado */}
            <div className="grid gap-1.5">
              <Label htmlFor="status">Estado</Label>
              <Select id="status" {...register("status")}>
                <option value="Active">Activo</option>
                <option value="Pending">Pendiente</option>
                <option value="Paused">Pausado</option>
                <option value="Cancelled">Cancelado</option>
              </Select>
            </div>

            {/* Ingreso / MRR */}
            <div className="grid gap-1.5">
              <Label htmlFor="revenue">Ingreso ($ USD)</Label>
              <Input
                id="revenue"
                type="number"
                step="100"
                {...register("revenue")}
              />
              {errors.revenue && (
                <p className="text-xs text-destructive font-medium">{errors.revenue.message}</p>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {customerToEdit ? "Guardar Cambios" : "Crear Registro"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
