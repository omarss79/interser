"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User, Session } from "@supabase/supabase-js";
import { formatDate } from "@/utils/strings";
import toast from "react-hot-toast";

export default function UsuarioPage() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<"normal" | "admin" | null>(null);
  const [loading, setLoading] = useState(true); // 👈 Nuevo estado de carga

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const router = useRouter();
  const supabase = createClient();

  // ✅ Efecto para validar la sesión y redirigir
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirige al login si no hay sesión
        router.push("/login");
        toast.error("Debes iniciar sesión para acceder a esta página.");
      } else {
        // Si hay sesión, obtén el usuario
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setSession(session);
        setLoading(false); // La carga ha terminado
      }
    };

    checkSession();
  }, [router, supabase]); // Dependencias para re-ejecutar el efecto si cambian

  // Se mueve la lógica de `getUserRole` para que se ejecute solo si hay un usuario
  useEffect(() => {
    const getUserRole = async () => {
      if (!user) return;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (roleData) {
        setUserRole(roleData.role);
      }
    };

    getUserRole();
  }, [user, supabase]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión: " + error.message);
      return;
    }
    router.push("/");
    toast.success("Has cerrado sesión exitosamente");
  };

  const handleDeleteAccount = async () => {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    toast.success("Nivel de autenticación actual: " + data?.currentLevel);
    if (data?.currentLevel !== "aal2") {
      router.push("/mfa-challenge");
      toast.error(
        "Debes completar la verificación MFA para eliminar tu cuenta"
      );
      return;
    }
    setShowDeleteConfirmationModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      toast.error("Error al eliminar la cuenta: " + error.message);
      return;
    }
    router.push("/");
    toast.success("Has eliminado tu cuenta exitosamente");
    setShowDeleteConfirmationModal(false);
  };

  // ✅ Mostrar un estado de carga mientras se verifica la sesión
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2">Verificando sesión...</p>
      </div>
    );
  }

  // ✅ Solo renderiza el contenido si el usuario está autenticado
  if (!user || !session) {
    // Esto debería ser inaccesible debido a la redirección
    return null;
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-row gap-2">
            <div className="avatar">
              <div className="mask mask-squircle size-14">
                {/* <img
                  src={
                    user.user_metadata.avatar_url || '/userPlaceholder.png'
                  }
                /> */}
              </div>
            </div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-base-content/60">
                Bienvenido{" "}
                {user.user_metadata.full_name ||
                  user.email ||
                  user.phone ||
                  "usuario"}
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🙍‍♂️ Datos del Usuario</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-sm">Email:</span>
                    <div className="flex flex-row gap-2">
                      <p className="text-sm break-all w-full">
                        {user.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Teléfono:</span>
                    <div className="flex flex-row gap-2">
                      <p className="text-sm break-all w-full">
                        {user.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">
                      Último acceso:
                    </span>
                    <p className="text-xs">
                      {user.last_sign_in_at
                        ? formatDate(user.last_sign_in_at)
                        : "N/A"}
                    </p>
                  </div>
                  {user.user_metadata &&
                    Object.keys(user.user_metadata).length > 0 && (
                      <div>
                        <span className="font-semibold text-sm">
                          Metadatos del usuario:
                        </span>
                        <details className="text-xs">
                          <summary className="cursor-pointer">
                            Ver detalles
                          </summary>
                          <pre className="bg-base-200 p-2 rounded mt-2 overflow-auto">
                            {JSON.stringify(user.user_metadata, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  <div>
                    <span className="font-semibold text-sm">Identidades:</span>
                    <ul className="list-disc ml-5">
                      {user.identities?.map((identity) => {
                        return <li key={identity.id}>{identity.provider}</li>;
                      })}
                    </ul>
                  </div>
                </div>
                <div className="card-actions justify-end mt-auto">
                  <Link href="/profile" className="btn btn-primary btn-sm">
                    Editar Perfil
                  </Link>
                  <Link
                    href="/update-password"
                    className="btn btn-primary btn-outline btn-sm"
                  >
                    Cambiar Contraseña
                  </Link>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🔐 Datos de la Sesión</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-sm">Expira:</span>
                    <p className="text-xs">
                      {session.expires_at
                        ? formatDate(session.expires_at * 1000)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Duración:</span>
                    <p className="text-xs">
                      {session.expires_in
                        ? `${session.expires_in} segundos`
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="card-actions justify-end mt-auto">
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-error btn-sm"
                    title="Eliminar cuenta permanentemente"
                  >
                    Borrar Cuenta
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-error btn-sm btn-outline"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
            {userRole === "admin" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">⚡ Acciones de administrador</h2>
                  <p className="text-xs">
                    Esta tarjeta solo se le muestra a los usuarios que tengan el
                    rol de "admin"
                  </p>
                  <div className="space-y-3">
                    <button className="btn btn-outline w-full justify-start">
                      ➕ Añadir nuevos usuarios
                    </button>
                    <button className="btn btn-outline w-full justify-start">
                      🗑️ Borrar usuarios existentes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteConfirmationModal && (
        <div className="modal modal-open">
          <div
            className="modal-box relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg text-error">⚠️ Eliminar Cuenta</h3>
            <p className="py-4">
              ¿Estás seguro que quieres eliminar tu cuenta?
            </p>
            <p className="text-sm text-base-content/60 mb-4">
              <strong>Esta acción no se puede deshacer.</strong> Se eliminará
              permanentemente tu cuenta y todos los datos asociados.
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDeleteAccount}>
                Sí, estoy seguro
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowDeleteConfirmationModal(false)}
          ></div>
        </div>
      )}
    </>
  );
}
