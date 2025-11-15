"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Acción para CREAR un nuevo proyecto
export async function createProject(formData: FormData) {
  const supabase = createClient();

  // 1. Validar que el usuario esté autenticado
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return redirect("/login"); // Redirige si no hay usuario
  }

  // 2. Obtener y validar los datos del formulario
  const titulo = formData.get("titulo") as string;

  if (!titulo) {
    // Podrías retornar un estado de error más sofisticado
    throw new Error("El título y la fecha de inicio son requeridos.");
  }

  // 3. Insertar los datos en la tabla 'proyectos'
  const { error } = await (await supabase).from("proyectos").insert({
    titulo,
    user_id: user.id, // Asegura que el proyecto se asocie al usuario actual
  });

  if (error) {
    console.error("Error al crear el proyecto:", error);
    throw new Error("No se pudo crear el proyecto.");
  }

  // 4. Revalidar la caché de la ruta para que la UI se actualice al instante
  revalidatePath("/proyectos");
}

// Acción para ELIMINAR un proyecto
export async function deleteProject(id: string) {
  const supabase = createClient();

  // 1. Validar que el usuario esté autenticado
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 2. Eliminar el proyecto
  // Supabase aplicará la política RLS automáticamente,
  // por lo que solo se podrá borrar si auth.uid() === user_id
  const { error } = await (await supabase)
    .from("proyectos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar el proyecto:", error);
    throw new Error("No se pudo eliminar el proyecto.");
  }

  // 3. Revalidar la caché para actualizar la UI
  revalidatePath("/proyectos");
}
