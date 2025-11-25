import React from "react";

export default function ServiciosPage() {
  return (
    <main
      className="container py-5 mt-3 border rounded page-offset"
      style={{ borderColor: "#e0e0e0" }}
    >
      <div className="row">
        <div className="col-12 col-lg-10 mx-auto">
          <h1 className="contact-title mb-4">Servicios</h1>

          <section className="mb-5">
            <p className="lead">
              En InterSer ofrecemos un acompañamiento terapéutico integral desde
              un enfoque humanista, Gestalt, cognitivo-conductual y sexológico,
              adaptado a las necesidades únicas de cada persona. Nuestro
              objetivo es brindar un espacio seguro, cálido y profesional donde
              puedas explorar tus emociones, resolver conflictos internos y
              avanzar hacia una vida más plena.
            </p>
          </section>

          {/* Terapia Individual */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Terapia Individual para Adultos</h2>
            <p>Acompañamiento personalizado para trabajar temas como:</p>
            <ul>
              <li>Ansiedad y estrés</li>
              <li>Depresión</li>
              <li>Duelos y pérdidas</li>
              <li>Procesos de vida y toma de decisiones</li>
              <li>Autoestima y desarrollo personal</li>
              <li>Crisis existenciales</li>
              <li>Trastornos psicológicos y emocionales</li>
            </ul>
            <p>
              Nuestros terapeutas cuentan con amplia experiencia en psicoterapia
              humanista, Gestalt, psicodiagnóstico y procesos de transformación
              emocional.
            </p>
          </section>

          {/* Terapia de Pareja */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Terapia de Pareja</h2>
            <p>Espacio de trabajo para parejas que buscan:</p>
            <ul>
              <li>Mejorar la comunicación</li>
              <li>Resolver conflictos recurrentes</li>
              <li>Reconstruir la confianza</li>
              <li>Afrontar infidelidades, celos o inseguridades</li>
              <li>Redefinir acuerdos y límites sanos</li>
              <li>Reconectar emocional y sexualmente</li>
            </ul>
            <p>
              Desde el enfoque humanista, se promueve el diálogo honesto, la
              escucha activa y la construcción de un vínculo más consciente y
              funcional.
            </p>
          </section>

          {/* Terapia para Jóvenes y Adolescentes */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Terapia para Jóvenes y Adolescentes</h2>
            <p>Intervenciones orientadas a:</p>
            <ul>
              <li>Ansiedad y depresión</li>
              <li>Manejo emocional</li>
              <li>Dificultades escolares o familiares</li>
              <li>Identidad, autoestima y pertenencia</li>
              <li>Orientación vocacional y proyectos de vida</li>
            </ul>
            <p>
              Cuidamos especialmente el acompañamiento respetuoso, cercano y
              empático, atendiendo la etapa de desarrollo y el contexto del
              joven.
            </p>
          </section>

          {/* Terapia Sexológica */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Terapia Sexológica</h2>
            <p>
              Especializada para adultos, jóvenes y parejas que desean trabajar
              temas como:
            </p>
            <ul>
              <li>Disfunciones sexuales</li>
              <li>Sexualidad consciente y placentera</li>
              <li>Orientación sexual e identidad de género</li>
              <li>Proceso de transición de género</li>
              <li>Abuso sexual y recuperación emocional</li>
              <li>Educación sexual y vínculos saludables</li>
            </ul>
            <p>
              La atención es ofrecida por especialistas con formación
              profesional en sexualidad humana.
            </p>
          </section>

          {/* Terapia Gestalt */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Terapia Gestalt (Aquí y Ahora)</h2>
            <p>Un proceso terapéutico centrado en:</p>
            <ul>
              <li>El presente y la experiencia inmediata</li>
              <li>El contacto con emociones auténticas</li>
              <li>La integración de cuerpo, emoción y pensamiento</li>
              <li>
                El fortalecimiento del autoconocimiento y la responsabilidad
              </li>
            </ul>
            <p>
              Esta terapia, realizada por psicoterapeutas con formación avanzada
              Gestalt, es efectiva para resultados a corto plazo y para
              restablecer la conexión con uno mismo y el entorno.
            </p>
          </section>

          {/* Terapia Familiar */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Terapia Familiar</h2>
            <p>Intervenciones orientadas a:</p>
            <ul>
              <li>Conflictos entre miembros de la familia</li>
              <li>Crisis familiares</li>
              <li>Comunicación y límites</li>
              <li>Procesos de separación o duelo</li>
              <li>Restauración de vínculos sanos</li>
            </ul>
            <p>
              Se promueve un espacio seguro donde cada integrante pueda
              expresarse y ser escuchado.
            </p>
          </section>

          {/* Primeros Auxilios Psicológicos */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Primeros Auxilios Psicológicos (PAP)</h2>
            <p>Atención inmediata para situaciones de crisis emocional como:</p>
            <ul>
              <li>Ataques de ansiedad</li>
              <li>Eventos traumáticos</li>
              <li>Pérdidas inesperadas</li>
              <li>Rupturas o conflictos agudos</li>
              <li>Estrés intenso</li>
            </ul>
            <p>
              Nuestro equipo está certificado para brindar contención,
              estabilización emocional y acompañamiento inicial en momentos
              críticos.
            </p>
          </section>

          {/* Psicodiagnóstico */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Psicodiagnóstico</h2>
            <p>
              Evaluación profesional para adolescentes y adultos que incluye:
            </p>
            <ul>
              <li>Entrevistas clínicas</li>
              <li>Pruebas psicológicas</li>
              <li>Devolución y recomendaciones</li>
              <li>Plan de intervención terapéutica</li>
            </ul>
            <p>
              Ideal para obtener claridad sobre procesos emocionales,
              dificultades psicológicas o para orientar decisiones de vida.
            </p>
          </section>

          {/* Masaje de Desbloqueo Psicocorporal */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Masaje de Desbloqueo Psicocorporal</h2>
            <p>Un enfoque terapéutico que integra cuerpo y emoción para:</p>
            <ul>
              <li>Liberar tensión acumulada</li>
              <li>Facilitar la expresión emocional</li>
              <li>Reducir estrés y ansiedad</li>
              <li>Restablecer el equilibrio corporal</li>
            </ul>
            <p>
              Es una técnica realizada por especialistas en psicoterapia
              corporal y procesos humanistas.
            </p>
          </section>

          {/* Terapia Online */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Terapia Online</h2>
            <p>
              Atención profesional a distancia, con la misma calidad y eficacia
              de la terapia presencial. Ideal para:
            </p>
            <ul>
              <li>Personas que viven fuera de Culiacán</li>
              <li>Quienes requieren flexibilidad horaria</li>
              <li>Situaciones de movilidad limitada</li>
              <li>Procesos que requieren continuidad desde cualquier lugar</li>
            </ul>
            <p>
              Modalidad segura, privada y accesible para quienes buscan apoyo
              emocional desde casa.
            </p>
          </section>

          {/* Cierre */}
          <section className="mb-5 p-4 bg-light rounded">
            <h2 className="h4 mb-3">
              Un espacio para sanar, crecer y reencontrarte
            </h2>
            <p>
              En InterSer creemos en el potencial humano, en la autenticidad y
              en la fuerza transformadora de la relación terapéutica. Nuestro
              equipo está listo para acompañarte en cada paso de tu proceso.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
