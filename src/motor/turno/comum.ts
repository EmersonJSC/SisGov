// Tipos e constantes que todas as etapas do turno usam.
import type { Estado } from "../estado";
import type { Regras, Pedido } from "./regras";

export const TURNOS_POR_ANO = 6;
export type Etapa = (
  regras: Regras,
  estado: Estado,
  pedidos: Pedido[],
) => Estado;
