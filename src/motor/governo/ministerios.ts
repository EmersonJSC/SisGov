// Ministérios: a caixa de cada instituição, a ficha do ministro e o quanto ela
// muda o efeito das leis da caixa.
import type { Lei } from "../leis";
import { instituicaoPorId } from "./indices";
import type { AjusteDeEfeito, Caixa, Ficha, RegrasGoverno } from "./tipos";

/** Instituições que um ministro cuida sem dividir a atenção; a sobra do gabinete conta estas a mais. */
const SEM_DIVISAO = 3;
/** Competência acima da qual o ministro adianta a lei, e abaixo da qual atrasa. */
const COMPETENTE = 70;
const FRACO = 30;
/** Força da lei: 1 com competência 50; 0,6 com zero e 1,4 com cem. */
const FORCA_BASE = 0.6;
const FORCA_POR_PONTO = 0.008;
/** Lei de instituição sem ministro anda como com um ministro mediano. */
const COMPETENCIA_SEM_MINISTRO = 50;

const TECNICO = "tecnico";

export const fichaDe = (r: RegrasGoverno, id: string): Ficha => {
  const f = r.pessoas.find((x) => x.id === id);
  if (!f) throw new Error(`governo: pessoa "${id}" não existe`);
  return f;
};

/** A instituição fica com um dos poderes, sem ministro? */
export const semMinistro = (r: RegrasGoverno, instituicao: string) =>
  instituicaoPorId(r, instituicao)?.semMinistro === true;

/** Caixa que leva a instituição: a que a cita, senão a sobra; null se ela não tem ministro. */
export function caixaDaInstituicao(
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  instituicao: string,
): Caixa | null {
  if (semMinistro(r, instituicao)) return null;
  const dona =
    caixas.find((c) => c.instituicoes.includes(instituicao)) ??
    caixas.find((c) => c.sobra);
  if (!dona) throw new Error(`governo: nenhuma caixa leva "${instituicao}"`);
  return dona;
}

/** O que basta saber de uma lei para achar a caixa dela. */
type DaInstituicao = Pick<Lei, "id" | "esfera">;

/** Caixa que cuida da lei: a da instituição onde ela mora (null sem ministro). */
export const caixaDaLei = (
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  lei: DaInstituicao,
): Caixa | null => caixaDaInstituicao(r, caixas, lei.esfera ?? "");

/** Instituições com ministro que nenhuma caixa cita: vão para a sobra. */
export const instituicoesSoltas = (
  r: RegrasGoverno,
  caixas: readonly Caixa[],
): string[] =>
  r.instituicoes
    .filter((i) => !i.semMinistro)
    .filter((i) => !caixas.some((c) => c.instituicoes.includes(i.id)))
    .map((i) => i.id);

/** Quantas instituições a caixa cuida; a sobra leva também as soltas e conta mais. */
export function instituicoesDaCaixa(
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  caixa: Caixa,
): number {
  return caixa.sobra
    ? caixa.instituicoes.length +
        instituicoesSoltas(r, caixas).length +
        SEM_DIVISAO
    : caixa.instituicoes.length;
}

/** Competência que sobra quando o ministro cuida de muitas instituições. */
export const competenciaEfetiva = (competencia: number, instituicoes: number) =>
  competencia * Math.sqrt(Math.min(1, SEM_DIVISAO / Math.max(1, instituicoes)));

/** Atraso e força que a competência dá às leis da caixa. */
export function ajusteDaCompetencia(competencia: number): AjusteDeEfeito {
  const adianta = competencia > COMPETENTE ? -1 : 0;
  const atraso = competencia < FRACO ? 1 : adianta;
  return { atraso, forca: FORCA_BASE + FORCA_POR_PONTO * competencia };
}

/** O ajuste do ministro da caixa que cuida da lei. */
export function ajusteDaLei(
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  lei: Lei,
): AjusteDeEfeito {
  const caixa = caixaDaLei(r, caixas, lei);
  if (!caixa) return ajusteDaCompetencia(COMPETENCIA_SEM_MINISTRO);
  const ficha = fichaDe(r, caixa.ministro);
  return ajusteDaCompetencia(
    competenciaEfetiva(
      ficha.competencia,
      instituicoesDaCaixa(r, caixas, caixa),
    ),
  );
}

/** Ministro de cada partido (origem) por contagem; técnico não conta. */
export function ministrosPorPartido(r: RegrasGoverno, caixas: Caixa[]) {
  return caixas
    .map((c) => fichaDe(r, c.ministro).origem)
    .filter((origem) => origem !== TECNICO)
    .reduce<Record<string, number>>(
      (conta, origem) => ({ ...conta, [origem]: (conta[origem] ?? 0) + 1 }),
      {},
    );
}

/** Pessoas livres do partido, a mais competente primeiro. */
export function candidatosDoPartido(
  r: RegrasGoverno,
  caixas: Caixa[],
  partido: string,
): Ficha[] {
  const ocupadas = new Set(caixas.map((c) => c.ministro));
  return r.pessoas
    .filter((p) => p.origem === partido && !ocupadas.has(p.id))
    .sort((a, b) => b.competencia - a.competencia);
}
