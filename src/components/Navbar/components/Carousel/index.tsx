"use client";

import React, { useEffect, useRef } from "react";

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || initialized.current) return;

    let pollId: number | undefined;
    const initCarousel = () => {
      const $ = (window as any).$;
      if (!($ && $.fn && $.fn.owlCarousel)) return false;

      const $carousel = $(carouselRef.current);
      if ($carousel.length === 0) return false;

      try {
        $carousel.owlCarousel({
          autoplay: true,
          smartSpeed: 1500,
          items: 1,
          loop: true,
        });
        initialized.current = true;
        return true;
      } catch (error) {
        console.error("Error al inicializar Owl Carousel:", error);
        return false;
      }
    };

    // Try immediate init; if jQuery/plugin aren't loaded yet, poll until available.
    if (!initCarousel()) {
      pollId = window.setInterval(() => {
        if (initCarousel() && pollId !== undefined) {
          clearInterval(pollId);
        }
      }, 100);
    }

    return () => {
      if (pollId !== undefined) clearInterval(pollId);
      if (initialized.current && (window as any).$) {
        try {
          (window as any).$(carouselRef.current).owlCarousel("destroy");
          initialized.current = false;
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div ref={carouselRef} className="header-carousel owl-carousel">
      <div className="header-carousel-item">
        <img src="img/carousel-1.jpg" className="img-fluid w-100" alt="Image" />
        <div className="carousel-caption">
          <div className="carousel-caption-content p-3">
            <h1 className="display-1 text-white mb-4">
              Bienestar Emocional Integral
            </h1>
            <p className="mb-5 fs-5">
              “Ansiedad, depresión, duelos… aquí te acompañamos para recuperar
              tu equilibrio.”
            </p>
            <a
              className="btn btn-primary rounded-pill text-white py-3 px-5"
              href="#"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>

      <div className="header-carousel-item">
        <img src="img/carousel-2.jpg" className="img-fluid w-100" alt="Image" />
        <div className="carousel-caption">
          <div className="carousel-caption-content p-3">
            <h1 className="display-1 text-white mb-4">
              Terapia Gestalt & Humanista
            </h1>
            <p className="mb-5 fs-5">
              “Vive el aquí y ahora, reconecta con tus emociones y redescubre tu
              autenticidad.”
            </p>
            <a
              className="btn btn-primary rounded-pill text-white py-3 px-5"
              href="#"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>

      <div className="header-carousel-item">
        <img src="img/carousel-2.jpg" className="img-fluid w-100" alt="Image" />
        <div className="carousel-caption">
          <div className="carousel-caption-content p-3">
            <h1 className="display-1 text-white mb-4">
              Terapia para parejas, familias y relaciones
            </h1>
            <p className="mb-5 fs-5">
              “Comunicación, vínculo y crecimiento en pareja o familia.”
            </p>
            <a
              className="btn btn-primary rounded-pill text-white py-3 px-5"
              href="#"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>

      <div className="header-carousel-item">
        <img src="img/carousel-2.jpg" className="img-fluid w-100" alt="Image" />
        <div className="carousel-caption">
          <div className="carousel-caption-content p-3">
            <h1 className="display-1 text-white mb-4">
              Terapia sexológica e identidad
            </h1>
            <p className="mb-5 fs-5">
              “Orientación sexual, transición, disfunciones: un espacio seguro
              sin juicio.”
            </p>
            <a
              className="btn btn-primary rounded-pill text-white py-3 px-5"
              href="#"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>

      <div className="header-carousel-item">
        <img src="img/carousel-2.jpg" className="img-fluid w-100" alt="Image" />
        <div className="carousel-caption">
          <div className="carousel-caption-content p-3">
            <h1 className="display-1 text-white mb-4">
              Modalidad presencial y online
            </h1>
            <p className="mb-5 fs-5">
              “Atención en Culiacán o desde cualquier lugar vía sesión en
              línea.”
            </p>
            <a
              className="btn btn-primary rounded-pill text-white py-3 px-5"
              href="#"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
