import type { GameState } from "../../game/createGame";
import { prepareGameQuarter } from "../../game/prepareGameQuarter";
import { commitGameQuarter } from "../../game/commitGameQuarter";
import { advancePolicyImplementation } from "../../game/advancePolicyImplementation";
import type { Resultado, Partida, EfeitoPrevisto, PrevisaoLei } from "./tipos";
import { escalaDe, falha } from "./comum";
import { aplicarMeta } from "./leis";

/** Maior horizonte da prévia, em trimestres (5 anos). */
export const MAXIMO_TRIMESTRES_PREVIA = 20;

/** Os três meses do próximo turno, sem gravar nada na partida. */
export function simularTrimestre(partida: Partida) {
  const { content, graph, game } = partida;
  const months = [];
  let states = game.policies;
  for (let month = 0; month < 3; month++) {
    const advanced = advancePolicyImplementation(
      content,
      states,
      game.currentTurn,
    );
    if (!advanced.ok) return advanced;
    states = advanced.value;
    months.push(states);
  }
  const prepared = prepareGameQuarter(content, graph, game, months);
  if (!prepared.ok) return prepared;
  return { ok: true as const, value: { prepared: prepared.value, months } };
}

type Serie = Readonly<{
  /** A simulação parou antes do horizonte: o motivo (a série é o que deu). */
  interrompida?: string;
  /** Valores das bolhas ao fim de cada mês. */
  valores: readonly Readonly<Record<string, number>>[];
  /** Estados das leis ao fim de cada mês. */
  leis: readonly (readonly GameState["policies"][number][])[];
}>;

/** Várias rodadas seguidas, sem gravar nada na partida. */
export function simularTrimestres(
  partida: Partida,
  trimestres: number,
): Resultado<Serie> {
  const valores: Readonly<Record<string, number>>[] = [];
  const leis: (readonly GameState["policies"][number][])[] = [];
  let atual = partida;
  for (let t = 0; t < trimestres; t++) {
    const simulado = simularTrimestre(atual);
    if (!simulado.ok) {
      // devolve o trecho que deu para calcular (SG159)
      const motivo = simulado.diagnostics.map((d) => d.message).join(" ");
      if (!valores.length) return falha(simulado.diagnostics);
      return {
        ok: true,
        value: { valores, leis, interrompida: `turno ${t + 1}: ${motivo}` },
      };
    }
    const { prepared, months } = simulado.value;
    prepared.months.forEach((mes) => valores.push(mes.execution.values));
    months.forEach((estados) => leis.push(estados));
    atual = { ...atual, game: commitGameQuarter(atual.game, prepared) };
  }
  return { ok: true, value: { valores, leis } };
}

/** A série sem mudança só depende da partida: guarda para não refazer. */
const seriesBase = new WeakMap<Partida, Map<number, Resultado<Serie>>>();

export function serieSemMudanca(partida: Partida, trimestres: number) {
  const porHorizonte =
    seriesBase.get(partida) ?? new Map<number, Resultado<Serie>>();
  seriesBase.set(partida, porHorizonte);
  if (!porHorizonte.has(trimestres))
    porHorizonte.set(trimestres, simularTrimestres(partida, trimestres));
  return porHorizonte.get(trimestres)!;
}

/** Bolhas que diferem entre duas simulações, da maior diferença para a menor. */
export function compararSeries(
  partida: Partida,
  base: Serie,
  alt: Serie,
  meses: number,
): EfeitoPrevisto[] {
  const { content, game } = partida;
  const now = game.execution.values;
  return content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable): EfeitoPrevisto & { peso: number } => {
      const semMudanca = base.valores
        .slice(0, meses)
        .map((v) => v[variable.id] ?? 0);
      const comMudanca = alt.valores
        .slice(0, meses)
        .map((v) => v[variable.id] ?? 0);
      const escala = escalaDe(variable);
      const amplitude = escala.maximo - escala.minimo || 1;
      const peso =
        Math.max(
          ...comMudanca.map((value, i) => Math.abs(value - semMudanca[i])),
        ) / amplitude;
      return {
        id: variable.id,
        nome: variable.nome,
        unidade: variable.unidade,
        avaliacao: variable.avaliacao,
        atual: now[variable.id] ?? 0,
        semMudanca,
        comMudanca,
        peso,
      };
    })
    .filter((item) => item.peso > 1e-7)
    .sort((a, b) => b.peso - a.peso)
    .map((item): EfeitoPrevisto => ({
      id: item.id,
      nome: item.nome,
      unidade: item.unidade,
      avaliacao: item.avaliacao,
      atual: item.atual,
      semMudanca: item.semMudanca,
      comMudanca: item.comMudanca,
    }));
}

/**
 * Prévia: o que muda nos próximos `trimestres` turnos (3 meses cada) se a
 * lei for para `nivel` agora. Compara a simulação com e sem a mudança; a
 * diferença é o efeito da lei. Nada é gravado. A prévia supõe que a mudança
 * vale na hora (como no modo `teste`).
 */
export function preverLei(
  partida: Partida,
  leiId: string,
  nivel: number,
  trimestres = 1,
): Resultado<PrevisaoLei> {
  if (
    !Number.isInteger(trimestres) ||
    trimestres < 1 ||
    trimestres > MAXIMO_TRIMESTRES_PREVIA
  )
    return {
      ok: false,
      erros: [
        `O horizonte da prévia deve ser um número inteiro de 1 a ${MAXIMO_TRIMESTRES_PREVIA} trimestres.`,
      ],
    };
  const changed = aplicarMeta(partida, leiId, nivel);
  if (!changed.ok) return changed;
  const base = serieSemMudanca(partida, trimestres);
  if (!base.ok) return base;
  const alt = simularTrimestres(changed.value, trimestres);
  if (!alt.ok) return alt;
  // Só compara os meses que as duas simulações calcularam.
  const meses = Math.min(base.value.valores.length, alt.value.valores.length);
  const interrompida = alt.value.interrompida ?? base.value.interrompida;
  const efeitos = compararSeries(partida, base.value, alt.value, meses);
  const implantacao = alt.value.leis
    .slice(0, meses)
    .map(
      (states) =>
        states.find((state) => state.policyDefinitionId === leiId)
          ?.implementedLevel ?? nivel,
    );
  return {
    ok: true,
    value: {
      leiId,
      nivel,
      implantacao,
      efeitos,
      ...(interrompida ? { interrompida } : {}),
    },
  };
}
