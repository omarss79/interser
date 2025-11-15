// src/app/gastos/_components/GastosCliente.tsx

"use client";

import { useState, useMemo } from "react"; // 👈 Importamos useMemo
import { useRouter, useSearchParams } from "next/navigation";
import type {
  GastoConDetalles,
  Concepto,
  Cuenta,
  Proyecto,
  GastoEstatus,
} from "@/interfaces";
import { GastoModal } from "./GastoModal";
// import { CalendarView } from "./CalendarView";
import { ListView } from "./ListView";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface Props {
  initialGastos: GastoConDetalles[];
  conceptos: Concepto[];
  cuentas: Cuenta[]; // 👈 Recibimos las cuentas
  proyectos: Proyecto[];
  initialView: "list" | "calendar";
}

// 👈 Definimos las opciones de estatus
const ESTATUS_OPTIONS: GastoEstatus[] = [
  "Comprometido",
  "Programado",
  "Pagado",
];

export function GastosCliente({
  initialGastos,
  conceptos,
  cuentas,
  proyectos,
  initialView,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGasto, setEditingGasto] = useState<GastoConDetalles | null>(
    null
  );
  const [deletingGasto, setDeletingGasto] = useState<GastoConDetalles | null>(
    null
  );
  const [filterCuenta, setFilterCuenta] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("");

  const handleOpenModal = (gasto: GastoConDetalles | null = null) => {
    setEditingGasto(gasto);
    setIsModalOpen(true);
  };

  const handleViewChange = (view: "list" | "calendar") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`?${params.toString()}`);
  };

  // ✅ Creamos un array filtrado basado en los filtros de estado
  const filteredGastos = useMemo(() => {
    let gastosFiltrados = initialGastos;

    if (filterCuenta) {
      gastosFiltrados = gastosFiltrados.filter(
        (gasto) => gasto.cuenta_id === filterCuenta
      );
    }

    if (filterEstatus) {
      gastosFiltrados = gastosFiltrados.filter(
        (gasto) => gasto.estatus === filterEstatus
      );
    }

    return gastosFiltrados;
  }, [initialGastos, filterCuenta, filterEstatus]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 p-1 bg-gray-200 rounded-lg">
          <button
            onClick={() => handleViewChange("list")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              initialView === "list" ? "bg-white shadow" : "hover:bg-gray-300"
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => handleViewChange("calendar")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              initialView === "calendar"
                ? "bg-white shadow"
                : "hover:bg-gray-300"
            }`}
          >
            Calendario
          </button>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Agregar Gasto
        </button>
      </div>

      {initialView === "list" ? (
        <ListView
          gastos={filteredGastos} // 👈 Pasamos los gastos filtrados
          onEdit={handleOpenModal}
          onDelete={setDeletingGasto}
          cuentas={cuentas} // 👈 Pasamos las cuentas y estatus para los filtros
          estatusOptions={ESTATUS_OPTIONS}
          onFilterCuentaChange={setFilterCuenta}
          onFilterEstatusChange={setFilterEstatus}
        />
      ) : (
        // <CalendarView gastos={initialGastos} onEdit={handleOpenModal} />
        <div>Calendar</div>
      )}

      {isModalOpen && (
        <GastoModal
          gasto={editingGasto}
          onClose={() => setIsModalOpen(false)}
          conceptos={conceptos}
          cuentas={cuentas}
          proyectos={proyectos}
        />
      )}

      {deletingGasto && (
        <ConfirmDeleteModal
          gasto={deletingGasto}
          onClose={() => setDeletingGasto(null)}
        />
      )}
    </>
  );
}
