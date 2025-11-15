import { createClient } from "@/supabase/server";
import { GastoConDetalles, Concepto, Cuenta, Proyecto } from "@/interfaces";
import { GastosCliente } from "./_components/GastosCliente";

export default async function GastosPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const supabase = await createClient();

  const [gastosResult, conceptosResult, cuentasResult, proyectosResult] =
    await Promise.all([
      // CORRECTO: Cada una de estas líneas devuelve una promesa que Promise.all puede manejar.
      supabase
        .from("gastos")
        .select(
          `
          id, monto, fecha_del_gasto, descripcion, estatus, 
          concepto_id, cuenta_id, proyecto_id,
          conceptos ( nombre ),
          cuentas ( nombre ),
          proyectos ( titulo )
        `
        )
        .order("fecha_del_gasto", { ascending: false }),

      supabase.from("conceptos").select("id, nombre"),

      supabase.from("cuentas").select("id, nombre"),

      supabase.from("proyectos").select("id, titulo"),
    ]);

  const gastos = (gastosResult.data as unknown as GastoConDetalles[]) || [];
  const conceptos = (conceptosResult.data as unknown as Concepto[]) || [];
  const cuentas = cuentasResult.data || [];
  const proyectos = proyectosResult.data || [];

  const initialView = searchParams.view === "calendar" ? "calendar" : "list";

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Administración de Gastos
        </h1>
        <GastosCliente
          initialGastos={gastos}
          conceptos={conceptos}
          cuentas={cuentas}
          proyectos={proyectos}
          initialView={initialView}
        />
      </div>
    </div>
  );
}
