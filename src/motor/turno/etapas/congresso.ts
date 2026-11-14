// Etapas do turno: congresso. Comportamento em turno.md.
import { enfileirar, envelhecer } from "../../efeitos";
import { type PedidoPrometer, turnosMandato } from "../../eleicao";
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
  valorDesligado,
} from "../../leis";
import { traduzirCarimbos, montarMesa } from "../../mesa";
import type { PedidoIndicar } from "../../judiciario";
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
    if (pedido.tipo === "mudar_lei" && pedido.revogar) {
      if (lei.camada === "essencial")
        throw new Error(`pedido: ${lei.id} é essencial e não se revoga`);
      if (pedido.valor !== valorDesligado(lei))
        throw new Error(`pedido: revogar ${lei.id} pede o valor desligado`);
    }
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
        (
          p,
        ): p is Exclude<
          Pedido,
          PedidoNomear | PedidoPrometer | PedidoIndicar
        > =>
          p.tipo !== "nomear" && p.tipo !== "prometer" && p.tipo !== "indicar",
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
/** Pedidos de revogar do turno somados aos que ainda tramitam. */
export function revogacoesDoTurno(
  estado: Estado,
  pedidos: readonly Pedido[],
): string[] {
  const novos = pedidos.flatMap((p) =>
    p.tipo === "mudar_lei" && p.revogar ? [p.lei] : [],
  );
  // pedir outro valor para a lei desfaz a revogação
  const trocados = new Set(
    pedidos.flatMap((p) =>
      p.tipo === "mudar_lei" && !p.revogar ? [p.lei] : [],
    ),
  );
  return [
    ...new Set([
      ...(estado.revogacoes ?? []).filter((l) => !trocados.has(l)),
      ...novos,
    ]),
  ];
}

/**
 * 2. Leis novas: o que passou muda de valor e os efeitos entram na fila. A
 * revogação aprovada tira a lei do país (volta a "não legislada").
 */
export const leisNovas: Etapa = (regras, estado, pedidos) => {
  let { leis, efeitos } = estado;
  const revogacoes = revogacoesDoTurno(estado, pedidos);
  const revogadas = new Set<string>();
  for (const v of estado.votacoes) {
    if (!v.muda_lei) continue;
    const lei = regras.leis[v.lei];
    const revoga =
      revogacoes.includes(v.lei) && v.valor === valorDesligado(lei);
    if (revoga) {
      leis = Object.fromEntries(
        Object.entries(leis).filter(([id]) => id !== v.lei),
      );
      revogadas.add(v.lei);
    } else leis = { ...leis, [v.lei]: v.valor };
    efeitos = enfileirar(
      efeitos,
      lei,
      revoga ? undefined : v.valor,
      regras.governo && estado.governo
        ? ajusteDaLei(regras.governo, estado.governo.caixas, lei)
        : undefined,
    );
  }
  // a revogação some quando a lei sai da pauta (aprovada, derrubada ou trocada)
  const tramitando = new Set(
    [
      ...(estado.congresso?.pauta ?? []),
      ...(estado.congresso?.sancao ?? []),
    ].map((t) => t.lei),
  );
  const seguem = revogacoes.filter(
    (l) => !revogadas.has(l) && (tramitando.has(l) || !regras.congresso),
  );
  return {
    ...estado,
    leis,
    efeitos,
    revogacoes: seguem.length > 0 ? seguem : undefined,
  };
};
/** 3. Efeitos andam um turno em direção ao inteiro. */
export const efeitosVencem: Etapa = (_, estado) => ({
  ...estado,
  efeitos: envelhecer(estado.efeitos),
});
