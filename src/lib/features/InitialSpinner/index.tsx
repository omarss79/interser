"use client"; // ¡IMPORTANTE! Debe ser un Componente del Cliente

import React, { useState, useEffect } from "react";

// Se puede envolver en una función componente, por ejemplo:
export default function InitialSpinner() {
  // 1. Estado para controlar la visibilidad. Inicialmente visible (true).
  const [showSpinner, setShowSpinner] = useState(true);

  // Define la duración en milisegundos (3 segundos en este ejemplo)
  const DURATION_MS = 3000;

  // 2. useEffect para ejecutar el temporizador solo en el cliente
  useEffect(() => {
    // 3. Establece el temporizador
    const timer = setTimeout(() => {
      // Oculta el spinner al cambiar el estado a false
      setShowSpinner(false);
    }, DURATION_MS);

    // Función de limpieza para cancelar el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez al montar

  // 4. Renderizado Condicional: Muestra el spinner si 'showSpinner' es true
  if (!showSpinner) {
    return null; // No renderiza nada si el spinner debe estar oculto
  }

  return (
    <div
      id="spinner"
      // Usa tus clases de Bootstrap/CSS para que se vea bien
      className="bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
      style={{ zIndex: 9999 }} // Asegura que esté por encima de todo
    >
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        {/* Usar una clase para ocultar texto accesible o un span vacío para evitar el 'sr-only' */}
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}
