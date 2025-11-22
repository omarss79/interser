"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type Errors = Partial<Record<string, string>>;

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse({ email, password });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        toast.error(error.message || "Error al iniciar sesión");
        return;
      }

      toast.success("Sesión iniciada");
      router.push("/dashboard");
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Error inesperado");
    }
  };

  const handleGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch (err: any) {
      toast.error(err?.message || "Error OAuth");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
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
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-required="true"
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <a href="/reset-password" className="small">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button
        className="btn btn-primary w-100"
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Entrando..." : "Iniciar sesión"}
      </button>

      <hr />

      <button
        type="button"
        className="btn btn-outline-secondary w-100"
        onClick={handleGoogle}
      >
        Iniciar con Google
      </button>
    </form>
  );
}
