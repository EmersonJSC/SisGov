// Etapas do turno: jogabilidade. Comportamento em turno.md.
import { andarDerivas } from "../../deriva";
import { somaPorIndice } from "../../efeitos";
import type { Estado } from "../../estado";
import { indiceDaPrevidencia } from "../../fisco";
import { rendimentoDasLeis } from "../../governo";
import { tomada } from "../../leis";
import {
  contaDoPais,
  segurancaDaCesta,
  reacaoDaCesta,
  reacaoCivil,
} from "../../mercado";
import {
  coberturaDosPops,
  direitoDoPop,
  pedacos,
  type TipoPop,
  rendaDoEstrato,
  type Estrato,
} from "../../populacao";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";
import {
  arrecadacaoPorBase,
  dinheiroFora,
  gastoPorLei,
  situacoesDeCapacidade,
} from "./economia";

/**
 * Quanto cada pessoa consome de cada cesta contra a média do turno 0 (passo
 * D): a `fatia` da cesta × a renda por pessoa do estrato no turno 0, dividida
 * para a média da população dar 1. Pop com divisão soma os pedaços.
 */
export function consumoDasCestas(
  regras: Regras,
  estado: Estado,
): {
  porPop: Record<string, Record<string, number>>;
  media: Record<string, number>;
} {
  const porPop: Record<string, Record<string, number>> = {};
  const media: Record<string, number> = {};
  const m = regras.mercado;
  if (!m) return { porPop, media };
  const pessoas0: Partial<Record<Estrato, number>> = {};
  const renda0: Partial<Record<Estrato, number>> = {};
  for (const t of regras.pops) {
    const d = regras.pais.pops[t.id];
    if (!d) continue;
    for (const [e, pp, pr] of pedacos(t)) {
      pessoas0[e] = (pessoas0[e] ?? 0) + d.parcela_pessoas * pp;
      renda0[e] = (renda0[e] ?? 0) + d.parcela_renda * pr;
    }
  }
  for (const cesta of m.mercado.cestas) {
    if (!cesta.fatia) continue;
    const bruto = (e: Estrato) =>
      (cesta.fatia?.[e] ?? 0) *
      ((pessoas0[e] ?? 0) > 0 ? (renda0[e] ?? 0) / pessoas0[e]! : 0);
    const escala = (Object.keys(pessoas0) as Estrato[]).reduce(
      (s, e) => s + (pessoas0[e] ?? 0) * bruto(e),
      0,
    );
    if (!(escala > 0)) continue;
    const doPop: Record<string, number> = {};
    let gente = 0;
    let soma = 0;
    for (const t of regras.pops) {
      const q = pedacos(t).reduce(
        (s, [e, pp]) => s + (pp * bruto(e)) / escala,
        0,
      );
      doPop[t.id] = q;
      const n = estado.pops[t.id]?.pessoas ?? 0;
      gente += n;
      soma += n * q;
    }
    porPop[cesta.id] = doPop;
    media[cesta.id] = gente > 0 ? soma / gente : 1;
  }
  return { porPop, media };
}
/**
 * Quanto as leis em vigor mudam o preço de cada cesta, em % (tomada
 * `preco_<cesta>`, 15/nov). O motor só conhece as cestas do mundo.
 */
export function precoPorLei(
  regras: Regras,
  estado: Estado,
): Record<string, number> {
  return Object.fromEntries(
    (regras.mercado?.mercado.cestas ?? []).map((c) => [
      c.id,
      tomada(regras.leis, estado.leis, `preco_${c.id}`),
    ]),
  );
}
/**
 * Parte do salário que a inflação comeu, para este pop (15/nov): a perda do
 * país × quanto cada estrato dele sente, pesado pela renda de cada pedaço.
 */
function perdaDoPop(
  regras: Regras,
  estado: Estado,
  tipo: TipoPop | undefined,
): number {
  const perda = estado.inflacao?.perda ?? 0;
  const sente = regras.fisco?.inflacao?.sente;
  if (!tipo || !sente || !(perda > 0)) return 0;
  return (
    perda *
    pedacos(tipo).reduce((s, [e, , renda]) => s + renda * (sente[e] ?? 0), 0)
  );
}
/** Cestas cujo índice o mundo declara (ex.: abastecimento, acesso a remédios). */
const cestasComIndice = (regras: Regras) =>
  (regras.mercado?.mercado.cestas ?? []).filter((c) => c.indice);
/**
 * Segurança média da população em cada cesta com índice, com os preços e a
 * renda de hoje (motor/mercado, fatias 6c e 6d).
 */
function indicesDasCestas(
  regras: Regras,
  estado: Estado,
): { indices: Record<string, number>; pops: Estado["pops"] } {
  const cestas = cestasComIndice(regras);
  const m = regras.mercado;
  if (!m) return { indices: {}, pops: estado.pops };
  const consumo = consumoDasCestas(regras, estado);
  const conta = contaDoPais(
    m.mercado,
    m.producao,
    m.cobertura,
    m.populacaoBase,
    estado.essenciais.populacao,
    estado.precos,
    consumo.media,
  );
  const seguranca = segurancaDaCesta(
    m.mercado,
    conta,
    estado.pops,
    consumo.porPop,
    precoPorLei(regras, estado),
  );
  const indices: Record<string, number> = {};
  for (const cesta of cestas) {
    const media = seguranca.find((c) => c.id === cesta.id)?.media;
    if (cesta.indice && media !== undefined) indices[cesta.indice] = media;
  }
  return { indices, pops: comPadraoDeVida(regras, estado, seguranca) };
}
/** Padrão de vida igual ao do turno 0. */
export const PADRAO_INICIAL = 50;
/**
 * Quanto vale cada serviço inteiro por pessoa, real (passo H): a parte
 * `valor` da renda por pessoa do estrato `de`. Fica no marco do turno 0.
 */
export function valorDosServicos(
  regras: Regras,
  estado: Estado,
): Record<string, number> {
  return Object.fromEntries(
    (regras.servicos ?? []).map((s) => [
      s.id,
      (s.valor * rendaDoEstrato(regras.pops, estado.pops, s.de) * 100) /
        estado.essenciais.indice_precos,
    ]),
  );
}
/**
 * Padrão de vida de cada pop (passo D, GDD 2.3): o que sobra da renda depois
 * das cestas, descontada a inflação, mais o que valem os serviços que ele
 * recebe (`poder`, passo H), e o número de 1 a 99 que diz quanto isso andou
 * desde o turno 0 (50 = igual, 99 = o dobro ou mais). O pop guarda também a
 * parte atendida de cada serviço e o direito que sente das leis.
 */
function comPadraoDeVida(
  regras: Regras,
  estado: Estado,
  seguranca: ReturnType<typeof segurancaDaCesta>,
): Estado["pops"] {
  const gasto: Record<string, number> = {};
  for (const c of seguranca)
    for (const p of c.pops) gasto[p.id] = (gasto[p.id] ?? 0) + p.gasto;
  const poder0 = estado.marco?.poder_pop;
  const valor = estado.marco?.valor_servico ?? valorDosServicos(regras, estado);
  const cobertura = Object.fromEntries(
    (regras.servicos ?? []).map((s) => [
      s.id,
      coberturaDosPops(
        regras.pops,
        estado.pops,
        s,
        (estado.jogabilidade[s.indice] ?? 0) / 100,
      ),
    ]),
  );
  const tipos = new Map(regras.pops.map((t) => [t.id, t]));
  const daLei = (chave: string) => tomada(regras.leis, estado.leis, chave);
  return Object.fromEntries(
    Object.entries(estado.pops).map(([id, pop]) => {
      const sobra = Math.max(0, 1 - (gasto[id] ?? 0) / 100);
      const servicos = Object.fromEntries(
        Object.entries(cobertura).map(([s, c]) => [s, c[id] ?? 0]),
      );
      const recebe = Object.entries(servicos).reduce(
        (soma, [s, parte]) => soma + parte * (valor[s] ?? 0),
        0,
      );
      const poder =
        ((pop.renda * sobra * 100) / estado.essenciais.indice_precos) *
          (1 - perdaDoPop(regras, estado, tipos.get(id))) +
        recebe;
      const antes = poder0?.[id];
      const padrao =
        antes && antes > 0
          ? Math.min(99, Math.max(1, (PADRAO_INICIAL * poder) / antes))
          : PADRAO_INICIAL;
      const t = tipos.get(id);
      const direito = t && direitoDoPop(t, daLei);
      return [
        id,
        {
          ...pop,
          poder,
          padrao,
          ...(regras.servicos?.length ? { servicos } : {}),
          ...(direito !== undefined ? { direito } : {}),
        },
      ];
    }),
  );
}
/**
 * Pontos que as cestas somam em outros índices (6c e 6d). Usa o índice do
 * turno anterior: o efeito chega com um turno de atraso.
 */
export function reacaoDasCestas(regras: Regras, estado: Estado) {
  const soma: Record<string, number> = {};
  for (const cesta of cestasComIndice(regras)) {
    const atual = cesta.indice && estado.jogabilidade[cesta.indice];
    const marco = cesta.indice && estado.marco.indices[cesta.indice];
    if (!cesta.reacao || atual === undefined || marco === undefined) continue;
    const pontos = reacaoDaCesta(cesta.reacao, Number(atual) - Number(marco));
    for (const [id, v] of Object.entries(pontos))
      soma[id] = (soma[id] ?? 0) + v;
  }
  // Falta de capacidade que chega aos civis (ex.: apagão em crise grave).
  for (const { capacidade, situacao } of situacoesDeCapacidade(regras, estado))
    for (const [id, v] of Object.entries(reacaoCivil(capacidade, situacao)))
      soma[id] = (soma[id] ?? 0) + v;
  return soma;
}
/** Quanto cada lei rende hoje pela instituição dela (sem governo, inteira). */
export const rendimentoDasLeisDoEstado = (regras: Regras, estado: Estado) =>
  estado.governo
    ? rendimentoDasLeis(estado.governo.orgaos, regras.leis, estado.leis)
    : undefined;

export function jogabilidade(regras: Regras, estado: Estado) {
  const soma = somaPorIndice(
    estado.efeitos,
    rendimentoDasLeisDoEstado(regras, estado),
  );
  const cestas = reacaoDasCestas(regras, estado);
  const indices: Record<string, number> = {};
  for (const [id, base] of Object.entries(estado.base)) {
    const { min, max } = regras.dominios[id];
    indices[id] = Math.min(
      max,
      Math.max(min, base + (soma[id] ?? 0) + (cestas[id] ?? 0)),
    );
  }
  // Os índices das cestas não têm base: são calculados no passo 8 e passam adiante.
  for (const { indice } of cestasComIndice(regras))
    if (indice && indice in estado.jogabilidade)
      indices[indice] = estado.jogabilidade[indice];
  return indices;
}
/** 7. Índices de jogabilidade: base do país + contribuições das leis; a deriva move a base. */
export const indicesJogabilidade: Etapa = (regras, estado) => {
  const base = regras.derivas
    ? andarDerivas(
        regras.derivas,
        estado.base,
        todosIndices(estado),
        estado.marco.indices,
        somaPorIndice(
          estado.efeitos,
          rendimentoDasLeisDoEstado(regras, estado),
        ),
        regras.dominios,
      )
    : estado.base;
  const comBase = { ...estado, base };
  return {
    ...comBase,
    jogabilidade: {
      ...jogabilidade(regras, comBase),
      ...indicesDoFisco(regras, comBase),
    },
  };
};
/**
 * Índices que saem de uma conta do motor e não das leis (motor/fisco): o
 * déficit da previdência é benefício menos contribuição, em % do PIB.
 */
export function indicesDoFisco(
  regras: Regras,
  estado: Estado,
): Record<string, number> {
  const p = regras.fisco?.previdencia;
  if (!p || !regras.dominios[p.indice]) return {};
  const gasto = gastoPorLei(regras, estado.leis, estado.fiscal?.corte);
  const beneficios = p.leis_gasto.reduce((s, id) => s + (gasto[id] ?? 0), 0);
  const e = estado.essenciais;
  const contribuicao =
    ((arrecadacaoPorBase(regras, estado.leis, e, dinheiroFora(regras, estado))[
      p.base_contribuicao
    ] ?? 0) /
      e.pib_nominal) *
    100;
  return {
    [p.indice]: indiceDaPrevidencia(
      beneficios - contribuicao,
      p.pontos_por_pct_pib,
      regras.dominios[p.indice],
    ),
  };
}
/** Essenciais e jogabilidade num mapa só, para os grupos. */
export const todosIndices = (estado: Estado): Record<string, number> => ({
  ...estado.essenciais,
  ...estado.jogabilidade,
});
/** Índices das cestas de hoje no estado, para os grupos e o turno seguinte. */
export function comIndicesDasCestas(regras: Regras, estado: Estado): Estado {
  const { indices, pops } = indicesDasCestas(regras, estado);
  return {
    ...estado,
    pops,
    jogabilidade: { ...estado.jogabilidade, ...indices },
  };
}
