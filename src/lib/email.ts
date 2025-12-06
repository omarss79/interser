import { Resend } from "resend";

export interface AppointmentEmailData {
  appointmentId: string;
  clientName: string;
  clientEmail: string;
  therapistName: string;
  therapistEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "presencial" | "online";
  notes?: string;
}

/**
 * Envía correos de confirmación de cita al cliente, terapeuta y administrador
 */
export async function sendAppointmentConfirmationEmails(
  data: AppointmentEmailData,
  resendApiKey: string,
  adminEmail: string = "admin@interser.org.mx"
) {
  try {
    // Validar API key
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY no está configurada");
    }

    const resend = new Resend(resendApiKey);

    // Formatear fecha
    const formattedDate = new Date(
      data.appointmentDate + "T00:00:00"
    ).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Formatear hora
    const [hour, minute] = data.appointmentTime.split(":");
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    const formattedTime = `${hour12}:${minute} ${period}`;

    // HTML del correo para el cliente
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #198754; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #198754; }
            .detail-item { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #198754; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #198754; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Cita Confirmada</h1>
              <p>InterSer - Centro de Psicoterapia</p>
            </div>
            <div class="content">
              <p>Hola <strong>${data.clientName}</strong>,</p>
              <p>Tu cita ha sido agendada exitosamente. A continuación los detalles:</p>
              
              <div class="detail-box">
                <div class="detail-item">
                  <span class="detail-label">👤 Terapeuta:</span> ${data.therapistName}
                </div>
                <div class="detail-item">
                  <span class="detail-label">📅 Fecha:</span> ${formattedDate}
                </div>
                <div class="detail-item">
                  <span class="detail-label">🕐 Hora:</span> ${formattedTime}
                </div>
                <div class="detail-item">
                  <span class="detail-label">📍 Tipo:</span> ${data.appointmentType === "presencial" ? "Presencial" : "En línea"}
                </div>
                ${data.notes ? `<div class="detail-item"><span class="detail-label">📝 Notas:</span> ${data.notes}</div>` : ""}
              </div>

              <p><strong>¿Qué sigue?</strong></p>
              <ul>
                <li>El terapeuta se pondrá en contacto contigo para confirmar la sesión</li>
                <li>Por favor llega 10 minutos antes si es presencial</li>
                <li>Si es en línea, recibirás el enlace de la videollamada por correo</li>
              </ul>

              <p style="margin-top: 30px;">Si necesitas cancelar o reprogramar tu cita, por favor contáctanos con al menos 24 horas de anticipación.</p>
              
              <div style="text-align: center;">
                <a href="https://interser.org.mx/contacto" class="button">Contactar a InterSer</a>
              </div>
            </div>
            <div class="footer">
              <p>InterSer - Centro de Psicoterapia Gestalt y Humanista</p>
              <p>Este correo fue enviado automáticamente, por favor no responder.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // HTML del correo para el terapeuta
    const therapistEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0d6efd; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0d6efd; }
            .detail-item { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #0d6efd; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Nueva Cita Agendada</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${data.therapistName}</strong>,</p>
              <p>Se ha agendado una nueva cita para ti:</p>
              
              <div class="detail-box">
                <div class="detail-item">
                  <span class="detail-label">👤 Paciente:</span> ${data.clientName}
                </div>
                <div class="detail-item">
                  <span class="detail-label">📧 Email:</span> ${data.clientEmail}
                </div>
                <div class="detail-item">
                  <span class="detail-label">📅 Fecha:</span> ${formattedDate}
                </div>
                <div class="detail-item">
                  <span class="detail-label">🕐 Hora:</span> ${formattedTime}
                </div>
                <div class="detail-item">
                  <span class="detail-label">📍 Tipo:</span> ${data.appointmentType === "presencial" ? "Presencial" : "En línea"}
                </div>
                ${data.notes ? `<div class="detail-item"><span class="detail-label">📝 Notas del paciente:</span> ${data.notes}</div>` : ""}
                <div class="detail-item">
                  <span class="detail-label">🆔 ID de cita:</span> ${data.appointmentId}
                </div>
              </div>

              <p><strong>Acciones requeridas:</strong></p>
              <ul>
                <li>Confirmar la cita con el paciente</li>
                <li>Preparar el espacio/enlace según el tipo de consulta</li>
                <li>Revisar el historial si es paciente recurrente</li>
              </ul>
            </div>
            <div class="footer">
              <p>InterSer - Sistema de Gestión de Citas</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // HTML del correo para el administrador
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6c757d; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .detail-item { margin: 10px 0; }
            .detail-label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Nueva Cita Registrada</h1>
            </div>
            <div class="content">
              <p>Se ha registrado una nueva cita en el sistema:</p>
              
              <div class="detail-box">
                <div class="detail-item">
                  <span class="detail-label">Paciente:</span> ${data.clientName} (${data.clientEmail})
                </div>
                <div class="detail-item">
                  <span class="detail-label">Terapeuta:</span> ${data.therapistName} (${data.therapistEmail})
                </div>
                <div class="detail-item">
                  <span class="detail-label">Fecha:</span> ${formattedDate}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Hora:</span> ${formattedTime}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo:</span> ${data.appointmentType === "presencial" ? "Presencial" : "En línea"}
                </div>
                <div class="detail-item">
                  <span class="detail-label">ID:</span> ${data.appointmentId}
                </div>
                ${data.notes ? `<div class="detail-item"><span class="detail-label">Notas:</span> ${data.notes}</div>` : ""}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Usar dominio de prueba de Resend si no está en producción
    // Cambiar a tu dominio verificado cuando esté listo
    const fromEmail =
      process.env.NODE_ENV === "production"
        ? "InterSer <noreply@interser.org.mx>"
        : "InterSer <onboarding@resend.dev>";

    console.log("Enviando desde:", fromEmail);
    console.log("Destinatarios:", {
      client: data.clientEmail,
      therapist: data.therapistEmail,
      admin: adminEmail,
    });

    // Enviar correos en paralelo
    const results = await Promise.allSettled([
      // Correo al cliente
      resend.emails
        .send({
          from: fromEmail,
          to: data.clientEmail,
          subject: "✓ Confirmación de Cita - InterSer",
          html: clientEmailHtml,
        })
        .then((result) => {
          console.log("Correo al cliente enviado:", result);
          return result;
        })
        .catch((error) => {
          console.error("Error enviando correo al cliente:", error);
          throw error;
        }),

      // Correo al terapeuta
      resend.emails
        .send({
          from: fromEmail,
          to: data.therapistEmail,
          subject: "📅 Nueva Cita Agendada - InterSer",
          html: therapistEmailHtml,
        })
        .then((result) => {
          console.log("Correo al terapeuta enviado:", result);
          return result;
        })
        .catch((error) => {
          console.error("Error enviando correo al terapeuta:", error);
          throw error;
        }),

      // Correo al administrador
      resend.emails
        .send({
          from: fromEmail,
          to: adminEmail,
          subject: "📊 Nueva Cita Registrada - InterSer",
          html: adminEmailHtml,
        })
        .then((result) => {
          console.log("Correo al admin enviado:", result);
          return result;
        })
        .catch((error) => {
          console.error("Error enviando correo al admin:", error);
          throw error;
        }),
    ]);

    // Verificar resultados
    const errors = results
      .filter((r) => r.status === "rejected")
      .map((r, index) => {
        const reason = (r as PromiseRejectedResult).reason;
        const recipient =
          index === 0 ? "cliente" : index === 1 ? "terapeuta" : "admin";
        console.error(`Error enviando correo a ${recipient}:`, reason);
        return { recipient, error: reason };
      });

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    console.log(`Correos enviados exitosamente: ${successCount}/3`);

    if (errors.length > 0) {
      console.error("Errores al enviar correos:", errors);
      return {
        success: false,
        errors,
        partialSuccess: successCount > 0,
        successCount,
        totalCount: 3,
      };
    }

    return { success: true, successCount: 3 };
  } catch (error: any) {
    console.error("Error crítico en sendAppointmentConfirmationEmails:", error);
    return {
      success: false,
      error: error.message || error,
      stack: error.stack,
    };
  }
}
