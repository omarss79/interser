"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { z } from "zod";
import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type Errors = Partial<Record<string, string>>;

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Show error from URL params (e.g., from OAuth callback)
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(decodeURIComponent(error));
      // Clean URL
      router.replace("/login");
    }
  }, [searchParams, router]);

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

      // Get user profile to redirect based on role
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        toast.success("Sesión iniciada");

        // Redirect based on role
        const redirectUrl =
          profile?.role === "usuario" ? "/profile" : "/dashboard";
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Error inesperado");
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
          autoComplete="current-password"
          aria-required="true"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <a href="/reset-password" className="small">
          ¿Olvidaste tu contraseña?
        </a>
        <a href="/register" className="small">
          Registrarse
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

      <div className="position-relative my-4">
        <hr />
        <span
          className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small"
          style={{ marginTop: "-0.5rem" }}
        >
          o
        </span>
      </div>

      <GoogleSignInButton />
    </form>
  );
}
