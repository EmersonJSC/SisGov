/**
 * Contas da tramitação (V1-12, docs/v1/desenho/tramitacao.md): caminho por
 * nível, quórum, quantas votações por turno, a ordem da fila e o voto de
 * cada cadeira.
 */
import type { PolicyFile } from "../../engine";
import { roll } from "../randomState";
import type { Etapa, NivelNoCongresso, Pressa, Projeto } from "./tipos";

/**
 * Nível da lei pelo que está escrito hoje (`processoAutorizacao`, e os
 * campos antigos `nivelLegal` e `nivel`), até a organização das leis
 * (V1-34) deixar um campo só.
 */
export function nivelNoCongresso(policy: PolicyFile): NivelNoCongresso {
  const extra = policy as PolicyFile & { nivelLegal?: string; nivel?: string };
  const p = policy.processoAutorizacao ?? "";
  if (p === "clausula-petrea" || extra.nivelLegal === "petrea") return "petrea";
  if (p === "decreto" || p.startsWith("execucao-") || extra.nivel === "decreto")
    return "decreto";
  if (p === "lei-complementar") return "lei-complementar";
  if (
    p === "emenda-constitucional" ||
    extra.nivelLegal === "constitucional" ||
    extra.nivel === "constituicao"
  )
    return "emenda";
  return "lei-ordinaria";
}

/** Votações do projeto: cada casa, uma rodada (ou duas, na emenda). */
export function etapasDo(
  tipo: Projeto["tipo"],
  casas: readonly string[],
  rodadas: number,
): Etapa[] {
  const n = tipo === "emenda" ? Math.max(1, rodadas) : 1;
  return casas.flatMap((casa) =>
    Array.from({ length: n }, (_, i) => ({ casa, rodada: i + 1 })),
  );
}

/** Quantas etapas o projeto anda num turno, pela pressa. */
export function etapasPorTurno(tipo: Projeto["tipo"], pressa: Pressa): number {
  if (pressa === "emergencia") return 2;
  if (pressa === "urgencia" && tipo !== "emenda") return 2;
  return 1;
}

/** Votos sim necessários numa casa. */
export function quorum(
  regra: "maioria-dos-votos" | "maioria-absoluta" | number,
  cadeiras: number,
): number {
  if (regra === "maioria-absoluta" || regra === "maioria-dos-votos")
    return Math.floor(cadeiras / 2) + 1;
  return Math.ceil(regra * cadeiras - 1e-9);
}

/**
 * Votações por casa no turno: cresce com o apoio (0 a 100); abaixo do
 * mínimo, o Congresso ignora a fila.
 */
export function votacoesNoTurno(
  apoio: number,
  maximo: number,
  minimo: number,
): number {
  if (apoio < minimo) return 0;
  return Math.max(1, Math.min(maximo, Math.round((maximo * apoio) / 100)));
}

/**
 * Prioridade na fila: medida provisória no último turno do prazo tranca a
 * fila (vai antes de tudo); depois a opinião pública mais a pressa; empate,
 * quem chegou antes.
 */
export function ordemDaFila(
  fila: readonly Projeto[],
  turno: number,
  bonus: Readonly<{ urgencia: number; emergencia: number }>,
  prazoDaMedidaProvisoria: number,
): Projeto[] {
  const tranca = (p: Projeto) =>
    p.medidaProvisoria && turno - p.enviadoNoTurno >= prazoDaMedidaProvisoria
      ? 1
      : 0;
  const nota = (p: Projeto) =>
    p.previsao.opiniao +
    (p.pressa === "urgencia"
      ? bonus.urgencia
      : p.pressa === "emergencia"
        ? bonus.emergencia
        : 0);
  return [...fila].sort(
    (a, b) =>
      tranca(b) - tranca(a) ||
      nota(b) - nota(a) ||
      a.enviadoNoTurno - b.enviadoNoTurno ||
      a.id.localeCompare(b.id),
  );
}

/** Votos sim de uma bancada: cada cadeira sorteia com a mesma chance. */
export function votosSim(
  chance: number,
  cadeiras: number,
  seed: number,
  turno: number,
  chave: string,
): number {
  let sim = 0;
  for (let i = 0; i < cadeiras; i++)
    if (roll(seed, turno, `${chave}:${i}`) < chance) sim += 1;
  return sim;
}
