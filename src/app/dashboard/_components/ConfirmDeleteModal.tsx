// src/app/gastos/_components/ConfirmDeleteModal.tsx

"use client";

import { useState } from "react";
import { deleteGasto } from "@/app/actions/gastos";
import type { GastoConDetalles } from "@/interfaces";

interface Props {
  gasto: GastoConDetalles;
  onClose: () => void;
}

export function ConfirmDeleteModal({ gasto, onClose }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteGasto(gasto.id);
    setIsDeleting(false);
    onClose();
  };

  return (
    <dialog
      open
      className="p-6 rounded-lg shadow-xl w-full max-w-sm backdrop:bg-black backdrop:opacity-50"
    >
      <h2 className="text-lg font-bold">Confirmar Eliminación</h2>
      <p className="my-4 text-gray-600">
        ¿Estás seguro de que deseas eliminar el gasto de{" "}
        <strong>${gasto.monto}</strong> en{" "}
        <strong>{gasto.conceptos?.nombre}</strong>? Esta acción no se puede
        deshacer.
      </p>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400"
        >
          {isDeleting ? "Eliminando..." : "Sí, eliminar"}
        </button>
      </div>
    </dialog>
  );
}
