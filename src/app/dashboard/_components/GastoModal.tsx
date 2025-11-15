// src/app/gastos/_components/GastoModal.tsx

"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveGasto } from "@/app/actions/gastos";
import type {
  GastoConDetalles,
  Concepto,
  Cuenta,
  Proyecto,
  GastoEstatus, // 👈 Importamos el tipo GastoEstatus
} from "@/interfaces";

interface Props {
  gasto: GastoConDetalles | null;
  onClose: () => void;
  conceptos: Concepto[];
  cuentas: Cuenta[];
  proyectos: Proyecto[];
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
    >
      {pending ? "Guardando..." : isEdit ? "Actualizar Gasto" : "Crear Gasto"}
    </button>
  );
}

export function GastoModal({
  gasto,
  onClose,
  conceptos,
  cuentas,
  proyectos,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState(saveGasto, {
    message: "",
    errors: {},
  });

  useEffect(() => {
    dialogRef.current?.showModal();
    if (state.message.includes("éxito")) {
      onClose();
    }
  }, [state, onClose]);

  const renderError = (field: keyof typeof state.errors | string) =>
    state.errors?.[field] && (
      <p className="text-red-500 text-xs mt-1">{state.errors[field]?.[0]}</p>
    );

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="p-0 rounded-lg shadow-xl w-full max-w-md backdrop:bg-black backdrop:opacity-50"
    >
      <form action={formAction} className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {gasto ? "Editar Gasto" : "Nuevo Gasto"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        {state.message && !state.message.includes("éxito") && (
          <p className="text-red-500 bg-red-50 p-2 rounded-md text-sm mb-4">
            {state.message}
          </p>
        )}
        {gasto && <input type="hidden" name="id" value={gasto.id} />}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="monto"
              className="block text-sm font-medium text-gray-700"
            >
              Monto
            </label>
            <input
              id="monto"
              name="monto"
              type="number"
              step="0.01"
              defaultValue={gasto?.monto}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {renderError("monto")}
          </div>
          <div>
            <label
              htmlFor="fecha_del_gasto"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha
            </label>
            <input
              id="fecha_del_gasto"
              name="fecha_del_gasto"
              type="date"
              defaultValue={gasto?.fecha_del_gasto}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {renderError("fecha_del_gasto")}
          </div>
          {/* Nuevo campo para Estatus */}
          <div>
            <label
              htmlFor="estatus"
              className="block text-sm font-medium text-gray-700"
            >
              Estatus
            </label>
            <select
              id="estatus"
              name="estatus"
              defaultValue={gasto?.estatus || "Comprometido"}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="Comprometido">Comprometido</option>
              <option value="Programado">Programado</option>
              <option value="Pagado">Pagado</option>
            </select>
            {renderError("estatus")}
          </div>
          {/* ... otros campos */}
          <div>
            <label
              htmlFor="concepto_id"
              className="block text-sm font-medium text-gray-700"
            >
              Concepto
            </label>
            <select
              id="concepto_id"
              name="concepto_id"
              defaultValue={gasto?.concepto_id ?? ""}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="" disabled>
                Selecciona un concepto
              </option>
              {conceptos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {renderError("concepto_id")}
          </div>
          <div>
            <label
              htmlFor="cuenta_id"
              className="block text-sm font-medium text-gray-700"
            >
              Cuenta
            </label>
            <select
              id="cuenta_id"
              name="cuenta_id"
              defaultValue={gasto?.cuenta_id ?? ""}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="" disabled>
                Selecciona una cuenta
              </option>
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {renderError("cuenta_id")}
          </div>
          <div>
            <label
              htmlFor="proyecto_id"
              className="block text-sm font-medium text-gray-700"
            >
              Proyecto
            </label>
            <select
              id="proyecto_id"
              name="proyecto_id"
              defaultValue={gasto?.proyecto_id ?? ""}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="" disabled>
                Selecciona un proyecto
              </option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo}
                </option>
              ))}
            </select>
            {renderError("proyecto_id")}
          </div>
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              defaultValue={gasto?.descripcion ?? ""}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            ></textarea>
          </div>
        </div>
        <div className="mt-6">
          <SubmitButton isEdit={!!gasto} />
        </div>
      </form>
    </dialog>
  );
}
