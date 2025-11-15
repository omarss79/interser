// src/app/proyectos/page.tsx

import { redirect } from "next/navigation"; // 👈 Importa redirect
import { createClient } from "@/supabase/server";
import { createProject, deleteProject } from "../actions/proyectos";
import { Proyecto } from "@/interfaces";

export default async function ProyectosPage() {
  const supabase = createClient();

  // ✅ Validar la sesión del usuario en el servidor
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (!session) {
    // Si no hay sesión, redirige al usuario a la página de login
    redirect("/login");
  }

  // Ahora, obtienes los proyectos solo si el usuario está autenticado
  const { data: proyectos } = await (await supabase)
    .from("proyectos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Mis Proyectos 🚀
        </h1>
        {/* Formulario para Crear Proyectos (usa la Server Action) */}
        <form
          action={createProject}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Proyecto</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="titulo"
              placeholder="Título del proyecto"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar Proyecto
          </button>
        </form>
        {/* Lista de Proyectos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Proyectos Existentes</h2>
          {proyectos && proyectos.length > 0 ? (
            proyectos.map((proyecto: Proyecto) => (
              <div
                key={proyecto.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {proyecto.titulo}
                  </h3>
                </div>
                {/* Formulario para el botón de eliminar */}
                <form action={deleteProject.bind(null, proyecto.id)}>
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-6">
              Aún no tienes proyectos. ¡Añade uno para empezar!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
