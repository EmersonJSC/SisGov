// Etapas do turno: congresso. Comportamento em turno.md.
import { enfileirar, envelhecer } from "../../efeitos";
import { turnosMandato } from "../../eleicao";
import type { Estado } from "../../estado";
import {
  type PedidoNomear,
  ministrosPorPartido,
  candidatosDoPartido,
  ajusteDaLei,
} from "../../governo";
import { gruposComDeslize } from "../../grupos";
import {
  type ValorLei,
  motivoValorInvalido,
  valoresComPedidos,
  leiAtiva,
  colisoesDe,
} from "../../leis";
import { traduzirCarimbos, montarMesa } from "../../mesa";
import {
  type Votacao,
  tramitar,
  type PedidoCongresso,
  type EntradaTramitar,
  iniciarCongresso,
} from "../../politica";
import type { Etapa } from "../comum";
import type { Pedido, Regras } from "../regras";

/**
 * 1. Congresso: cada pedido que muda uma lei entra na pauta, as casas votam em
 * sequência e a lei sai no turno em que passa (motor/politica). Sem Congresso
 * nas regras, todo pedido passa e o decreto vale na hora.
 */
export const congresso: Etapa = (regras, estado, pedidos) => {
  const anteriores: { lei: string; valor: ValorLei }[] = [];
  for (const pedido of pedidos) {
    if (pedido.tipo !== "mudar_lei" && pedido.tipo !== "decretar") continue;
    const lei = regras.leis[pedido.lei];
    if (!lei) throw new Error(`pedido: lei "${pedido.lei}" não existe`);
    const motivo = motivoValorInvalido(lei, pedido.valor);
    if (motivo) throw new Error(`pedido: ${pedido.lei} ${motivo}`);
    const valores = valoresComPedidos(regras.leis, estado.leis, anteriores);
    const colide = leiAtiva(lei, pedido.valor)
      ? colisoesDe(lei.id, regras.colisoes ?? [], regras.leis, valores)
      : [];
    if (colide.length)
      throw new Error(`pedido: ${lei.id} colide com ${colide.join(", ")}`);
    anteriores.push(pedido);
  }
  if (!regras.congresso) {
    const votacoes: Votacao[] = anteriores
      .filter((p) => estado.leis[p.lei] !== p.valor)
      .map((p) => ({
        lei: p.lei,
        valor: p.valor,
        exorbitante: false,
        votos: {},
        sim: 0,
        nao: 0,
        aprovada: true,
        muda_lei: true,
      }));
    return { ...estado, votacoes };
  }
  const entrada = entradaDoCongresso(
    regras,
    estado,
    traduzirCarimbos(
      estado.mesa ?? [],
      pedidos.filter(
        (p): p is Exclude<Pedido, PedidoNomear> => p.tipo !== "nomear",
      ),
    ),
  );
  const saida = tramitar(entrada);
  return {
    ...estado,
    mesa: montarMesa(estado.turno, saida.estado.sancao, saida.votacoes),
    votacoes: saida.votacoes,
    coligacao: saida.coligacao,
    congresso: saida.estado,
    fatos: [...(estado.fatos ?? []), ...saida.fatos],
  };
};
/** O que o Congresso lê do estado, no começo do turno. */
export function entradaDoCongresso(
  regras: Regras,
  estado: Estado,
  pedidos: PedidoCongresso[] = [],
): EntradaTramitar {
  const congresso = regras.congresso as NonNullable<Regras["congresso"]>;
  const mandato = turnosMandato(regras.leis, estado.leis);
  return {
    congresso,
    tipos: gruposComDeslize(regras.grupos, estado.pops, estado.deslize),
    leis: regras.leis,
    valores: estado.leis,
    turno: estado.turno,
    estado: estado.congresso ?? iniciarCongresso(congresso, estado.coligacao),
    coligacao: estado.coligacao,
    grupos: estado.grupos,
    deficit: Math.max(
      0,
      estado.essenciais.gasto_publico - estado.essenciais.arrecadacao,
    ),
    fatos: estado.fatos ?? [],
    ministros:
      regras.governo && estado.governo
        ? ministrosPorPartido(regras.governo, estado.governo.caixas)
        : {},
    candidato: (partido) =>
      regras.governo && estado.governo
        ? candidatosDoPartido(regras.governo, estado.governo.caixas, partido)
            .length > 0
        : false,
    turnosParaEleicao:
      mandato === null
        ? null
        : mandato - (estado.turno - estado.inicio_mandato),
    pedidos,
  };
}
/** 2. Leis novas: o que passou muda de valor e os efeitos entram na fila. */
export const leisNovas: Etapa = (regras, estado) => {
  let { leis, efeitos } = estado;
  for (const v of estado.votacoes) {
    if (!v.muda_lei) continue;
    leis = { ...leis, [v.lei]: v.valor };
    efeitos = enfileirar(
      efeitos,
      regras.leis[v.lei],
      v.valor,
      regras.governo && estado.governo
        ? ajusteDaLei(
            regras.governo,
            estado.governo.caixas,
            regras.leis,
            regras.leis[v.lei],
          )
        : undefined,
    );
  }
  return { ...estado, leis, efeitos };
};
/** 3. Efeitos andam um turno em direção ao inteiro. */
export const efeitosVencem: Etapa = (_, estado) => ({
  ...estado,
  efeitos: envelhecer(estado.efeitos),
});
