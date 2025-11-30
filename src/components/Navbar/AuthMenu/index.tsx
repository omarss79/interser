"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { usePathname } from "next/navigation";

export default function AuthMenu() {
  const supabase = createClient();
  const [user, setUser] = useState<any | null>(null);
  const [currentSessionProvider, setCurrentSessionProvider] = useState<
    string | null
  >(null);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data.user ?? null);

        // Get current session to check which provider was used to sign in THIS time
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session && data.user) {
          const user = data.user;

          // Find the most recently used identity based on last_sign_in_at
          let currentProvider = "email";

          if (user.identities && user.identities.length > 0) {
            // Sort identities by last_sign_in_at (most recent first)
            const sortedIdentities = [...user.identities].sort(
              (a: any, b: any) => {
                const aTime = a.last_sign_in_at
                  ? new Date(a.last_sign_in_at).getTime()
                  : 0;
                const bTime = b.last_sign_in_at
                  ? new Date(b.last_sign_in_at).getTime()
                  : 0;
                return bTime - aTime;
              }
            );

            // The most recent identity is the one used to sign in
            const mostRecentIdentity = sortedIdentities[0];
            currentProvider = mostRecentIdentity.provider || "email";
          }

          setCurrentSessionProvider(currentProvider);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") console.error(err);
        setUser(null);
        setCurrentSessionProvider(null);
      }
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);

        // Update current session provider when auth state changes
        if (session && session.user) {
          const user = session.user;
          let currentProvider = "email";

          if (user.identities && user.identities.length > 0) {
            const sortedIdentities = [...user.identities].sort(
              (a: any, b: any) => {
                const aTime = a.last_sign_in_at
                  ? new Date(a.last_sign_in_at).getTime()
                  : 0;
                const bTime = b.last_sign_in_at
                  ? new Date(b.last_sign_in_at).getTime()
                  : 0;
                return bTime - aTime;
              }
            );

            currentProvider = sortedIdentities[0].provider || "email";
          }

          setCurrentSessionProvider(currentProvider);
        } else {
          setCurrentSessionProvider(null);
        }
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

  // Check if user signed in with OAuth provider in THIS session
  // This allows users with both identities to change password when logged in via email
  const isOAuthSession = currentSessionProvider === "google";

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
            <a href="/update-password" className="dropdown-item">
              Cambiar contraseña
            </a>
            <hr className="dropdown-divider" />
            <a href="#" onClick={handleSignOut} className="dropdown-item">
              Cerrar sesión
            </a>
          </>
        )}

        {/* keep existing placeholder items for compatibility if needed */}
        {pathname === "/" && (
          <>
            <div className="dropdown-divider" />
            <a
              href="https://api.whatsapp.com/send/?phone=5216671792487&text=%C2%A1%C2%A1Hola%21%21+Deseo+informes+de+sus+servicios+psicoterapeuticos.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-item"
            >
              Agendar cita
            </a>
          </>
        )}
      </div>
    </div>
  );
}
