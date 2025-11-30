import { createClient } from "@/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import type { Profile } from "@/interfaces/types";

export interface TherapistCredential {
  id: string;
  credential_type: string;
  title: string;
  institution: string | null;
  year: number | null;
  display_order: number;
}

export interface TherapistService {
  id: string;
  service_name: string;
  description: string | null;
  display_order: number;
}

export interface TherapistIntervention {
  id: string;
  intervention_name: string;
  display_order: number;
}

export interface TherapistProfile extends Profile {
  slug: any;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  professional_id: string | null;
  phone: string | null;
  whatsapp: string | null;
  years_experience: number | null;
  therapeutic_approach: string | null;
  credentials: TherapistCredential[];
  services: TherapistService[];
  interventions: TherapistIntervention[];
}

/**
 * Obtiene el perfil completo de un terapeuta por su slug
 */
export async function getTherapistBySlug(
  slug: string
): Promise<TherapistProfile | null> {
  try {
    const supabase = await createClient();

    // Obtener perfil del terapeuta
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .eq("role", "terapeuta")
      .eq("is_public", true)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching therapist profile:", profileError);
      return null;
    }

    // Obtener credenciales
    const { data: credentials } = await supabase
      .from("therapist_credentials")
      .select("*")
      .eq("therapist_id", profile.id)
      .order("display_order", { ascending: true });

    // Obtener servicios
    const { data: services } = await supabase
      .from("therapist_services")
      .select("*")
      .eq("therapist_id", profile.id)
      .order("display_order", { ascending: true });

    // Obtener intervenciones
    const { data: interventions } = await supabase
      .from("therapist_interventions")
      .select("*")
      .eq("therapist_id", profile.id)
      .order("display_order", { ascending: true });

    return {
      ...profile,
      credentials: credentials || [],
      services: services || [],
      interventions: interventions || [],
    } as TherapistProfile;
  } catch (error) {
    console.error("Error in getTherapistBySlug:", error);
    return null;
  }
}

/**
 * Obtiene todos los terapeutas públicos
 */
export async function getAllTherapists(): Promise<TherapistProfile[]> {
  try {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "terapeuta")
      .eq("is_public", true)
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching therapists:", error.message || error);
      // Si la columna no existe, retornar array vacío sin fallar
      return [];
    }

    if (!profiles) {
      return [];
    }

    return profiles as TherapistProfile[];
  } catch (error) {
    console.error("Exception in getAllTherapists:", error);
    return [];
  }
}

/**
 * Obtiene todos los slugs de terapeutas (para generación estática)
 * Usa un cliente sin autenticación ya que se ejecuta en build time
 */
export async function getAllTherapistSlugs(): Promise<string[]> {
  try {
    // Crear cliente sin cookies para build time
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("profiles")
      .select("slug")
      .eq("role", "terapeuta")
      .eq("is_public", true)
      .not("slug", "is", null);

    if (error) {
      console.error("Error fetching therapist slugs:", error.message || error);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map((row) => row.slug).filter(Boolean);
  } catch (error) {
    console.error("Exception in getAllTherapistSlugs:", error);
    return [];
  }
}
