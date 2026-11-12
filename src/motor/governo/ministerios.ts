// Ministérios: a caixa de cada lei, a ficha do ministro e o quanto ela muda o
// efeito das leis da caixa.
import type { Lei } from "../leis";
import { chavesDeEsfera, moldePorId } from "./indices";
import type {
  AjusteDeEfeito,
  Caixa,
  Ficha,
  Molde,
  RefEsfera,
  RegrasGoverno,
} from "./tipos";

/** Esferas que a sobra do gabinete conta ao dividir a competência. */
const ESFERAS_SEM_DIVISAO = 3;
/** Competência acima da qual o ministro adianta a lei, e abaixo da qual atrasa. */
const COMPETENTE = 70;
const FRACO = 30;
/** Força da lei: 1 com competência 50; 0,6 com zero e 1,4 com cem. */
const FORCA_BASE = 0.6;
const FORCA_POR_PONTO = 0.008;

const TECNICO = "tecnico";

/** A caixa (ou o gabinete) responde por esta esfera e subesfera? */
const cobre = (ref: RefEsfera, esfera?: string, sub?: string) =>
  ref.esfera === esfera &&
  (ref.subesfera === undefined || ref.subesfera === sub);

const molde = (r: RegrasGoverno, id: string): Molde => {
  const m = moldePorId(r, id);
  if (!m) throw new Error(`governo: molde "${id}" não existe`);
  return m;
};

export const fichaDe = (r: RegrasGoverno, id: string): Ficha => {
  const f = r.pessoas.find((x) => x.id === id);
  if (!f) throw new Error(`governo: pessoa "${id}" não existe`);
  return f;
};

/** O que basta saber de uma lei para achar a caixa dela. */
type DaEsfera = Pick<Lei, "id" | "esfera" | "subesfera">;

/** Caixa que cuida da lei: a que cita a subesfera, senão a esfera, senão a sobra. */
export function caixaDaLei(
  r: RegrasGoverno,
  caixas: Caixa[],
  lei: DaEsfera,
): Caixa {
  const moldes = caixas.map((c) => ({ c, m: molde(r, c.molde) }));
  const acha = (exato: boolean) =>
    moldes.find(({ m }) =>
      m.esferas.some((ref) =>
        exato
          ? ref.subesfera !== undefined && cobre(ref, lei.esfera, lei.subesfera)
          : ref.subesfera === undefined && ref.esfera === lei.esfera,
      ),
    );
  // lei de esfera inteira (sem subesfera) vai a quem cuida de qualquer pedaço dela
  const dePedaco = () =>
    lei.subesfera === undefined
      ? moldes.find(({ m }) =>
          m.esferas.some((ref) => ref.esfera === lei.esfera),
        )
      : undefined;
  const dona =
    acha(true) ?? acha(false) ?? dePedaco() ?? moldes.find(({ m }) => m.sobra);
  if (!dona) throw new Error(`governo: nenhuma caixa cuida da lei "${lei.id}"`);
  return dona.c;
}

/** Quantas esferas a caixa cuida; a sobra leva o que ninguém mais cuida. */
export function esferasDaCaixa(
  r: RegrasGoverno,
  caixas: Caixa[],
  leis: Record<string, Lei>,
  idDoMolde: string,
): number {
  const dela = molde(r, idDoMolde);
  const minhas = chavesDeEsfera(leis).filter((k) => {
    const [esfera, sub] = k.split(":");
    return (
      caixaDaLei(r, caixas, { id: k, esfera, subesfera: sub || undefined })
        .molde === idDoMolde
    );
  });
  return dela.sobra ? minhas.length + ESFERAS_SEM_DIVISAO : minhas.length;
}

/** Competência que sobra quando o ministro cuida de muitas esferas. */
export const competenciaEfetiva = (competencia: number, esferas: number) =>
  competencia *
  Math.sqrt(Math.min(1, ESFERAS_SEM_DIVISAO / Math.max(1, esferas)));

/** Atraso e força que a competência dá às leis da caixa. */
export function ajusteDaCompetencia(competencia: number): AjusteDeEfeito {
  const atraso = competencia > COMPETENTE ? -1 : competencia < FRACO ? 1 : 0;
  return { atraso, forca: FORCA_BASE + FORCA_POR_PONTO * competencia };
}

/** O ajuste do ministro da caixa que cuida da lei. */
export function ajusteDaLei(
  r: RegrasGoverno,
  caixas: Caixa[],
  leis: Record<string, Lei>,
  lei: Lei,
): AjusteDeEfeito {
  const caixa = caixaDaLei(r, caixas, lei);
  const ficha = fichaDe(r, caixa.ministro);
  const efetiva = competenciaEfetiva(
    ficha.competencia,
    esferasDaCaixa(r, caixas, leis, caixa.molde),
  );
  return ajusteDaCompetencia(efetiva);
}

/** Ministro de cada partido (origem) por contagem; técnico não conta. */
export function ministrosPorPartido(r: RegrasGoverno, caixas: Caixa[]) {
  const conta: Record<string, number> = {};
  for (const c of caixas) {
    const origem = fichaDe(r, c.ministro).origem;
    if (origem !== TECNICO) conta[origem] = (conta[origem] ?? 0) + 1;
  }
  return conta;
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
