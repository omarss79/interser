import React from "react";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import UpdateNameForm from "@/components/Profile/UpdateNameForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  let user: any = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch (e) {
    // ignore
  }

  if (!user) {
    // Server-side redirect to login if not authenticated
    redirect("/login");
  }

  const meta = user.user_metadata || {};
  const displayName = meta.full_name || meta.name || meta.first_name || "";

  return (
    <main className="container py-4 mt-3 border rounded" style={{ borderColor: "#e0e0e0" }}>
      <h1 className="mb-3">Perfil</h1>
      <p className="mb-3">ID: {user.id}</p>
      <p className="mb-3">Email: {user.email}</p>

      <section className="mt-3">
        <h2 className="h5">Actualizar nombre</h2>
        <UpdateNameForm initialName={displayName} />
      </section>
    </main>
  );
}
