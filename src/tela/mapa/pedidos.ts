// Pedidos do turno que a tela monta (carimbos, convites, moedas).
import type { Pedido } from "../../partida";

/** Tira os pedidos que `mesmo` reconhece e, se vier, põe `novo` no lugar. */
export const trocar = (
  lista: Pedido[],
  mesmo: (p: Pedido) => boolean,
  novo?: Pedido,
): Pedido[] => [...lista.filter((p) => !mesmo(p)), ...(novo ? [novo] : [])];
