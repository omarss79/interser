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
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
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
            <p className="mb-5 fs-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
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
};

export default Carousel;
