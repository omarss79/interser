import Image from "next/image";
import Link from "next/link";
import type { TherapistProfile } from "@/utils/therapists";

interface TeamSectionProps {
  therapists: TherapistProfile[];
}

export default function TeamSection({ therapists }: TeamSectionProps) {
  return (
    <div className="container-fluid team py-5">
      <div className="container py-5">
        <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.1s">
          <div className="sub-style">
            <h4 className="sub-title px-3 mb-0">Conoce a nuestro equipo</h4>
          </div>
          <h1 className="display-3 mb-4">
            Servicios Psicoterapéuticos de Terapeutas Profesionales
          </h1>
          <p className="mb-0">
            Nuestro equipo de psicoterapeutas está comprometido con tu bienestar
            emocional. Con amplia experiencia en enfoque humanista y gestalt,
            estamos aquí para acompañarte en tu proceso de crecimiento personal.
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          {therapists.map((therapist, index) => (
            <div
              key={therapist.id}
              className="col-md-6 col-lg-6 col-xl-4 wow fadeInUp"
              data-wow-delay={`${0.1 + index * 0.2}s`}
            >
              <div className="team-item rounded">
                <div className="team-img rounded-top h-100">
                  {therapist.photo_url ? (
                    <Image
                      src={therapist.photo_url}
                      alt={therapist.full_name || "Terapeuta"}
                      width={400}
                      height={500}
                      className="img-fluid rounded-top w-100"
                      style={{ objectFit: "cover", height: "400px" }}
                    />
                  ) : (
                    <div
                      className="bg-secondary d-flex align-items-center justify-content-center"
                      style={{ height: "400px" }}
                    >
                      <span className="text-white display-1">
                        {(therapist.full_name || "T").charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="team-icon d-flex justify-content-center">
                    <Link
                      href={`/${therapist.slug}`}
                      className="btn btn-square btn-primary text-white rounded-circle mx-1"
                      title="Ver perfil completo"
                    >
                      <i className="fas fa-user"></i>
                    </Link>
                    <a
                      href={`/${therapist.slug}#contacto`}
                      className="btn btn-square btn-primary text-white rounded-circle mx-1"
                      title="Contactar"
                    >
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
                <div className="team-content text-center border border-primary border-top-0 rounded-bottom p-4">
                  <h5>
                    {therapist.title && `${therapist.title} `}
                    {therapist.full_name}
                  </h5>
                  <p className="mb-0">
                    {therapist.therapeutic_approach || "Psicoterapeuta"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link href="/terapeutas" className="btn btn-primary btn-lg">
            Ver todos los terapeutas
          </Link>
        </div>
      </div>
    </div>
  );
}
