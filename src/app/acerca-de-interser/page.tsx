import React from "react";

export default function AboutPage() {
  return (
    <main
      className="container py-5 mt-3 border rounded page-offset"
      style={{ borderColor: "#e0e0e0" }}
    >
      <div className="row">
        <div className="col-12 col-lg-10 mx-auto">
          <h1 className="contact-title mb-4">Acerca de InterSer</h1>

          <section className="mb-5">
            <p className="lead">
              Bienvenidos a InterSer, un espacio de acompañamiento terapéutico
              con un enfoque profundamente humanista. Aquí creemos que cada
              persona es un ser único, con potencial para el crecimiento, la
              conexión y la autorrealización. Nuestro centro se funda en la
              convicción de que el bienestar emocional se alcanza a través de la
              autenticidad, la presencia y la relación consciente.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h3 mb-3">Nuestra misión</h2>
            <p>
              Guiar a quienes acuden a nosotros en su camino hacia una vida más
              plena. Ofrecemos un acompañamiento profesional para enfrentar
              desafíos como la ansiedad, la depresión, los duelos, los
              conflictos de pareja, la identidad, la sexualidad y los proyectos
              de vida. Ya sea de forma individual, en pareja o familiar, buscamos
              crear un espacio seguro, respetuoso y transformador.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h3 mb-3">Nuestro enfoque</h2>
            <p>
              En InterSer trabajamos con modalidades humanistas y gestálticas,
              centradas en el aquí y ahora, la responsabilidad personal y la
              conexión genuina. Fomentamos la exploración emocional, la
              conciencia plena y el contacto auténtico con uno mismo y con los
              demás. También integramos prácticas como primeros auxilios
              psicológicos para responder con calidez y eficacia en situaciones
              de crisis.
            </p>
            <p>
              Además, utilizamos técnicas como{" "}
              <strong>mindfulness</strong> para cultivar la presencia y la
              regulación emocional.
            </p>
            <p className="mt-3">
              <a
                href="https://interser.org.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                interser.org.mx
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
