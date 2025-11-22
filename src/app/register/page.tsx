import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/supabase/server";
import RegisterForm from "@/components/Auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registrarse - Interser",
  description: "Crear cuenta en Interser",
};

export default async function RegisterPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">Crear cuenta</h1>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
