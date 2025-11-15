// src/app/partidas/[id]/page.tsx

import { redirect } from "next/navigation"; // 👈 Importa redirect
import { createClient } from "@/supabase/server";
import { PartidaConConceptos } from "@/interfaces";
import { createConcepto, deleteConcepto } from "@/app/actions/partidas";
import Link from "next/link";

// Componente de servidor para leer datos de una partida y sus conceptos
export default async function PartidaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // ✅ Validar la sesión del usuario en el servidor
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (!session) {
    // Si no hay sesión, redirige al usuario a la página de login
    redirect("/login");
  }

  // Ahora, obtienes la partida y sus conceptos solo si el usuario está autenticado
  const { data } = await (
    await supabase
  )
    .from("partidas")
    .select(
      `
      *,
      conceptos ( * )
    `
    )
    .eq("id", params.id)
    .single();

  const partida: PartidaConConceptos | null = data;

  if (!partida) {
    return <div>Partida no encontrada.</div>;
  }

  return (
    <div className="p-8">
      <Link href="/partidas" className="text-blue-500 mb-4 block">
        &larr; Volver a Partidas
      </Link>
      <h1 className="text-2xl font-bold mb-4">Partida: {partida.nombre}</h1>

      <hr className="my-6" />

      {/* CRUD para Conceptos */}
      <h2 className="text-xl font-bold mb-4">Conceptos de Gasto</h2>

      {/* Formulario para Crear Concepto */}
      <form action={createConcepto} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg mb-2">Nuevo Concepto</h3>
        <input type="hidden" name="partida_id" value={partida.id} />
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Renta de oficina"
          required
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Añadir Concepto
        </button>
      </form>

      {/* Lista de Conceptos Existentes */}
      <div className="space-y-2">
        {partida.conceptos.map((concepto) => (
          <div
            key={concepto.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <p>{concepto.nombre}</p>
            <form action={deleteConcepto.bind(null, concepto.id, partida.id)}>
              <button
                type="submit"
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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
