// src/interfaces/index.ts

export type GastoEstatus = "Programado" | "Pagado" | "Comprometido";

// export interface Concepto {
//   id: string;
//   nombre: string;
// }

export interface Cuenta {
  id: string;
  nombre: string;
}

export interface Proyecto {
  id: string;
  titulo: string;
}

export interface GastoConDetalles {
  id: string;
  monto: number;
  fecha_del_gasto: string;
  descripcion: string | null;
  user_id: string;
  concepto_id: string | null;
  cuenta_id: string | null;
  proyecto_id: string | null;
  estatus: GastoEstatus; // 👈 Agregamos el nuevo campo
  conceptos?: {
    nombre: string;
  } | null;
  cuentas?: {
    nombre: string;
  } | null;
  proyectos?: {
    titulo: string;
  } | null;
}
