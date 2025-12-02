"use client";

import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "react-day-picker/style.css";

const Footer = () => {
  return (
    <div className="container-fluid footer py-5 fadeIn" data-wow-delay="0.2s">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-md-9 col-lg-9 col-xl-9">
            <div className="footer-item d-flex flex-column">
              <h4 className="text-white mb-4">
                <img
                  src="img/logo-interser.png"
                  alt="Interser - Centro Psicoterapeutico Humanista"
                />
              </h4>
              <p>
                Acompañamos a personas, parejas y familias desde un enfoque
                humanista, Gestalt y sexológico, brindando atención profesional
                para ansiedad, depresión, duelos, relaciones de pareja,
                identidad y sexualidad, procesos de vida y bienestar emocional.
                Nuestro equipo cuenta con amplia formación académica,
                experiencia clínica y actualización constante, ofreciendo
                terapia presencial en Culiacán y atención psicológica en línea
                con calidez, ética y confianza.
              </p>
              <div className="d-flex align-items-center">
                <i className="fas fa-share fa-2x text-white me-2"></i>
                <a
                  href="https://www.facebook.com/interserculiacan"
                  className="btn-square btn btn-primary text-white rounded-circle mx-1"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  href="https://www.instagram.com/interser_psicoterapia/"
                  className="btn-square btn btn-primary text-white rounded-circle mx-1"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=5216671792487&text=%C2%A1%C2%A1Hola%21%21+Deseo+informes+de+sus+servicios+psicoterapeuticos.&type=phone_number&app_absent=0"
                  className="btn-square btn btn-primary text-white rounded-circle mx-1"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-lg-3 col-xl-3">
            <div className="footer-item d-flex flex-column">
              <h4 className="mb-4 text-white">Información de contacto</h4>
              <a href="">
                <i className="fa fa-map-marker-alt me-2"></i> Municipio de
                Culiacan 2673, Fraccionamiento Floresta, 80014 Culiacán Rosales,
                Sin.
              </a>
              <a href="tel:+526671792487">
                <i className="fas fa-phone me-2"></i> +526671792487
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
