"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Esquema de validación para los datos del formulario
const CuentaSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
});

export type FormState = {
  message: string;
  errors?: { nombre?: string[] };
};

// Acción para CREAR y ACTUALIZAR una cuenta
export async function saveCuenta(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) return { message: "Error de autenticación.", errors: {} };

  const validatedFields = CuentaSchema.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre"),
  });

  if (!validatedFields.success) {
    return {
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, nombre } = validatedFields.data;

  try {
    const dataToUpsert = { nombre, user_id: user.id };
    const operation = id
      ? (await supabase).from("cuentas").update(dataToUpsert).eq("id", id)
      : (await supabase).from("cuentas").insert(dataToUpsert);

    const { error } = await operation;
    if (error) throw new Error(error.message);

    revalidatePath("/cuentas");
    return { message: "¡Cuenta guardada con éxito!", errors: {} };
  } catch (e: any) {
    return { message: `Error en la base de datos: ${e.message}`, errors: {} };
  }
}

// Acción para ELIMINAR una cuenta
export async function deleteCuenta(id: string) {
  const supabase = createClient();
  const { error } = await (await supabase)
    .from("cuentas")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, message: "Error al eliminar la cuenta." };
  }
  revalidatePath("/cuentas");
  return { success: true, message: "Cuenta eliminada." };
}
