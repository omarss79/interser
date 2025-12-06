import { NextRequest, NextResponse } from "next/server";
import { sendAppointmentConfirmationEmails } from "@/lib/email";
import { createClient } from "@/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "appointmentId es requerido" },
        { status: 400 }
      );
    }

    // Obtener datos completos de la cita
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select(
        `
        *,
        client:profiles!appointments_client_id_fkey(id, full_name, email),
        therapist:profiles!appointments_therapist_id_fkey(id, full_name, email, title)
      `
      )
      .eq("id", appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el cliente de esta cita
    if (appointment.client_id !== user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Preparar datos para el correo
    const emailData = {
      appointmentId: appointment.id,
      clientName: appointment.client.full_name,
      clientEmail: appointment.client.email,
      therapistName: appointment.therapist.title
        ? `${appointment.therapist.title} ${appointment.therapist.full_name}`
        : appointment.therapist.full_name,
      therapistEmail: appointment.therapist.email,
      appointmentDate: appointment.appointment_date,
      appointmentTime: appointment.start_time.substring(0, 5), // HH:mm
      appointmentType: appointment.appointment_type as "presencial" | "online",
      notes: appointment.notes || undefined,
    };

    // Validar variables de entorno
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY no está configurada");
      return NextResponse.json(
        {
          error: "Configuración de correo incompleta",
          details:
            "RESEND_API_KEY no está configurada en las variables de entorno",
        },
        { status: 500 }
      );
    }

    console.log("Enviando correos de confirmación para cita:", appointmentId);
    console.log("Cliente:", emailData.clientEmail);
    console.log("Terapeuta:", emailData.therapistEmail);
    console.log("Admin:", adminEmail || "admin@interser.org.mx");

    // Enviar correos
    const result = await sendAppointmentConfirmationEmails(
      emailData,
      resendApiKey,
      adminEmail
    );

    if (!result.success) {
      console.error("Error sending emails:", result);
      return NextResponse.json(
        {
          error: "Error al enviar correos",
          details: result.errors || result.error,
          partialSuccess: result.partialSuccess,
        },
        { status: 500 }
      );
    }

    console.log("Correos enviados exitosamente");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in send-appointment-email API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
