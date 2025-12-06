"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import toast from "react-hot-toast";
import type { Appointment } from "@/interfaces/appointments";

interface AppointmentWithTherapist extends Appointment {
  therapist?: {
    id: string;
    full_name: string;
    title: string | null;
    photo_url: string | null;
  };
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [appointments, setAppointments] = useState<AppointmentWithTherapist[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndLoadAppointments();
  }, [filter]);

  const checkAuthAndLoadAppointments = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      await loadAppointments();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar las citas");
    }
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      let query = supabase
        .from("appointments")
        .select(
          `
          *,
          therapist:profiles!appointments_therapist_id_fkey(
            id,
            full_name,
            title,
            photo_url
          )
        `
        )
        .order("appointment_date", { ascending: filter !== "past" })
        .order("start_time", { ascending: true });

      if (filter === "upcoming") {
        query = query
          .gte("appointment_date", today)
          .in("status", ["pending", "confirmed"]);
      } else if (filter === "past") {
        query = query.lt("appointment_date", today);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      return;
    }

    const reason = prompt(
      "Por favor indica el motivo de la cancelación (opcional):"
    );

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          cancellation_reason: reason || "Cancelado por el cliente",
          cancelled_at: new Date().toISOString(),
          cancelled_by: user?.id,
        })
        .eq("id", appointmentId)
        .eq("client_id", user?.id);

      if (error) throw error;

      toast.success("Cita cancelada exitosamente");
      loadAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Error al cancelar la cita");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hour, minute] = timeStr.substring(0, 5).split(":");
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${hour12}:${minute} ${period}`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: "Pendiente", class: "bg-warning text-dark" },
      confirmed: { text: "Confirmada", class: "bg-success" },
      cancelled: { text: "Cancelada", class: "bg-danger" },
      completed: { text: "Completada", class: "bg-secondary" },
      no_show: { text: "No asistió", class: "bg-dark" },
    };
    const badge = badges[status as keyof typeof badges] || {
      text: status,
      class: "bg-secondary",
    };
    return (
      <span className={`badge ${badge.class}`}>{badge.text}</span>
    );
  };

  const canCancelAppointment = (appointment: Appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.appointment_date}T${appointment.start_time}`
    );
    const now = new Date();
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return (
      (appointment.status === "pending" || appointment.status === "confirmed") &&
      hoursDiff > 24
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-3">Mis Citas</h1>
          <p className="text-muted">
            Administra y revisa todas tus citas programadas
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filter === "upcoming" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("upcoming")}
            >
              Próximas
            </button>
            <button
              type="button"
              className={`btn ${filter === "past" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("past")}
            >
              Pasadas
            </button>
            <button
              type="button"
              className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("all")}
            >
              Todas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      {appointments.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No tienes citas {filter === "upcoming" ? "próximas" : filter === "past" ? "pasadas" : ""} registradas.
        </div>
      ) : (
        <div className="row g-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="col-12">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="row align-items-center">
                    {/* Foto del terapeuta */}
                    <div className="col-md-2 text-center mb-3 mb-md-0">
                      {appointment.therapist?.photo_url ? (
                        <img
                          src={appointment.therapist.photo_url.trim()}
                          alt={appointment.therapist.full_name}
                          className="rounded-circle"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                          style={{ width: "80px", height: "80px" }}
                        >
                          <i className="bi bi-person-fill fs-2"></i>
                        </div>
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="col-md-7">
                      <h5 className="card-title mb-2">
                        {appointment.therapist?.title}{" "}
                        {appointment.therapist?.full_name}
                      </h5>
                      <div className="mb-2">
                        <i className="bi bi-calendar3 text-primary me-2"></i>
                        <strong>{formatDate(appointment.appointment_date)}</strong>
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-clock text-primary me-2"></i>
                        {formatTime(appointment.start_time)} -{" "}
                        {formatTime(appointment.end_time)}
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-geo-alt text-primary me-2"></i>
                        {appointment.appointment_type === "presencial"
                          ? "Presencial"
                          : "En línea"}
                      </div>
                      {appointment.notes && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <i className="bi bi-card-text me-1"></i>
                            {appointment.notes}
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Estado y acciones */}
                    <div className="col-md-3 text-md-end">
                      <div className="mb-3">
                        {getStatusBadge(appointment.status)}
                      </div>
                      {canCancelAppointment(appointment) && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Cancelar
                        </button>
                      )}
                      {appointment.status === "cancelled" &&
                        appointment.cancellation_reason && (
                          <small className="text-muted d-block mt-2">
                            Motivo: {appointment.cancellation_reason}
                          </small>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
