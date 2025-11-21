"use client";

import React from "react";

const Copyright = () => {
  return (
    <div className="container-fluid copyright py-4">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center text-md-start mb-md-0">
            <span className="text-white">
              <a href="#">
                <i className="fas fa-copyright text-light me-2"></i>Interser -
                Centro Psicoterapeutico Humanista
              </a>{" "}
              - Todos los derechos reservados.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end text-white">
            Designed By
            <a className="border-bottom" href="https://htmlcodex.com">
              HTML Codex
            </a>
            Distributed By
            <a className="border-bottom" href="https://themewagon.com">
              ThemeWagon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
