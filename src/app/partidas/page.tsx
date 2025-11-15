// src/app/dashboard/page.tsx

import { redirect } from "next/navigation"; // 👈 Importa redirect
import { createClient } from "@/supabase/server";
import { Partida } from "@/interfaces";
import { createPartida, deletePartida } from "../actions/partidas";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createClient();

  // ✅ Validar la sesión del usuario en el servidor
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (!session) {
    // Si no hay sesión, redirige al usuario a la página de login
    redirect("/login");
  }

  // Si la sesión existe, continúa con la lógica
  const { data: partidas } = await (await supabase)
    .from("partidas")
    .select("*");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mis Partidas Financieras</h1>

      {/* Formulario para Crear Partida */}
      <form action={createPartida} className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl mb-2">Nueva Partida</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Gastos de Oficina"
          required
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear Partida
        </button>
      </form>

      {/* Lista de Partidas Existentes */}
      <div className="space-y-4">
        {partidas?.map((partida: Partida) => (
          <div
            key={partida.id}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <Link
              href={`/partidas/${partida.id}`}
              className="text-lg font-semibold hover:underline"
            >
              {partida.nombre}
            </Link>
            <form action={deletePartida.bind(null, partida.id)}>
              <button
                type="submit"
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
