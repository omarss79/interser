// src/interfaces/index.ts

export type GastoEstatus = "Programado" | "Pagado" | "Comprometido";

// Roles de usuario
export type UserRole = "usuario" | "terapeuta" | "administrador";

// Perfil de usuario
export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

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
