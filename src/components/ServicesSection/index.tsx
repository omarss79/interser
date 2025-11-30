import Link from "next/link";

export default function ServicesSection() {
  const services = [
    {
      icon: "fas fa-user",
      title: "Terapia Individual",
      description:
        "Acompañamiento personalizado para ansiedad, depresión, duelos, autoestima y procesos de transformación emocional.",
      delay: "0.1s",
    },
    {
      icon: "fas fa-heart",
      title: "Terapia de Pareja",
      description:
        "Mejora la comunicación, resuelve conflictos y reconecta emocionalmente desde el enfoque humanista.",
      delay: "0.3s",
    },
    {
      icon: "fas fa-users",
      title: "Terapia Familiar",
      description:
        "Espacio seguro para resolver conflictos, restaurar vínculos y fortalecer la comunicación familiar.",
      delay: "0.5s",
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Jóvenes y Adolescentes",
      description:
        "Atención especializada en identidad, autoestima, manejo emocional y orientación vocacional.",
      delay: "0.7s",
    },
    {
      icon: "fas fa-venus-mars",
      title: "Terapia Sexológica",
      description:
        "Especializada en sexualidad consciente, identidad de género, disfunciones y vínculos saludables.",
      delay: "0.1s",
    },
    {
      icon: "fas fa-spa",
      title: "Terapia Gestalt",
      description:
        "Enfoque en el aquí y ahora, contacto con emociones auténticas e integración cuerpo-mente.",
      delay: "0.3s",
    },
    {
      icon: "fas fa-hand-holding-heart",
      title: "Primeros Auxilios Psicológicos",
      description:
        "Atención inmediata en crisis emocionales, ataques de ansiedad y eventos traumáticos.",
      delay: "0.5s",
    },
    {
      icon: "fas fa-laptop",
      title: "Terapia Online",
      description:
        "Atención profesional a distancia con la misma calidad, flexible y accesible desde cualquier lugar.",
      delay: "0.7s",
    },
  ];

  return (
    <div className="container-fluid feature py-5">
      <div className="container py-5">
        <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.1s">
          <div className="sub-style">
            <h4 className="sub-title px-3 mb-0">¿Por qué elegir InterSer?</h4>
          </div>
          <h1 className="display-3 mb-4">
            Acompañamiento Integral para tu Bienestar Emocional
          </h1>
          <p className="mb-0">
            En InterSer ofrecemos un acompañamiento terapéutico integral desde
            un enfoque humanista, Gestalt, cognitivo-conductual y sexológico.
            Nuestro objetivo es brindar un espacio seguro, cálido y profesional
            donde puedas explorar tus emociones, resolver conflictos internos y
            avanzar hacia una vida más plena.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp"
              data-wow-delay={service.delay}
            >
              <div className="row-cols-1 feature-item p-4">
                <div className="col-12">
                  <div className="feature-icon mb-4">
                    <div className="p-3 d-inline-flex bg-white rounded">
                      <i className={`${service.icon} fa-4x text-primary`}></i>
                    </div>
                  </div>
                  <div className="feature-content d-flex flex-column">
                    <h5 className="mb-4">{service.title}</h5>
                    <p className="mb-0">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div
            className="col-12 text-center wow fadeInUp"
            data-wow-delay="0.2s"
          >
            <Link
              href="/servicios"
              className="btn btn-primary rounded-pill text-white py-3 px-5"
            >
              Ver todos los servicios
            </Link>
          </div>
        </div>

        {/* Por qué elegir InterSer */}
        <div className="row mt-5 pt-5">
          <div className="col-12">
            <div className="section-title text-center mb-4 wow fadeInUp">
              <h2 className="display-5 mb-4">¿Por qué elegir InterSer?</h2>
            </div>
          </div>
          <div className="col-lg-10 mx-auto">
            <div className="row g-4">
              <div className="col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-seedling fa-3x text-primary me-3"></i>
                  </div>
                  <div>
                    <h5>Humanismo y autenticidad</h5>
                    <p className="mb-0">
                      Atendemos con profundidad, respeto y mirada integral hacia
                      ti como persona.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 wow fadeInUp" data-wow-delay="0.2s">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-brain fa-3x text-primary me-3"></i>
                  </div>
                  <div>
                    <h5>Profesionales con formación y experiencia</h5>
                    <p className="mb-0">
                      Psicoterapeutas con especialización, años de práctica
                      clínica y dedicación.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-comments fa-3x text-primary me-3"></i>
                  </div>
                  <div>
                    <h5>Atención flexible</h5>
                    <p className="mb-0">
                      Ofrecemos sesiones presenciales y en línea, para
                      adaptarnos a tus necesidades.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 wow fadeInUp" data-wow-delay="0.4s">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-heart fa-3x text-primary me-3"></i>
                  </div>
                  <div>
                    <h5>Enfoque completo</h5>
                    <p className="mb-0">
                      Abordamos mente, cuerpo y emociones; no solo síntomas,
                      sino bienestar integral.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-handshake fa-3x text-primary me-3"></i>
                  </div>
                  <div>
                    <h5>Compromiso con tu proceso</h5>
                    <p className="mb-0">
                      Acompañamiento ético, confidencial y empático; contigo en
                      cada paso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
