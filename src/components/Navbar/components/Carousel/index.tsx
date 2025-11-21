"use client";

import React, { useEffect, useState } from "react";

const index = () => {
  // Estado para controlar si el carrusel se ha inicializado en el cliente

  const [isCarouselReady, setIsCarouselReady] = useState(false);

  useEffect(() => {
    // 1. Verificar disponibilidad de jQuery (usamos 'any' para el global $)

    if (typeof window !== "undefined" && (window as any).$) {
      const $ = (window as any).$;

      const $carouselElement = $(".header-carousel");

      if ($carouselElement.length === 0) {
        // Si el elemento no existe, salimos

        return;
      }

      // 2. Inicializar Owl Carousel

      try {
        $carouselElement.owlCarousel({
          autoplay: true,

          smartSpeed: 1500,

          items: 1,

          loop: true,

          // ... otras opciones ...
        });

        // 3. Una vez inicializado (y el DOM modificado), actualizamos el estado

        // Esto causará un re-renderizado SÓLO en el cliente.

        setIsCarouselReady(true);
      } catch (error) {
        console.error("Error al inicializar Owl Carousel:", error);
      }
    }

    // 4. Limpieza (opcional pero recomendado)

    return () => {
      // Intentar destruir el carrusel si el componente se desmonta

      if (typeof window !== "undefined" && (window as any).$) {
        // Asegúrate de que el carrusel fue inicializado antes de intentar destruirlo

        ((window as any).$(".header-carousel") as any).owlCarousel("destroy");
      }
    };
  }, []);

  // --- Renderizado ---

  // Mientras NO esté listo, renderizamos una versión simple o un spinner.

  // Esto asegura que el HTML enviado por el servidor sea *exactamente* lo que React está validando.

  if (!isCarouselReady) {
    // Puedes devolver una versión estática simple o un placeholder para evitar el error.

    // Esto es lo que el servidor renderizará y lo que React validará antes de la inicialización.

    return (
      //   <div className="header-carousel-placeholder">

      //     {/* Usamos el primer elemento como placeholder estático */}

      //     <div className="header-carousel-item">

      //       <img

      //         src="img/carousel-1.jpg"

      //         className="img-fluid w-100"

      //         alt="Image Placeholder"

      //       />

      //       {/* ... contenido ... */}

      //     </div>

      //   </div>

      <div
        className="header-carousel owl-carousel"
        suppressHydrationWarning={true}
      >
        <div className="header-carousel-item">
          <img
            src="img/carousel-1.jpg"
            className="img-fluid w-100"
            alt="Image"
          />

          <div className="carousel-caption">
            <div className="carousel-caption-content p-3">
              <h5
                className="text-white text-uppercase fw-bold mb-4"
                style={{ letterSpacing: "3px" }}
              >
                Physiotherapy Center
              </h5>

              <h1 className="display-1 text-capitalize text-white mb-4">
                Best Solution For Painful Life
              </h1>

              <p className="mb-5 fs-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s,
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
          <img
            src="img/carousel-2.jpg"
            className="img-fluid w-100"
            alt="Image"
          />

          <div className="carousel-caption">
            <div className="carousel-caption-content p-3">
              <h5
                className="text-white text-uppercase fw-bold mb-4"
                style={{ letterSpacing: "3px" }}
              >
                Physiotherapy Center
              </h5>

              <h1 className="display-1 text-capitalize text-white mb-4">
                Best Solution For Painful Life
              </h1>

              <p className="mb-5 fs-5 animated slideInDown">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s,
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
  }

  return (
    <div
      className="header-carousel owl-carousel"
      suppressHydrationWarning={true}
    >
      <div className="header-carousel-item">
        <img src="img/carousel-1.jpg" className="img-fluid w-100" alt="Image" />

        <div className="carousel-caption">
          <div className="carousel-caption-content p-3">
            <h5
              className="text-white text-uppercase fw-bold mb-4"
              style={{ letterSpacing: "3px" }}
            >
              Physiotherapy Center
            </h5>

            <h1 className="display-1 text-capitalize text-white mb-4">
              Best Solution For Painful Life
            </h1>

            <p className="mb-5 fs-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s,
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
            <h5
              className="text-white text-uppercase fw-bold mb-4"
              style={{ letterSpacing: "3px" }}
            >
              Physiotherapy Center
            </h5>

            <h1 className="display-1 text-capitalize text-white mb-4">
              Best Solution For Painful Life
            </h1>

            <p className="mb-5 fs-5 animated slideInDown">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s,
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

export default index;
