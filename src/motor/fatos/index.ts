// Mesa de fatos: a memória curta da partida. Comportamento em fatos.md.
import type { PontoBussola } from "../leis";

/** Tipos que a mesa aceita. Tipo novo entra aqui e no fatos.md. */
export const TIPOS_DE_FATO = [
  "lei-aprovada",
  "lei-rejeitada",
  "partido-saiu-da-base",
  "partido-entrou-na-base",
  "eleicao-vencida",
  "eleicao-perdida",
  "emenda",
  "papel-assinado",
  "papel-vetado",
  "papel-ignorado",
  "veto-derrubado",
  "decreto",
  "decreto-derrubado",
  "promessa-cumprida",
  "promessa-descumprida",
  "partido-ameaca-sair",
  "ministro-nomeado",
  "ministro-demitido",
  "ministerio-oferecido",
  "programa-formado",
  "programa-desfeito",
  "meta-cumprida",
  "meta-quebrada",
  "segundo-turno",
  "juiz-aposentado",
  "juiz-nomeado",
  "indicado-barrado",
  "corte-novo-presidente",
  // Ninguém escreve ainda; o Congresso já lê (mídia e escândalos vêm depois).
  "escandalo",
  "manchete-contra",
  "grupo-com-raiva",
] as const;
export type TipoFato = (typeof TIPOS_DE_FATO)[number];

export const TAMANHOS = ["pequeno", "medio", "grande"] as const;
export type Tamanho = (typeof TAMANHOS)[number];

/** Turnos que o fato fica na mesa, contando o turno em que aconteceu. */
const DURACAO: Record<Tamanho, number> = { pequeno: 1, medio: 2, grande: 3 };

export interface Fato {
  tipo: TipoFato;
  /** Turno em que aconteceu. */
  turno: number;
  tamanho: Tamanho;
  /** Do que se trata: id de lei, índice ou área. */
  sobre?: string;
  /** Quem está envolvido: ids de partido, grupo, potência. */
  quem?: string[];
  /** Para onde o fato puxa na bússola. */
  lado?: PontoBussola;
  /** Turnos que ainda fica na mesa (1 = some no próximo). */
  restam: number;
}

export type FatoNovo = Omit<Fato, "restam">;

export function novoFato(fato: FatoNovo): Fato {
  return { ...fato, restam: DURACAO[fato.tamanho] };
}

/** Força de 0 a 1: inteira no turno em que aconteceu, cai a cada turno. */
export function forcaDoFato(fato: Fato): number {
  return fato.restam / DURACAO[fato.tamanho];
}

/** Começo do turno: cada fato perde um turno; o que chega a zero sai. */
export function envelhecerFatos(fatos: readonly Fato[]): Fato[] {
  return fatos
    .map((f) => ({ ...f, restam: f.restam - 1 }))
    .filter((f) => f.restam > 0);
}

/** O que um módulo procura na mesa; campo ausente = qualquer. */
export interface Pergunta {
  tipo?: TipoFato | readonly TipoFato[];
  sobre?: string;
  /** Pelo menos um destes está envolvido. */
  quem?: string | readonly string[];
  tamanhoMinimo?: Tamanho;
  /** Só os fatos deste turno. */
  turno?: number;
}

const lista = <T>(v: T | readonly T[]): readonly T[] =>
  Array.isArray(v) ? v : [v as T];

export function consultar(
  fatos: readonly Fato[],
  pergunta: Pergunta = {},
): Fato[] {
  const { tipo, sobre, quem, tamanhoMinimo, turno } = pergunta;
  const tipos = tipo === undefined ? null : lista(tipo);
  const envolvidos = quem === undefined ? null : lista(quem);
  const piso = tamanhoMinimo ? TAMANHOS.indexOf(tamanhoMinimo) : 0;
  return fatos.filter(
    (f) =>
      (!tipos || tipos.includes(f.tipo)) &&
      (sobre === undefined || f.sobre === sobre) &&
      (!envolvidos || (f.quem ?? []).some((q) => envolvidos.includes(q))) &&
      TAMANHOS.indexOf(f.tamanho) >= piso &&
      (turno === undefined || f.turno === turno),
  );
}

/** Fato com tipo, tamanho e prazo válidos (invariante do turno). */
export function motivoFatoInvalido(fato: Fato): string | null {
  if (!TIPOS_DE_FATO.includes(fato.tipo))
    return `tipo "${fato.tipo}" desconhecido`;
  if (!TAMANHOS.includes(fato.tamanho))
    return `tamanho "${fato.tamanho}" desconhecido`;
  if (!(Number.isInteger(fato.restam) && fato.restam > 0))
    return "prazo na mesa inválido";
  return null;
}
