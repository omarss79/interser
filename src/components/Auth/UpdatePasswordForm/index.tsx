"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";

function parseParamsFromHash(hash: string) {
  // hash like #access_token=...&refresh_token=... or #type=...&access_token=...
  if (!hash) return {} as Record<string, string>;
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  return Object.fromEntries(new URLSearchParams(trimmed));
}

function parseParamsFromQuery(query: string) {
  if (!query) return {} as Record<string, string>;
  const trimmed = query.startsWith("?") ? query.slice(1) : query;
  return Object.fromEntries(new URLSearchParams(trimmed));
}

export default function UpdatePasswordForm() {
  const supabase = createClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any> | null>(null);

  const isDebug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";

  useEffect(() => {
    // Extract tokens from URL either from hash or query params
    const hashParams = parseParamsFromHash(window.location.hash);
    const queryParams = parseParamsFromQuery(window.location.search);

    const at = hashParams.access_token || queryParams.access_token || null;
    const rt = hashParams.refresh_token || queryParams.refresh_token || null;
    const code = queryParams.code || null;

    if (at) setAccessToken(at);
    if (rt) setRefreshToken(rt);

    const trySetSessionFromTokens = async () => {
      if (at && rt) {
        try {
          await supabase.auth.setSession({
            access_token: at,
            refresh_token: rt,
          });
          setReady(true);
          return true;
        } catch (err) {
          console.error("setSession error", err);
          toast.error("No se pudo establecer la sesión desde el enlace.");
          return false;
        }
      }

      if (at && !rt) {
        try {
          await (supabase.auth as any).setSession({ access_token: at });
          setReady(true);
          return true;
        } catch (err) {
          console.error("setSession error", err);
          toast.error("No se pudo establecer la sesión desde el enlace.");
          return false;
        }
      }

      return false;
    };

    const tryExchangeCode = async (codeToExchange: string) => {
      const authAny: any = supabase.auth as any;
      // Try SDK helper methods if available
      if (typeof authAny.exchangeCodeForSession === "function") {
        try {
          await authAny.exchangeCodeForSession(codeToExchange);
          setReady(true);
          return true;
        } catch (err) {
          console.error("exchangeCodeForSession error", err);
          // continue to next option
        }
      }

      if (typeof authAny.getSessionFromUrl === "function") {
        try {
          const { data, error } = await authAny.getSessionFromUrl();
          if (error) throw error;
          if (data) {
            setReady(true);
            return true;
          }
        } catch (err) {
          console.error("getSessionFromUrl error", err);
        }
      }

      return false;
    };

    (async () => {
      // If code param is present (PKCE flow), try to exchange it for session first
      if (code) {
        const ok = await tryExchangeCode(code);
        if (ok) return;
        // if exchange failed, fallthrough to token handling
      }

      const tokensOk = await trySetSessionFromTokens();
      if (!tokensOk && !code) {
        // No tokens and no code: invalid or expired
        toast.error(
          "Enlace inválido o expirado. Solicita otro enlace para restablecer tu contraseña."
        );
      }

      if (isDebug) {
        setDebugInfo({
          hashParams,
          queryParams,
          at: at || null,
          rt: rt || null,
          code: code || null,
        });
      }
    })();
  }, []);

  const copyHashToQueryAndReload = () => {
    const hashParams = parseParamsFromHash(window.location.hash);
    if (!hashParams || Object.keys(hashParams).length === 0) {
      toast.error("No se encontraron parámetros en el hash para copiar");
      return;
    }
    const qp = new URLSearchParams(hashParams as Record<string, string>);
    if (isDebug) qp.set("debug", "1");
    const newUrl = `${window.location.origin}${
      window.location.pathname
    }?${qp.toString()}`;
    window.location.href = newUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (error) {
        toast.error(error.message || "Error al actualizar la contraseña");
        return;
      }

      toast.success(
        "Contraseña actualizada correctamente. Ahora puedes iniciar sesión."
      );
      // Redirect to login
      window.location.href = "/login";
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Error inesperado");
    }
  };

  if (!accessToken && !refreshToken) {
    return (
      <div className="card p-4 shadow-sm">
        <p>
          Enlace inválido o expirado. Solicita un nuevo enlace para restablecer
          tu contraseña desde la página de recuperación.
        </p>
        {isDebug && debugInfo && (
          <div className="mt-3">
            <h6>Debug info</h6>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <button
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={copyHashToQueryAndReload}
            >
              Copiar hash a query y recargar
            </button>
            <div className="small text-muted mt-2">
              Si tu cliente de correo elimina el fragmento (#), usa el botón
              para mover los tokens al query string.
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="card p-4 shadow-sm">
        <p>Preparando sesión desde el enlace...</p>
        {isDebug && debugInfo && (
          <div className="mt-3">
            <h6>Debug info</h6>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Nueva contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <button
        className="btn btn-primary w-100"
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Actualizando..." : "Actualizar contraseña"}
      </button>
    </form>
  );
}
