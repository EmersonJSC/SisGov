// Pops nos setores: emprego, salário e lucro (src/motor/mercado/mercado.md,
// fatia 4). O motor não conhece nomes de pop nem de setor.
import type { ErroMercado, Mercado } from "./index";

/** Onde o pop trabalha e quanto da renda dele é lucro. */
export interface Ocupacao {
  /** Peso de cada setor (soma 1); vazio = sem emprego formal. */
  setores: Record<string, number>;
  /** Parte da renda bruta que é lucro (0 a 1); o resto é salário. */
  capital: number;
}

const FOLGA = 1e-6;

/** Valida a ocupação de cada pop do JSON do mundo. */
export function validarOcupacao(
  pops: readonly { id: string; setores?: unknown; capital?: unknown }[],
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

export function lerOcupacao(
  pops: readonly { id: string; setores?: unknown; capital?: unknown }[],
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
    for (const [setor, peso] of Object.entries(o.setores)) {
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
