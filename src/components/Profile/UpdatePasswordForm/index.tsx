"use client";

import React, { useState, useMemo } from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordForm() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const MAX_PASSWORD = 128;

  const validate = () => {
    const cur = (currentPassword || "").trim();
    if (!cur) return "Debes introducir tu contraseña actual.";
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
    setSuccess(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      // Re-authenticate with current password to add security
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) {
        setError("No se pudo obtener el email del usuario autenticado.");
        setLoading(false);
        return;
      }

      const signRes = await (supabase.auth as any).signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signRes?.error) {
        setError("Contraseña actual incorrecta.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password } as any);
      if (error) {
        setError(error.message || "Error al actualizar la contraseña");
      } else {
        setSuccess("Contraseña actualizada correctamente");
        setPassword("");
        setConfirm("");
        setCurrentPassword("");
        try {
          router.refresh();
        } catch {}
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-100" aria-live="polite">
      <div className="mb-3">
        <label className="form-label">Contraseña actual</label>
        <input
          type="password"
          className="form-control"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Tu contraseña actual"
          disabled={loading}
          maxLength={MAX_PASSWORD}
        />
      </div>
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
          placeholder="Repite la contraseña"
          disabled={loading}
          maxLength={MAX_PASSWORD}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Actualizar contraseña"}
        </button>
      </div>
    </form>
  );
}
