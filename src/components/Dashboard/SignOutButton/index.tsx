"use client";

import React from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/");
    } catch (err) {
      if (process.env.NODE_ENV === "development")
        console.error("Sign out error", err);
      try {
        window.location.href = "/";
      } catch {}
    }
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleSignOut}>
      Cerrar sesión
    </button>
  );
}
