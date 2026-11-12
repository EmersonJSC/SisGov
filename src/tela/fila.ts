import type { Partida, PedidoMudarLei } from "../partida";

/** Um pedido por lei; voltar ao valor vigente tira o pedido da fila. */
export function comPedido(
  fila: PedidoMudarLei[],
  partida: Partida,
  lei: string,
  valor: PedidoMudarLei["valor"],
): PedidoMudarLei[] {
  const resto = fila.filter((p) => p.lei !== lei);
  return valor === partida.estado.leis[lei]
    ? resto
    : [...resto, { tipo: "mudar_lei", lei, valor }];
}
