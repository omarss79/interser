import { createClient } from "@/supabase/client";
import type { Appointment } from "@/interfaces/appointments";

/**
 * Obtiene todas las citas del cliente actual
 */
export async function getClientAppointments(
  status?: ("pending" | "confirmed" | "cancelled" | "completed" | "no_show")[]
): Promise<Appointment[]> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return [];
  }

  let query = supabase
    .from("appointments")
    .select("*")
    .eq("client_id", userData.user.id)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (status && status.length > 0) {
    query = query.in("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching client appointments:", error);
    return [];
  }

  return data || [];
}

/**
 * Obtiene el terapeuta asociado a una cita
 */
export async function getTherapistForAppointment(therapistId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, title, email, photo_url")
    .eq("id", therapistId)
    .single();

  if (error) {
    console.error("Error fetching therapist:", error);
    return null;
  }

  return data;
}
