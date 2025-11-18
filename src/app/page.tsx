"use client";

import InitialSpinner from "@/lib/features/InitialSpinner";
import { Spinnaker } from "next/font/google";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

export default function HomePage() {
  return (
    <>
      <InitialSpinner />

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
              <a href="#" className="text-light me-4">
                <i className="fas fa-phone-alt text-primary me-2"></i>
                +01234567890
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
                className="btn btn-light btn-square border rounded-circle nav-fill me-3"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href="https://www.instagram.com/interser_psicoterapia/"
                className="btn btn-light btn-square border rounded-circle nav-fill me-3"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=5216671792487&text=%C2%A1%C2%A1Hola%21%21+Deseo+informes+de+sus+servicios+psicoterapeuticos.&type=phone_number&app_absent=0"
                className="btn btn-light btn-square border rounded-circle nav-fill me-0"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 px-lg-5 py-3 py-lg-0">
          <a href="index.html" className="navbar-brand p-0">
            {/* <!-- <h1 className="text-primary m-0">
            <i className="fas fa-star-of-life me-3"></i>Terapia
          </h1> --> */}
            <img src="img/logo-interser.png" alt="Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <a href="index.html" className="nav-item nav-link active">
                Home
              </a>
              <a href="about.html" className="nav-item nav-link">
                About
              </a>
              <a href="service.html" className="nav-item nav-link">
                Services
              </a>
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Pages
                </a>
                <div className="dropdown-menu m-0">
                  <a href="appointment.html" className="dropdown-item">
                    Appointment
                  </a>
                  <a href="feature.html" className="dropdown-item">
                    Features
                  </a>
                  <a href="blog.html" className="dropdown-item">
                    Our Blog
                  </a>
                  <a href="team.html" className="dropdown-item">
                    Our Team
                  </a>
                  <a href="testimonial.html" className="dropdown-item">
                    Testimonial
                  </a>
                  <a href="404.html" className="dropdown-item">
                    404 Page
                  </a>
                </div>
              </div>
              <a href="contact.html" className="nav-item nav-link">
                Contact Us
              </a>
            </div>
            <a
              href="#"
              className="btn btn-primary rounded-pill text-white py-2 px-4 flex-wrap flex-sm-shrink-0"
            >
              Book Appointment
            </a>
          </div>
        </nav>
      </div>

      <a href="#" className="btn btn-primary btn-lg-square back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>
    </>
  );
}
