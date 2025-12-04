import { notFound } from "next/navigation";
import {
  getTherapistBySlug,
  getAllTherapistSlugs,
  getAllTherapists,
} from "@/utils/therapists";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookAppointmentButton from "@/components/BookAppointmentButton";

// Generar páginas estáticas para cada terapeuta
export async function generateStaticParams() {
  const slugs = await getAllTherapistSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generar metadata dinámica para SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const therapist = await getTherapistBySlug(slug);

  if (!therapist) {
    return {
      title: "Terapeuta no encontrado",
    };
  }

  const fullName = `${therapist.title || ""} ${therapist.full_name}`.trim();

  return {
    title: `${fullName} | InterSer Centro Psicoterapéutico`,
    description: therapist.bio || `Perfil profesional de ${fullName}`,
    openGraph: {
      title: fullName,
      description: therapist.bio || undefined,
      images: therapist.photo_url ? [therapist.photo_url] : undefined,
    },
  };
}

export default async function TherapistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const therapist = await getTherapistBySlug(slug);

  if (!therapist) {
    notFound();
  }

  // Obtener todos los terapeutas para el modal
  const allTherapists = await getAllTherapists();

  const whatsappLink = therapist.whatsapp
    ? `https://api.whatsapp.com/send?phone=${therapist.whatsapp}&text=Hola, solicito informes para una consulta psicológica`
    : null;

  return (
    <main className="page-offset">
      {/* Hero Section */}
      <section className="container-fluid bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 text-center mb-4 mb-lg-0">
              {therapist.photo_url ? (
                <Image
                  src={therapist.photo_url}
                  alt={therapist.full_name || "Terapeuta"}
                  width={300}
                  height={300}
                  className="rounded-circle shadow"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: 300, height: 300 }}
                >
                  <span className="text-white display-1">
                    {(therapist.full_name || "T").charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="col-lg-8">
              <h1 className="display-4 mb-3">
                {therapist.title && `${therapist.title} `}
                {therapist.full_name}
              </h1>
              {therapist.therapeutic_approach && (
                <p className="lead text-muted mb-3">
                  {therapist.therapeutic_approach}
                </p>
              )}
              {therapist.years_experience && (
                <p className="mb-3">
                  <strong>{therapist.years_experience}+ años</strong> de
                  experiencia clínica
                </p>
              )}
              {therapist.professional_id && (
                <p className="small text-muted">
                  Cédula Profesional: {therapist.professional_id}
                </p>
              )}

              {/* Botones de contacto */}
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <BookAppointmentButton
                  therapist={therapist}
                  allTherapists={allTherapists}
                />
                {therapist.phone && (
                  <a
                    href={`tel:${therapist.phone}`}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-telephone-fill me-2"></i>
                    Llamar
                  </a>
                )}
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {therapist.bio && (
        <section className="container py-5">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="mb-4">Sobre mí</h2>
              <p className="lead">{therapist.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* Credenciales */}
      {therapist.credentials.length > 0 && (
        <section className="container py-5 bg-light">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="mb-4">Formación Profesional</h2>
              <div className="list-group">
                {therapist.credentials.map((credential) => (
                  <div key={credential.id} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{credential.title}</h5>
                        <span className="badge bg-primary">
                          {credential.credential_type}
                        </span>
                      </div>
                      {credential.year && (
                        <small className="text-muted">{credential.year}</small>
                      )}
                    </div>
                    {credential.institution && (
                      <p className="mb-0 mt-2 small text-muted">
                        {credential.institution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Servicios */}
      {therapist.services.length > 0 && (
        <section className="container py-5">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="mb-4">Servicios</h2>
              <div className="row g-4">
                {therapist.services.map((service) => (
                  <div key={service.id} className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title text-primary">
                          {service.service_name}
                        </h5>
                        {service.description && (
                          <p className="card-text">{service.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Áreas de Intervención */}
      {therapist.interventions.length > 0 && (
        <section className="container py-5 bg-light">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="mb-4">Áreas de Intervención</h2>
              <div className="row g-3">
                {therapist.interventions.map((intervention) => (
                  <div key={intervention.id} className="col-md-4 col-sm-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>{intervention.intervention_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h3 className="mb-3">
              ¿Listo para comenzar tu proceso terapéutico?
            </h3>
            <p className="lead mb-4">
              Agenda una cita y da el primer paso hacia tu bienestar emocional
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <BookAppointmentButton
                therapist={therapist}
                allTherapists={allTherapists}
              />
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-lg"
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  Agenda por WhatsApp
                </a>
              )}
              {therapist.phone && (
                <a
                  href={`tel:${therapist.phone}`}
                  className="btn btn-outline-primary btn-lg"
                >
                  <i className="bi bi-telephone-fill me-2"></i>
                  {therapist.phone}
                </a>
              )}
            </div>
            <div className="mt-4">
              <Link href="/" className="text-muted">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
