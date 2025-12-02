"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UpdatePasswordForm from "@/components/Auth/UpdatePasswordForm";
import ResetPasswordWithTokenForm from "@/components/Auth/ResetPasswordWithTokenForm";

function UpdatePasswordContent() {
  const searchParams = useSearchParams();
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    // Check if there's a recovery token in the URL (from email link)
    const code = searchParams.get("code");
    const type = searchParams.get("type");

    // If there's a recovery code or type=recovery, show recovery form
    if (code || type === "recovery") {
      setIsRecoveryMode(true);
    }
  }, [searchParams]);

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">
            {isRecoveryMode
              ? "Establecer nueva contraseña"
              : "Actualizar contraseña"}
          </h1>
          {isRecoveryMode ? (
            <ResetPasswordWithTokenForm />
          ) : (
            <UpdatePasswordForm />
          )}
        </div>
      </div>
    </main>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <UpdatePasswordContent />
    </Suspense>
  );
}
