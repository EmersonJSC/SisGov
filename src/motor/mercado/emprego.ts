// Pops nos setores: emprego, salário e lucro (src/motor/mercado/mercado.md,
// fatia 4). O motor não conhece nomes de pop nem de setor.
import type { ErroMercado, Mercado } from "./index";

/** Onde o pop trabalha e quanto da renda dele é lucro. */
export interface Ocupacao {
  /** Peso de cada setor (soma 1); vazio = sem emprego formal. */
  setores: Record<string, number>;
  /** Parte da renda bruta que é lucro (0 a 1); o resto é salário. */
  capital: number;
  /** Setores para onde a gente do pop pode ir estudando, e o índice que manda. */
  treina?: { para: string[]; exige: string };
}

const FOLGA = 1e-6;

/** Valida a ocupação de cada pop do JSON do mundo. */
export function validarOcupacao(
  pops: readonly {
    id: string;
    setores?: unknown;
    capital?: unknown;
    treina?: unknown;
  }[],
  mercado: Mercado,
): ErroMercado[] {
  const erros: ErroMercado[] = [];
  const ids = new Set(mercado.setores.map((s) => s.id));
  for (const p of pops) {
    const erro = (campo: string, motivo: string) =>
      erros.push({ campo: `${p.id}.${campo}`, motivo });
    const cap = p.capital;
    if (typeof cap !== "number" || !(cap >= 0 && cap <= 1))
      erro("capital", "precisa ser um número de 0 a 1");
    const t = p.treina as { para?: unknown; exige?: unknown } | undefined;
    if (t !== undefined) {
      if (!Array.isArray(t.para) || typeof t.exige !== "string" || !t.exige)
        erro("treina", "precisa de { para: [setores], exige: índice }");
      else
        for (const id of t.para)
          if (!ids.has(id)) erro(`treina.${id}`, "setor não existe");
    }
    const s = p.setores;
    if (typeof s !== "object" || s === null || Array.isArray(s)) {
      erro("setores", "precisa ser um objeto");
      continue;
    }
    let soma = 0;
    let ruim = false;
    for (const [id, peso] of Object.entries(s)) {
      if (!ids.has(id)) {
        erro(`setores.${id}`, "setor não existe");
        ruim = true;
      } else if (typeof peso !== "number" || !(peso >= 0)) {
        erro(`setores.${id}`, "precisa ser um número ≥ 0");
        ruim = true;
      } else soma += peso;
    }
    if (!ruim && Object.keys(s).length > 0 && Math.abs(soma - 1) > FOLGA)
      erro("setores", `pesos somam ${soma}, precisa ser 1`);
  }
  return erros;
}

/** Mistura de setores de cada pop hoje (pesos somam 1 por pop). */
export type MixDeSetores = Record<string, Record<string, number>>;

/** Fração do pop que muda de setor por turno, no máximo (instrução cheia). */
export const PASSO_SETOR = 0.005;
/** O setor de destino precisa pagar pelo menos 5% a mais para valer a mudança. */
const GANHO_MINIMO = 1.05;

/**
 * Um turno de gente estudando e mudando de setor: de cada pop sai um pouco do
 * setor que paga menos e vai para o que paga mais, entre os que ele já tem e
 * os que `treina` libera. A velocidade é a do índice que o pop exige (ex.:
 * instrução). O total de cada pop segue 1.
 */
export function migrarSetores(
  mercado: Mercado,
  ocupacao: Record<string, Ocupacao>,
  atual: MixDeSetores | undefined,
  pops: Record<string, PopNoSetor>,
  indices: Record<string, number>,
): MixDeSetores {
  const mix = mixAtual(ocupacao, atual);
  const salario = Object.fromEntries(
    empregoDoPais(mercado, ocupacao, pops, mix).setores.map((s) => [
      s.id,
      s.salario,
    ]),
  );
  const novo: MixDeSetores = {};
  for (const [id, o] of Object.entries(ocupacao)) {
    if (!o.treina) continue;
    const pesos = { ...mix[id] };
    novo[id] = pesos;
    const forca = Math.min(1, Math.max(0, (indices[o.treina.exige] ?? 0) / 100));
    const daqui = Object.keys(pesos)
      .filter((k) => pesos[k] > 0)
      .sort((a, b) => salario[a] - salario[b])[0];
    const para = [...new Set([...Object.keys(pesos), ...o.treina.para])]
      .filter((k) => k in salario)
      .sort((a, b) => salario[b] - salario[a])[0];
    if (!daqui || !para || daqui === para || forca <= 0) continue;
    if (salario[para] < salario[daqui] * GANHO_MINIMO) continue;
    const fluxo = Math.min(pesos[daqui], PASSO_SETOR * forca);
    pesos[daqui] -= fluxo;
    pesos[para] = (pesos[para] ?? 0) + fluxo;
    if (pesos[daqui] < 1e-9) delete pesos[daqui];
  }
  return novo;
}

/** Mistura de hoje: a do estado onde houver, senão a declarada pelo país. */
function mixAtual(
  ocupacao: Record<string, Ocupacao>,
  atual: MixDeSetores | undefined,
): MixDeSetores {
  return Object.fromEntries(
    Object.entries(ocupacao).map(([id, o]) => [id, atual?.[id] ?? o.setores]),
  );
}

export function lerOcupacao(
  pops: readonly {
    id: string;
    setores?: unknown;
    capital?: unknown;
    treina?: unknown;
  }[],
  mercado: Mercado,
): Record<string, Ocupacao> {
  const erros = validarOcupacao(pops, mercado);
  if (erros.length)
    throw new Error(
      erros
        .map((e) => `mundo/pops/pops.json › ${e.campo}: ${e.motivo}`)
        .join("\n"),
    );
  return Object.fromEntries(
    pops.map((p) => [
      p.id,
      {
        setores: p.setores as Ocupacao["setores"],
        capital: p.capital as number,
        ...("treina" in p ? { treina: p.treina as Ocupacao["treina"] } : {}),
      },
    ]),
  );
}

export interface EmpregoDoSetor {
  id: string;
  nome: string;
  /** Empregos, em % da população. */
  empregos: number;
  /** Salário médio, em vezes a renda média por pessoa. */
  salario: number;
  /** Massa salarial, em % do PIB. */
  massa: number;
  /** Lucro, em % do PIB. */
  lucro: number;
}

export interface EmpregoDoPais {
  setores: EmpregoDoSetor[];
  /** Pessoas sem emprego formal, em % da população. */
  semEmprego: number;
}

/** Pedaço do pop que a conta precisa: pessoas e renda bruta por pessoa. */
export interface PopNoSetor {
  pessoas: number;
  renda_bruta: number;
}

/** Empregos, salário e lucro de cada setor, a partir dos pops do estado. */
export function empregoDoPais(
  mercado: Mercado,
  ocupacao: Record<string, Ocupacao>,
  pops: Record<string, PopNoSetor>,
  mix?: MixDeSetores,
): EmpregoDoPais {
  let populacao = 0;
  let pib = 0;
  let semEmprego = 0;
  const soma = new Map(
    mercado.setores.map((s) => [s.id, { empregos: 0, massa: 0, lucro: 0 }]),
  );
  for (const [id, pop] of Object.entries(pops)) {
    populacao += pop.pessoas;
    const renda = pop.pessoas * pop.renda_bruta;
    pib += renda;
    const o = ocupacao[id];
    if (!o || Object.keys(o.setores).length === 0) {
      semEmprego += pop.pessoas;
      continue;
    }
    for (const [setor, peso] of Object.entries(mix?.[id] ?? o.setores)) {
      const acc = soma.get(setor);
      if (!acc) continue;
      acc.empregos += pop.pessoas * peso * (1 - o.capital);
      acc.massa += renda * peso * (1 - o.capital);
      acc.lucro += renda * peso * o.capital;
    }
  }
  const media = populacao > 0 ? pib / populacao : 0;
  return {
    semEmprego: populacao > 0 ? (100 * semEmprego) / populacao : 0,
    setores: mercado.setores.map((s) => {
      const a = soma.get(s.id)!;
      return {
        id: s.id,
        nome: s.nome,
        empregos: populacao > 0 ? (100 * a.empregos) / populacao : 0,
        salario: a.empregos > 0 && media > 0 ? a.massa / a.empregos / media : 0,
        massa: pib > 0 ? (100 * a.massa) / pib : 0,
        lucro: pib > 0 ? (100 * a.lucro) / pib : 0,
      };
    }),
  };
}
