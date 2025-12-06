"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import AppointmentModal from "@/components/AppointmentModal";
import LoginModal from "@/components/LoginModal";
import type { TherapistProfile } from "@/utils/therapists";

interface BookAppointmentButtonProps {
  therapist: TherapistProfile;
  allTherapists: TherapistProfile[];
}

export default function BookAppointmentButton({
  therapist,
  allTherapists,
}: BookAppointmentButtonProps) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const supabase = createClient();

  // Check authentication status
  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      setShowAppointmentModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setShowAppointmentModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="btn btn-success btn-lg"
        disabled={isChecking}
      >
        <i className="bi bi-calendar-check me-2"></i>
        Reservar cita
      </button>

      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AppointmentModal
        show={showAppointmentModal}
        onHide={() => setShowAppointmentModal(false)}
        therapists={allTherapists}
        preselectedTherapistId={therapist.id}
      />
    </>
  );
}
