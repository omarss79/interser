"use client";

import React from "react";
import styles from "./navbar.module.scss";
import Carousel from "./components/Carousel";

const Navbar = () => {
  return (
    <>
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 px-lg-5 py-3 py-lg-0">
          <a href="/" className="navbar-brand p-0">
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
              <a href="/" className="nav-item nav-link active">
                Inicio
              </a>
              <a href="about.html" className="nav-item nav-link">
                About
              </a>
              <a href="service.html" className="nav-item nav-link">
                Services
              </a>
              <a href="contact.html" className="nav-item nav-link">
                Contacto
              </a>
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Iniciar sesión
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
            </div>
          </div>
        </nav>
      </div>
      <Carousel />
    </>
  );
};

export default Navbar;
