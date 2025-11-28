"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPasswordWithTokenForm() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_PASSWORD = 128;

  // Verify session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Sesión de recuperación no válida o expirada");
        router.push("/reset-password");
      }
    };
    checkSession();
  }, [supabase, router]);

  const validate = () => {
    const p = (password || "").trim();
    if (p.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (p.length > 128)
      return "La contraseña debe tener como máximo 128 caracteres.";
    if (p !== confirm) return "Las contraseñas no coinciden.";
    return null;
  };

  const passwordStrength = useMemo(() => {
    const p = password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) score++;

    score = Math.max(0, Math.min(4, score));
    const percent = Math.round((score / 4) * 100);
    let label = "Muy débil";
    let variant = "danger";
    if (score >= 4) {
      label = "Muy fuerte";
      variant = "success";
    } else if (score === 3) {
      label = "Fuerte";
      variant = "info";
    } else if (score === 2) {
      label = "Media";
      variant = "warning";
    } else {
      label = "Muy débil";
      variant = "danger";
    }
    return { score, percent, label, variant };
  }, [password]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // Update password without requiring current password (recovery flow)
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message || "Error al establecer la nueva contraseña");
        setLoading(false);
        return;
      }

      toast.success("Contraseña actualizada correctamente");

      // Redirect to dashboard after successful password reset
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || String(err));
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-4 shadow-sm"
      aria-live="polite"
    >
      <div className="alert alert-info mb-4">
        <strong>Recuperación de contraseña</strong>
        <p className="mb-0 small">
          Establece tu nueva contraseña. No necesitas proporcionar la anterior.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Nueva contraseña</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          disabled={loading}
          maxLength={MAX_PASSWORD}
          required
        />
        <div className="mt-2">
          <div className="progress" style={{ height: 8 }}>
            <div
              className={`progress-bar bg-${passwordStrength.variant}`}
              role="progressbar"
              style={{ width: `${passwordStrength.percent}%` }}
              aria-valuenow={passwordStrength.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="small text-muted mt-1">
            Fuerza: <strong>{passwordStrength.label}</strong>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Confirmar contraseña</label>
        <input
          type="password"
          className="form-control"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repetir contraseña"
          disabled={loading}
          maxLength={MAX_PASSWORD}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Actualizando..." : "Establecer nueva contraseña"}
      </button>
    </form>
  );
}
