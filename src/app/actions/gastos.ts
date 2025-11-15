"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Esquema de validación para los datos del formulario
const GastoSchema = z.object({
  id: z.string().optional().nullable(),
  monto: z.coerce
    .number()
    .min(0.01, { message: "El monto debe ser mayor a 0." }),
  fecha_del_gasto: z.string().date({ message: "La fecha es requerida." }),
  descripcion: z.string().optional().nullable(),
  estatus: z.enum(["Programado", "Pagado", "Comprometido"], {
    message: "El estatus no es válido.",
  }),
  concepto_id: z.string().uuid({ message: "El concepto es requerido." }),
  cuenta_id: z.string().uuid({ message: "La cuenta es requerida." }),
  proyecto_id: z.string().uuid({ message: "El proyecto es requerido." }),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

// Acción para CREAR y ACTUALIZAR un gasto
export async function saveGasto(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) return { message: "Error de autenticación.", errors: {} };

  const validatedFields = GastoSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Error de validación en los campos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...gastoData } = validatedFields.data;

  try {
    const operation = id
      ? (await supabase).from("gastos").update(gastoData).eq("id", id) // UPDATE
      : (await supabase)
          .from("gastos")
          .insert({ ...gastoData, user_id: user.id }); // INSERT

    const { error } = await operation;
    if (error) throw new Error(error.message);

    revalidatePath("/gastos");
    return { message: "¡Gasto guardado con éxito!", errors: {} };
  } catch (e: any) {
    return { message: `Error en la base de datos: ${e.message}`, errors: {} };
  }
}

// Acción para ELIMINAR un gasto
export async function deleteGasto(id: string) {
  const supabase = createClient();
  const { error } = await (await supabase).from("gastos").delete().eq("id", id);
  if (error) {
    // Esto podría fallar si las políticas RLS no lo permiten
    return { success: false, message: "Error al eliminar el gasto." };
  }
  revalidatePath("/gastos");
  return { success: true, message: "Gasto eliminado." };
}
