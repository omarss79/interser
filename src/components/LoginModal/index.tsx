"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { z } from "zod";
import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type Errors = Partial<Record<string, string>>;

interface LoginModalProps {
  show: boolean;
  onHide: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({
  show,
  onHide,
  onLoginSuccess,
}: LoginModalProps) {
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

      if (data.user) {
        toast.success("Sesión iniciada correctamente");
        setEmail("");
        setPassword("");
        onHide();

        // Call success callback if provided (to open appointment modal)
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Refresh to update auth state
        router.refresh();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Error inesperado");
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    onHide();
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={handleClose}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1050 }}
        aria-labelledby="loginModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Iniciar sesión para reservar
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Cerrar"
              />
            </div>

            <div className="modal-body">
              <p className="text-muted mb-4">
                Para reservar una cita necesitas tener una cuenta. Inicia sesión
                o regístrate para continuar.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">
                    Correo
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                    Contraseña
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <a
                    href="/reset-password"
                    className="small text-decoration-none"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  className="btn btn-primary w-100 mb-3"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Iniciar sesión"}
                </button>

                <div className="position-relative my-3">
                  <hr />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                    o continuar con
                  </span>
                </div>

                <GoogleSignInButton />
              </form>
            </div>

            <div className="modal-footer justify-content-center">
              <p className="mb-0 small">
                ¿No tienes cuenta?{" "}
                <a href="/register" className="text-decoration-none">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
