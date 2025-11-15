// src/app/gastos/_components/ListView.tsx

"use client";

import { useState, useMemo } from "react";
import type { GastoConDetalles, Cuenta, GastoEstatus } from "@/interfaces";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  gastos: GastoConDetalles[];
  cuentas: Cuenta[];
  estatusOptions: GastoEstatus[];
  onFilterCuentaChange: (cuentaId: string) => void;
  onFilterEstatusChange: (estatus: string) => void;
  onEdit: (gasto: GastoConDetalles) => void;
  onDelete: (gasto: GastoConDetalles) => void;
}

export function ListView({
  gastos,
  cuentas,
  estatusOptions,
  onFilterCuentaChange,
  onFilterEstatusChange,
  onEdit,
  onDelete,
}: Props) {
  const [filterText, setFilterText] = useState("");

  const filteredGastos = useMemo(() => {
    if (!filterText) return gastos;
    return gastos.filter(
      (g) =>
        g.descripcion?.toLowerCase().includes(filterText.toLowerCase()) ||
        g.conceptos?.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
        g.proyectos?.titulo.toLowerCase().includes(filterText.toLowerCase()) ||
        g.monto.toString().includes(filterText)
    );
  }, [gastos, filterText]);

  // ✅ Calcular el total de los gastos filtrados
  const totalMonto = useMemo(() => {
    return filteredGastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  }, [filteredGastos]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* ... (filtros de búsqueda y select) ... */}

      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Buscar por concepto, proyecto, etc..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full sm:flex-1 p-2 border border-gray-300 rounded-md"
        />
        <select
          onChange={(e) => onFilterCuentaChange(e.target.value)}
          className="w-full sm:w-auto p-2 border border-gray-300 rounded-md"
          defaultValue=""
        >
          <option value="">Todas las Cuentas</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.nombre}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => onFilterEstatusChange(e.target.value)}
          className="w-full sm:w-auto p-2 border border-gray-300 rounded-md"
          defaultValue=""
        >
          <option value="">Todos los Estatus</option>
          {estatusOptions.map((estatus) => (
            <option key={estatus} value={estatus}>
              {estatus}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estatus
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGastos.map((gasto) => (
              <tr key={gasto.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(gasto.fecha_del_gasto), "d LLL yyyy", {
                    locale: es,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {gasto.conceptos?.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {gasto.proyectos?.titulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                  ${gasto.monto.toLocaleString("en-US")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      gasto.estatus === "Pagado"
                        ? "bg-green-100 text-green-800"
                        : gasto.estatus === "Programado"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {gasto.estatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(gasto)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(gasto)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Agrega el total en una nueva sección */}
      <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
        <span className="text-lg font-bold text-gray-800">
          Total: $
          {totalMonto.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
