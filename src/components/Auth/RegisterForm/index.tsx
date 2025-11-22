"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre"),
    email: z.string().email("Correo inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

type Errors = Partial<Record<string, string>>;

export default function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse({ name, email, password, confirm });
    if (!result.success) {
      const fieldErrors: Errors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path && issue.path.length) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      setLoading(false);

      if (error) {
        toast.error(error.message || "Error al crear la cuenta");
        return;
      }

      if ((data as any)?.user) {
        toast.success("Cuenta creada. Redirigiendo...");
        router.push("/dashboard");
        return;
      }

      toast.success(
        "Cuenta creada. Revisa tu correo para confirmar tu cuenta."
      );
      router.push("/login");
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Error inesperado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          aria-required="true"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          aria-required="true"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="confirm" className="form-label">
          Repetir contraseña
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          className={`form-control ${errors.confirm ? "is-invalid" : ""}`}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          aria-required="true"
        />
        {errors.confirm && (
          <div className="invalid-feedback">{errors.confirm}</div>
        )}
      </div>

      <button
        className="btn btn-primary w-100"
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
