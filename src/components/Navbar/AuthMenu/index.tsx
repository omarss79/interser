"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { usePathname } from "next/navigation";

export default function AuthMenu() {
  const supabase = createClient();
  const [user, setUser] = useState<any | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data.user ?? null);
      } catch (err) {
        if (process.env.NODE_ENV === "development") console.error(err);
        setUser(null);
      }
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe?.();
      } catch (e) {}
    };
  }, [supabase]);

  const handleSignOut = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      await supabase.auth.signOut();
      setUser(null);
      if (typeof window !== "undefined") window.location.href = "/";
    } catch (err) {
      if (process.env.NODE_ENV === "development")
        console.error("Sign out error", err);
    }
  };

  // Check if user signed in with OAuth provider (Google, etc.)
  // Check identities array for OAuth providers (more reliable than app_metadata.provider)
  const hasOAuthIdentity = user?.identities?.some(
    (identity: any) =>
      identity.provider === "google" || identity.provider !== "email"
  );
  const isOAuthUser =
    hasOAuthIdentity ||
    (user?.app_metadata?.provider && user.app_metadata.provider !== "email");

  // Simple menu: if no user, show link to /login; if user, show profile/change-password/sign out
  return (
    <div className="nav-item dropdown">
      <a
        href="#"
        className="nav-link dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded={false}
      >
        {user ? user.email ?? "Mi cuenta" : "Iniciar sesión"}
      </a>
      <div className="dropdown-menu m-0">
        {!user && (
          <>
            <a href="/login" className="dropdown-item">
              Iniciar sesión
            </a>
            <a href="/register" className="dropdown-item">
              Registrarse
            </a>
          </>
        )}

        {user && (
          <>
            <a href="/profile" className="dropdown-item">
              Perfil
            </a>
            {/* Only show "Change password" for email/password users, not OAuth users */}
            {!isOAuthUser && (
              <a href="/update-password" className="dropdown-item">
                Cambiar contraseña
              </a>
            )}
            <div className="dropdown-divider" />
            <a href="#" onClick={handleSignOut} className="dropdown-item">
              Cerrar sesión
            </a>
          </>
        )}

        {/* keep existing placeholder items for compatibility if needed */}
        {pathname === "/" && (
          <>
            <div className="dropdown-divider" />
            <a href="appointment.html" className="dropdown-item">
              Appointment
            </a>
          </>
        )}
      </div>
    </div>
  );
}
