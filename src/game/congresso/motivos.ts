import type { PerfilDoEleitor } from "./tipos";

/**
 * Motivos da satisfação de uma pessoa (População, "a população pensa").
 *
 * A satisfação nunca é um número solto: é 50 mais a soma de motivos, e cada
 * módulo que conhece algo da pessoa só acrescenta os seus. Hoje são três: o
 * grupo social a que ela pertence, o bolso e a memória. As leis entram depois
 * como mais um produtor, sem tocar nos que já existem.
 */
export type Motivo = Readonly<{
  /** Quem produziu o motivo. */
  origem: "grupo" | "bolso" | "memoria";
  /** Variável do grupo (`grupo_*`), o motivo da memória; vazio no bolso. */
  id: string;
  /**
   * Tags que ligam o motivo aos outros módulos (leis, economia, rede social).
   * Cada módulo lê as suas; o motivo de grupo leva o próprio id.
   */
  tags: readonly string[];
  /** Pontos de satisfação que o motivo soma (+) ou tira (−) dos 50. */
  pontos: number;
}>;

type Valores = Readonly<Record<string, number>>;

/** Um módulo da pessoa: olha o perfil e o país e diz o que ela sente. */
type Produtor = (
  perfil: PerfilDoEleitor,
  pesoDoSegmento: Valores,
  valores: Valores,
) => readonly Motivo[];

/** Cada grupo da pessoa puxa a satisfação para o valor dele, pesado pelo eixo. */
const doGrupo: Produtor = (perfil, pesoDoSegmento, valores) => {
  const pesos = perfil.segmentos.reduce(
    (a, s) => a + (pesoDoSegmento[s] ?? 1),
    0,
  );
  if (pesos <= 0) return [];
  return perfil.segmentos.map((s) => ({
    origem: "grupo",
    id: s,
    tags: [s],
    pontos: ((pesoDoSegmento[s] ?? 1) * ((valores[s] ?? 50) - 50)) / pesos,
  }));
};

/** O que o bolso da pessoa mudou desde o turno 0. */
const doBolso: Produtor = (perfil) =>
  perfil.bolso
    ? [{ origem: "bolso", id: "", tags: ["bolso"], pontos: perfil.bolso }]
    : [];

/** O que a pessoa lembra: já vem em pontos, com as tags do JSON. */
const daMemoria: Produtor = (perfil) =>
  (perfil.memoria ?? []).map((m) => ({ origem: "memoria", ...m }));

const PRODUTORES: readonly Produtor[] = [doGrupo, doBolso, daMemoria];

/** Todos os motivos da pessoa, na ordem em que os módulos os dão. */
export function motivosDoPerfil(
  perfil: PerfilDoEleitor,
  pesoDoSegmento: Valores,
  valores: Valores,
): readonly Motivo[] {
  return PRODUTORES.flatMap((p) => p(perfil, pesoDoSegmento, valores));
}

/** Satisfação (0 a 100) que os motivos somam. Sem motivo, 50. */
export const satisfacaoDosMotivos = (motivos: readonly Motivo[]): number =>
  Math.max(0, Math.min(100, 50 + motivos.reduce((a, m) => a + m.pontos, 0)));
