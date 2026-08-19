"use client"

import * as React from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { useAuth, UserRole } from "@/context/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  keepSignedIn: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  company: z.string().min(2, "El nombre de la empresa u organización es requerido"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  role: z.enum(["admin", "user"]),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isRegisterMode, setIsRegisterMode] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("admin");
  const [registerSuccess, setRegisterSuccess] = React.useState(false);

  // Formulario de Inicio de Sesión
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@slate.io",
      password: "password123",
      keepSignedIn: true,
    },
  });

  // Formulario de Registro
  const {
    register: registerSignup,
    handleSubmit: handleRegisterSubmit,
    setValue: setRegisterValue,
    watch: watchRegister,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      role: "admin",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedRegisterRole = watchRegister("role");

  const onLoginSubmit = (data: LoginFormValues) => {
    login(data.email, selectedRole);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    setRegisterSuccess(true);
    setTimeout(() => {
      login(data.email, data.role);
    }, 800);
  };

  const handleQuickDemo = (role: UserRole) => {
    if (role === "admin") {
      setLoginValue("email", "admin@slate.io");
      setLoginValue("password", "admin123");
      setSelectedRole("admin");
      login("admin@slate.io", "admin");
    } else {
      setLoginValue("email", "carlos@nexuslabs.co");
      setLoginValue("password", "user123");
      setSelectedRole("user");
      login("carlos@nexuslabs.co", "user");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col lg:flex-row antialiased selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">
      
      {/* ─── COLUMNA IZQUIERDA: FORMULARIO ─── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-2xl mx-auto w-full z-10">
        
        {/* Fila Superior: Selector de Tema */}
        <div className="flex items-center justify-end w-full mb-8 lg:mb-4">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-card border border-border shadow-xs">
            <ThemeToggle />
          </div>
        </div>

        {/* Contenedor Central del Formulario */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          
          {/* Títulos */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              {isRegisterMode ? "Crear Cuenta" : "Bienvenido"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isRegisterMode
                ? "Regístrate para comenzar a utilizar la plataforma"
                : "Accede a tu cuenta y continúa con nosotros"}
            </p>
          </div>

          {/* Acceso Rápido Demo */}
          <div className="rounded-2xl border border-border bg-card/60 p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                <Sparkles className="size-3.5" />
                Acceso Rápido Demo (1 Clic)
              </span>
              <span>Elige rol</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted/80 p-2 text-xs font-medium text-foreground transition-all active:scale-[0.98]"
              >
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Administrador</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("user")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted/80 p-2 text-xs font-medium text-foreground transition-all active:scale-[0.98]"
              >
                <UserCheck className="size-3.5 text-indigo-500" />
                <span>Usuario / Cliente</span>
              </button>
            </div>
          </div>

          {!isRegisterMode ? (
            /* ───── FORMULARIO DE INICIO DE SESIÓN ───── */
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              
              {/* Correo Electrónico */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  className="w-full rounded-xl bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  {...registerLogin("email")}
                />
                {loginErrors.email && (
                  <p className="text-xs text-destructive">{loginErrors.email.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    className="w-full rounded-xl bg-card border border-border px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                    {...registerLogin("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-xs text-destructive">{loginErrors.password.message}</p>
                )}
              </div>

              {/* Mantener sesión iniciada y Recuperar contraseña */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 accent-primary cursor-pointer"
                    {...registerLogin("keepSignedIn")}
                  />
                  <span className="text-xs text-muted-foreground">Mantener sesión iniciada</span>
                </label>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Por favor utiliza los botones de Acceso Rápido Demo para ingresar.");
                  }}
                  className="text-xs text-primary hover:underline transition-colors font-medium"
                >
                  Recuperar contraseña
                </a>
              </div>

              {/* Botón Principal Iniciar Sesión */}
              <button
                type="submit"
                disabled={isLoginSubmitting}
                className="w-full rounded-xl bg-foreground hover:bg-foreground/90 text-background font-semibold py-3 text-sm transition-all duration-200 shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                Iniciar Sesión
              </button>

              {/* Separador */}
              <div className="relative flex items-center justify-center py-2">
                <div className="w-full border-t border-border" />
                <span className="absolute bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  O continuar con
                </span>
              </div>

              {/* Botón Google */}
              <button
                type="button"
                onClick={() => handleQuickDemo("user")}
                className="w-full rounded-xl bg-card hover:bg-muted border border-border py-3 text-sm text-foreground font-medium transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer shadow-xs"
              >
                {/* Google SVG Logo */}
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>
            </form>
          ) : (
            /* ───── FORMULARIO DE REGISTRO ───── */
            <div className="space-y-4">
              {registerSuccess ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-2">
                  <CheckCircle2 className="size-10 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-foreground text-base">¡Cuenta creada con éxito!</h4>
                  <p className="text-xs text-muted-foreground">Iniciando sesión automáticamente en tu panel...</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-3.5">
                  {/* Nombre Completo */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Sofia Rodríguez"
                      className="w-full rounded-xl bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      {...registerSignup("name")}
                    />
                    {registerErrors.name && (
                      <p className="text-xs text-destructive">{registerErrors.name.message}</p>
                    )}
                  </div>

                  {/* Empresa u Organización */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Empresa u Organización
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Nexus Labs"
                      className="w-full rounded-xl bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      {...registerSignup("company")}
                    />
                    {registerErrors.company && (
                      <p className="text-xs text-destructive">{registerErrors.company.message}</p>
                    )}
                  </div>

                  {/* Correo Electrónico */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="tu@empresa.com"
                      className="w-full rounded-xl bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      {...registerSignup("email")}
                    />
                    {registerErrors.email && (
                      <p className="text-xs text-destructive">{registerErrors.email.message}</p>
                    )}
                  </div>

                  {/* Selección de Rol */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Tipo de Cuenta</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegisterValue("role", "admin")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-medium transition-all ${
                          selectedRegisterRole === "admin"
                            ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <ShieldCheck className="size-3.5" />
                        <span>Administrador</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegisterValue("role", "user")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-medium transition-all ${
                          selectedRegisterRole === "user"
                            ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <UserCheck className="size-3.5" />
                        <span>Usuario</span>
                      </button>
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full rounded-xl bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      {...registerSignup("password")}
                    />
                    {registerErrors.password && (
                      <p className="text-xs text-destructive">{registerErrors.password.message}</p>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Confirmar contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      className="w-full rounded-xl bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      {...registerSignup("confirmPassword")}
                    />
                    {registerErrors.confirmPassword && (
                      <p className="text-xs text-destructive">{registerErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isRegisterSubmitting}
                    className="w-full rounded-xl bg-foreground hover:bg-foreground/90 text-background font-semibold py-3 text-sm transition-all duration-200 shadow-md mt-2 cursor-pointer"
                  >
                    Crear Cuenta
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Alternar entre Iniciar Sesión / Crear Cuenta */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              {isRegisterMode ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                {isRegisterMode ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            </p>
          </div>
        </div>

        {/* Pie de página */}
        <div className="text-center lg:text-left text-[11px] text-muted-foreground mt-8 lg:mt-4">
          © 2026 Todos los derechos reservados.
        </div>
      </div>

      {/* ─── COLUMNA DERECHA: TARJETA CONTENEDOR CON PUNTAS REDONDEADAS Y ARTE 3D ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] p-3 sm:p-4 lg:p-5 h-screen relative">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative border border-border/60 shadow-2xl flex flex-col justify-end p-8">
          
          {/* Fondo de Arte 3D */}
          <Image
            src="/images/auth-side-art.jpg"
            alt="Arte Visual"
            fill
            className="object-cover object-center select-none"
            priority
          />

          {/* Degradado sobre la imagen para profundidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Tarjeta Flotante de Testimonio (Frosted Glass) */}
          <div className="relative z-10 backdrop-blur-xl bg-black/45 border border-white/15 rounded-2xl p-4.5 shadow-2xl max-w-sm ml-auto mr-2 mb-2 transition-transform hover:scale-[1.02]">
            <div className="flex items-start gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="Sarah Chen"
                className="size-10 rounded-full object-cover ring-2 ring-white/20 shrink-0"
              />
              <div className="space-y-1">
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">Sarah Chen</h4>
                  <span className="text-[10px] text-zinc-400 font-medium">@sarahdigital</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                  ¡Una plataforma increíble! La experiencia de usuario es muy fluida y las funciones son exactamente lo que necesitaba.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
