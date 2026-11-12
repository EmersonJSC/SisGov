// Etapas do turno: eleição. Comportamento em turno.md e eleicao.md.
import {
  type Chapa,
  type Eleicao,
  type EstadoDaCampanha,
  type PedidoPrometer,
  type PromessaDeCampanha,
  TAMANHO_DE_PROGRAMA,
  cumprimento,
  desgasteDaQuebra,
  efeitoDaPromessa,
  finalistas,
  montarChapas,
  pesoDoGrupo,
  primeiroTurno,
  segundoTurno,
  tamanhoDaMeta,
  turnosMandato,
  vencedorNoPrimeiroTurno,
} from "../../eleicao";
import type { Estado } from "../../estado";
import { novoFato, type Fato } from "../../fatos";
import { situacoesDosProgramas } from "../../programas";
import type { Etapa } from "../comum";
import type { Pedido, Regras } from "../regras";
import { todosIndices } from "./jogabilidade";

/** Promessa cumprida em pelo menos isto conta como cumprida; abaixo da metade, quebrada. */
const CUMPRIDA = 0.999;
const QUEBRADA = 0.5;
const CAMPANHA_VAZIA: EstadoDaCampanha = { quebradas: [] };

const campanhaDe = (e: Estado): EstadoDaCampanha =>
  e.campanha ?? CAMPANHA_VAZIA;

// ---------- a promessa ----------

/** Quanto o programa está perto de se formar: formado vale 1, o resto fica abaixo. */
function andamentoDoPrograma(regras: Regras, estado: Estado, id: string) {
  if (estado.programas?.vidas[id]?.situacao === "formado") return 1;
  const s = situacoesDosProgramas(
    regras.programas ?? {
      programas: [],
      moldes: [],
      nomesDoPais: {},
      formados: [],
    },
    estado.programas as NonNullable<Estado["programas"]>,
    regras.leis,
    estado.leis,
  ).find((x) => x.id === id);
  return s ? Math.min(0.9, s.andadas.length / s.minimo) : 0;
}

/** Onde a meta está hoje: o valor do índice, ou o andamento do programa. */
function valorAtual(regras: Regras, estado: Estado, p: PromessaDeCampanha) {
  return p.alvo.tipo === "indice"
    ? (todosIndices(estado)[p.alvo.id] ?? p.de)
    : andamentoDoPrograma(regras, estado, p.alvo.id);
}

/** Promessa nova a partir do pedido; recusa o que não existe ou não pode ser prometido. */
function promessaDoPedido(
  regras: Regras,
  estado: Estado,
  { alvo, meta }: PedidoPrometer,
): PromessaDeCampanha {
  if (alvo.tipo === "programa") {
    const existe = regras.programas?.programas.some((p) => p.id === alvo.id);
    if (!existe) throw new Error(`promessa: programa "${alvo.id}" não existe`);
    if (estado.programas?.vidas[alvo.id]?.situacao === "formado")
      throw new Error(`promessa: o programa "${alvo.id}" já está formado`);
    return {
      alvo,
      de: 0,
      meta: 1,
      feitaEm: estado.turno,
      tamanho: TAMANHO_DE_PROGRAMA,
    };
  }
  const dominio = regras.dominios[alvo.id];
  const de = todosIndices(estado)[alvo.id];
  if (!dominio || de === undefined)
    throw new Error(`promessa: índice "${alvo.id}" não existe`);
  if (
    meta === undefined ||
    meta < dominio.min ||
    meta > dominio.max ||
    meta === de
  )
    throw new Error(`promessa: meta inválida para "${alvo.id}"`);
  return {
    alvo,
    de,
    meta,
    feitaEm: estado.turno,
    tamanho: tamanhoDaMeta(de, meta, dominio),
  };
}

const mesma = (a: PromessaDeCampanha, b: PromessaDeCampanha) =>
  a.alvo.tipo === b.alvo.tipo && a.alvo.id === b.alvo.id && a.meta === b.meta;

/** O pedido de prometer: a promessa nova entra e a antiga, se diferente, conta como quebrada. */
function prometer(regras: Regras, estado: Estado, pedidos: Pedido[]): Estado {
  const pedido = [...pedidos]
    .reverse()
    .find((p): p is PedidoPrometer => p.tipo === "prometer");
  if (!pedido) return estado;
  const nova = promessaDoPedido(regras, estado, pedido);
  const { promessa: antiga, quebradas } = campanhaDe(estado);
  if (antiga && mesma(antiga, nova)) return estado;
  return {
    ...estado,
    campanha: {
      ...campanhaDe(estado),
      promessa: nova,
      quebradas: antiga ? [...quebradas, antiga.tamanho] : quebradas,
    },
  };
}

// ---------- as rodadas ----------

/** As chapas desta eleição: governo com a coligação, oposição por partido ou coligada. */
function chapasDaEleicao(regras: Regras, estado: Estado) {
  const c = regras.congresso;
  return montarChapas(
    (c?.partidos ?? []).map((p) => ({
      id: p.id,
      cadeiras: p.cadeiras,
      defende: p.defende,
    })),
    c?.governo ?? "",
    estado.coligacao,
  );
}

interface Avaliacao {
  /** Voto no governo que a promessa (e as trocadas) pesa, antes do peso de cada grupo. */
  efeito: number;
  /** Cumprimento da promessa de agora, ou null se não há. */
  cumprido: number | null;
  desgaste: number;
  fatos: Fato[];
}

/** A promessa é avaliada no primeiro turno da eleição; as trocadas já contam como quebradas. */
function avaliarPromessa(regras: Regras, estado: Estado): Avaliacao {
  const { promessa, quebradas } = campanhaDe(estado);
  const dasTrocas = quebradas.map((t) => ({
    efeito: efeitoDaPromessa(t, 0),
    desgaste: desgasteDaQuebra(t, 0),
  }));
  const cumprido = promessa
    ? cumprimento(promessa, valorAtual(regras, estado, promessa))
    : null;
  const fatos: Fato[] = [];
  if (
    promessa &&
    cumprido !== null &&
    (cumprido >= CUMPRIDA || cumprido < QUEBRADA)
  )
    fatos.push(
      novoFato({
        tipo: cumprido >= CUMPRIDA ? "meta-cumprida" : "meta-quebrada",
        turno: estado.turno,
        tamanho: cumprido >= CUMPRIDA ? "medio" : "grande",
        sobre: promessa.alvo.id,
      }),
    );
  return {
    efeito:
      dasTrocas.reduce((s, t) => s + t.efeito, 0) +
      (promessa && cumprido !== null
        ? efeitoDaPromessa(promessa.tamanho, cumprido)
        : 0),
    cumprido,
    desgaste:
      dasTrocas.reduce((s, t) => s + t.desgaste, 0) +
      (promessa && cumprido !== null
        ? desgasteDaQuebra(promessa.tamanho, cumprido)
        : 0),
    fatos,
  };
}

/** Voto no governo que cada grupo dá por causa das promessas. */
function ajusteDosGrupos(regras: Regras, estado: Estado, a: Avaliacao) {
  const { promessa } = campanhaDe(estado);
  const lembranca =
    promessa?.alvo.tipo === "programa"
      ? estado.programas?.vidas[promessa.alvo.id]?.lembranca
      : undefined;
  return (grupo: string) => {
    const tipo = regras.grupos.find((g) => g.id === grupo);
    if (!promessa || !tipo) return a.efeito;
    const dela = efeitoDaPromessa(promessa.tamanho, a.cumprido ?? 0);
    const resto = a.efeito - dela;
    return (
      resto +
      dela *
        pesoDoGrupo(promessa, tipo, regras.indicesPrincipais ?? [], lembranca)
    );
  };
}

/** Primeiro turno: promessa avaliada, desgaste da quebra somado, votos contados. */
function rodadaUm(regras: Regras, estado: Estado): Estado {
  const avaliacao = avaliarPromessa(regras, estado);
  const desgaste = estado.desgaste + avaliacao.desgaste;
  const { governo, oposicao } = chapasDaEleicao(regras, estado);
  const rodada = primeiroTurno({
    grupos: estado.grupos,
    governo,
    oposicao,
    desgaste,
    ajuste: ajusteDosGrupos(regras, estado, avaliacao),
  });
  const decidida = vencedorNoPrimeiroTurno(rodada) !== null;
  const vaiAoSegundo = !decidida && finalistas(rodada).includes(governo.id);
  return {
    ...estado,
    desgaste,
    campanha: {
      ...campanhaDe(estado),
      primeiro: { rodada, promessa: avaliacao.efeito },
    },
    fatos: [
      ...(estado.fatos ?? []),
      ...avaliacao.fatos,
      ...(vaiAoSegundo
        ? [
            novoFato({
              tipo: "segundo-turno",
              turno: estado.turno,
              tamanho: "grande",
            }),
          ]
        : []),
    ],
  };
}

/** O resultado do mandato: no primeiro turno se alguém passou da metade, senão no segundo. */
function resultado(regras: Regras, estado: Estado): Eleicao {
  const { governo, oposicao } = chapasDaEleicao(regras, estado);
  const chapas: Chapa[] = [governo, ...oposicao];
  const { rodada } = campanhaDe(estado).primeiro as NonNullable<
    EstadoDaCampanha["primeiro"]
  >;
  const decidida = vencedorNoPrimeiroTurno(rodada) !== null;
  const oponente = finalistas(rodada).find((id) => id !== governo.id) as string;
  const final =
    !decidida && finalistas(rodada).includes(governo.id)
      ? segundoTurno(rodada, estado.grupos, chapas, governo.id, oponente)
      : rodada;
  const rodadas = final === rodada ? 1 : 2;
  const apoio = (final.votos[governo.id] ?? 0) * 100;
  const rival = Math.max(
    ...Object.entries(final.votos)
      .filter(([id]) => id !== governo.id)
      .map(([, v]) => v * 100),
  );
  return {
    turno: estado.turno,
    apoio,
    adversario: rodadas === 2 ? 100 - apoio : rival,
    desgaste: estado.desgaste,
    margem: apoio - (rodadas === 2 ? 100 - apoio : rival),
    venceu: apoio > 50,
    grupos: Object.fromEntries(
      Object.entries(estado.grupos).map(([id, g]) => [
        id,
        { satisfacao: g.satisfacao, pessoas: g.pessoas },
      ]),
    ),
    rodadas,
    chapas: Object.entries(final.votos)
      .map(([id, votos]) => ({ id, votos }))
      .sort((a, b) => b.votos - a.votos),
  };
}

/** Fim do mandato: o resultado vira fato; ganhou, começa outro mandato; perdeu, a partida acaba. */
function fecharMandato(regras: Regras, estado: Estado): Estado {
  const pronto = campanhaDe(estado).primeiro
    ? estado
    : rodadaUm(regras, estado);
  const eleicao = resultado(regras, pronto);
  const fato = novoFato({
    tipo: eleicao.venceu ? "eleicao-vencida" : "eleicao-perdida",
    turno: estado.turno,
    tamanho: "grande",
  });
  return {
    ...pronto,
    ...(eleicao.venceu && pronto.congresso
      ? {
          congresso: {
            ...pronto.congresso,
            cargosUsados: 0,
            emendasUsadas: 0,
          },
        }
      : {}),
    fatos: [...(pronto.fatos ?? []), fato],
    eleicao,
    campanha: eleicao.venceu ? CAMPANHA_VAZIA : pronto.campanha,
    inicio_mandato: eleicao.venceu ? estado.turno : estado.inicio_mandato,
    encerrada: !eleicao.venceu,
  };
}

/**
 * 9b. Eleição: a promessa do jogador entra; no turno antes do fim do mandato
 * vota o primeiro turno; no último, sai o resultado (segundo turno, se
 * ninguém passou da metade).
 */
export const eleicao: Etapa = (regras, estado, pedidos) => {
  const comPromessa = prometer(regras, estado, pedidos);
  const mandato = turnosMandato(regras.leis, comPromessa.leis);
  if (mandato === null) return comPromessa;
  const decorrido = comPromessa.turno - comPromessa.inicio_mandato;
  if (decorrido >= mandato) return fecharMandato(regras, comPromessa);
  if (decorrido === mandato - 1) return rodadaUm(regras, comPromessa);
  return comPromessa;
};
