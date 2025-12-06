"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getTherapistSchedules,
  getTherapistExceptions,
  getTherapistAppointments,
  generateTimeSlotsFromSchedules,
  getAvailableDays,
  createAppointment,
} from "@/utils/appointments";
import type { TherapistProfile } from "@/utils/therapists";
import type { TimeSlot, AvailableDay } from "@/interfaces/appointments";
import AppointmentConfirmationModal from "@/components/AppointmentConfirmationModal";

interface AppointmentModalProps {
  show: boolean;
  onHide: () => void;
  therapists: TherapistProfile[];
  preselectedTherapistId?: string;
}

export default function AppointmentModal({
  show,
  onHide,
  therapists,
  preselectedTherapistId,
}: AppointmentModalProps) {
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>(
    preselectedTherapistId || ""
  );
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<
    "presencial" | "online"
  >("presencial");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    therapistName: string;
    date: string;
    time: string;
    type: "presencial" | "online";
    notes?: string;
  } | null>(null);

  const daysToShow = 3; // Mostrar 3 días a la vez

  // Cargar horarios cuando se selecciona un terapeuta
  useEffect(() => {
    if (selectedTherapistId) {
      loadTherapistSchedule();
    } else {
      setAvailableDays([]);
      setSelectedDate("");
      setTimeSlots([]);
    }
  }, [selectedTherapistId]);

  // Cargar slots de tiempo cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate && selectedTherapistId) {
      loadTimeSlots();
    }
  }, [selectedDate]);

  const loadTherapistSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      const endDate = maxDate.toISOString().split("T")[0];

      const [schedules, exceptions] = await Promise.all([
        getTherapistSchedules(selectedTherapistId),
        getTherapistExceptions(selectedTherapistId, today, endDate),
      ]);

      const days = getAvailableDays(schedules, exceptions, 30);
      setAvailableDays(days);

      // Seleccionar automáticamente el primer día disponible
      const firstAvailable = days.find((d) => d.hasSchedule);
      if (firstAvailable) {
        setSelectedDate(firstAvailable.date);
      }
    } catch (error) {
      console.error("Error loading therapist schedule:", error);
      toast.error("Error al cargar horarios del terapeuta");
    } finally {
      setLoadingSchedule(false);
    }
  };

  const loadTimeSlots = async () => {
    try {
      const selectedDay = availableDays.find((d) => d.date === selectedDate);
      if (!selectedDay || !selectedDay.hasSchedule) {
        setTimeSlots([]);
        return;
      }

      // Obtener horarios y citas
      const [schedules, appointments] = await Promise.all([
        getTherapistSchedules(selectedTherapistId),
        getTherapistAppointments(
          selectedTherapistId,
          selectedDate,
          selectedDate
        ),
      ]);

      // Filtrar todos los horarios para este día (puede haber varios bloques por día, ej: mañana y tarde)
      const daySchedules = schedules.filter(
        (s) => s.day_of_week === selectedDay.dayOfWeek
      );

      if (daySchedules.length === 0) {
        setTimeSlots([]);
        return;
      }

      // Generar slots usando la nueva función que maneja múltiples bloques horarios
      const slots = generateTimeSlotsFromSchedules(
        daySchedules,
        appointments,
        selectedDate,
        60
      );

      setTimeSlots(slots);
    } catch (error) {
      console.error("Error loading time slots:", error);
      toast.error("Error al cargar horarios disponibles");
    }
  };

  const handleNextDays = () => {
    if (currentDayIndex + daysToShow < availableDays.length) {
      setCurrentDayIndex(currentDayIndex + daysToShow);
    }
  };

  const handlePrevDays = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(Math.max(0, currentDayIndex - daysToShow));
    }
  };

  const handleSubmit = async () => {
    if (!selectedTherapistId || !selectedDate || !selectedTime) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting appointment:", {
        therapist_id: selectedTherapistId,
        appointment_date: selectedDate,
        start_time: selectedTime,
        appointment_type: appointmentType,
        notes: notes || undefined,
        today: new Date().toISOString().split("T")[0],
      });

      const result = await createAppointment({
        therapist_id: selectedTherapistId,
        appointment_date: selectedDate,
        start_time: selectedTime,
        appointment_type: appointmentType,
        notes: notes || undefined,
      });

      if (result.success) {
        // Obtener nombre del terapeuta
        const therapist = therapists.find((t) => t.id === selectedTherapistId);
        const therapistName = therapist
          ? `${therapist.prefix || ""} ${therapist.full_name}`.trim()
          : "Terapeuta";

        // Preparar datos de confirmación
        setConfirmedAppointment({
          therapistName,
          date: selectedDate,
          time: selectedTime,
          type: appointmentType,
          notes: notes || undefined,
        });

        // Cerrar modal de reserva y abrir modal de confirmación
        onHide();
        setShowConfirmation(true);

        // Reset form
        setSelectedDate("");
        setSelectedTime("");
        setNotes("");
        setSelectedTherapistId(preselectedTherapistId || "");
      } else {
        toast.error(result.error || "Error al agendar cita");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Error inesperado al agendar cita");
    } finally {
      setLoading(false);
    }
  };

  const visibleDays = availableDays.slice(
    currentDayIndex,
    currentDayIndex + daysToShow
  );

  return (
    <>
      {show && (
        <div
          className={`modal fade ${show ? "show d-block" : ""}`}
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reservar Cita</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onHide}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Selector de Terapeuta */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Selecciona un terapeuta
                  </label>
                  <select
                    className="form-select"
                    value={selectedTherapistId}
                    onChange={(e) => {
                      setSelectedTherapistId(e.target.value);
                      setCurrentDayIndex(0);
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                  >
                    <option value="">-- Selecciona un terapeuta --</option>
                    {therapists.map((therapist) => (
                      <option key={therapist.id} value={therapist.id}>
                        {therapist.title} {therapist.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingSchedule ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : selectedTherapistId ? (
                  <>
                    {/* Calendario de 3 días */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <label className="form-label fw-bold mb-0">
                          Selecciona una fecha
                        </label>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={handlePrevDays}
                            disabled={currentDayIndex === 0}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={handleNextDays}
                            disabled={
                              currentDayIndex + daysToShow >=
                              availableDays.length
                            }
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>

                      <div className="row g-2">
                        {visibleDays.map((day) => (
                          <div key={day.date} className="col-4">
                            <button
                              className={`btn w-100 ${
                                selectedDate === day.date
                                  ? "btn-primary"
                                  : day.hasSchedule
                                  ? "btn-outline-primary"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() =>
                                day.hasSchedule && setSelectedDate(day.date)
                              }
                              disabled={!day.hasSchedule}
                            >
                              <div className="small">{day.dayName}</div>
                              <div className="fw-bold">
                                {new Date(day.date + "T00:00:00").getDate()}
                              </div>
                              <div className="small">
                                {new Date(
                                  day.date + "T00:00:00"
                                ).toLocaleDateString("es-MX", {
                                  month: "short",
                                })}
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Horarios disponibles */}
                    {selectedDate && (
                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Horarios disponibles
                        </label>
                        {timeSlots.length === 0 ? (
                          <div className="alert alert-info">
                            No hay horarios disponibles para este día
                          </div>
                        ) : (
                          <div className="row g-2">
                            {timeSlots.map((slot) => (
                              <div key={slot.time} className="col-3">
                                <button
                                  className={`btn btn-sm w-100 ${
                                    selectedTime === slot.time
                                      ? "btn-primary"
                                      : slot.available
                                      ? "btn-outline-primary"
                                      : "btn-outline-secondary"
                                  }`}
                                  onClick={() =>
                                    slot.available && setSelectedTime(slot.time)
                                  }
                                  disabled={!slot.available}
                                >
                                  {slot.time}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tipo de cita */}
                    {selectedTime && (
                      <>
                        <div className="mb-4">
                          <label className="form-label fw-bold">
                            Tipo de cita
                          </label>
                          <div className="btn-group w-100" role="group">
                            <input
                              type="radio"
                              className="btn-check"
                              id="presencial"
                              checked={appointmentType === "presencial"}
                              onChange={() => setAppointmentType("presencial")}
                            />
                            <label
                              className="btn btn-outline-primary"
                              htmlFor="presencial"
                            >
                              <i className="fas fa-building me-2"></i>
                              Presencial
                            </label>

                            <input
                              type="radio"
                              className="btn-check"
                              id="online"
                              checked={appointmentType === "online"}
                              onChange={() => setAppointmentType("online")}
                            />
                            <label
                              className="btn btn-outline-primary"
                              htmlFor="online"
                            >
                              <i className="fas fa-laptop me-2"></i>
                              Online
                            </label>
                          </div>
                        </div>

                        {/* Notas opcionales */}
                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            Notas (opcional)
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Describe brevemente el motivo de tu consulta..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            maxLength={500}
                          />
                          <small className="text-muted">
                            {notes.length}/500 caracteres
                          </small>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="alert alert-info">
                    Por favor selecciona un terapeuta para ver horarios
                    disponibles
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={
                    !selectedTherapistId ||
                    !selectedDate ||
                    !selectedTime ||
                    loading
                  }
                >
                  {loading ? "Agendando..." : "Confirmar cita"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación - Fuera del modal de reserva */}
      <AppointmentConfirmationModal
        show={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        appointmentDetails={confirmedAppointment}
      />
    </>
  );
}
