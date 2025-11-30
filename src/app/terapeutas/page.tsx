import { getAllTherapists } from "@/utils/therapists";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestros Terapeutas | InterSer Centro Psicoterapéutico",
  description:
    "Conoce a nuestro equipo de psicoterapeutas profesionales con amplia experiencia en enfoque humanista y gestalt.",
};

export default async function TerapeutasPage() {
  const therapists = await getAllTherapists();

  return (
    <main className="page-offset">
      {/* Hero Section */}
      <section className="container-fluid bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 mb-3">Nuestros Terapeutas</h1>
          <p className="lead">
            Profesionales comprometidos con tu bienestar emocional
          </p>
        </div>
      </section>

      {/* Therapists Grid */}
      <section className="container py-5">
        {therapists.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead text-muted">
              No hay terapeutas disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {therapists.map((therapist) => (
              <div key={therapist.id} className="col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm hover-shadow transition">
                  <div className="card-body text-center">
                    <Link
                      href={`/${therapist.slug}`}
                      className="text-decoration-none"
                    >
                      {therapist.photo_url ? (
                        <div
                          className="position-relative mb-3 mx-auto"
                          style={{ width: 200, height: 200 }}
                        >
                          <Image
                            src={therapist.photo_url}
                            alt={therapist.full_name || ""}
                            fill
                            className="rounded-circle"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-3"
                          style={{ width: 200, height: 200 }}
                        >
                          <span className="text-white display-3">
                            {therapist.full_name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}

                      <h3 className="h5 mb-2">
                        {therapist.title && `${therapist.title} `}
                        {therapist.full_name}
                      </h3>

                      {therapist.therapeutic_approach && (
                        <p className="text-muted small mb-2">
                          {therapist.therapeutic_approach}
                        </p>
                      )}

                      {therapist.years_experience && (
                        <p className="small mb-3">
                          <strong>{therapist.years_experience}+</strong> años de
                          experiencia
                        </p>
                      )}
                    </Link>

                    <div className="d-flex gap-2 justify-content-center mb-3">
                      {therapist.phone && (
                        <a
                          href={`tel:${therapist.phone}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-telephone-fill"></i>
                        </a>
                      )}
                      {therapist.whatsapp && (
                        <a
                          href={`https://api.whatsapp.com/send?phone=${therapist.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-success"
                        >
                          <i className="bi bi-whatsapp"></i>
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/${therapist.slug}`}
                      className="btn btn-primary btn-sm"
                    >
                      Ver perfil completo →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container-fluid bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-3">¿Necesitas ayuda para elegir?</h2>
          <p className="lead mb-4">
            Contáctanos y te ayudaremos a encontrar al terapeuta ideal para ti
          </p>
          <Link href="/contacto" className="btn btn-primary btn-lg">
            Contáctanos
          </Link>
        </div>
      </section>
    </main>
  );
}
