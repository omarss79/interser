"use client";

import React, { useEffect, useState } from "react";

export default function HandleCodeRedirect() {
  const [code, setCode] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "redirecting" | "failed" | "done"
  >("idle");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("code");
      if (!c) return;
      setCode(c);

      // If already on /update-password, do nothing
      if (window.location.pathname === "/update-password") return;

      // Build target preserving all params
      const qs = params.toString();
      const tgt = `/update-password?${qs}`;
      setTarget(tgt);

      // Prevent repeated rapid redirects by storing a short-lived marker
      const last = sessionStorage.getItem("redir_code_ts");
      const now = Date.now();
      if (last && now - parseInt(last, 10) < 5000) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Skipping redirect: recently redirected");
        }
        return;
      }
      sessionStorage.setItem("redir_code_ts", String(now));

      // Try to redirect after a short delay to allow the page to finish loading
      setStatus("redirecting");
      setTimeout(() => {
        try {
          if (process.env.NODE_ENV === "development") {
            console.log("HandleCodeRedirect: redirecting to", tgt);
          }
          // Use replace to avoid creating history entries and be more robust
          window.location.replace(tgt);
          setStatus("done");
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.error("HandleCodeRedirect redirect error", err);
          }
          // increment a retry counter to avoid infinite loops
          const tries =
            parseInt(sessionStorage.getItem("redir_code_tries") || "0", 10) + 1;
          sessionStorage.setItem("redir_code_tries", String(tries));
          if (tries >= 3) {
            setStatus("failed");
          } else {
            // schedule another attempt shortly
            setTimeout(() => {
              try {
                window.location.replace(tgt);
              } catch (err2) {
                if (process.env.NODE_ENV === "development") {
                  console.error("Second redirect attempt failed", err2);
                }
                setStatus("failed");
              }
            }, 400);
          }
        }
      }, 200);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("HandleCodeRedirect error parsing params", e);
      }
    }
  }, []);

  if (!code) return null;

  return (
    <div style={{ position: "fixed", top: 8, right: 8, zIndex: 9999 }}>
      <div
        className="alert alert-info p-2 m-0"
        role="alert"
        style={{ minWidth: 260 }}
      >
        <div style={{ fontSize: 13 }}>
          Detectado código de restablecimiento.
        </div>
        <div style={{ fontSize: 12, marginTop: 6 }}>
          {status === "redirecting" && (
            <span>Redirigiendo a la página de actualización...</span>
          )}
          {status === "failed" && target && (
            <>
              <div className="mb-1">No se pudo redirigir automáticamente.</div>
              <a className="btn btn-sm btn-outline-primary" href={target}>
                Ir a actualizar contraseña
              </a>
            </>
          )}
          {status === "idle" && <span>Preparando redirección...</span>}
        </div>
      </div>
    </div>
  );
}
