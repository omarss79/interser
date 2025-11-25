"use client";

import React from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Carousel from "./components/Carousel";
import AuthMenu from "./AuthMenu";

const Navbar = () => {
  const pathname = usePathname();
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
              <Link href="/acerca-de-interser" className="nav-item nav-link">
                Acerca de InterSer
              </Link>
              <Link href="/servicios" className="nav-item nav-link">
                Servicios
              </Link>
              <Link href="/contact" className="nav-item nav-link">
                Contacto
              </Link>
              <AuthMenu />
            </div>
          </div>
        </nav>
      </div>
      {pathname === "/" && <Carousel />}
    </>
  );
};

export default Navbar;
