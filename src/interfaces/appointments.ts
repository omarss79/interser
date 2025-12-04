// Interfaces para el sistema de citas

export interface TherapistSchedule {
  id: string;
  therapist_id: string;
  day_of_week: number; // 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
  start_time: string; // formato HH:mm:ss
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TherapistScheduleException {
  id: string;
  therapist_id: string;
  exception_date: string; // formato YYYY-MM-DD
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  reason?: string;
  created_at: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";
export type AppointmentType = "presencial" | "online";

export interface Appointment {
  id: string;
  client_id: string;
  therapist_id: string;
  appointment_date: string; // formato YYYY-MM-DD
  start_time: string; // formato HH:mm:ss
  end_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  appointment_type: AppointmentType;
  notes?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  time: string; // formato HH:mm
  available: boolean;
  appointmentId?: string; // si está ocupado, ID de la cita
}

export interface AvailableDay {
  date: string; // formato YYYY-MM-DD
  dayOfWeek: number;
  dayName: string;
  hasSchedule: boolean;
  isException: boolean;
  exceptionReason?: string;
}
