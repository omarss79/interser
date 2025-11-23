"use client";

import React, { useState } from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  initialName?: string;
}

export default function UpdateNameForm({ initialName = "" }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Client-side validation
      const trimmed = (name || "").trim();
      if (trimmed.length < 2) {
        setError("El nombre debe tener al menos 2 caracteres.");
        setLoading(false);
        return;
      }
      if (trimmed.length > 80) {
        setError("El nombre debe tener como máximo 80 caracteres.");
        setLoading(false);
        return;
      }

      // Update both metadata fields for compatibility with different schemas
      const updateData = { full_name: trimmed, name: trimmed };
      const { error } = await supabase.auth.updateUser({ data: updateData } as any);
      if (error) {
        setError(error.message || "Error al actualizar el nombre");
      } else {
        setSuccess("Nombre actualizado");
        // Refresh server components / page data
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
    <form onSubmit={handleSubmit} className="w-100">
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          disabled={loading}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setName(initialName);
            setError(null);
            setSuccess(null);
          }}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
