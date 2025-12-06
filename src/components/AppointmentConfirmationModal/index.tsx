"use client";

interface AppointmentConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  appointmentDetails: {
    therapistName: string;
    date: string;
    time: string;
    type: "presencial" | "online";
    notes?: string;
  } | null;
}

export default function AppointmentConfirmationModal({
  show,
  onHide,
  appointmentDetails,
}: AppointmentConfirmationModalProps) {
  if (!show || !appointmentDetails) return null;

  // Formatear fecha a formato legible
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Formatear hora
  const formatTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(":");
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${hour12}:${minute} ${period}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onHide}
        style={{ zIndex: 1055 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1060 }}
        aria-labelledby="confirmationModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="confirmationModalLabel">
                <i className="bi bi-check-circle-fill me-2"></i>
                ¡Cita Confirmada!
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onHide}
                aria-label="Cerrar"
              />
            </div>

            <div className="modal-body">
              <div className="text-center mb-4">
                <div
                  className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i
                    className="bi bi-calendar-check text-success"
                    style={{ fontSize: "2.5rem" }}
                  ></i>
                </div>
                <p className="text-muted mb-0">
                  Tu cita ha sido agendada exitosamente
                </p>
              </div>

              <div className="card">
                <div className="card-body">
                  <h6 className="card-title text-muted mb-3">
                    Detalles de la cita
                  </h6>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-person-circle text-primary me-2"></i>
                      <strong>Terapeuta:</strong>
                    </div>
                    <p className="ms-4 mb-0">
                      {appointmentDetails.therapistName}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar3 text-primary me-2"></i>
                      <strong>Fecha:</strong>
                    </div>
                    <p className="ms-4 mb-0">
                      {formatDate(appointmentDetails.date)}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-clock text-primary me-2"></i>
                      <strong>Hora:</strong>
                    </div>
                    <p className="ms-4 mb-0">
                      {formatTime(appointmentDetails.time)}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-geo-alt text-primary me-2"></i>
                      <strong>Tipo de consulta:</strong>
                    </div>
                    <p className="ms-4 mb-0">
                      {appointmentDetails.type === "presencial"
                        ? "Presencial"
                        : "En línea"}
                    </p>
                  </div>

                  {appointmentDetails.notes && (
                    <div className="mb-0">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-card-text text-primary me-2"></i>
                        <strong>Notas:</strong>
                      </div>
                      <p className="ms-4 mb-0 text-muted small">
                        {appointmentDetails.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="alert alert-info mt-3 mb-0" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <small>
                  Recibirás un correo de confirmación con los detalles de tu
                  cita. El terapeuta se pondrá en contacto contigo para
                  confirmar la sesión.
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={onHide}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
