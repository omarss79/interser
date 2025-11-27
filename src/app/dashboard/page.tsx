import React from "react";
import { createClient } from "@/supabase/server";
import Link from "next/link";
import SignOutButton from "@/components/Dashboard/SignOutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch (e) {
    // ignore server-side getUser errors; user remains null
  }

  // Prefer a visible bordered container and a small top margin so nothing is hidden
  return (
    <main
      className="container py-4 mt-3 border rounded"
      style={{ borderColor: "#e0e0e0" }}
    >
      <h1 className="mb-3">Dashboard</h1>
      {!user ? (
        <div>
          <p>No estás autenticado.</p>
          <p>
            <Link href="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
          </p>
        </div>
      ) : (
        <div>
          {/* Prefer display name from user metadata when available */}
          {(() => {
            const meta = (user && user.user_metadata) || {};
            const displayName =
              meta.full_name ||
              meta.name ||
              meta.first_name ||
              user.email ||
              user.id;
            return (
              <p>
                Bienvenido, <strong>{displayName}</strong>
              </p>
            );
          })()}
          <p className="mb-3">ID: {user.id}</p>
          <p className="mb-3">Rol: {user.role ?? "-"}</p>
          {(() => {
            // Check if user signed in with OAuth provider (Google, etc.)
            const hasOAuthIdentity = user?.identities?.some(
              (identity: any) =>
                identity.provider === "google" || identity.provider !== "email"
            );
            const isOAuthUser =
              hasOAuthIdentity ||
              (user?.app_metadata?.provider &&
                user.app_metadata.provider !== "email");

            return (
              <div className="d-flex gap-2 align-items-center">
                <Link href="/profile" className="btn btn-secondary">
                  Perfil
                </Link>
                {/* Only show "Change password" for email/password users, not OAuth users */}
                {!isOAuthUser && (
                  <Link
                    href="/update-password"
                    className="btn btn-outline-secondary"
                  >
                    Cambiar contraseña
                  </Link>
                )}
                <SignOutButton />
              </div>
            );
          })()}
        </div>
      )}
    </main>
  );
}
