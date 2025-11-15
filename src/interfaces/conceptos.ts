export interface Partida {
  id: string;
  nombre: string;
  user_id: string;
  created_at: string;
}

export interface Concepto {
  id: string;
  nombre: string;
  partida_id: string;
  user_id: string;
  created_at: string;
}

// Para mostrar partidas con sus conceptos
export interface PartidaConConceptos extends Partida {
  conceptos: Concepto[];
}
