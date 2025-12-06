import { createClient } from "@/supabase/client";
import type {
  Appointment,
  TherapistSchedule,
  TimeSlot,
  AvailableDay,
  TherapistScheduleException,
} from "@/interfaces/appointments";

/**
 * Obtiene los horarios regulares de un terapeuta
 */
export async function getTherapistSchedules(
  therapistId: string
): Promise<TherapistSchedule[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("therapist_schedules")
    .select("*")
    .eq("therapist_id", therapistId)
    .eq("is_active", true)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching therapist schedules:", error);
    return [];
  }

  return data || [];
}

/**
 * Obtiene las excepciones de horario para un rango de fechas
 */
export async function getTherapistExceptions(
  therapistId: string,
  startDate: string,
  endDate: string
): Promise<TherapistScheduleException[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("therapist_schedule_exceptions")
    .select("*")
    .eq("therapist_id", therapistId)
    .gte("exception_date", startDate)
    .lte("exception_date", endDate);

  if (error) {
    console.error("Error fetching schedule exceptions:", error);
    return [];
  }

  return data || [];
}

/**
 * Obtiene las citas existentes de un terapeuta para un rango de fechas
 */
export async function getTherapistAppointments(
  therapistId: string,
  startDate: string,
  endDate: string
): Promise<Appointment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("therapist_id", therapistId)
    .gte("appointment_date", startDate)
    .lte("appointment_date", endDate)
    .in("status", ["pending", "confirmed"])
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  return data || [];
}

/**
 * Genera slots de tiempo disponibles para múltiples bloques horarios de un día
 */
export function generateTimeSlotsFromSchedules(
  schedules: TherapistSchedule[],
  appointments: Appointment[],
  date: string,
  slotDuration: number = 60
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Ordenar horarios por hora de inicio
  const sortedSchedules = [...schedules].sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  // Generar slots para cada bloque de horario
  sortedSchedules.forEach((schedule) => {
    const [startHour, startMinute] = schedule.start_time.split(":").map(Number);
    const [endHour, endMinute] = schedule.end_time.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeString = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      // Verificar si este horario está ocupado
      const isOccupied = appointments.some((apt) => {
        if (apt.appointment_date !== date) return false;

        const aptStart = apt.start_time.substring(0, 5); // HH:mm
        const aptEnd = apt.end_time.substring(0, 5);

        return timeString >= aptStart && timeString < aptEnd;
      });

      const occupiedAppointment = appointments.find((apt) => {
        if (apt.appointment_date !== date) return false;
        const aptStart = apt.start_time.substring(0, 5);
        return timeString === aptStart;
      });

      slots.push({
        time: timeString,
        available: !isOccupied,
        appointmentId: occupiedAppointment?.id,
      });

      // Avanzar al siguiente slot
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
  });

  return slots;
}

/**
 * Genera slots de tiempo disponibles para un día específico (backward compatibility)
 * @deprecated Use generateTimeSlotsFromSchedules instead
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  appointments: Appointment[],
  date: string,
  slotDuration: number = 60
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const timeString = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    // Verificar si este horario está ocupado
    const isOccupied = appointments.some((apt) => {
      if (apt.appointment_date !== date) return false;

      const aptStart = apt.start_time.substring(0, 5); // HH:mm
      const aptEnd = apt.end_time.substring(0, 5);

      return timeString >= aptStart && timeString < aptEnd;
    });

    const occupiedAppointment = appointments.find((apt) => {
      if (apt.appointment_date !== date) return false;
      const aptStart = apt.start_time.substring(0, 5);
      return timeString === aptStart;
    });

    slots.push({
      time: timeString,
      available: !isOccupied,
      appointmentId: occupiedAppointment?.id,
    });

    // Avanzar al siguiente slot
    currentMinute += slotDuration;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }

  return slots;
}

/**
 * Obtiene los días disponibles en un rango (máximo 30 días desde hoy)
 */
export function getAvailableDays(
  schedules: TherapistSchedule[],
  exceptions: TherapistScheduleException[],
  maxDays: number = 30
): AvailableDay[] {
  const days: AvailableDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  for (let i = 0; i < maxDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();
    const dateString = date.toISOString().split("T")[0];

    // Verificar si hay excepción para este día
    const exception = exceptions.find((ex) => ex.exception_date === dateString);

    // Verificar si hay horario regular para este día
    const hasSchedule = schedules.some((sch) => sch.day_of_week === dayOfWeek);

    days.push({
      date: dateString,
      dayOfWeek,
      dayName: dayNames[dayOfWeek],
      hasSchedule: exception ? exception.is_available : hasSchedule,
      isException: !!exception,
      exceptionReason: exception?.reason,
    });
  }

  return days;
}

/**
 * Verifica si un horario específico está disponible
 */
async function checkAvailability(
  therapistId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const supabase = createClient();

  console.log("Checking availability with params:", {
    therapistId,
    date,
    startTime,
    endTime,
  });

  // Obtener todas las citas del terapeuta en esa fecha
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("therapist_id", therapistId)
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    console.error("Error checking availability:", error);
    // En caso de error, asumimos que está disponible y dejamos que la DB lo valide
    return true;
  }

  console.log("Existing appointments:", data);

  // Verificar si hay conflicto con alguna cita existente
  const hasConflict = data?.some((apt) => {
    // Convertir tiempos a formato comparable
    const existingStart = apt.start_time.substring(0, 8); // HH:MM:SS
    const existingEnd = apt.end_time.substring(0, 8);

    // Hay conflicto si los rangos se solapan
    const conflict = startTime < existingEnd && endTime > existingStart;

    if (conflict) {
      console.log("Conflict found with appointment:", apt);
    }

    return conflict;
  });

  console.log("Has conflict:", hasConflict);
  return !hasConflict;
}

/**
 * Crea una nueva cita
 */
export async function createAppointment(appointment: {
  therapist_id: string;
  appointment_date: string;
  start_time: string;
  appointment_type: "presencial" | "online";
  notes?: string;
}): Promise<{ success: boolean; error?: string; appointmentId?: string }> {
  const supabase = createClient();

  // Calcular end_time (1 hora después)
  const [hour, minute] = appointment.start_time.split(":").map(Number);
  const endHour = hour + 1;
  const end_time = `${endHour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:00`;

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error getting user:", userError);
    return { success: false, error: "Error al verificar autenticación" };
  }

  if (!userData.user) {
    console.error("No user found");
    return {
      success: false,
      error: "Usuario no autenticado. Por favor inicia sesión nuevamente.",
    };
  }

  console.log("User authenticated:", userData.user.id);

  // Verificar disponibilidad primero
  console.log("Checking availability for:", {
    therapist_id: appointment.therapist_id,
    date: appointment.appointment_date,
    start_time: `${appointment.start_time}:00`,
    end_time: end_time,
  });

  const isAvailable = await checkAvailability(
    appointment.therapist_id,
    appointment.appointment_date,
    `${appointment.start_time}:00`,
    end_time
  );

  console.log("Availability check result:", isAvailable);

  if (!isAvailable) {
    return {
      success: false,
      error: "El horario seleccionado ya no está disponible",
    };
  }

  const appointmentData = {
    client_id: userData.user.id,
    therapist_id: appointment.therapist_id,
    appointment_date: appointment.appointment_date,
    start_time: `${appointment.start_time}:00`,
    end_time: end_time,
    duration_minutes: 60,
    status: "pending" as const,
    appointment_type: appointment.appointment_type,
    notes: appointment.notes || null,
  };

  console.log("Creating appointment with data:", appointmentData);

  const { data, error } = await supabase
    .from("appointments")
    .insert(appointmentData)
    .select()
    .single();

  console.log("Insert result - data:", data);
  console.log("Insert result - error:", error);

  if (error) {
    console.error("Error creating appointment:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return {
      success: false,
      error:
        error.message ||
        error.hint ||
        "Error al crear la cita. Por favor intenta nuevamente.",
    };
  }

  if (!data) {
    return {
      success: false,
      error: "No se pudo crear la cita. Verifica tus permisos.",
    };
  }

  return { success: true, appointmentId: data.id };
}

/**
 * Cancela una cita
 */
export async function cancelAppointment(
  appointmentId: string,
  cancellationReason: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { success: false, error: "Usuario no autenticado" };
  }

  const { error } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      cancellation_reason: cancellationReason,
      cancelled_at: new Date().toISOString(),
      cancelled_by: userData.user.id,
    })
    .eq("id", appointmentId)
    .eq("client_id", userData.user.id);

  if (error) {
    console.error("Error cancelling appointment:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Obtiene las citas del cliente actual
 */
export async function getClientAppointments(): Promise<Appointment[]> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("client_id", userData.user.id)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching client appointments:", error);
    return [];
  }

  return data || [];
}
