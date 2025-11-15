"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- ACCIONES PARA PARTIDAS ---

export async function createPartida(formData: FormData) {
  const supabase = createClient();

  // 1. Obtener el usuario actual
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  // 2. Obtener y validar datos del formulario
  const nombre = formData.get("nombre") as string;
  if (!nombre) {
    throw new Error("El nombre es requerido");
  }

  // 3. Insertar en la base de datos
  const { error } = await (await supabase)
    .from("partidas")
    .insert({ nombre, user_id: user.id });

  if (error) {
    console.error("Error al crear partida:", error);
    throw new Error("No se pudo crear la partida.");
  }

  // 4. Revalidar la cache para que la UI se actualice
  revalidatePath("/dashboard");
}

export async function deletePartida(id: string) {
  const supabase = createClient();
  const { error } = await (await supabase)
    .from("partidas")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("No se pudo eliminar la partida.");
  }

  revalidatePath("/dashboard");
}

// --- ACCIONES PARA CONCEPTOS ---

export async function createConcepto(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const nombre = formData.get("nombre") as string;
  const partida_id = formData.get("partida_id") as string;

  if (!nombre || !partida_id) {
    throw new Error("Faltan datos para crear el concepto.");
  }

  const { error } = await (await supabase)
    .from("conceptos")
    .insert({ nombre, partida_id, user_id: user.id });

  if (error) {
    throw new Error("No se pudo crear el concepto.");
  }

  // Revalidamos la página específica de esa partida
  revalidatePath(`/partidas/${partida_id}`);
}

export async function deleteConcepto(id: string, partida_id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("conceptos").delete().eq("id", id);

  if (error) {
    throw new Error("No se pudo eliminar el concepto.");
  }

  revalidatePath(`/partidas/${partida_id}`);
}
