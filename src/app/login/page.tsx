import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/supabase/server";
import LoginForm from "@/components/Auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión - Interser",
  description: "Iniciar sesión en Interser",
};

export default async function LoginPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If already authenticated, redirect to dashboard
    redirect("/dashboard");
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">Iniciar sesión</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
