"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Correo inválido"),
});

type Errors = Partial<Record<string, string>>;

export default function ResetPasswordForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse({ email });
    if (!result.success) {
      const fld: Errors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path && issue.path.length)
          fld[issue.path[0] as string] = issue.message;
      });
      setErrors(fld);
      return;
    }

    setLoading(true);
    try {
      // Supabase v2: resetPasswordForEmail(email, { redirectTo })
      // Redirect to a dedicated update-password page that will consume the tokens
      const redirectTo = `${window.location.origin}/update-password`;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message || "Error al solicitar el enlace");
        return;
      }

      setEmailSent(true);
      toast.success(
        "Si existe ese correo, recibirás un enlace para restablecer tu contraseña."
      );
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
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <button
        className="btn btn-primary w-100"
        type="submit"
        disabled={loading || emailSent}
        aria-busy={loading}
      >
        {loading
          ? "Enviando..."
          : emailSent
          ? "Enlace enviado ✓"
          : "Enviar enlace de recuperación"}
      </button>

      {emailSent && (
        <div className="alert alert-info mt-3 mb-0" role="status">
          Revisa tu correo. Si no lo encuentras, verifica la carpeta de spam.
        </div>
      )}
    </form>
  );
}
