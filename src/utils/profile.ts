import { createClient } from "@/supabase/server";
import type { Profile } from "@/interfaces/types";

/**
 * Obtiene el perfil completo del usuario actual incluyendo su rol
 */
export async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error in getProfile:", error);
    return null;
  }
}

/**
 * Determina la URL de redirección basada en el rol del usuario
 * - usuario: /profile
 * - terapeuta: /dashboard
 * - administrador: /dashboard
 */
export function getRedirectUrlByRole(role: Profile["role"]): string {
  if (role === "usuario") {
    return "/profile";
  }
  return "/dashboard";
}
