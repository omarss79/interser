"use client";

import UpdatePasswordForm from "@/components/Auth/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">Actualizar contraseña</h1>
          <UpdatePasswordForm />
        </div>
      </div>
    </main>
  );
}
