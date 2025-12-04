"use client";

import { useState } from "react";
import AppointmentModal from "@/components/AppointmentModal";
import type { TherapistProfile } from "@/utils/therapists";

interface BookAppointmentButtonProps {
  therapist: TherapistProfile;
  allTherapists: TherapistProfile[];
}

export default function BookAppointmentButton({
  therapist,
  allTherapists,
}: BookAppointmentButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-success btn-lg"
      >
        <i className="bi bi-calendar-check me-2"></i>
        Reservar cita
      </button>

      <AppointmentModal
        show={showModal}
        onHide={() => setShowModal(false)}
        therapists={allTherapists}
        preselectedTherapistId={therapist.id}
      />
    </>
  );
}
