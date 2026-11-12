// Etapas do turno: governo. Comportamento em turno.md.
import {
  andarGoverno,
  type PedidoNomear,
  fracaoDosCargos,
} from "../../governo";
import type { Etapa } from "../comum";

/**
 * 8b. Governo: as moedas Ministério e os pedidos de nomear viram ministros e
 * cada órgão anda um turno de corrupção (motor/governo).
 */
export const governo: Etapa = (regras, estado, pedidos) => {
  if (!regras.governo || !estado.governo) return estado;
  const saida = andarGoverno({
    regras: regras.governo,
    estado: estado.governo,
    leis: regras.leis,
    valores: estado.leis,
    turno: estado.turno,
    fatos: estado.fatos ?? [],
    pedidos: pedidos.filter((p): p is PedidoNomear => p.tipo === "nomear"),
    cargos: fracaoDosCargos(regras.governo, regras.leis, estado.leis),
  });
  return {
    ...estado,
    governo: saida.estado,
    fatos: [...(estado.fatos ?? []), ...saida.fatos],
  };
};
