"use client";

import React from "react";
// import { Spinnaker } from "next/font/google";
// import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import styles from "./topbar.module.scss";

const Topbar = () => {
  return (
    <div className="container-fluid bg-dark px-5 d-none d-lg-block">
      <div className="row gx-0 align-items-center" style={{ height: "45px" }}>
        <div className="col-lg-8 text-center text-lg-start mb-lg-0">
          <div className="d-flex flex-wrap">
            <a
              href="https://maps.app.goo.gl/JxuSeHt6yix7eJxs5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light me-4"
            >
              <i className="fas fa-map-marker-alt text-primary me-2"></i>
              Ubicación
            </a>
            <a href="tel:6671792487" className="text-light me-4">
              <i className="fas fa-phone-alt text-primary me-2"></i>
              6671792487
            </a>
            {/* <a href="#" className="text-light me-0">
                <i className="fas fa-envelope text-primary me-2"></i>
                Example@gmail.com
              </a> */}
          </div>
        </div>
        <div className="col-lg-4 text-center text-lg-end">
          <div className="d-flex align-items-center justify-content-end">
            <a
              href="https://www.facebook.com/interserculiacan"
              className={`btn btn-light btn-square border rounded-circle nav-fill me-3 ${styles.iconSocialMedia}`}
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/interser_psicoterapia/"
              className={`btn btn-light btn-square border rounded-circle nav-fill me-3 ${styles.iconSocialMedia}`}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=5216671792487&text=%C2%A1%C2%A1Hola%21%21+Deseo+informes+de+sus+servicios+psicoterapeuticos.&type=phone_number&app_absent=0"
              className={`btn btn-light btn-square border rounded-circle nav-fill me-0 ${styles.iconSocialMedia}`}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
