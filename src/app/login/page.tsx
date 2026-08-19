"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Layers, ShieldCheck, Sparkles, ArrowRight, Lock, Mail, UserCheck, ShieldAlert } from "lucide-react"
import { useAuth, UserRole } from "@/context/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("admin");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@slate.io",
      password: "password123",
      rememberMe: true,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data.email, selectedRole);
  };

  const handleQuickDemo = (role: UserRole) => {
    if (role === "admin") {
      setValue("email", "admin@slate.io");
      setValue("password", "admin123");
      setSelectedRole("admin");
      login("admin@slate.io", "admin");
    } else {
      setValue("email", "carlos@nexuslabs.co");
      setValue("password", "user123");
      setSelectedRole("user");
      login("carlos@nexuslabs.co", "user");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Top right theme toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Branding Hero Section */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-primary text-white overflow-hidden">
        {/* Abstract Background Effects */}
        <div className="absolute -left-20 -top-20 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 size-96 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <Layers className="size-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white">Slate SaaS</span>
            <span className="block text-xs text-white/70">Gestión Inteligente & Portal de Cliente</span>
          </div>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15">
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Versión 2.0 Lanzada</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Control total para Administradores y experiencia premium para Clientes.
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Accede a paneles en tiempo real, seguimiento de métricas, consumo de API y facturación en una plataforma unificada.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2.5 rounded-lg bg-white/5 p-3 backdrop-blur-xs border border-white/10">
              <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">Seguridad ISO 27001</p>
                <p className="text-white/60">Encriptación de extremo a extremo</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg bg-white/5 p-3 backdrop-blur-xs border border-white/10">
              <UserCheck className="size-5 text-indigo-300 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">Roles Granulares</p>
                <p className="text-white/60">Vistas de Admin y Usuario</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative z-10 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/15">
          <p className="text-xs italic text-white/90 leading-relaxed">
            "Slate transformó la forma en que gestionamos nuestros clientes y la facturación recurrente. El portal de cliente es impecable."
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold">Carlos Mendoza • CEO en Nexus Labs</span>
          </div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Header Mobile / Brand Title */}
          <div className="text-center sm:text-left space-y-2">
            <div className="lg:hidden flex items-center justify-center sm:justify-start gap-2.5 mb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Layers className="size-5" />
              </div>
              <span className="font-bold text-xl">Slate SaaS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Iniciar Sesión
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          {/* Quick Demo Selector Tabs */}
          <Card className="border-border/60 bg-card/60 shadow-xs">
            <CardContent className="p-3">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-2 text-center">
                Demo Rápida - Elige tu Rol
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === "admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedRole("admin");
                    setValue("email", "admin@slate.io");
                  }}
                  className="text-xs gap-1.5 h-9"
                >
                  <ShieldAlert className="size-3.5" />
                  <span>Modo Admin</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "user" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedRole("user");
                    setValue("email", "carlos@nexuslabs.co");
                  }}
                  className="text-xs gap-1.5 h-9"
                >
                  <UserCheck className="size-3.5" />
                  <span>Modo Cliente</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  className="pl-9 h-10 text-sm"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-10 text-sm"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary size-4"
                  {...register("rememberMe")}
                />
                <span className="text-muted-foreground">Recordar esta sesión</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 gap-2 font-semibold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <span>Acceder como {selectedRole === "admin" ? "Administrador" : "Cliente"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Social Logins */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold">
                O continuar con
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickDemo("admin")}
              className="h-10 text-xs gap-2"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickDemo("user")}
              className="h-10 text-xs gap-2"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">
            ¿No tienes una cuenta aún?{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Regístrate gratis
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
