import type { Metadata } from "next";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña - Interser",
  description: "Solicitar enlace para recuperar contraseña",
};

export default function ResetPasswordPage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">Recuperar contraseña</h1>
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
