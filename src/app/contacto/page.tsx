import React from "react";
import Link from "next/link";

export default function ContactPage() {
  const address =
    "Municipio de Culiacán 2673, Fraccionamiento Floresta, 80014 Culiacán Rosales, Sin.";
  const phone = "6671792487";
  const whatsapp = "6671792487";
  const email = "contacto@interser.org.mx"; // placeholder email
  const googleMapsUrl =
    "https://www.google.com/maps/place/InterSer/@24.8359529,-107.3661277,15.05z/data=!4m22!1m15!4m14!1m6!1m2!1s0x86bcd9a190906ed7:0x7aa4c1a84e9812d!2sInterSer,+Municipio+de+Culiacan,+Fraccionamiento+Floresta,+Culiac%C3%A1n,+Sinaloa!2m2!1d-107.3598355!2d24.8379294!1m6!1m2!1s0x86bcd9a190906ed7:0x7aa4c1a84e9812d!2sMunicipio+de+Culiacan+2673,+Fraccionamiento+Floresta,+80014+Culiac%C3%A1n+Rosales,+Sin.!2m2!1d-107.3598355!2d24.8379294!3m5!1s0x86bcd9a190906ed7:0x7aa4c1a84e9812d!8m2!3d24.8379294!4d-107.3598355!16s%2Fg%2F11skfw2r8d?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D";

  return (
    <main
      className="container py-5 mt-3 border rounded page-offset"
      style={{ borderColor: "#e0e0e0" }}
    >
      {/* Hero banner: editable image (Unsplash placeholder). Replace URL with a local image under /public/img if desired. */}
      {/* <div className="contact-hero mb-4">
        <div className="contact-hero-overlay">
          <h1 className="contact-hero-title">InterSer - Centro Psicoterapéutico Humanista</h1>
        </div>
      </div> */}
      <div className="row">
        <div className="col-12 col-md-8">
          <h1 className="contact-title">
            InterSer - Centro Psicoterapéutico Humanista
          </h1>

          <section className="mt-4">
            <h2 className="h5">Contacto</h2>
            <p className="mb-1">
              <strong>Dirección:</strong> {address}
            </p>
            <p className="mb-1">
              <strong>Teléfono:</strong> <a href={`tel:${phone}`}>{phone}</a>
            </p>
            <p className="mb-1">
              <strong>WhatsApp:</strong>{" "}
              <a
                href={`https://wa.me/52${whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                {whatsapp}
              </a>
            </p>
            <p className="mb-1">
              <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
            </p>
          </section>

          <section className="mt-4">
            <h2 className="h5">Horario de atención</h2>
            <ul>
              <li>Lunes a Viernes: 09:00 - 18:00</li>
              <li>Sábados: 09:00 - 13:00</li>
              <li>Domingos: Cerrado</li>
            </ul>
          </section>

          <section className="mt-4">
            <h2 className="h5">Cómo llegar</h2>
            <p>Puedes ver la ubicación en Google Maps:</p>
            <p>
              <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                Abrir en Google Maps
              </a>
            </p>
          </section>

          <section className="mt-4">
            <h2 className="h5">¿Necesitas más ayuda?</h2>
            <p>
              Si quieres que nos pongamos en contacto contigo, envíanos un
              correo a <a href={`mailto:${email}`}>{email}</a> o escríbenos por
              WhatsApp y te atenderemos a la brevedad.
            </p>
          </section>
        </div>

        <div className="col-12 col-md-4 mt-4 mt-md-0">
          <div className="card p-3">
            <h3 className="h6 summary-title">Resumen</h3>
            <p className="mb-1">InterSer - Centro Psicoterapéutico Humanista</p>
            <p className="mb-1">
              <strong>Dirección:</strong>
              <br />
              {address}
            </p>
            <p className="mb-1">
              <strong>Tel:</strong> <a href={`tel:${phone}`}>{phone}</a>
            </p>
            <p className="mb-1">
              <strong>WhatsApp:</strong>{" "}
              <a
                href={`https://wa.me/52${whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                {whatsapp}
              </a>
            </p>
            <p className="mb-0">
              <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>

          <div className="mt-3">
            <iframe
              title="InterSer - mapa"
              src={`https://www.google.com/maps?q=24.8379294,-107.3598355&z=15&output=embed`}
              width="100%"
              height={220}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
